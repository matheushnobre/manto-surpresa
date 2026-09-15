from sqlalchemy import create_engine, Column, String, Integer, Float
from sqlalchemy.orm import declarative_base

db = create_engine("sqlite:///banco.db")
Base = declarative_base()

class Box(Base):
    __tablename__ = 'boxes'

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    name = Column("name", String, nullable=False)
    image = Column("image", String, nullable=False)
    description = Column("description", String, nullable=False)
    price = Column("price", Float, nullable=False)

    def __init__(self, name: str, image: str, description: str, price: float):
        self.name = name
        self.image = image
        self.description = description
        self.price = price
        
