import time
from datetime import date

import sqlalchemy as sa
from dateutil.relativedelta import relativedelta

from app import models, schemas
from app.extensions import db


def check_user_exists(email: str) -> bool:
    return bool(db.session.scalar(sa.select(models.User).where(models.User.email == email)))


def create_user(email: str) -> None:
    new_user = models.User(email=email)
    db.session.add(new_user)
    db.session.commit()


def get_animal_types() -> list[models.AnimalType]:
    return models.AnimalType.query.order_by("name").all()


def get_animal_type_by_id(animal_type_id: int) -> models.AnimalType | None:
    return models.AnimalType.query.filter(models.AnimalType.id == animal_type_id).one_or_none()


def get_user_by_email(email: str) -> models.User | None:
    return models.User.query.filter(models.User.email == email).one_or_none()


def create_animal(name: str, animal_type: models.AnimalType, user: models.User) -> models.Animal:
    animal = models.Animal(name=name, animal_type=animal_type, user=user)
    db.session.add(animal)
    db.session.commit()

    return animal


def get_animal(animal_id: int) -> models.Animal | None:
    return models.Animal.query.filter(models.Animal.id == animal_id).one_or_none()


def get_animals_for_user(user: models.User) -> list[models.Animal]:
    return models.Animal.query.filter(models.Animal.user == user).all()


def create_symptom(data: schemas.CreateSymptom, animal: models.Animal) -> models.Symptom:
    symptom = models.Symptom(description=data.description, date=data.date, animal=animal)
    db.session.add(symptom)
    db.session.commit()

    return symptom


def get_symptom(symptom_id: int) -> models.Symptom | None:
    return models.Symptom.query.filter(models.Symptom.id == symptom_id).one_or_none()


def delete_symptom(symptom: models.Symptom) -> None:
    db.session.delete(symptom)
    db.session.commit()


def update_symptom(symptom: models.Symptom, data: schemas.UpdateSymptom) -> models.Symptom:
    if data.description:
        symptom.description = data.description
    if data.date:
        symptom.date = data.date

    db.session.commit()

    return symptom


def get_symptoms_for_animal(animal: models.Animal) -> list[models.Symptom]:
    return models.Symptom.query.filter(models.Symptom.animal == animal).order_by(models.Symptom.date.desc()).all()


def create_weight(data: schemas.CreateWeight, animal: models.Animal) -> models.Weight:
    weight = models.Weight(weight=data.weight, date=data.date, animal=animal)
    db.session.add(weight)
    db.session.commit()

    return weight


def get_weight(weight_id: int) -> models.Weight | None:
    return models.Weight.query.filter(models.Weight.id == weight_id).one_or_none()


def get_weights_for_animal(animal: models.Animal) -> list[models.Weight]:
    return models.Weight.query.filter(models.Weight.animal == animal).order_by(models.Weight.date.desc()).all()


def delete_weight(weight: models.Weight) -> None:
    db.session.delete(weight)
    db.session.commit()


def update_weight(weight: models.Weight, data: schemas.UpdateWeight) -> models.Weight:
    if data.weight:
        weight.weight = data.weight
    if data.date:
        weight.date = data.date

    db.session.commit()

    return weight


def create_appointment(data: schemas.CreateAppointment, animal: models.Animal) -> models.Appointment:
    appointment = models.Appointment(description=data.description, date=data.date, notes=data.notes, animal=animal)
    db.session.add(appointment)
    db.session.commit()

    return appointment


def get_appointment(appointment_id: int) -> models.Appointment | None:
    return models.Appointment.query.filter(models.Appointment.id == appointment_id).one_or_none()


def get_appointments_for_animal(animal: models.Animal) -> list[models.Appointment]:
    return (
        models.Appointment.query.filter(models.Appointment.animal == animal)
        .order_by(models.Appointment.date.desc())
        .all()
    )


def delete_appointment(appointment: models.Appointment) -> None:
    db.session.delete(appointment)
    db.session.commit()


def update_appointment(appointment: models.Appointment, data: schemas.UpdateAppointment) -> models.Appointment:
    if data.description:
        appointment.description = data.description
    if data.date:
        appointment.date = data.date
    if "notes" in data.model_fields_set:
        appointment.notes = data.notes

    db.session.commit()

    return appointment


def create_medication(data: schemas.CreateMedication, animal: models.Animal, end_date: date) -> models.Medication:
    medication = models.Medication(
        name=data.name,
        is_recurring=data.is_recurring,
        times_per_day=data.times_per_day,
        frequency_number=data.frequency_number,
        frequency_unit=data.frequency_unit,
        duration_number=data.duration_number,
        duration_unit=data.duration_unit,
        start_date=data.start_date,
        end_date=end_date,
        notes=data.notes,
        animal=animal,
    )
    db.session.add(medication)
    db.session.commit()

    return medication


def get_medication(medication_id: int) -> models.Medication | None:
    return models.Medication.query.filter(models.Medication.id == medication_id).one_or_none()


def get_medications(animal: models.Animal) -> list[models.Medication]:
    return (
        models.Medication.query.filter(models.Medication.animal == animal)
        .order_by(models.Medication.start_date.desc())
        .all()
    )


def delete_medication(medication: models.Medication) -> None:
    db.session.delete(medication)
    db.session.commit()


def update_medication(medication: models.Medication, data: schemas.UpdateMedication) -> models.Medication:
    if data.name:
        medication.name = data.name
    if "notes" in data.model_fields_set:
        medication.notes = data.notes

    db.session.commit()

    return medication


def create_demo_account() -> models.User:
    current_time = int(time.time())
    email = "demo_" + str(current_time)
    user = models.User(email=email, is_demo_account=True)
    db.session.add(user)

    animal_type = get_animal_type_by_id(1)
    animal = models.Animal(name="Horatio", animal_type=animal_type, user=user)
    db.session.add(animal)

    about_eight_years_ago = date.today() - relativedelta(years=8, months=3, days=2)
    about_two_years_ago = date.today() - relativedelta(years=2, months=1, days=14)
    about_six_months_ago = date.today() - relativedelta(months=6, days=3)

    medications = [
        models.Medication(
            name="Worming tablets",
            is_recurring=True,
            times_per_day=1,
            frequency_number=3,
            frequency_unit="month",
            duration_number=None,
            duration_unit=None,
            start_date=about_eight_years_ago,
            end_date=None,
            notes=None,
            animal=animal,
        ),
        models.Medication(
            name="Flea spot-on",
            is_recurring=True,
            times_per_day=1,
            frequency_number=1,
            frequency_unit="month",
            duration_number=None,
            duration_unit=None,
            start_date=about_eight_years_ago,
            end_date=None,
            notes="PetsAtHome subscription",
            animal=animal,
        ),
        models.Medication(
            name="Diuretic",
            is_recurring=False,
            times_per_day=False,
            frequency_number=None,
            frequency_unit=None,
            duration_number=None,
            duration_unit=None,
            start_date=about_two_years_ago + relativedelta(days=2),
            end_date=about_two_years_ago + relativedelta(days=2),
            notes="Given at the vets",
            animal=animal,
        ),
        models.Medication(
            name="Antibiotics",
            is_recurring=True,
            times_per_day=1,
            frequency_number=1,
            frequency_unit="day",
            duration_number=7,
            duration_unit="day",
            start_date=about_two_years_ago + relativedelta(days=2),
            end_date=about_two_years_ago + relativedelta(days=9),
            notes=None,
            animal=animal,
        ),
    ]
    db.session.add_all(medications)

    symptoms = [
        models.Symptom(
            description="Rapid breathing - called vet, said to monitor", date=about_two_years_ago, animal=animal
        ),
        models.Symptom(
            description="Rapid breathing continuing. Seems very tired after appointment",
            date=about_two_years_ago + relativedelta(days=2),
            animal=animal,
        ),
        models.Symptom(
            description="Breathing back to normal", date=about_two_years_ago + relativedelta(days=4), animal=animal
        ),
        models.Symptom(
            description="Didn't eat breakfast. No interest even when offered repeatedly.",
            date=about_six_months_ago,
            animal=animal,
        ),
        models.Symptom(description="Not eating again", date=about_six_months_ago, animal=animal),
        models.Symptom(
            description="Tried new food - appetite appears to be back",
            date=about_six_months_ago + relativedelta(days=1),
            animal=animal,
        ),
        models.Symptom(description="Excessive scratching", date=date.today(), animal=animal),
    ]
    db.session.add_all(symptoms)

    weights = [
        models.Weight(weight=4060, date=date.today() - relativedelta(weeks=1), animal=animal),
        models.Weight(weight=4100, date=date.today() - relativedelta(weeks=2), animal=animal),
        models.Weight(weight=3890, date=date.today() - relativedelta(weeks=5), animal=animal),
        models.Weight(weight=3900, date=date.today() - relativedelta(weeks=6), animal=animal),
        models.Weight(weight=3880, date=date.today() - relativedelta(weeks=10), animal=animal),
        models.Weight(weight=4200, date=date.today() - relativedelta(weeks=14), animal=animal),
    ]
    db.session.add_all(weights)

    appointments = [
        models.Appointment(description="Annual check-up", date=about_eight_years_ago, notes=None, animal=animal),
        models.Appointment(
            description="Annual check-up",
            date=about_eight_years_ago + relativedelta(years=1, days=5),
            notes=None,
            animal=animal,
        ),
        models.Appointment(
            description="Annual check-up",
            date=about_eight_years_ago + relativedelta(years=2, weeks=2),
            notes=None,
            animal=animal,
        ),
        models.Appointment(
            description="Annual check-up",
            date=about_eight_years_ago + relativedelta(years=3, months=1, days=2),
            notes=None,
            animal=animal,
        ),
        models.Appointment(
            description="Annual check-up",
            date=about_eight_years_ago + relativedelta(years=4, weeks=1),
            notes=None,
            animal=animal,
        ),
        models.Appointment(
            description="Annual check-up",
            date=about_eight_years_ago + relativedelta(years=5, weeks=2, days=6),
            notes=None,
            animal=animal,
        ),
        models.Appointment(
            description="Annual check-up",
            date=about_eight_years_ago + relativedelta(years=6, weeks=3, days=4),
            notes=None,
            animal=animal,
        ),
        models.Appointment(
            description="Phone call - rapid breathing",
            date=about_two_years_ago,
            notes="Vet said to monitor, book in-person appointment if continues",
            animal=animal,
        ),
        models.Appointment(
            description="Out of hours appt - rapid breathing",
            date=about_two_years_ago + relativedelta(days=2),
            notes="Given duretic and prescribed antibiotics",
            animal=animal,
        ),
        models.Appointment(
            description="Annual check-up",
            date=about_eight_years_ago + relativedelta(years=7, weeks=1),
            notes=None,
            animal=animal,
        ),
        models.Appointment(
            description="Annual check-up",
            date=about_eight_years_ago + relativedelta(years=8, weeks=5),
            notes=None,
            animal=animal,
        ),
        models.Appointment(
            description="Annual check-up",
            date=about_eight_years_ago + relativedelta(years=9, weeks=4),
            notes=None,
            animal=animal,
        ),
    ]
    db.session.add_all(appointments)

    db.session.commit()

    return user
