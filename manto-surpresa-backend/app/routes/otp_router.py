from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.dependencies import get_session
from fastapi import Depends
from app.services import otp_service
from pydantic import BaseModel, EmailStr

otp_router = APIRouter(prefix='/otp', tags=['otp'])

class GenerateOTPRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    code: str

@otp_router.post("/",
                summary = "Generate OTP Code",
                description = "Generate an OTP code and send email.",
                status_code = status.HTTP_200_OK,
)
def generate_otp(data: GenerateOTPRequest, session: Session = Depends(get_session)):
    email = data.email
    try:
        otp_service.generate_otp(email, session)

        return {
            "message": "Code sent to email."
        }

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating the OTP.",
        )

@otp_router.post("/verify",
                 summary = "Verify OTP Code",
                 description = "Validae an OTP Code",
                 status_code = status.HTTP_200_OK)
def verify_otp_code(data: VerifyOTPRequest, session: Session = Depends(get_session)):
    email = data.email
    code = data.code
    
    try:
        token = otp_service.verify_otp(email, code, session)
        
        return JSONResponse(
            status_code = status.HTTP_200_OK,
            content = ({
                "message": "Código verificado com sucesso",
                "access_token": token,
                "token_type": "bearer",
                "expires_in": 900
            })
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )