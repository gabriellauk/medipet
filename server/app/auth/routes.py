from flask import current_app, jsonify, redirect, session, url_for
from werkzeug.exceptions import Unauthorized

from app.extensions import oauth

from . import auth, controller


@auth.route("/api/login", methods=["POST"])
def login():
    redirect_uri = url_for("auth.authenticate", _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@auth.route("/api/login-demo", methods=["POST"])
def login_demo_account():
    session.clear()
    controller.create_demo_account()
    return redirect(current_app.config["CORS_ORIGINS"] + "/dashboard")


@auth.route("/api/auth")
def authenticate():
    controller.authenticate()
    REDIRECT_URL = current_app.config["CORS_ORIGINS"] + "/test"
    return redirect(REDIRECT_URL)


@auth.route("/api/user", methods=["GET"])
def get_user():
    try:
        user = controller.get_user()
        return jsonify(user.model_dump())
    except Unauthorized:
        return "", 401


@auth.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})
