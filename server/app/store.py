from app import db
from app.models import User, AnimalType

import sqlalchemy as sa


def check_user_exists(email):
    return db.session.scalar(sa.select(User).where(User.email == email))


def create_user(email):
    new_user = User(email=email)
    db.session.add(new_user)
    db.session.commit()


def get_animal_types():
    return AnimalType.query.order_by("name")
