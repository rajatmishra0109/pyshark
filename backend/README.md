# XTI-SOC Backend (FastAPI + WebSocket)

## Run

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Render Deployment

Set the Render service root directory to `backend` and use:

- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

The file [`runtime.txt`](runtime.txt) pins Python to 3.12.8 so Render avoids the Python 3.14 / pydantic-core build issue.

## Endpoints

- GET `/health`
- GET `/stats`
- GET `/sessions?page=1&limit=50&severity=High&protocol=TCP&search=1.2.3.4`
- GET `/sessions/{id}`
- GET `/alerts?severity=Critical&hours=24`
- GET `/threats/top`
- WS `/ws`

WebSocket emits `session_scored` and `stats_update` every ~2.5s.
