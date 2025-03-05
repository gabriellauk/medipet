from typing import List

from flask import session
from app.decorators import requires_auth
from app import store, schemas

from werkzeug.exceptions import BadRequest, Forbidden

from app import models


@requires_auth
def test_protected(user):
    user_session = session.get("user")
    name = user_session.get("given_name")
    return name


def get_animal_types() -> list[schemas.AnimalType]:
    animal_types = store.get_animal_types()

    return [schemas.AnimalType.model_validate(animal_type) for animal_type in animal_types]


@requires_auth
def create_animal(user: models.User, data: schemas.CreateAnimal) -> schemas.Animal:
    if (animal_type := store.get_animal_type_by_id(data.animal_type_id)) is None:
        raise BadRequest("Animal type not found")

    animal = store.create_animal(data.name, animal_type, user)

    return schemas.Animal.model_validate(animal)


@requires_auth
def get_animal(user: models.User, animal_id: id) -> schemas.Animal:
    if (animal := store.get_animal(animal_id)) is None:
        raise BadRequest("Animal not found")

    if animal.user != user:
        raise Forbidden("User cannot access this animal")

    return schemas.Animal.model_validate(animal)


@requires_auth
def get_animals(user: models.User) -> schemas.Animal:
    animals = store.get_animals_for_user(user)

    return [schemas.Animal.model_validate(animal) for animal in animals]


@requires_auth
def create_symptom(user: models.User, animal_id: int, data: schemas.CreateSymptom) -> schemas.Symptom:
    if (animal := store.get_animal(animal_id)) is None:
        raise BadRequest("Animal not found")

    if animal.user != user:
        raise Forbidden("User cannot access this animal")

    symptom = store.create_symptom(data, animal)

    return schemas.Symptom.model_validate(symptom)


@requires_auth
def delete_symptom(user: models.User, animal_id: int, symptom_id: int) -> None:
    if (animal := store.get_animal(animal_id)) is None:
        raise BadRequest("Animal not found")

    if animal.user != user:
        raise Forbidden("User cannot access this animal")

    if (symptom := store.get_symptom(symptom_id)) is None or symptom.animal != animal:
        raise BadRequest(f"Symptom {symptom_id} not found for animal {animal_id}")

    store.delete_symptom(symptom)


@requires_auth
def update_symptom(user: models.User, animal_id: int, symptom_id: int, data: schemas.UpdateSymptom) -> schemas.Symptom:
    if (animal := store.get_animal(animal_id)) is None:
        raise BadRequest("Animal not found")

    if animal.user != user:
        raise Forbidden("User cannot access this animal")

    if (symptom := store.get_symptom(symptom_id)) is None or symptom.animal != animal:
        raise BadRequest(f"Symptom {symptom_id} not found for animal {animal_id}")

    symptom = store.update_symptom(symptom, data)

    return schemas.Symptom.model_validate(symptom)


@requires_auth
def get_symptoms_for_animal(user: models.User, animal_id: int) -> List[schemas.Symptom]:
    if (animal := store.get_animal(animal_id)) is None:
        raise BadRequest("Animal not found")

    if animal.user != user:
        raise Forbidden("User cannot access this animal")

    symptoms = store.get_symptoms_for_animal(animal)

    return [schemas.Symptom.model_validate(symptom) for symptom in symptoms]


@requires_auth
def get_symptom(user: models.User, animal_id: int, symptom_id: int) -> None:
    if (animal := store.get_animal(animal_id)) is None:
        raise BadRequest("Animal not found")

    if animal.user != user:
        raise Forbidden("User cannot access this animal")

    if (symptom := store.get_symptom(symptom_id)) is None or symptom.animal != animal:
        raise BadRequest(f"Symptom {symptom_id} not found for animal {animal_id}")

    return schemas.Symptom.model_validate(symptom)


@requires_auth
def create_weight(user: models.User, animal_id: int, data: schemas.CreateWeight) -> schemas.Weight:
    if (animal := store.get_animal(animal_id)) is None:
        raise BadRequest("Animal not found")

    if animal.user != user:
        raise Forbidden("User cannot access this animal")

    weight = store.create_weight(data, animal)

    return schemas.Weight.model_validate(weight)


@requires_auth
def delete_weight(user: models.User, animal_id: int, weight_id: int) -> None:
    if (animal := store.get_animal(animal_id)) is None:
        raise BadRequest("Animal not found")

    if animal.user != user:
        raise Forbidden("User cannot access this animal")

    if (weight := store.get_weight(weight_id)) is None or weight.animal != animal:
        raise BadRequest(f"Weight {weight_id} not found for animal {animal_id}")

    store.delete_weight(weight)
