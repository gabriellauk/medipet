from typing import List


from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class BaseSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class AnimalType(BaseSchema):
    id: int
    name: str


class AnimalTypes(BaseSchema):
    data: List[AnimalType]


class Animal(BaseSchema):
    id: int
    name: str
    animal_type_id: int


class CreateAnimal(BaseSchema):
    name: str
    animal_type_id: int
