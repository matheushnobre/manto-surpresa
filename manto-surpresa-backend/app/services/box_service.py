from models import Box
from sqlalchemy.orm import Session
from fastapi import Depends
from dependencies import get_session

def get_boxes(session: Session = Depends(get_session)):
    boxes = session.query(Box).all()
    return boxes

def get_box_by_id(id: int, session: Session = Depends(get_session)):
    box = session.query(Box).filter(Box.id==id).first()
    
    if not box:
        return None
        
    return box

def add_box(name: str, description: str, image: str, price: float, session: Session = Depends(get_session)):
    new_box = Box(name=name, description=description, image=image, price=price)
    session.add(new_box)
    session.commit()
    session.refresh(new_box)

    return new_box