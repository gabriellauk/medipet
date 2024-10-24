from flask import render_template, flash, redirect, url_for, session, jsonify, request
from flask_login import current_user
import sqlalchemy as sa

from app import app, db, oauth
from app.decorators import requires_auth
from app.models import Animal, AnimalType, User

@app.route("/api/test")
def test():
    return jsonify(name="testing", numbers=[1, 2, 3])
    

@app.route("/api/login", methods=["POST"])
def login():
    redirect_uri = url_for("auth", _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@app.route("/api/auth")
def auth():
    token = oauth.google.authorize_access_token()
    session["user"] = token["userinfo"]
    user = session.get("user")
    email = user["email"]
    user_exists = db.session.scalar(sa.select(User).where(User.email == email))
    if not user_exists:
        new_user = User(email=email)
        db.session.add(new_user)
        db.session.commit()

    redirect_url = app.config["CORS_ORIGINS"] + "/test"
    return redirect(redirect_url)


@app.route("/api/logout", methods=["POST"])
def logout():
    session.pop("user", None)

    redirect_url = app.config["CORS_ORIGINS"] + "/test"
    return redirect(redirect_url)


@app.route("/api/user", methods=["GET"])
def get_user():
    user = session.get('user')
    if user:
        return jsonify({'isLoggedIn': True})
    else:
        return jsonify({'isLoggedIn': False})
