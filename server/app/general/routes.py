from flask import jsonify, request

from . import controller

from app.schemas import (
    AnimalTypes,
    Animals,
    CreateAnimal,
    CreateSymptom,
    CreateWeight,
    Symptoms,
    UpdateSymptom,
    UpdateWeight,
    Weights,
)

from pydantic import ValidationError

from . import general


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


@general.route("/api/animal/<animal_id>/weight", methods=["POST"])
def create_weight(animal_id: int):
    try:
        data = CreateWeight.model_validate(request.json)
        weight = controller.create_weight(animal_id, data)
        return jsonify(weight.model_dump()), 201
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 422


@general.route("/api/animal/<animal_id>/weight/<weight_id>", methods=["DELETE"])
def delete_weight(animal_id: int, weight_id: int):
    controller.delete_weight(animal_id, weight_id)

    return "", 204


@general.route("/api/animal/<animal_id>/weight/<weight_id>", methods=["GET"])
def get_weight(animal_id: int, weight_id: int):
    weight = controller.get_weight(animal_id, weight_id)

    return jsonify(weight.model_dump()), 200


@general.route("/api/animal/<animal_id>/weight/<weight_id>", methods=["PATCH"])
def update_weight(animal_id: int, weight_id: int):
    try:
        data = UpdateWeight.model_validate(request.json)
        weight = controller.update_weight(animal_id, weight_id, data)
        return jsonify(weight.model_dump()), 200
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 422


@general.route("/api/animal/<animal_id>/weight", methods=["GET"])
def get_weights_for_animal(animal_id: int):
    weights = controller.get_weights_for_animal(animal_id)

    return jsonify(Weights(data=[weight for weight in weights]).model_dump())
