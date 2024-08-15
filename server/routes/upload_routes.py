from flask import Blueprint, request, jsonify
from services.file_service import FileService

upload_bp = Blueprint('upload', __name__)
file_service = FileService()

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and file.filename.endswith('.pdf'):
        message = file_service.process_file(file)
        return jsonify({"message": message}), 200
    return jsonify({"error": "Invalid file format"}), 400