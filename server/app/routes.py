from flask import render_template, flash, redirect, url_for, session, jsonify
from flask_login import current_user
import sqlalchemy as sa

from app import app, db, oauth
from app.decorators import requires_auth
from app.forms import CreateAnimalForm
from app.models import Animal, AnimalType, User

@app.route("/api/test")
def test():
    return jsonify(name="testing", numbers=[1, 2, 3])

@app.route("/")
@app.route("/index")
def index():
    user = session.get("user")
    return render_template("index.html", user=user)


@app.route("/login")
def login():
    redirect_uri = url_for("auth", _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@app.route("/auth")
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
    return redirect("/")


@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect("/")


@app.route("/create-animal", methods=["GET", "POST"])
@requires_auth
def create_animal():
    form = CreateAnimalForm()
    form.animal_type.choices = [(at.id, at.name) for at in AnimalType.query.order_by("name")]
    if form.validate_on_submit():
        animal = Animal(
            name=form.name.data,
            animal_type_id=form.animal_type.data,
            user_id=current_user.id,
        )
        db.session.add(animal)
        db.session.commit()
        flash("Added new pet")
        return redirect(url_for("index"))
    return render_template("create_animal.html", title="Add new pet", form=form)
