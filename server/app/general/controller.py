from typing import List
from app.decorators import requires_auth
from app import store, schemas

from werkzeug.exceptions import BadRequest, Forbidden


@requires_auth
def test_protected(user):
    name = user.get("given_name")
    return name


def get_animal_types() -> list[schemas.AnimalType]:
    animal_types = store.get_animal_types()

    return [schemas.AnimalType.model_validate(animal_type) for animal_type in animal_types]


@requires_auth
def create_animal(user, data: schemas.CreateAnimal) -> schemas.Animal:
    if (animal_type := store.get_animal_type_by_id(data.animal_type_id)) is None:
        raise BadRequest("Animal type not found")

    if (user_record := store.get_user_by_email(user["email"])) is None:
        raise BadRequest("User record not found")

    animal = store.create_animal(data.name, animal_type, user_record)

    return schemas.Animal.model_validate(animal)


@requires_auth
def get_animal(user, animal_id: id) -> schemas.Animal:
    if (animal := store.get_animal(animal_id)) is None:
        raise BadRequest("Animal not found")

    if (user_record := store.get_user_by_email(user["email"])) is None:
        raise BadRequest("User record not found")

    if animal.user != user_record:
        raise Forbidden("User cannot access this animal")

    return schemas.Animal.model_validate(animal)


@requires_auth
def get_animals(user) -> schemas.Animal:
    if (user_record := store.get_user_by_email(user["email"])) is None:
        raise BadRequest("User record not found")

    animals = store.get_animals_for_user(user_record)

    return [schemas.Animal.model_validate(animal) for animal in animals]


@requires_auth
def create_symptom(user, animal_id: int, data: schemas.CreateSymptom) -> schemas.Symptom:
    if (animal := store.get_animal(animal_id)) is None:
        raise BadRequest("Animal not found")

    if (user_record := store.get_user_by_email(user["email"])) is None:
        raise BadRequest("User record not found")

    if animal.user != user_record:
        raise Forbidden("User cannot access this animal")

    symptom = store.create_symptom(data, animal)

    return schemas.Symptom.model_validate(symptom)


@requires_auth
def get_symptoms_for_animal(user, animal_id: int) -> List[schemas.Symptom]:
    if (animal := store.get_animal(animal_id)) is None:
        raise BadRequest("Animal not found")

    if (user_record := store.get_user_by_email(user["email"])) is None:
        raise BadRequest("User record not found")

    if animal.user != user_record:
        raise Forbidden("User cannot access this animal")

    symptoms = store.get_symptoms_for_animal(animal)

    return [schemas.Symptom.model_validate(symptom) for symptom in symptoms]
