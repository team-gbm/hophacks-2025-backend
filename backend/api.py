from flask import Blueprint, jsonify, request

api_bp = Blueprint('api', __name__)


@api_bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


@api_bp.route('/echo', methods=['POST'])
def echo():
    data = request.get_json(silent=True) or {}
    return jsonify({'you_sent': data})
