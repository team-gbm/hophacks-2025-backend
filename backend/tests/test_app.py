import json
import os
from app import create_app


def test_index():
    app = create_app()
    client = app.test_client()
    r = client.get('/')
    assert r.status_code == 200
    data = r.get_json()
    assert 'message' in data


def test_health_and_echo():
    app = create_app()
    client = app.test_client()

    r = client.get('/api/health')
    assert r.status_code == 200
    assert r.get_json() == {'status': 'ok'}
