from datetime import date as date_type
from typing import List


from pydantic import BaseModel, ConfigDict, field_validator, field_serializer
from pydantic.alias_generators import to_camel

from app.models import TimeUnit


class BaseSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    def model_dump(self, **kwargs):
        kwargs.setdefault("by_alias", True)
        return super().model_dump(**kwargs)


class User(BaseSchema):
    first_name: str
    last_name: str
    is_demo_account: bool


class AnimalType(BaseSchema):
    id: int
    name: str


class AnimalTypes(BaseSchema):
    data: List[AnimalType]


class Animal(BaseSchema):
    id: int
    name: str
    animal_type_id: int


class Animals(BaseSchema):
    data: List[Animal]


class CreateAnimal(BaseSchema):
    name: str
    animal_type_id: int

    @field_validator("name", mode="before")
    @classmethod
    def empty_str_to_none(cls, v: str) -> str | None:
        if v == "":
            return None
        return v


class SymptomFields(BaseSchema):
    description: str
    date: date_type

    @field_validator("description", mode="before")
    @classmethod
    def empty_str_to_none(cls, v: str) -> str | None:
        if v == "":
            return None
        return v

    @field_serializer("date")
    def serialize_date(self, dt: date_type, _info):
        return dt.strftime("%Y-%m-%d")


class Symptom(SymptomFields):
    id: int


class Symptoms(BaseSchema):
    data: List[Symptom]


class CreateSymptom(SymptomFields): ...


class UpdateSymptom(BaseSchema):
    description: str | None = None
    date: date_type | None = None


class WeightFields(BaseSchema):
    weight: int
    date: date_type

    @field_serializer("date")
    def serialize_date(self, dt: date_type, _info):
        return dt.strftime("%Y-%m-%d")


class Weight(WeightFields):
    id: int


class Weights(BaseSchema):
    data: List[Weight]


class CreateWeight(WeightFields): ...


class UpdateWeight(BaseSchema):
    weight: int | None = None
    date: date_type | None = None


class AppointmentFields(BaseSchema):
    description: str
    date: date_type
    notes: str | None = None

    @field_serializer("date")
    def serialize_date(self, dt: date_type, _info):
        return dt.strftime("%Y-%m-%d")

    @field_validator("description", "notes", mode="before")
    @classmethod
    def empty_str_to_none(cls, v: str) -> str | None:
        if v == "":
            return None
        return v


class Appointment(AppointmentFields):
    id: int


class Appointments(BaseSchema):
    data: List[Appointment]


class CreateAppointment(AppointmentFields): ...


class UpdateAppointment(BaseSchema):
    description: str | None = None
    date: date_type | None = None
    notes: str | None = None


class MedicationFields(BaseSchema):
    name: str
    is_recurring: bool
    times_per_day: int | None = None
    frequency_number: int | None = None
    frequency_unit: TimeUnit | None = None
    duration_number: int | None = None
    duration_unit: TimeUnit | None = None
    start_date: date_type
    notes: str | None = None

    model_config = ConfigDict(use_enum_values=True)

    @field_serializer("start_date")
    def serialize_date(self, dt: date_type, _info):
        return dt.strftime("%Y-%m-%d")

    @field_validator("name", "notes", "frequency_unit", "duration_unit", mode="before")
    @classmethod
    def empty_str_to_none(cls, v: str) -> str | None:
        if v == "":
            return None
        return v


class Medication(MedicationFields):
    id: int
    end_date: date_type | None

    @field_serializer("start_date", "end_date")
    def serialize_date(self, dt: date_type, _info):
        if dt:
            return dt.strftime("%Y-%m-%d")
        return dt


class Medications(BaseSchema):
    data: List[Medication]


class CreateMedication(MedicationFields): ...


class UpdateMedication(BaseSchema):
    name: str | None = None
    notes: str | None = None

    @field_validator("name", "notes", mode="before")
    @classmethod
    def empty_str_to_none(cls, v: str) -> str | None:
        if v == "":
            return None
        return v
