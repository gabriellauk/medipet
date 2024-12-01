from typing import List


from pydantic import BaseModel, ConfigDict, field_validator
from pydantic.alias_generators import to_camel


class BaseSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    def model_dump(self, **kwargs):
        kwargs.setdefault("by_alias", True)
        return super().model_dump(**kwargs)


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

    @field_validator("name", mode="before")
    @classmethod
    def empty_str_to_none(cls, v: str) -> str | None:
        if v == "":
            return None
        return v
