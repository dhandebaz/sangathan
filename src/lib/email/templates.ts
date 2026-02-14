// Common HTML wrapper for all templates
export const baseLayout = (content: string, preview?: string) => `
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

// --- Welcome Admin Email ---
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

// --- New Membership Request Email (To Admin) ---
export const newMemberRequestEmail = (adminName: string, requesterName: string, orgName: string, link: string) => baseLayout(`
    <h2>New Membership Request</h2>
    <p>Hello ${adminName},</p>
    <p><strong>${requesterName}</strong> has requested to join <strong>${orgName}</strong>.</p>
    <div style="text-align: center;">
        <a href="${link}" class="button">Review Request</a>
    </div>
`, `New membership request for ${orgName}`)

// --- Membership Approved Email ---
export const membershipApprovedEmail = (memberName: string, orgName: string, link: string) => baseLayout(`
    <h2>Membership Approved</h2>
    <p>Hello ${memberName},</p>
    <p>Your membership request for <strong>${orgName}</strong> has been approved.</p>
    <p>You now have access to the organisation workspace and can start collaborating with other members.</p>
    <div style="text-align: center;">
        <a href="${link}" class="button">Access Dashboard</a>
    </div>
`, `Membership approved for ${orgName}`)

// --- Membership Rejected Email ---
export const membershipRejectedEmail = (memberName: string, orgName: string, dashboardUrl: string) => baseLayout(`
    <h2>Membership Update</h2>
    <p>Hello ${memberName},</p>
    <p>Your membership request for <strong>${orgName}</strong> has been reviewed.</p>
    <p>Unfortunately, your request could not be approved at this time. This may be due to various reasons such as membership criteria or organisational policies.</p>
    <p>If you have questions about this decision, please contact the organisation administrators directly.</p>
    <div style="text-align: center;">
        <a href="${dashboardUrl}" class="button">Visit Dashboard</a>
    </div>
`, `Membership status update for ${orgName}`)
