from __future__ import annotations

import asyncio
import random
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="XTI-SOC Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SEVERITIES = ["Low", "Medium", "High", "Critical"]
PROTOCOLS = ["TCP", "UDP", "ICMP", "OTHER"]
ML_LABELS = ["Normal", "Suspicious", "Malicious"]

clients: set[WebSocket] = set()
client_lock = asyncio.Lock()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def severity_from_score(score: int) -> str:
    if score < 30:
        return "Low"
    if score < 60:
        return "Medium"
    if score < 80:
        return "High"
    return "Critical"


def random_session(index: int) -> dict[str, Any]:
    risk_score = random.randint(8, 99)
    label = "Malicious" if risk_score > 75 else "Suspicious" if risk_score > 45 else "Normal"
    normal = max(0.02, round(1 - risk_score / 130, 2))
    malicious = max(0.02, round(risk_score / 110, 2))
    suspicious = max(0.02, round(1 - normal - malicious, 2))

    src_a = random.randint(11, 222)
    src_ip = f"{src_a}.{random.randint(1,254)}.{random.randint(1,254)}.{random.randint(1,254)}"

    return {
        "id": f"sess-{index}",
        "timestamp": now_iso(),
        "src_ip": src_ip,
        "dst_ip": f"10.0.{random.randint(1,10)}.{random.randint(2,250)}",
        "src_port": random.randint(1024, 65535),
        "dst_port": random.choice([22, 53, 80, 443, 3306, 8080]),
        "protocol": random.choice(PROTOCOLS),
        "duration": round(random.random() * 6.2, 2),
        "packet_count": random.randint(12, 15000),
        "total_bytes": random.randint(300, 2_000_000),
        "ml": {
            "label": label,
            "confidence": round(0.5 + random.random() * 0.5, 2),
            "probabilities": {
                "Normal": normal,
                "Suspicious": suspicious,
                "Malicious": malicious,
            },
        },
        "shap": [
            {"feature": "syn_rate", "value": round(random.random() * 2, 3), "impact": round(random.random() * 2 - 0.2, 3)},
            {"feature": "dst_port_entropy", "value": round(random.random() * 8, 3), "impact": round(random.random() * 1.8 - 0.3, 3)},
            {"feature": "pkt_len_std", "value": round(random.random() * 400, 3), "impact": round(random.random() * 1.8 - 0.5, 3)},
            {"feature": "rst_rate", "value": round(random.random() * 1.5, 3), "impact": round(random.random() * 1.5 - 0.6, 3)},
            {"feature": "iat_std", "value": round(random.random() * 900, 3), "impact": round(random.random() * 1.5 - 0.6, 3)},
        ],
        "cti": None
        if src_a % 3 == 0
        else {
            "is_malicious": risk_score > 70,
            "abuse_confidence": random.randint(15, 99),
            "country_code": random.choice(["US", "DE", "IN", "JP", "BR", "NL"]),
            "isp": random.choice(["Akamai", "Cloudflare", "DigitalOcean", "Hetzner", "AWS"]),
            "usage_type": random.choice(["Data Center", "ISP", "Hosting", "Enterprise"]),
            "last_reported": (datetime.now(timezone.utc) - timedelta(minutes=random.randint(5, 3000))).isoformat(),
        },
        "risk": {
            "score": risk_score,
            "severity": severity_from_score(risk_score),
            "factors": [
                "Anomalous packet cadence",
                "Suspicious port behavior",
                "Model confidence spike",
            ],
        },
    }


sessions: list[dict[str, Any]] = [random_session(i + 1) for i in range(240)]


def compute_stats(data: list[dict[str, Any]]) -> dict[str, Any]:
    alerts_today = sum(1 for s in data if s["risk"]["score"] >= 60)
    malicious_ips = sum(1 for s in data if s["ml"]["label"] == "Malicious")
    avg_risk = round(sum(s["risk"]["score"] for s in data) / max(1, len(data)), 1)

    breakdown = {
        "Normal": sum(1 for s in data if s["ml"]["label"] == "Normal"),
        "Suspicious": sum(1 for s in data if s["ml"]["label"] == "Suspicious"),
        "Malicious": sum(1 for s in data if s["ml"]["label"] == "Malicious"),
    }

    ip_map: dict[str, dict[str, Any]] = {}
    for s in data:
        key = s["src_ip"]
        if key in ip_map:
            ip_map[key]["hit_count"] += 1
            ip_map[key]["risk_score"] = max(ip_map[key]["risk_score"], s["risk"]["score"])
        else:
            ip_map[key] = {
                "ip": key,
                "risk_score": s["risk"]["score"],
                "hit_count": 1,
                "severity": s["risk"]["severity"],
                "country": (s["cti"] or {}).get("country_code", "N/A"),
            }

    top_threats = sorted(ip_map.values(), key=lambda x: (-x["risk_score"], -x["hit_count"]))[:5]

    return {
        "total_sessions": len(data),
        "active_sessions": max(8, int(len(data) * 0.12)),
        "alerts_today": alerts_today,
        "malicious_ips": malicious_ips,
        "threat_breakdown": breakdown,
        "avg_risk_score": avg_risk,
        "top_threats": top_threats,
    }


async def broadcast(event: dict[str, Any]) -> None:
    async with client_lock:
        targets = list(clients)
    dead: list[WebSocket] = []
    for ws in targets:
        try:
            await ws.send_json(event)
        except Exception:
            dead.append(ws)
    if dead:
        async with client_lock:
            for ws in dead:
                clients.discard(ws)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/stats")
async def stats() -> dict[str, Any]:
    return compute_stats(sessions)


@app.get("/sessions")
async def list_sessions(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=50, ge=1, le=200),
    severity: str | None = None,
    protocol: str | None = None,
    search: str | None = None,
) -> dict[str, Any]:
    data = sessions
    if severity:
        data = [s for s in data if s["risk"]["severity"] == severity]
    if protocol:
        data = [s for s in data if s["protocol"] == protocol]
    if search:
        needle = search.lower()
        data = [
            s
            for s in data
            if needle in s["src_ip"].lower() or needle in s["dst_ip"].lower()
        ]

    total = len(data)
    start = (page - 1) * limit
    return {"data": data[start : start + limit], "total": total, "page": page}


@app.get("/sessions/{session_id}")
async def get_session(session_id: str) -> dict[str, Any]:
    for item in sessions:
        if item["id"] == session_id:
            return item
    return {"status": 404, "message": "Session not found"}


@app.get("/alerts")
async def get_alerts(severity: str | None = None, hours: int = 24) -> list[dict[str, Any]]:
    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
    data = [
        s
        for s in sessions
        if s["risk"]["score"] >= 60 and datetime.fromisoformat(s["timestamp"]) >= cutoff
    ]
    if severity:
        data = [s for s in data if s["risk"]["severity"] == severity]
    return data


@app.get("/threats/top")
async def top_threats() -> list[dict[str, Any]]:
    return compute_stats(sessions)["top_threats"]


@app.websocket("/ws")
async def ws_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    async with client_lock:
        clients.add(websocket)
    await websocket.send_json({"type": "demo_status", "payload": {"active": True, "progress": 100}})

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        async with client_lock:
            clients.discard(websocket)


@app.on_event("startup")
async def startup() -> None:
    async def stream_loop() -> None:
        counter = len(sessions) + 1
        while True:
            await asyncio.sleep(2.5)
            session = random_session(counter)
            counter += 1
            sessions.insert(0, session)
            if len(sessions) > 500:
                sessions.pop()
            await broadcast({"type": "session_scored", "payload": session})
            await broadcast({"type": "stats_update", "payload": compute_stats(sessions)})

    asyncio.create_task(stream_loop())
