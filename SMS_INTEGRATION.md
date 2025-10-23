# Twilio SMS Integration Guide

This document outlines the SMS integration implementation for phone-based authentication using Twilio with NextAuth.js.

## Overview

The SMS integration allows users to sign in using their phone number by receiving a 6-digit verification code via SMS. The system uses NextAuth.js for session management with a custom phone provider for authentication.

## Features

- ✅ **Twilio SMS Integration**: Real SMS sending via Twilio API
- ✅ **NextAuth.js Integration**: Custom phone provider for NextAuth.js sessions
- ✅ **Rate Limiting**: Prevents spam and abuse
- ✅ **Security**: Enhanced attempt tracking and validation
- ✅ **Development Mode**: Console logging for testing without SMS costs
- ✅ **Error Handling**: Comprehensive error handling and retry logic
- ✅ **Status Tracking**: SMS delivery status monitoring
- ✅ **Onboarding Flow**: Automatic redirect to onboarding for new users

## Setup Instructions

### 1. Twilio Account Setup

1. Create a Twilio account at [twilio.com](https://twilio.com)
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number for sending SMS
4. Add the credentials to your environment variables

### 2. Environment Variables

Add these to your `.env` file:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### 3. Database Schema

The integration uses the existing `sms_verification_codes` table with these fields:

- `phone_number`: E.164 formatted phone number
- `code`: 6-digit verification code
- `attempts`: Number of verification attempts
- `max_attempts`: Maximum allowed attempts (default: 3)
- `expires_at`: Code expiration timestamp
- `verified_at`: Verification completion timestamp
- `ip_address`: Client IP for rate limiting

## NextAuth.js Integration

### Custom Phone Provider

The system uses a custom NextAuth.js credentials provider for phone authentication:

```typescript
// src/lib/auth/phone-provider.ts
export const phoneProvider: NextAuthOptions["providers"][0] = {
  id: "phone",
  name: "Phone",
  type: "credentials",
  credentials: {
    phoneNumber: { label: "Phone Number", type: "text" },
    code: { label: "Verification Code", type: "text" },
  },
  async authorize(credentials) {
    // Verification logic with SMS code validation
    // Creates or updates user in database
    // Returns user object for NextAuth session
  },
};
```

### Session Management

The system automatically:

- Creates NextAuth sessions upon successful phone verification
- Tracks user onboarding status in the session
- Redirects new users to onboarding flow
- Manages user authentication state across the application

### Onboarding Integration

After successful phone verification:

1. **New Users**: Redirected to `/onboarding` for profile setup
2. **Existing Users**: Redirected to main application
3. **Session Persistence**: User data available throughout the app via NextAuth session

## API Endpoints

### Send Verification Code

```
POST /api/auth/phone/send-code
```

**Request:**

```json
{
  "phoneNumber": "+1234567890"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Verification code sent",
  "code": "123456" // Only in development mode
}
```

**Note:** In development mode, the actual verification code is returned in the response for testing purposes. In production, the code is sent via SMS only.

### Verify Code (NextAuth.js Integration)

The phone verification now uses NextAuth.js with a custom phone provider. The verification process creates a NextAuth session instead of returning user data directly.

**Frontend Implementation:**

```javascript
import { signIn } from "next-auth/react";

const result = await signIn("phone", {
  phoneNumber: "+1234567890",
  code: "123456",
  redirect: false,
});

if (result?.ok) {
  // Check if user needs onboarding
  const userResponse = await fetch("/api/auth/me");
  if (userResponse.ok) {
    const userData = await userResponse.json();
    if (!userData.onboardingCompleted) {
      router.push("/onboarding");
    } else {
      router.push("/");
    }
  }
}
```

**Response:**

```json
{
  "ok": true,
  "error": null,
  "status": 200,
  "url": null
}
```

**Note:** The actual user data is now accessed via the NextAuth session through `/api/auth/me` endpoint.

### Get Current User

```
GET /api/auth/me
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "phoneNumber": "+1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "displayName": "John Doe",
    "onboardingCompleted": false
  }
}
```

**Note:** This endpoint requires a valid NextAuth session. Returns 401 if not authenticated.

### SMS Status Check

```
GET /api/sms/status-check
```

**Response:**

```json
{
  "success": true,
  "smsService": {
    "configured": false,
    "accountSid": true,
    "authToken": true,
    "phoneNumber": true
  },
  "environment": "development",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Returns SMS service configuration status and availability.

### SMS Test (Development Only)

```
POST /api/sms/test
```

**Request:**

```json
{
  "phoneNumber": "+1234567890",
  "testCode": "123456" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "test": {
    "phoneNumber": "+1234567890",
    "code": "123456",
    "smsResult": {
      "success": true,
      "messageId": "dev-1705312200000"
    },
    "serviceStatus": {
      "configured": false,
      "accountSid": true,
      "authToken": true,
      "phoneNumber": true
    },
    "environment": "development",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### SMS Status Callback (Production Only)

```
POST /api/sms/status
```

**Note:** This endpoint is used by Twilio to send delivery status updates. It receives webhook data when SMS messages are delivered, failed, or undelivered.

**Webhook Data:**

- `MessageSid`: Twilio message ID
- `MessageStatus`: Delivery status (delivered, failed, undelivered)
- `To`: Recipient phone number
- `ErrorCode`: Error code if delivery failed
- `ErrorMessage`: Error message if delivery failed

## Rate Limiting

- **Code Expiration**: Codes expire after 5 minutes
- **Failed Attempts**: Maximum 3 attempts per code (configurable via `max_attempts`)
- **IP Tracking**: Client IP addresses are logged for security monitoring
- **Single Use**: Each verification code can only be used once

## Security Features

1. **Code Expiration**: Codes expire after 5 minutes
2. **Single Use**: Codes can only be used once
3. **Attempt Tracking**: Failed attempts are tracked and limited (max 3 attempts per code)
4. **IP Tracking**: Client IP addresses are logged for security monitoring
5. **Retry Logic**: Exponential backoff for SMS sending failures
6. **Input Validation**: Phone number format validation (E.164)

## Development vs Production

### Development Mode

- SMS codes are logged to console instead of being sent
- Verification codes are returned in API responses for testing
- Test endpoint available at `/api/sms/test`
- No Twilio credentials required for basic testing
- Status check endpoint shows service configuration

### Production Mode

- Real SMS messages sent via Twilio
- Status callbacks for delivery tracking via `/api/sms/status`
- Full error handling and retry logic with exponential backoff
- Cost tracking per message
- No verification codes returned in API responses

## Error Handling

The integration includes comprehensive error handling for:

- Invalid phone numbers (E.164 format validation)
- Twilio API failures with retry logic
- Network timeouts with exponential backoff
- Database errors during code storage/verification
- SMS delivery failures with status tracking

## Monitoring

- SMS delivery status tracking via Twilio webhooks at `/api/sms/status`
- Failed delivery logging with error codes and messages
- Cost tracking per message
- Service availability monitoring via `/api/sms/status-check`
- IP address logging for security monitoring

## Onboarding Flow

### New User Journey

1. **Phone Verification**: User enters phone number and receives SMS code
2. **Code Verification**: User enters 6-digit code via NextAuth.js phone provider
3. **Session Creation**: NextAuth.js creates authenticated session
4. **Onboarding Check**: System checks `onboardingCompleted` status
5. **Redirect Logic**:
   - New users → `/onboarding` (3-step flow)
   - Existing users → `/` (main app)

### Onboarding Steps

1. **Welcome Screen**: Animated intro to "Strictly Sports"
2. **Name Input**: First name collection with validation
3. **Team Selection**: Choose favorite NFL teams from all 32 teams
4. **Completion**: Updates user profile and team relationships

### Onboarding API Endpoints

```
POST /api/onboarding/complete
POST /api/onboarding/teams
```

These endpoints require NextAuth.js session authentication and update user data and team preferences.

## Testing

### Development Testing

1. Use the test endpoint: `POST /api/sms/test`
2. Check console logs for verification codes
3. Use the send-code endpoint which returns codes in development mode
4. Verify rate limiting and attempt tracking works correctly
5. Test the status-check endpoint: `GET /api/sms/status-check`
6. **Test NextAuth Integration**: Verify session creation and onboarding redirects
7. **Test Onboarding Flow**: Complete the 3-step onboarding process

### Production Testing

1. Test with real phone numbers
2. Verify SMS delivery via Twilio
3. Test rate limiting and security features
4. Monitor delivery status callbacks at `/api/sms/status`
5. Verify codes are not returned in API responses
6. **Test Complete Flow**: Phone verification → Onboarding → Dashboard access
7. **Test Session Persistence**: Verify user stays logged in across page refreshes

## Cost Considerations

- Each SMS message costs approximately $0.0075 (US) via Twilio
- Rate limiting helps control costs
- Failed attempts don't incur SMS costs
- Development mode doesn't send real SMS

## Troubleshooting

### Common Issues

1. **SMS Not Sending**

   - Check Twilio credentials
   - Verify phone number format (E.164)
   - Check Twilio account balance

2. **Rate Limiting Issues**

   - Wait for cooldown period
   - Check for multiple requests from same IP
   - Verify phone number isn't blocked

3. **Code Verification Failing**

   - Check code expiration (5 minutes)
   - Verify code hasn't been used (single-use only)
   - Check attempt limits (max 3 attempts per code)
   - Verify phone number format matches the one used to send the code

4. **NextAuth.js Session Issues**

   - Verify NextAuth.js configuration is correct
   - Check that the phone provider is properly registered
   - Ensure session callbacks are working correctly
   - Verify database connection for session storage

5. **Onboarding Redirect Issues**
   - Check `onboardingCompleted` field in user record
   - Verify NextAuth session contains user data
   - Test `/api/auth/me` endpoint returns correct user data
   - Ensure onboarding page is accessible to authenticated users

### Debug Endpoints

- `GET /api/sms/status-check` - Check service configuration
- `POST /api/sms/test` - Test SMS sending (development only)
- `POST /api/sms/status` - Twilio status callback endpoint (production only)
- `GET /api/auth/me` - Get current user data (requires authentication)
- `GET /api/seed/nfl-teams` - Check NFL teams in database
- `POST /api/onboarding/complete` - Complete onboarding (requires authentication)
- `POST /api/onboarding/teams` - Save favorite teams (requires authentication)

## Security Best Practices

1. **Environment Variables**: Never commit Twilio credentials
2. **Rate Limiting**: Implement multiple layers of rate limiting
3. **Validation**: Validate all phone number inputs
4. **Logging**: Log all SMS activities for security monitoring
5. **Monitoring**: Set up alerts for unusual SMS activity

## Future Enhancements

- [ ] International phone number support
- [ ] SMS templates and localization
- [ ] Advanced analytics and reporting
- [ ] A/B testing for message content
- [ ] Integration with other SMS providers for redundancy
