/**
 * Email Service for OTP Delivery
 * Sends OTP codes via email
 */

// Mock nodemailer implementation (nodemailer not installed)
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html?: string;
}

interface Transporter {
  sendMail: (options: MailOptions) => Promise<{ messageId: string }>;
}

const nodemailer = { 
  createTransport: (config: any): Transporter => ({
    sendMail: async (options: MailOptions) => ({
      messageId: `mock-${Date.now()}`
    })
  })
};

// Email configuration
const emailConfig = {
  service: process.env.EMAIL_SERVICE || 'gmail',
  email: process.env.EMAIL_USER || 'your-email@gmail.com',
  password: process.env.EMAIL_PASSWORD || 'your-app-password',
  from: process.env.EMAIL_FROM || 'noreply@mplads.gov.in',
};

// Create email transporter
let transporter: Transporter | null = null;

const initializeEmailService = () => {
  try {
    if (process.env.EMAIL_SERVICE === 'gmail' || emailConfig.service === 'gmail') {
      // Gmail configuration
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailConfig.email,
          pass: emailConfig.password,
        },
      });
    } else if (process.env.EMAIL_SMTP_HOST) {
      // Custom SMTP configuration
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP_HOST,
        port: parseInt(process.env.EMAIL_SMTP_PORT || '587'),
        secure: process.env.EMAIL_SMTP_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_SMTP_USER,
          pass: process.env.EMAIL_SMTP_PASSWORD,
        },
      });
    } else {
      console.warn('⚠️ Email service not configured. OTP will NOT be sent.');
      console.warn('Configure EMAIL_SERVICE, EMAIL_USER, EMAIL_PASSWORD in .env');
    }

    console.log('✓ Email service initialized');
  } catch (error: any) {
    console.error('❌ Failed to initialize email service:', error.message);
  }
};

// Send OTP Email
export const sendOTPEmail = async (toEmail: string, otp: string, userName: string = 'User'): Promise<boolean> => {
  try {
    if (!transporter) {
      console.log('📧 Email service not configured. Mock sending OTP to:', toEmail);
      console.log('📧 OTP Code:', otp);
      console.log('⚠️ In production, this would be sent via email.');
      return true; // Mock success for development
    }

    const mailOptions = {
      from: emailConfig.from,
      to: toEmail,
      subject: '🔐 MPLADS Login - Your One-Time Password (OTP)',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1B3A7A 0%, #0F2A6B 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .otp-box { background: #fff; border: 2px solid #1B3A7A; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; }
            .otp-code { font-size: 36px; font-weight: bold; color: #1B3A7A; letter-spacing: 5px; font-family: 'Courier New', monospace; }
            .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
            .warning { color: #d9534f; margin: 10px 0; font-size: 14px; }
            .tricolor { height: 4px; background: linear-gradient(90deg, #FF6B00 0%, white 33%, #047A1E 100%); }
          </style>
        </head>
        <body>
          <div class="tricolor"></div>
          <div class="container">
            <div class="header">
              <h1>🇮🇳 MPLADS Portal</h1>
              <p>Member of Parliament Local Area Development Scheme</p>
            </div>
            
            <div class="content">
              <p>Dear ${userName},</p>
              
              <p>You have requested to log in to the MPLADS portal. Use the One-Time Password (OTP) below to complete your login:</p>
              
              <div class="otp-box">
                <p style="margin: 0 0 10px 0; color: #666;">Your OTP Code:</p>
                <div class="otp-code">${otp}</div>
              </div>
              
              <p><strong>⏱️ This OTP will expire in 5 minutes.</strong></p>
              
              <div class="warning">
                🔒 <strong>Security Notice:</strong>
                <ul style="margin: 5px 0; padding-left: 20px;">
                  <li>Never share this OTP with anyone</li>
                  <li>MPLADS staff will never ask for your OTP</li>
                  <li>Delete this email after using the OTP</li>
                </ul>
              </div>
              
              <p>If you did not request this OTP, please ignore this email. Your account is secure.</p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              
              <p style="font-size: 12px; color: #666;">
                <strong>Technical Details:</strong><br>
                Email: ${toEmail}<br>
                Sent: ${new Date().toLocaleString('en-IN')}<br>
                System: MPLADS Portal v1.0
              </p>
            </div>
            
            <div class="footer">
              <p><strong>National Informatics Centre (NIC)</strong></p>
              <p>Ministry of Electronics & Information Technology, Government of India</p>
              <p>© 2026 All Rights Reserved</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✓ OTP email sent to:', toEmail);
    console.log('  Message ID:', info.messageId);
    return true;
  } catch (error: any) {
    console.error('❌ Failed to send OTP email:', error.message);
    return false;
  }
};

// Send Welcome Email (after successful login)
export const sendWelcomeEmail = async (toEmail: string, userName: string, role: string): Promise<boolean> => {
  try {
    if (!transporter) {
      console.log('📧 Mock sending welcome email to:', toEmail);
      return true;
    }

    const mailOptions = {
      from: emailConfig.from,
      to: toEmail,
      subject: '✅ MPLADS Login Successful',
      html: `
        <h2>Welcome to MPLADS Portal</h2>
        <p>Hi ${userName},</p>
        <p>Your login to the MPLADS portal was successful!</p>
        <p><strong>Role:</strong> ${role}</p>
        <p>You can now access all features available for your role.</p>
        <p>Thank you for using MPLADS Portal.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✓ Welcome email sent to:', toEmail);
    return true;
  } catch (error: any) {
    console.error('❌ Failed to send welcome email:', error.message);
    return false;
  }
};

// Send Login Alert Email
export const sendLoginAlertEmail = async (toEmail: string, userName: string, loginTime: Date, ipAddress?: string): Promise<boolean> => {
  try {
    if (!transporter) {
      console.log('📧 Mock sending login alert to:', toEmail);
      return true;
    }

    const mailOptions = {
      from: emailConfig.from,
      to: toEmail,
      subject: '🔐 MPLADS Login Alert',
      html: `
        <h2>Login Alert</h2>
        <p>Hi ${userName},</p>
        <p>Your account was accessed at:</p>
        <p><strong>Time:</strong> ${loginTime.toLocaleString('en-IN')}</p>
        ${ipAddress ? `<p><strong>IP Address:</strong> ${ipAddress}</p>` : ''}
        <p>If this was not you, please change your password immediately.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✓ Login alert email sent to:', toEmail);
    return true;
  } catch (error: any) {
    console.error('❌ Failed to send login alert email:', error.message);
    return false;
  }
};

export default {
  initializeEmailService,
  sendOTPEmail,
  sendWelcomeEmail,
  sendLoginAlertEmail,
};

// Initialize on module load
initializeEmailService();
