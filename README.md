# Sangathan

Multi-tenant web application built with Laravel 10 and Tailwind CSS.

## Features

- Multi-tenant architecture with separate databases per organization
- Custom setup wizard (no manual .env configuration required)
- cPanel-compatible deployment
- Production-ready with pre-built assets
- Design system: Orange background, black text, single font (Inter)

## Tech Stack

- **Backend**: Laravel 10 (PHP 8.1+)
- **Frontend**: Blade templates + Tailwind CSS
- **Database**: MySQL
- **Multi-tenancy**: stancl/tenancy package

## Deployment

### cPanel Deployment

1. Upload files to your cPanel hosting
2. Ensure `public` folder contents go to `public_html`
3. Create MySQL database
4. Navigate to `https://yourdomain.com/setup`
5. Follow the setup wizard

### Local Development

```bash
# Install dependencies
composer install

# Install Node.js dependencies (for development only)
npm install

# Build assets for production
npm run build

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate
```

## Architecture

### Multi-tenancy
- Each organization gets its own database
- Central database manages tenant information
- Subdomain-based tenant identification

### Design System
- Background: Orange (#FF6B35)
- Text: Black (#000000)
- Font: Inter (single font throughout)
- No dark mode, no gradients, minimal animation

## External Services

- **Razorpay**: Payment processing (platform payments only)
- **Jitsi**: Video conferencing

## Security

- All features available for free users
- Paid supporter plan available (does not gate features)
- No external SaaS dependencies except Razorpay and Jitsi

## License

MIT