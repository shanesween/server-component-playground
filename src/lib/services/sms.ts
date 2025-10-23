import twilio from 'twilio';

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export interface SMSResult {
    success: boolean;
    messageId?: string;
    error?: string;
    cost?: number;
}

export interface SMSOptions {
    phoneNumber: string;
    code: string;
    retries?: number;
}

/**
 * Send SMS verification code via Twilio
 */
export async function sendSMSVerificationCode(options: SMSOptions): Promise<SMSResult> {
    const { phoneNumber, code, retries = 3 } = options;

    // In development mode, always fall back to console logging
    if (process.env.NODE_ENV === 'development') {
        console.log(`📱 SMS Code for ${phoneNumber}: ${code}`);
        return {
            success: true,
            messageId: 'dev-' + Date.now()
        };
    }

    // Check if Twilio is configured for production
    if (!client || !twilioPhoneNumber) {
        console.warn('Twilio not configured, SMS will not be sent');
        return {
            success: false,
            error: 'SMS service not configured'
        };
    }

    // Validate phone number format (E.164)
    if (!phoneNumber.startsWith('+') || phoneNumber.length < 10) {
        return {
            success: false,
            error: 'Invalid phone number format'
        };
    }

    // Create message content
    const message = `Your verification code is: ${code}\n\nThis code expires in 5 minutes. Do not share this code with anyone.`;

    try {
        // Send SMS with retry logic
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const messageResult = await client.messages.create({
                    body: message,
                    from: twilioPhoneNumber,
                    to: phoneNumber,
                    // Add status callback for delivery tracking (only in production)
                    ...(process.env.NODE_ENV === 'production' && {
                        statusCallback: `${process.env.NEXTAUTH_URL}/api/sms/status`
                    }),
                });

                console.log(`SMS sent successfully to ${phoneNumber}:`, {
                    messageId: messageResult.sid,
                    status: messageResult.status,
                    attempt
                });

                return {
                    success: true,
                    messageId: messageResult.sid,
                    cost: parseFloat(messageResult.price || '0')
                };
            } catch (error) {
                lastError = error as Error;
                console.warn(`SMS attempt ${attempt} failed:`, error);

                // Don't retry on certain errors
                if (error instanceof Error && (
                    error.message.includes('Invalid phone number') ||
                    error.message.includes('Permission denied')
                )) {
                    break;
                }

                // Wait before retry (exponential backoff)
                if (attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
            }
        }

        return {
            success: false,
            error: lastError?.message || 'Failed to send SMS after retries'
        };

    } catch (error) {
        console.error('SMS sending error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
    // E.164 format validation
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
}

/**
 * Format phone number to E.164 format
 */
export function formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');

    // Add +1 if it's a 10-digit US number
    if (digits.length === 10) {
        return `+1${digits}`;
    }

    // If it already starts with 1 and is 11 digits, add +
    if (digits.startsWith('1') && digits.length === 11) {
        return `+${digits}`;
    }

    // If it already has +, return as is
    if (phone.startsWith('+')) {
        return phone;
    }

    // Default: add +1 for US numbers
    return `+1${digits}`;
}

/**
 * Check if SMS service is available
 */
export function isSMSServiceAvailable(): boolean {
    // In development mode, always return false to use fallback
    if (process.env.NODE_ENV === 'development') {
        return false;
    }
    return !!(client && twilioPhoneNumber);
}

/**
 * Get SMS service status
 */
export function getSMSServiceStatus(): {
    configured: boolean;
    accountSid: boolean;
    authToken: boolean;
    phoneNumber: boolean;
} {
    return {
        configured: isSMSServiceAvailable(),
        accountSid: !!accountSid,
        authToken: !!authToken,
        phoneNumber: !!twilioPhoneNumber,
    };
}
