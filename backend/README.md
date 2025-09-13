# Flask starter for React frontend

This folder contains a minimal Flask backend suitable for use with a React frontend. It includes a small MongoDB-backed API for users, posts, likes, comments, shares and simple chats.

Quick start

1. Create a virtualenv and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and adjust if needed. Set `MONGODB_URI` if you have a remote MongoDB.

3. Run the app:

```bash
export FLASK_APP=app:create_app
flask run --port 5000
```

Health & basic info

- GET / -> basic message
- GET /api/health -> health check

MongoDB schema (NoSQL collections)

- users

  - \_id: ObjectId
  - name: string
  - bio: string
  - role: enum ('veteran'|'injured'|'support')
  - created_at: ISO datetime string

- posts

  - \_id: ObjectId
  - author_id: user id (string)
  - content: string
  - media: array
  - likes: integer
  - comments: integer
  - shares: integer
  - created_at: ISO datetime string

- likes

  - post_id: string
  - user_id: string
  - created_at: ISO datetime string

- comments

  - post_id: string
  - user_id: string
  - text: string
  - created_at: ISO datetime string

- shares

  - post_id: string
  - user_id: string
  - created_at: ISO datetime string

- chats
  - \_id: ObjectId
  - from: user id
  - to: user id
  - text: string
  - created_at: ISO datetime string

API endpoints

Users

- POST /api/users
  - body: { name, bio, role }
  - returns: created user
- GET /api/users/<user_id>
  - returns: user object

Posts

- POST /api/posts
  - body: { author_id, content, media }
  - returns: created post
- GET /api/posts/<post_id>
  - returns: post object
- POST /api/posts/<post_id>/like
  - body: { user_id }
  - returns: { ok: true }
- POST /api/posts/<post_id>/comment
  - body: { user_id, text }
  - returns: { ok: true }
- POST /api/posts/<post_id>/share
  - body: { user_id }
  - returns: { ok: true }

Chats

- POST /api/chats/<user_a>/<user_b>
  - body: { from, text }
  - returns: { ok: true }
- GET /api/chats/<user_a>/<user_b>
  - returns: list of messages between the two users sorted by created_at

Notes

- This starter uses `pymongo` directly. For production, add authentication, input validation, and indexes.
- Set `MONGODB_URI` in environment to point to your MongoDB server (defaults to mongodb://localhost:27017).

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
