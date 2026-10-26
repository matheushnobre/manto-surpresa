from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.models import Client, SessionLocal
from app.security import ExpiredSignatureError, JWTError, decode_access_token

http_bearer = HTTPBearer(auto_error=True)


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def get_current_user_email(credentials: HTTPAuthorizationCredentials = Depends(http_bearer)) -> str:
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado. Solicite um novo código OTP.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou malformado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email: str | None = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identidade do usuário não encontrada no token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return email


def get_current_client(
    email: str = Depends(get_current_user_email),
    session: Session = Depends(get_session),
) -> Client | None:
    return session.query(Client).filter(Client.email == email).first()
