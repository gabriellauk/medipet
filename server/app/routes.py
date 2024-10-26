from flask import redirect, session, jsonify, url_for

from app import app, oauth, controller

from app.schemas import AnimalTypes

REDIRECT_URL = app.config["CORS_ORIGINS"] + "/test"


@app.route("/api/test")
def test():
    return jsonify(name="testing", numbers=[1, 2, 3])


@app.route("/api/test-protected")
def test_protected():
    name = controller.test_protected()
    return jsonify(name=name, numbers=[1, 2, 3])


@app.route("/api/login", methods=["POST"])
def login():
    redirect_uri = url_for("auth", _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@app.route("/api/auth")
def auth():
    controller.auth()
    return redirect(REDIRECT_URL)


@app.route("/api/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    return redirect(REDIRECT_URL)


@app.route("/api/user", methods=["GET"])
def get_user():
    is_logged_in = controller.get_user_login_status()
    return jsonify({"isLoggedIn": is_logged_in})


@app.route("/api/animal-type", methods=["GET"])
def get_animal_types():
    animal_types = controller.get_animal_types()

    return jsonify(AnimalTypes(data=[animal_type for animal_type in animal_types]).model_dump())
