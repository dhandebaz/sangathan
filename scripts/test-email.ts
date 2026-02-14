
import { sendEmail } from '../src/lib/email/sender';
import { welcomeAdminEmail } from '../src/lib/email/templates';

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Please provide an email address: npx tsx scripts/test-email.ts user@example.com');
    process.exit(1);
  }

  console.log(`Sending test email to ${email}...`);
  
  const result = await sendEmail({
    to: email,
    subject: 'Test Email from Sangathan',
    html: welcomeAdminEmail('Test User', 'Test Org', 'https://sangathan.space/dashboard'),
    tags: ['test']
  });

  if (result.success) {
    console.log('✅ Email sent successfully!');
    console.log('ID:', result.id);
  } else {
    console.error('❌ Failed to send email.');
    console.error('Error:', result.error);
    if (result.code) console.error('Code:', result.code);
  }
}

main();
