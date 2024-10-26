from typing import List


from pydantic import BaseModel, ConfigDict


class AnimalType(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class AnimalTypes(BaseModel):
    data: List[AnimalType]
