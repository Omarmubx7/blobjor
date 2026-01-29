import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'info@blobjor.me'; // Verified Domain

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string | string[];
    subject: string;
    html: string;
}) {
    if (!process.env.RESEND_API_KEY) {
        console.error("❌ RESEND_API_KEY is missing");
        return { success: false, error: "Missing API Key" };
    }

    try {
        const data = await resend.emails.send({
            from: `blobjor.me <${FROM_EMAIL}>`,
            to: Array.isArray(to) ? to : [to],
            subject: subject,
            html: html,
        });

        console.log(`✅ Email sent to ${to}:`, data);
        return { success: true, data };
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        return { success: false, error };
    }
}
