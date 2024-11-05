from flask import Flask, jsonify
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from authlib.integrations.flask_client import OAuth
from flask_cors import CORS
from werkzeug.exceptions import BadRequest, Forbidden

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"], "supports_credentials": True}})

oauth = OAuth(app)
oauth.register(
    name="google",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


@app.errorhandler(BadRequest)
def handle_bad_request(e):
    return jsonify(error=str(e)), 400


@app.errorhandler(Forbidden)
def handle_forbidden(e):
    return jsonify(error=str(e)), 403


from app import routes, models, schemas
