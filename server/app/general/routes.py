from flask import jsonify, request

from . import controller

from app.schemas import AnimalTypes, CreateAnimal, CreateSymptom

from pydantic import ValidationError

from . import general


@general.route("/api/test")
def test():
    return jsonify(name="testing", numbers=[1, 2, 3])


@general.route("/api/test-protected")
def test_protected():
    name = controller.test_protected()
    return jsonify(name=name, numbers=[1, 2, 3])


@general.route("/api/animal-type", methods=["GET"])
def get_animal_types():
    animal_types = controller.get_animal_types()

    return jsonify(AnimalTypes(data=[animal_type for animal_type in animal_types]).model_dump())


@general.route("/api/animal", methods=["POST"])
def create_animal():
    try:
        data = CreateAnimal.model_validate(request.json)
        animal = controller.create_animal(data)
        return jsonify(animal.model_dump()), 201
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 422


@general.route("/api/animal/<animal_id>", methods=["GET"])
def get_animal(animal_id: int):
    animal = controller.get_animal(animal_id)

    return jsonify(animal.model_dump())


@general.route("/api/animal/<animal_id>/symptom", methods=["POST"])
def create_symptom(animal_id: int):
    try:
        data = CreateSymptom.model_validate(request.json)
        symptom = controller.create_symptom(animal_id, data)
        return jsonify(symptom.model_dump()), 201
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 422
