from flask import Flask, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS
from .api import api_bp


def create_app():
    # Load environment variables from backend/.env if present
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    load_dotenv(dotenv_path=env_path, override=False)

    app = Flask(__name__, instance_relative_config=False)

    # Allow configuring CORS origins (useful for React dev server)
    cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000')
    CORS(app, origins=cors_origins)

    # Register API blueprint under /api
    app.register_blueprint(api_bp, url_prefix='/api')

    @app.route('/')
    def index():
        return jsonify({'message': 'Flask backend running'})

    return app
