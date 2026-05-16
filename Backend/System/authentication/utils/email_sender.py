import resend
from django.conf import settings

resend.api_key = settings.RESEND_API_KEY

def send_otp_email(to_email, otp):
    params = {
        "from": "onboarding@resend.dev",
        "to": [to_email],
        "subject": "Your OTP Code",
        "html": f"""
            <h2>Password Reset OTP</h2>
            <p>Your OTP is:</p>
            <h1>{otp}</h1>
            <p>This OTP expires in 5 minutes.</p>
        """
    }

    email = resend.Emails.send(params)
    return email

