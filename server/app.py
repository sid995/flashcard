from flask import Flask
from routes.upload_routes import upload_bp
from routes.query_routes import query_bp
from config import Config

app = Flask(__name__)

# Validate configuration
Config.validate()

app.register_blueprint(upload_bp)
app.register_blueprint(query_bp)

if __name__ == '__main__':
    app.run(debug=True)