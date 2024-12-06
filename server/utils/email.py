import resend
import os
from dotenv import load_dotenv
from .email_templates import get_verification_template, get_welcome_template

load_dotenv()

resend.api_key = os.getenv('RESEND_API_KEY')

def send_verification_email(email: str, code: str) -> bool:
    try:
        params: resend.Emails.SendParams = {
            "from": "Ducky <verify@scriptphi.com>",
            "to": [email],
            "subject": "Verify your Ducky account",
            "html": get_verification_template(code)
        }
        resend.Emails.send(params)
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False
    
def send_welcome_email(email: str, user_name: str) -> bool:
    try:
        params: resend.Emails.SendParams = {
            "from": "Ducky <welcome@scriptphi.com>",
            "to": [email],
            "subject": "Welcome to Ducky!",
            "html": get_welcome_template(user_name)
        }
        resend.Emails.send(params)
        return True
    except Exception as e:
        print(f"Failed to send welcome email: {str(e)}")
        return False