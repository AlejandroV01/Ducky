def get_verification_template(code: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your Ducky account</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header with Logo -->
                        <tr>
                            <td align="center" style="padding: 40px 0;">
                                <img src="https://ducky.pics/logo.png" alt="Ducky Logo" width="120" style="margin-bottom: 20px;">
                                <h1 style="color: #333333; font-size: 24px; margin: 0;">Welcome to Ducky!</h1>
                            </td>
                        </tr>
                        
                        <!-- Main Content -->
                        <tr>
                            <td style="padding: 0 40px;">
                                <p style="color: #666666; font-size: 16px; line-height: 24px;">
                                    Thanks for signing up! Please verify your email address to get started.
                                </p>
                                
                                <!-- Verification Code Box -->
                                <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: center;">
                                    <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">Your verification code is:</p>
                                    <div style="font-family: monospace; font-size: 32px; font-weight: bold; color: #333333; letter-spacing: 4px;">
                                        {code}
                                    </div>
                                </div>
                                
                                <p style="color: #666666; font-size: 14px; line-height: 21px;">
                                    This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 40px; background-color: #f8f9fa; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                <p style="color: #999999; font-size: 13px; margin: 0; text-align: center;">
                                    © 2024 Ducky. All rights reserved.<br>
                                    <a href="https://ducky.pics/privacy" style="color: #666666; text-decoration: none;">Privacy Policy</a> • 
                                    <a href="https://ducky.pics/terms" style="color: #666666; text-decoration: none;">Terms of Service</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

def get_welcome_template(user_name: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Ducky!</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td align="center" style="padding: 40px 0;">
                                <img src="https://ducky.pics/logo.png" alt="Ducky Logo" width="120" style="margin-bottom: 20px;">
                                <h1 style="color: #333333; font-size: 24px; margin: 0;">Welcome aboard, {user_name}!</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 0 40px;">
                                <p style="color: #666666; font-size: 16px; line-height: 24px;">
                                    We're excited to have you join the Ducky community! Here are some things you can do to get started:
                                </p>
                                
                                <!-- Features List -->
                                <ul style="color: #666666; font-size: 16px; line-height: 24px; padding-left: 20px;">
                                    <li style="margin-bottom: 10px;">Create your first album</li>
                                    <li style="margin-bottom: 10px;">Share with friends and family</li>
                                    <li style="margin-bottom: 10px;">Customize your profile</li>
                                </ul>
                                
                                <!-- CTA Button -->
                                <div style="text-align: center; margin: 40px 0;">
                                    <a href="https://ducky.pics/dashboard" style="background-color: #4A90E2; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                        Get Started
                                    </a>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 40px; background-color: #f8f9fa; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                <p style="color: #999999; font-size: 13px; margin: 0; text-align: center;">
                                    © 2024 Ducky. All rights reserved.<br>
                                    <a href="https://ducky.pics/privacy" style="color: #666666; text-decoration: none;">Privacy Policy</a> • 
                                    <a href="https://ducky.pics/terms" style="color: #666666; text-decoration: none;">Terms of Service</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """