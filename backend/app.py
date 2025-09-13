from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# import the Mongo-backed blueprint
from api import api_bp

load_dotenv()
app = Flask(__name__)
CORS(app)

# register api endpoints under /api
app.register_blueprint(api_bp, url_prefix='/api')


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'RecoveryTogether API is running'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)