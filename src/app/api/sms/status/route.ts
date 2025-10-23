import { NextRequest, NextResponse } from 'next/server';

/**
 * Twilio status callback endpoint
 * Receives delivery status updates for sent SMS messages
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const messageSid = formData.get('MessageSid') as string;
        const messageStatus = formData.get('MessageStatus') as string;
        const to = formData.get('To') as string;
        const errorCode = formData.get('ErrorCode') as string;
        const errorMessage = formData.get('ErrorMessage') as string;

        console.log('SMS Status Callback:', {
            messageSid,
            messageStatus,
            to,
            errorCode,
            errorMessage
        });

        // Log the status for monitoring
        if (messageStatus === 'failed' || messageStatus === 'undelivered') {
            console.error('SMS delivery failed:', {
                messageSid,
                to,
                errorCode,
                errorMessage,
                status: messageStatus
            });
        }

        // You could update the database here to track delivery status
        // For now, we'll just log it
        if (messageSid && to) {
            // Optional: Update the verification code record with delivery status
            // This would require adding a deliveryStatus field to the schema
            console.log(`SMS ${messageSid} to ${to} status: ${messageStatus}`);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('SMS status callback error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process status callback' },
            { status: 500 }
        );
    }
}
