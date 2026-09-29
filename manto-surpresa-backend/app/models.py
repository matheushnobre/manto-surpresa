from sqlalchemy import create_engine, Column, String, Integer, Numeric, Date, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from decimal import Decimal

db = create_engine("sqlite:///banco.db")
Base = declarative_base()

class Box(Base):
    __tablename__ = "boxes"

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    name = Column("name", String, nullable=False)
    image = Column("image", String, nullable=False)
    description = Column("description", String, nullable=False)
    price = Column("price", Numeric(10, 2), nullable=False)

    order_items = relationship("OrderItem", back_populates="box")

    def __init__(self, name: str, image: str, description: str, price: Decimal):
        self.name = name
        self.image = image
        self.description = description
        self.price = price


class Client(Base):
    __tablename__ = "clients"

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    name = Column("name", String, nullable=False)
    email = Column("email", String, nullable=False)
    telephone = Column("telephone", String, nullable=False)

    orders = relationship("Order", back_populates="client")

    def __init__(self, name: str, email: str, telephone: str):
        self.name = name
        self.email = email
        self.telephone = telephone


class Address(Base):
    __tablename__ = "address"

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    cep = Column("cep", String, nullable=False)
    road = Column("road", String, nullable=False)
    number = Column("number", String, nullable=False)
    complement = Column("complement", String)
    neighborhood = Column("neighborhood", String, nullable=False)
    city = Column("city", String, nullable=False)
    state = Column("state", String, nullable=False)

    orders = relationship("Order", back_populates="address")

    def __init__(self, cep: str, road: str, number: str, neighborhood: str, city: str, state: str, complement: str | None = None):
        self.cep = cep
        self.road = road
        self.number = number
        self.complement = complement
        self.neighborhood = neighborhood
        self.city = city
        self.state = state


class Order(Base):
    __tablename__ = "orders"

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    date = Column("date", Date, nullable=False)
    status = Column("status", String, nullable=False, default="Pendente")
    subtotal = Column("subtotal", Numeric(10, 2), nullable=False, default=0)
    address_id = Column("address_id", Integer, ForeignKey("address.id"), nullable=False)
    client_id = Column("client_id", Integer, ForeignKey("clients.id"), nullable=False)

    client = relationship("Client", back_populates="orders")
    address = relationship("Address", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def __init__(self, date, client, address, status="Pendente"):
        self.date = date
        self.status = status
        self.client = client
        self.address = address

    def calcular_preco(self):
        self.subtotal = sum(
            (item.unit_price * item.quantity for item in self.items), 
            Decimal("0.00")
        )

        return self.subtotal


class OrderItem(Base):
    __tablename__ = "order_item"

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    order_id = Column("order_id", Integer, ForeignKey("orders.id"), nullable=False)
    box_id = Column("box_id", Integer, ForeignKey("boxes.id"), nullable=False)
    quantity = Column("quantity", Integer, nullable=False)
    size = Column("size", String, nullable=False)
    unit_price = Column("unit_price", Numeric(10, 2), nullable=False) 

    order = relationship("Order", back_populates="items")
    box = relationship("Box", back_populates="order_items")

    def __init__(self, box: Box, quantity: int, size: str):
        self.box = box
        self.quantity = quantity
        self.size = size
        self.unit_price = box.price