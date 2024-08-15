from flask import Blueprint, request, jsonify
from services.query_service import QueryService

query_bp = Blueprint('query', __name__)
query_service = QueryService()

@query_bp.route('/query', methods=['POST'])
def query_documents():
    query = request.json.get('query')
    if not query:
        return jsonify({"error": "No query provided"}), 400
    response = query_service.query_documents(query)
    return jsonify({"response": response}), 200