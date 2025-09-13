from flask import Blueprint, jsonify, request
from .db import get_db
from bson.objectid import ObjectId

api_bp = Blueprint('api', __name__)


def oid(id_str):
    try:
        return ObjectId(id_str)
    except Exception:
        return None


@api_bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


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

