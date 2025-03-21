import qrcode
from io import BytesIO
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta

class QrManager(BaseModel):
    token: str | None = None
    def create_token(self, user_id: int):
        self.token = jwt.encode(
            {"sub": user_id, "exp": datetime.now() + timedelta(minutes=30)},
            "secret-key-to-attendance",
            algorithm="HS256",
        )
        return self.token
    
    def get_new_qr(self):
        """Generate a QR code and return it as a PIL image"""
        if not self.token:
            raise ValueError("Token not created")
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(self.token)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        return img
    
    def get_qr_bytes(self):
        """Convert QR code image to bytes for API response"""
        img = self.get_new_qr()
        img_bytes = BytesIO()
        img.save(img_bytes, format="PNG")
        img_bytes.seek(0)  # Reset buffer position
        return img_bytes
