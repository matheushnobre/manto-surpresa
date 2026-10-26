import hashlib
import secrets
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import OTPCode
from app.services.email_service import send_otp_email
from app.security import create_access_token

OTP_EXPIRATION_MINUTES = 5

def generate_otp(email: str, session: Session):
    code = f"{secrets.randbelow(1_000_000):06d}"
    code_hash = hashlib.sha256(code.encode()).hexdigest()
    now = datetime.now()

    try:
        session.query(OTPCode).filter(
            OTPCode.email == email,
            OTPCode.used.is_(False),
        ).update(
            {"used": True},
            synchronize_session=False,
        )

        otp = OTPCode(
            email=email,
            code_hash=code_hash,
            expires_at=now + timedelta(
                minutes=OTP_EXPIRATION_MINUTES
            ),
            used=False,
        )

        session.add(otp)
        session.flush()

        send_otp_email(email, code)
        session.commit()

    except Exception:
        session.rollback()
        raise

import hashlib
from datetime import datetime
from sqlalchemy.orm import Session

def verify_otp(email: str, code: str, session: Session):
    code_hash = hashlib.sha256(code.encode()).hexdigest()

    otp_code = session.query(OTPCode).filter(
        OTPCode.email == email,
        OTPCode.code_hash == code_hash
    ).first()

    if not otp_code:
        raise ValueError("Código inválido")

    if otp_code.used:
        raise ValueError("Este código já foi utilizado")

    if datetime.now() > otp_code.expires_at:
        raise ValueError("Código expirado")

    otp_code.used = True
    session.commit()

    return create_access_token(otp_code.email)
