from flask import Blueprint, jsonify, request
from db import get_db
from bson.objectid import ObjectId
import os
import json
import google.generativeai as genai

api_bp = Blueprint('api', __name__)


def oid(id_str):
    try:
        return ObjectId(id_str)
    except Exception:
        return None


@api_bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})
# AI search (Gemini proxy)


@api_bp.route('/ai/search', methods=['POST'])
def ai_search():
    data = request.get_json() or {}
    query = (data.get('query') or '').strip()
    if not query:
        return jsonify({'error': 'query is required'}), 400
    api_key = "AIzaSyAooHmhujRJrNfFfqAPmdm44p4j8yosQyg"
    if not api_key:
        return jsonify({'error': 'Missing GEMINI_API_KEY/GOOGLE_API_KEY'}), 500
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"You are a helpful health assistant. Answer succinctly with 3-5 bullet suggestions for: {query}. Include doctor types, self-care tips, and learning resources."
        resp = model.generate_content(prompt)
        text = (resp.text or '').strip()
        system_instruction = (
            "You are LifeLine AI, a warm, empathetic assistant focused on health and philanthropy. "
            "Provide supportive, non-judgmental guidance. Offer credible, general health information, "
            "not medical diagnosis. Always include: (1) brief summary, (2) recommended care pathways with relevant clinician types, "
            "(3) self-care and safety notes, (4) community/financial support (low-cost clinics, assistance programs, nonprofits, support groups), "
            "and (5) learning resources. Respond in clear Markdown with headings and concise bullet points. If the query might indicate an emergency, "
            "advise to seek immediate local emergency help. Avoid sensitive content and respect privacy."
        )

        generation_config = {
            'temperature': 0.6,
            'top_p': 0.9,
            'top_k': 40,
            'max_output_tokens': 512,
                'response_mime_type': 'text/plain',
        }

        safety_settings = [
            { 'category': 'HARM_CATEGORY_HATE_SPEECH', 'threshold': 'BLOCK_LOW_AND_ABOVE' },
            { 'category': 'HARM_CATEGORY_HARASSMENT', 'threshold': 'BLOCK_MEDIUM_AND_ABOVE' },
            { 'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold': 'BLOCK_MEDIUM_AND_ABOVE' },
            { 'category': 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold': 'BLOCK_MEDIUM_AND_ABOVE' },
        ]

        model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            system_instruction=system_instruction,
            generation_config=generation_config,
            safety_settings=safety_settings,
        )

        user_prompt = (
            f"User question: {query}\n\n"
            "Please answer in Markdown with these sections:\n"
            "## Summary\n"
            "## Recommended Care Pathways\n"
            "## Self-care & Safety\n"
            "## Community & Financial Support\n"
            "## Learn More\n"
        )
        return jsonify({'text': text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# Users


@api_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json() or {}
    db = get_db()
    user = {
        'name': data.get('name'),
        'bio': data.get('bio', ''),
        'role': data.get('role', 'veteran'),
        'created_at': data.get('created_at')
    }
    res = db.users.insert_one(user)
    user['_id'] = str(res.inserted_id)
    return jsonify(user), 201


@api_bp.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    db = get_db()
    _id = oid(user_id)
    if not _id:
        return jsonify({'error': 'invalid id'}), 400
    u = db.users.find_one({'_id': _id}, {'password': 0})
    if not u:
        return jsonify({'error': 'not found'}), 404
    u['_id'] = str(u['_id'])
    return jsonify(u)


# Posts

@api_bp.route('/posts', methods=['POST'])
def create_post():
    data = request.get_json() or {}
    print(data)
    db = get_db()
    post = {
        'author_id': data.get('author_id'),
        'content': data.get('content', ''),
        'media': data.get('media', []),
        'likes': 0,
        'comments': 0,
        'shares': 0,
        'created_at': data.get('created_at')
    }
    res = db.posts.insert_one(post)
    print(res)
    post['_id'] = str(res.inserted_id)
    return jsonify(post), 201


@api_bp.route('/posts/<post_id>', methods=['GET'])
def get_post(post_id):
    db = get_db()
    _id = oid(post_id)
    if not _id:
        return jsonify({'error': 'invalid id'}), 400
    p = db.posts.find_one({'_id': _id})
    if not p:
        return jsonify({'error': 'not found'}), 404
    p['_id'] = str(p['_id'])
    return jsonify(p)


@api_bp.route('/posts', methods=['GET'])
def list_posts():
    """Return recent posts (simple list, not paginated)."""
    db = get_db()
    docs = list(db.posts.find().sort('created_at', -1).limit(100))
    for d in docs:
        d['_id'] = str(d['_id'])
    return jsonify(docs)


@api_bp.route('/posts/<post_id>/like', methods=['POST'])
def like_post(post_id):
    db = get_db()
    _id = oid(post_id)
    user = (request.get_json() or {}).get('user_id')
    if not _id or not user:
        return jsonify({'error': 'invalid input'}), 400
    # increment likes and record like
    db.posts.update_one({'_id': _id}, {'$inc': {'likes': 1}})
    db.likes.insert_one({'post_id': post_id, 'user_id': user})
    return jsonify({'ok': True})


@api_bp.route('/posts/<post_id>/comment', methods=['POST'])
def comment_post(post_id):
    db = get_db()
    _id = oid(post_id)
    data = request.get_json() or {}
    if not _id or not data.get('user_id') or not data.get('text'):
        return jsonify({'error': 'invalid input'}), 400
    comment = {
        'post_id': post_id,
        'user_id': data['user_id'],
        'text': data['text'],
        'created_at': data.get('created_at')
    }
    db.comments.insert_one(comment)
    db.posts.update_one({'_id': _id}, {'$inc': {'comments': 1}})
    return jsonify({'ok': True}), 201


@api_bp.route('/posts/<post_id>/share', methods=['POST'])
def share_post(post_id):
    db = get_db()
    _id = oid(post_id)
    data = request.get_json() or {}
    if not _id or not data.get('user_id'):
        return jsonify({'error': 'invalid input'}), 400
    db.shares.insert_one({'post_id': post_id, 'user_id': data['user_id'], 'created_at': data.get('created_at')})
    db.posts.update_one({'_id': _id}, {'$inc': {'shares': 1}})
    return jsonify({'ok': True})


# Chat (simple message store between two users)


@api_bp.route('/chats/<user_a>/<user_b>', methods=['POST'])
def send_message(user_a, user_b):
    db = get_db()
    data = request.get_json() or {}
    if not data.get('from') or not data.get('text'):
        return jsonify({'error': 'invalid input'}), 400
    msg = {
        'from': data['from'],
        'to': user_b if data['from'] == user_a else user_a,
        'text': data['text'],
        'created_at': data.get('created_at')
    }
    db.chats.insert_one(msg)
    return jsonify({'ok': True}), 201


@api_bp.route('/chats/<user_a>/<user_b>', methods=['GET'])
def get_messages(user_a, user_b):
    db = get_db()
    q = {'$or': [
        {'from': user_a, 'to': user_b},
        {'from': user_b, 'to': user_a}
    ]}
    msgs = list(db.chats.find(q).sort('created_at', 1))
    for m in msgs:
        m['_id'] = str(m['_id'])
    return jsonify(msgs)


@api_bp.route('/users', methods=['GET'])
def list_users():
    db = get_db()
    docs = list(db.users.find().limit(100))
    for d in docs:
        d['_id'] = str(d['_id'])
    return jsonify(docs)


# Multimodal AI chat: continuous chat with optional image inputs (health/equipment focus)
@api_bp.route('/ai/chat', methods=['POST'])
def ai_chat():
    api_key = "AIzaSyAooHmhujRJrNfFfqAPmdm44p4j8yosQyg"
    if not api_key:
        return jsonify({'error': 'Missing GEMINI_API_KEY/GOOGLE_API_KEY'}), 500

    try:
        genai.configure(api_key=api_key)

        system_instruction = (
            "You are LifeLine AI, a warm, empathetic assistant focused on health and medical equipment. "
            "Hold an educational, supportive tone. Provide general information (not diagnosis). "
            "When images are provided, carefully describe what is visible, identify potential medical devices or parts, "
            "and explain typical usage, safety considerations, and maintenance. Include: (1) brief summary, (2) steps or care pathways, "
            "(3) self-care & safety, (4) community/financial support, and (5) learn more. Use clear Markdown with headings/bullets. "
            "If anything suggests an emergency, advise seeking local emergency help immediately."
        )

        generation_config = {
            'temperature': 0.6,
            'top_p': 0.9,
            'top_k': 40,
            'max_output_tokens': 1024,
                'response_mime_type': 'text/plain',
        }

        safety_settings = [
            { 'category': 'HARM_CATEGORY_HATE_SPEECH', 'threshold': 'BLOCK_LOW_AND_ABOVE' },
            { 'category': 'HARM_CATEGORY_HARASSMENT', 'threshold': 'BLOCK_MEDIUM_AND_ABOVE' },
            { 'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold': 'BLOCK_MEDIUM_AND_ABOVE' },
            { 'category': 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold': 'BLOCK_MEDIUM_AND_ABOVE' },
        ]

        model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            system_instruction=system_instruction,
            generation_config=generation_config,
            safety_settings=safety_settings,
        )

        content_type = request.content_type or ''

        # Parse inputs: support JSON and multipart form-data. History is an array of {role, content}
        history = []
        user_text = ''
        image_parts = []

        if 'application/json' in content_type:
            body = request.get_json() or {}
            history = body.get('messages') or body.get('history') or []
            user_text = (body.get('message') or body.get('text') or '').strip()
            # For JSON mode, images are not supported directly
        else:
            # Multipart form: expect fields 'history' (JSON string), 'message' (text), and files under 'files'
            history_str = request.form.get('history', '[]')
            try:
                history = json.loads(history_str) if history_str else []
            except Exception:
                history = []
            user_text = (request.form.get('message') or '').strip()

            # Collect image files (png/jpeg/webp)
            files = request.files.getlist('files') if 'files' in request.files else []
            for f in files:
                # Basic type/size guard
                if f and f.mimetype in ('image/png', 'image/jpeg', 'image/webp'):
                    data = f.read()
                    if data and len(data) <= 5 * 1024 * 1024:  # <=5MB each
                        image_parts.append({'mime_type': f.mimetype, 'data': data})

        # Build contents from history
        contents = []
        for m in history[-10:]:  # limit context to last 10 exchanges
            role = m.get('role', 'user')
            text = (m.get('content') or '').strip()
            if not text:
                continue
            parts = [{'text': text}]
            contents.append({'role': 'user' if role == 'user' else 'model', 'parts': parts})

        # Current user turn
        user_parts = []
        if user_text:
            user_parts.append({'text': user_text})
        user_parts.extend(image_parts)
        contents.append({'role': 'user', 'parts': user_parts or [{'text': 'Describe the provided images.'}]})

        resp = model.generate_content(contents)
        text = (getattr(resp, 'text', None) or '').strip()
        return jsonify({'text': text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

