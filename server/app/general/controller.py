from datetime import date
from typing import List

from flask import session
from app.decorators import requires_animal_permission
from app import store, schemas

from werkzeug.exceptions import BadRequest, Unauthorized

from dateutil.relativedelta import relativedelta

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
    if data.date > date.today():
        raise BadRequest("Date cannot be in the future")

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
    if data.date and data.date > date.today():
        raise BadRequest("Date cannot be in the future")

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
    if data.date > date.today():
        raise BadRequest("Date cannot be in the future")

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

    if data.date and data.date > date.today():
        raise BadRequest("Date cannot be in the future")

    weight = store.update_weight(weight, data)

    return schemas.Weight.model_validate(weight)


@requires_animal_permission
def get_weights_for_animal(user: models.User, animal: models.Animal, animal_id: int) -> List[schemas.Weight]:
    weights = store.get_weights_for_animal(animal)

    return [schemas.Weight.model_validate(weight) for weight in weights]


@requires_animal_permission
def create_appointment(
    user: models.User, animal: models.Animal, animal_id: int, data: schemas.CreateAppointment
) -> schemas.Weight:
    appointment = store.create_appointment(data, animal)

    return schemas.Appointment.model_validate(appointment)


@requires_animal_permission
def delete_appointment(user: models.User, animal: models.Animal, animal_id: int, appointment_id: int) -> None:
    if (appointment := store.get_appointment(appointment_id)) is None or appointment.animal != animal:
        raise BadRequest(f"Appointment {appointment_id} not found for animal {animal_id}")

    store.delete_appointment(appointment)


@requires_animal_permission
def get_appointment(user: models.User, animal: models.Animal, animal_id: int, apppointment_id: int) -> None:
    if (appointment := store.get_appointment(apppointment_id)) is None or appointment.animal != animal:
        raise BadRequest(f"Appointment {apppointment_id} not found for animal {animal_id}")

    return schemas.Appointment.model_validate(appointment)


@requires_animal_permission
def update_appointment(
    user: models.User, animal: models.Animal, animal_id: int, appointment_id: int, data: schemas.UpdateAppointment
) -> schemas.Appointment:
    if (appointment := store.get_appointment(appointment_id)) is None or appointment.animal != animal:
        raise BadRequest(f"Appointment {appointment_id} not found for animal {animal_id}")

    appointment = store.update_appointment(appointment, data)

    return schemas.Appointment.model_validate(appointment)


@requires_animal_permission
def get_appointments_for_animal(user: models.User, animal: models.Animal, animal_id: int) -> List[schemas.Appointment]:
    appointments = store.get_appointments_for_animal(animal)

    return [schemas.Appointment.model_validate(appointment) for appointment in appointments]


@requires_animal_permission
def get_medication(user: models.User, animal: models.Animal, animal_id: int, medication_id: int) -> schemas.Medication:
    if (medication := store.get_medication(medication_id)) is None or medication.animal != animal:
        raise BadRequest(f"Appointment {medication_id} not found for animal {animal_id}")

    return schemas.Medication.model_validate(medication)


@requires_animal_permission
def create_medication(
    user: models.User, animal: models.Animal, animal_id: int, data: schemas.CreateMedication
) -> schemas.Medication:
    if data.is_recurring:
        end_date = _validate_data_for_recurring_medication(data)

    else:
        end_date = _validate_data_for_one_off_medication(data)

    medication = store.create_medication(data, animal, end_date)

    return schemas.Medication.model_validate(medication)


def _validate_data_for_recurring_medication(data: schemas.CreateMedication) -> date | None:
    required_fields_if_recurring = [data.times_per_day, data.frequency_number, data.frequency_unit]
    for field in required_fields_if_recurring:
        if not field:
            raise BadRequest("If a medication is recurring, times per day and frequency details must all be provided.")

    match data.duration_unit:
        case models.TimeUnit.DAY.value:
            end_date = data.start_date + relativedelta(days=data.duration_number)
        case models.TimeUnit.WEEK.value:
            end_date = data.start_date + relativedelta(weeks=data.duration_number)
        case models.TimeUnit.MONTH.value:
            end_date = data.start_date + relativedelta(months=data.duration_number)
        case models.TimeUnit.YEAR.value:
            end_date = data.start_date + relativedelta(years=data.duration_number)
        case None:
            end_date = None

    return end_date


def _validate_data_for_one_off_medication(data: schemas.CreateMedication) -> date:
    fields_not_required_if_not_recurring = [
        data.times_per_day,
        data.frequency_number,
        data.frequency_unit,
        data.duration_number,
        data.duration_unit,
    ]

    for field in fields_not_required_if_not_recurring:
        if field:
            raise BadRequest(
                "If a medication is not recurring, times per day, frequency details and duration info should not be provided."
            )

    end_date = data.start_date

    return end_date


@requires_animal_permission
def delete_medication(user: models.User, animal: models.Animal, animal_id: int, medication_id: int) -> None:
    if (medication := store.get_medication(medication_id)) is None or medication.animal != animal:
        raise BadRequest(f"Medication {medication_id} not found for animal {animal_id}")

    store.delete_medication(medication)


@requires_animal_permission
def get_medications_for_animal(user: models.User, animal: models.Animal, animal_id: int) -> List[schemas.Medication]:
    medications = store.get_medications(animal)

    return [schemas.Medication.model_validate(appointment) for appointment in medications]


@requires_animal_permission
def update_medication(
    user: models.User, animal: models.Animal, animal_id: int, medication_id: int, data: schemas.UpdateMedication
) -> schemas.Medication:
    if (medication := store.get_medication(medication_id)) is None or medication.animal != animal:
        raise BadRequest(f"Medication {medication_id} not found for animal {animal_id}")

    medication = store.update_medication(medication, data)

    return schemas.Medication.model_validate(medication)
