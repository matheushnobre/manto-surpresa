import os
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError, ExpiredSignatureError
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY não configurada")

ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))


def create_access_token(email: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": email,
        "exp": expires_at
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """
    Decodifica e valida a assinatura e expiração do token JWT.
    Lança ExpiredSignatureError se o token estiver expirado,
    ou JWTError se a assinatura/estrutura for inválida.
    """
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
