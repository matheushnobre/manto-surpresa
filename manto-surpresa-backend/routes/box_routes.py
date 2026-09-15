from fastapi import APIRouter, status, Form
from models import Box
from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi.responses import JSONResponse
from dependencies import get_session

box_router = APIRouter(prefix='/box', tags=['box'])

@box_router.get("/",
                summary = "List boxes",
                description = "Return all surprise boxes registered in the system.",
                status_code = status.HTTP_200_OK,
)
async def get_boxes(session: Session = Depends(get_session)):
    boxes = session.query(Box).all()
    return boxes

@box_router.get("/{id}",
                summary = "Get by id",
                description = "Return a box with specific id.",
                status_code = status.HTTP_200_OK,
)
async def get_box_by_id(id: int,
                        session: Session = Depends(get_session)):

    box = session.query(Box).filter(Box.id==id).first()

    if not box:
        return JSONResponse(
            status_code = status.HTTP_404_NOT_FOUND,
            content = {
                "message": f"Box with id {id} not found in the system."
            }
        )

    return box

@box_router.post("/add",
                summary = "Add new box",
                description = "Add a new box in the system.",
                status_code = status.HTTP_201_CREATED, 
)
async def add_box(name: str = Form(...),
                  description: str = Form(...),
                  image: str = Form(...),
                  price: float = Form(...),
                  session: Session = Depends(get_session)):

    new_box = Box(name=name, description=description, image=image, price=price)
    session.add(new_box)
    session.commit()
    session.refresh(new_box)

    return JSONResponse(
        status_code = status.HTTP_201_CREATED,
        content = {
            "id": new_box.id,
            "name": new_box.name,
            "image": new_box.image,
            "description": new_box.description,
            "price": new_box.price,
            "message": "Box successfully added"
        }
    )
