from typing import List
from pydantic import BaseModel, Field

class OrderItemSchema(BaseModel):
    box_id: int
    quantity: int
    size: str

class ClientSchema(BaseModel):
    name: str
    telephone: str
    email: str

class AddressSchema(BaseModel):
    cep: str
    road: str
    number: str
    complement: str | None = None
    neighborhood: str
    city: str
    state: str

class OrderSchema(BaseModel):
    items: List[OrderItemSchema] = Field(default_factory=list)
    client: ClientSchema
    address: AddressSchema