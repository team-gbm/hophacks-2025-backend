from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import random
from data.mock_data import mock_users, mock_posts, mock_connections, mock_games

app = Flask(__name__)
CORS(app)

# In-memory storage for demo purposes
users = mock_users
posts = mock_posts
connections = mock_connections
games = mock_games


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'RecoveryTogether API is running'})


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        new_user = {
            'id': len(users) + 1,
            'username': data['username'],
            'email': data['email'],
            'name': data.get('name', data['username']),
            'age': data.get('age', 30),
            'location': data.get('location', ''),
            'bio': data.get('bio', ''),
            'condition': data.get('condition', ''),
            'diagnosis_date': data.get('diagnosis_date', ''),
            'hospital': data.get('hospital', ''),
            'doctor': data.get('doctor', ''),
            'treatment': data.get('treatment', ''),
            'medications': data.get('medications', []),
            'progress': data.get('progress', ''),
            'goals': data.get('goals', ''),
            'created_at': datetime.now().isoformat()
        }
        users.append(new_user)
        return jsonify({'message': 'User created successfully', 'user': new_user}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = next((u for u in users if u['username'] == data['username']), None)
    if user:
        return jsonify({
            'message': 'Login successful',
            'user': user
        }), 200
    return jsonify({'error': 'User not found'}), 404


@app.route('/api/profile/<int:user_id>', methods=['GET', 'PUT'])
def profile(user_id):
    user = next((u for u in users if u['id'] == user_id), None)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if request.method == 'GET':
        return jsonify(user)

    elif request.method == 'PUT':
        data = request.get_json()
        for key, value in data.items():
            if key in user:
                user[key] = value
        return jsonify({'message': 'Profile updated successfully', 'user': user})


@app.route('/api/posts', methods=['GET', 'POST'])
def posts_handler():
    if request.method == 'POST':
        data = request.get_json()
        new_post = {
            'id': len(posts) + 1,
            'user_id': data['user_id'],
            'user': next((u['name'] for u in users if u['id'] == data['user_id']), 'Unknown User'),
            'condition': next((u['condition'] for u in users if u['id'] == data['user_id']), ''),
            'content': data['content'],
            'likes': 0,
            'comments': 0,
            'time': 'Just now',
            'created_at': datetime.now().isoformat()
        }
        posts.insert(0, new_post)
        return jsonify({'message': 'Post created', 'post': new_post}), 201

    else:
        return jsonify(posts)


@app.route('/api/posts/<int:post_id>/like', methods=['POST'])
def like_post(post_id):
    post = next((p for p in posts if p['id'] == post_id), None)
    if post:
        post['likes'] += 1
        return jsonify({'likes': post['likes']})
    return jsonify({'error': 'Post not found'}), 404


@app.route('/api/connections', methods=['GET'])
def get_connections():
    return jsonify(connections)


@app.route('/api/connect/<int:user_id>', methods=['POST'])
def connect_user(user_id):
    connection = next((c for c in connections if c['id'] == user_id), None)
    if connection:
        connection['status'] = 'Connected'
        return jsonify({'message': 'Connected successfully', 'connection': connection})
    return jsonify({'error': 'User not found'}), 404


@app.route('/api/games', methods=['GET'])
def get_games():
    return jsonify(games)


if __name__ == '__main__':
    app.run(debug=True, port=5000)