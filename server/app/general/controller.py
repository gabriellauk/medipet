from typing import List

from flask import session
from app.decorators import requires_animal_permission
from app import store, schemas

from werkzeug.exceptions import BadRequest, Unauthorized

from app import models


def get_animal_types() -> list[schemas.AnimalType]:
    animal_types = store.get_animal_types()

    return [schemas.AnimalType.model_validate(animal_type) for animal_type in animal_types]


def create_animal(data: schemas.CreateAnimal) -> schemas.Animal:
    user_session = session.get("user")
    if user_session is None or (user := store.get_user_by_email(user_session["email"])) is None:
        raise Unauthorized("No user logged in")

    if (animal_type := store.get_animal_type_by_id(data.animal_type_id)) is None:
        raise BadRequest("Animal type not found")

    animal = store.create_animal(data.name, animal_type, user)

    return schemas.Animal.model_validate(animal)


@requires_animal_permission
def get_animal(user: models.User, animal: models.Animal, animal_id: id) -> schemas.Animal:
    return schemas.Animal.model_validate(animal)


def get_animals() -> schemas.Animal:
    user_session = session.get("user")
    if user_session is None or (user := store.get_user_by_email(user_session["email"])) is None:
        raise Unauthorized("No user logged in")

    animals = store.get_animals_for_user(user)

    return [schemas.Animal.model_validate(animal) for animal in animals]


@requires_animal_permission
def create_symptom(
    user: models.User, animal: models.Animal, animal_id: int, data: schemas.CreateSymptom
) -> schemas.Symptom:
    symptom = store.create_symptom(data, animal)

    return schemas.Symptom.model_validate(symptom)


@requires_animal_permission
def delete_symptom(user: models.User, animal: models.Animal, animal_id: int, symptom_id: int) -> None:
    if (symptom := store.get_symptom(symptom_id)) is None or symptom.animal != animal:
        raise BadRequest(f"Symptom {symptom_id} not found for animal {animal_id}")

    store.delete_symptom(symptom)


@requires_animal_permission
def update_symptom(
    user: models.User, animal: models.Animal, animal_id: int, symptom_id: int, data: schemas.UpdateSymptom
) -> schemas.Symptom:
    if (symptom := store.get_symptom(symptom_id)) is None or symptom.animal != animal:
        raise BadRequest(f"Symptom {symptom_id} not found for animal {animal_id}")

    symptom = store.update_symptom(symptom, data)

    return schemas.Symptom.model_validate(symptom)


@requires_animal_permission
def get_symptoms_for_animal(user: models.User, animal: models.Animal, animal_id: int) -> List[schemas.Symptom]:
    symptoms = store.get_symptoms_for_animal(animal)

    return [schemas.Symptom.model_validate(symptom) for symptom in symptoms]


@requires_animal_permission
def get_symptom(user: models.User, animal: models.Animal, animal_id: int, symptom_id: int) -> None:
    if (symptom := store.get_symptom(symptom_id)) is None or symptom.animal != animal:
        raise BadRequest(f"Symptom {symptom_id} not found for animal {animal_id}")

    return schemas.Symptom.model_validate(symptom)


@requires_animal_permission
def create_weight(
    user: models.User, animal: models.Animal, animal_id: int, data: schemas.CreateWeight
) -> schemas.Weight:
    weight = store.create_weight(data, animal)

    return schemas.Weight.model_validate(weight)


@requires_animal_permission
def delete_weight(user: models.User, animal: models.Animal, animal_id: int, weight_id: int) -> None:
    if (weight := store.get_weight(weight_id)) is None or weight.animal != animal:
        raise BadRequest(f"Weight {weight_id} not found for animal {animal_id}")

    store.delete_weight(weight)


@requires_animal_permission
def get_weight(user: models.User, animal: models.Animal, animal_id: int, weight_id: int) -> None:
    if (weight := store.get_weight(weight_id)) is None or weight.animal != animal:
        raise BadRequest(f"Weight {weight_id} not found for animal {animal_id}")

    return schemas.Weight.model_validate(weight)


@requires_animal_permission
def update_weight(
    user: models.User, animal: models.Animal, animal_id: int, weight_id: int, data: schemas.UpdateWeight
) -> schemas.Weight:
    if (weight := store.get_weight(weight_id)) is None or weight.animal != animal:
        raise BadRequest(f"Weight {weight_id} not found for animal {animal_id}")

    weight = store.update_weight(weight, data)

    return schemas.Weight.model_validate(weight)


@requires_animal_permission
def get_weights_for_animal(user: models.User, animal: models.Animal, animal_id: int) -> List[schemas.Weight]:
    weights = store.get_weights_for_animal(animal)

    return [schemas.Weight.model_validate(weight) for weight in weights]
