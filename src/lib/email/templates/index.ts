// Common HTML wrapper for all templates
const baseLayout = (content: string, preview?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sangathan Email</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; }
        .header { background-color: #000000; padding: 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .content { padding: 30px 20px; }
        .button { display: inline-block; background-color: #000000; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600; margin: 20px 0; }
        .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }
        .footer a { color: #666; text-decoration: underline; }
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; border-radius: 0; border: none; margin: 0; }
            .content { padding: 20px; }
        }
    </style>
</head>
<body>
    <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
        ${preview || ''}
    </div>
    <div class="container">
        <div class="header">
            <h1>Sangathan</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Sangathan. Secure infrastructure for community work.</p>
            <p>
                <a href="https://sangathan.space">Visit Dashboard</a> • 
                <a href="mailto:talk@sangathan.space">Contact Support</a>
            </p>
            <p style="margin-top: 10px; font-size: 11px;">
                You received this email because you are registered with Sangathan.<br>
                <a href="#">Unsubscribe</a> from non-essential emails.
            </p>
        </div>
    </div>
</body>
</html>
`

// --- 1. Welcome Admin Email ---
export const welcomeAdminEmail = (name: string, orgName: string, link: string) => baseLayout(`
    <h2>Welcome to Sangathan, ${name}.</h2>
    <p>Your organisation workspace for <strong>${orgName}</strong> is ready.</p>
    <p>We built Sangathan to give community leaders like you secure, isolated infrastructure without the complexity. You now have access to:</p>
    <ul>
        <li>Secure Member Registry</li>
        <li>Encrypted Form Collection</li>
        <li>Private Meeting Rooms</li>
    </ul>
    <div style="text-align: center;">
        <a href="${link}" class="button">Access Dashboard</a>
    </div>
    <p>If you have any questions, reply directly to this email.</p>
`, `Your workspace for ${orgName} is ready.`)

// --- 2. Email Verification Reminder ---
export const emailVerificationReminder = (link: string) => baseLayout(`
    <h2>Verify your email address</h2>
    <p>We noticed you haven't verified your email address yet. To ensure your account security and recover access if you lose your password, please verify it now.</p>
    <div style="text-align: center;">
        <a href="${link}" class="button">Verify Email</a>
    </div>
    <p style="font-size: 14px; color: #666;">Link expires in 24 hours.</p>
`, `Action Required: Verify your email address.`)

// --- 3. Password Reset Email ---
export const passwordResetEmail = (link: string) => baseLayout(`
    <h2>Reset your password</h2>
    <p>We received a request to reset the password for your Sangathan account. If you didn't make this request, you can safely ignore this email.</p>
    <div style="text-align: center;">
        <a href="${link}" class="button">Reset Password</a>
    </div>
    <p>This link is valid for 1 hour only.</p>
`, `Reset your Sangathan password.`)

// --- 4. Phone Verification Reminder ---
export const phoneVerificationReminder = (name: string, link: string) => baseLayout(`
    <h2>Secure your account with 2FA</h2>
    <p>Hello ${name},</p>
    <p>As an organisation admin, securing your account is critical. Please verify your phone number to enable Two-Factor Authentication (2FA).</p>
    <div style="text-align: center;">
        <a href="${link}" class="button">Verify Phone Number</a>
    </div>
`, `Security Alert: Verify your phone number.`)

// --- 5. Supporter Receipt Email ---
export const supporterReceiptEmail = (amount: string, date: string, receiptId: string) => baseLayout(`
    <h2>Donation Receipt</h2>
    <p>Thank you for your support. Your contribution helps us maintain this infrastructure for free.</p>
    <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;">Amount</td>
            <td style="padding: 10px 0; font-weight: bold; text-align: right;">${amount}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;">Date</td>
            <td style="padding: 10px 0; text-align: right;">${date}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;">Receipt ID</td>
            <td style="padding: 10px 0; font-family: monospace; text-align: right;">${receiptId}</td>
        </tr>
    </table>
    <p>This receipt is for your records.</p>
`, `Receipt for your donation of ${amount}`)

// --- 6. Suspension Notice Email ---
export const suspensionNoticeEmail = (orgName: string, reason: string) => baseLayout(`
    <h2 style="color: #d32f2f;">Account Suspended</h2>
    <p>We are writing to inform you that the workspace for <strong>${orgName}</strong> has been suspended.</p>
    <div style="background-color: #fff5f5; border-left: 4px solid #d32f2f; padding: 15px; margin: 20px 0;">
        <strong>Reason:</strong> ${reason}
    </div>
    <p>If you believe this is an error, please contact our support team immediately.</p>
    <div style="text-align: center;">
        <a href="mailto:talk@sangathan.space" class="button" style="background-color: #d32f2f;">Contact Support</a>
    </div>
`, `Important: Account Suspension Notice`)

// --- 7. Export Ready Email ---
export const exportReadyEmail = (link: string, expiryHours: number) => baseLayout(`
    <h2>Your data export is ready</h2>
    <p>The data export you requested has been processed successfully.</p>
    <p>For security reasons, this download link will expire in <strong>${expiryHours} hours</strong>.</p>
    <div style="text-align: center;">
        <a href="${link}" class="button">Download Data</a>
    </div>
    <p style="font-size: 13px; color: #666;">The file is encrypted with the standard encryption key provided in your dashboard settings.</p>
`, `Download Ready: Your data export`)

// --- 8. New Membership Request Email (To Admin) ---
export const newMemberRequestEmail = (adminName: string, requesterName: string, orgName: string, link: string) => baseLayout(`
    <h2>New Membership Request</h2>
    <p>Hello ${adminName},</p>
    <p><strong>${requesterName}</strong> has requested to join <strong>${orgName}</strong>.</p>
    <div style="text-align: center;">
        <a href="${link}" class="button">Review Request</a>
    </div>
`, `New membership request for ${orgName}`)

// --- 9. Membership Approved Email (To Member) ---
export const membershipApprovedEmail = (memberName: string, orgName: string, link: string) => baseLayout(`
    <h2>Membership Approved</h2>
    <p>Hello ${memberName},</p>
    <p>Congratulations! Your request to join <strong>${orgName}</strong> has been approved.</p>
    <p>You can now access the organisation dashboard.</p>
    <div style="text-align: center;">
        <a href="${link}" class="button">Access Dashboard</a>
    </div>
`, `You have joined ${orgName}`)

// --- 10. Membership Rejected Email (To Member) ---
export const membershipRejectedEmail = (memberName: string, orgName: string) => baseLayout(`
    <h2>Membership Update</h2>
    <p>Hello ${memberName},</p>
    <p>Thank you for your interest in joining <strong>${orgName}</strong>.</p>
    <p>At this time, we are unable to approve your membership request. If you believe this is an error, please contact the organisation administrator directly.</p>
`, `Update regarding your request to join ${orgName}`)
