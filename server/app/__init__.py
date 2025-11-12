import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from werkzeug.exceptions import BadRequest, Forbidden
from werkzeug.middleware.proxy_fix import ProxyFix

from app.extensions import db, migrate, oauth

from .auth import auth
from .general import general


def create_app(app_config: dict[str, str] | None = None) -> Flask:
    load_dotenv()

    basedir = os.path.abspath(os.path.dirname(__file__))

    app = Flask(__name__)

    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_port=1)

    if app_config:
        app.config.update(app_config)
    else:
        app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI") or "sqlite:///" + os.path.join(
            basedir, "app.db"
        )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
    app.config["GOOGLE_CLIENT_ID"] = os.environ.get("GOOGLE_CLIENT_ID", None)
    app.config["GOOGLE_CLIENT_SECRET"] = os.environ.get("GOOGLE_CLIENT_SECRET", None)
    app.config["CORS_ORIGINS"] = os.environ.get("CORS_ORIGINS")
    app.config["SESSION_COOKIE_SAMESITE"] = os.environ.get("SESSION_COOKIE_SAMESITE", "None")
    app.config["SESSION_COOKIE_SECURE"] = os.environ.get("SESSION_COOKIE_SECURE", True)

    db.init_app(app)
    migrate.init_app(app, db)

    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"], "supports_credentials": True}})

    oauth.init_app(app)
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

    app.register_blueprint(auth)
    app.register_blueprint(general)

    return app


from app import models as models  # noqa: E402

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)
