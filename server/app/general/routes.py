from flask import jsonify, request

from . import controller

from app.schemas import AnimalTypes, Animals, CreateAnimal, CreateSymptom, Symptoms, UpdateSymptom

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


@general.route("/api/animal", methods=["GET"])
def get_animals():
    animals = controller.get_animals()

    return jsonify(Animals(data=[animal for animal in animals]).model_dump())


@general.route("/api/animal/<animal_id>/symptom", methods=["POST"])
def create_symptom(animal_id: int):
    try:
        data = CreateSymptom.model_validate(request.json)
        symptom = controller.create_symptom(animal_id, data)
        return jsonify(symptom.model_dump()), 201
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 422


@general.route("/api/animal/<animal_id>/symptom/<symptom_id>", methods=["DELETE"])
def delete_symptom(animal_id: int, symptom_id: int):
    controller.delete_symptom(animal_id, symptom_id)

    return "", 204


@general.route("/api/animal/<animal_id>/symptom/<symptom_id>", methods=["PATCH"])
def update_symptom(animal_id: int, symptom_id: int):
    try:
        data = UpdateSymptom.model_validate(request.json)
        symptom = controller.update_symptom(animal_id, symptom_id, data)
        return jsonify(symptom.model_dump()), 200
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 422


@general.route("/api/animal/<animal_id>/symptom", methods=["GET"])
def get_symptoms_for_animal(animal_id: int):
    symptoms = controller.get_symptoms_for_animal(animal_id)

    return jsonify(Symptoms(data=[symptom for symptom in symptoms]).model_dump())


@general.route("/api/animal/<animal_id>/symptom/<symptom_id>", methods=["GET"])
def get_symptom(animal_id: int, symptom_id: int):
    symptom = controller.get_symptom(animal_id, symptom_id)

    return jsonify(symptom.model_dump()), 200
