# Flask starter for React frontend

This folder contains a minimal Flask backend suitable for use with a React frontend.

Quick start

1. Create a virtualenv and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and adjust if needed.

3. Run the app:

```bash
export FLASK_APP=app:create_app
flask run --port 5000
```

API:
- GET / -> basic message
- GET /api/health -> health check
- POST /api/echo -> echoes JSON body
