# Sangathan - Multi-tenant Web Application

## cPanel Deployment Instructions

### Prerequisites
- PHP 8.1 or higher
- MySQL 5.7+ or MariaDB 10.3+
- Apache with mod_rewrite enabled

### Deployment Steps

1. **Upload Files**
   - Upload all files to your cPanel hosting account
   - Ensure `public` folder contents go to `public_html` (or your domain's document root)
   - All other files should be in the parent directory

2. **Database Setup**
   - Create a MySQL database in cPanel
   - Create a database user and assign privileges
   - Note the database name, username, and password

3. **Configuration**
   - The application will guide you through setup at `/setup`
   - No manual .env file creation required

4. **Permissions**
   - Set permissions:
     ```
     chmod 755 storage/
     chmod 755 storage/framework/
     chmod 755 storage/framework/cache/
     chmod 755 storage/framework/sessions/
     chmod 755 storage/framework/views/
     chmod 755 storage/logs/
     chmod 755 bootstrap/cache/
     ```

5. **Apache Configuration**
   - Ensure `.htaccess` file is present in public_html
   - mod_rewrite must be enabled

### Post-Deployment

1. **Setup Wizard**
   - Navigate to `https://yourdomain.com/setup`
   - Follow the setup wizard to configure:
     - Database connection
     - First organization
     - Administrator account

2. **Multi-tenant Access**
   - Each organization gets its own subdomain
   - Access organizations via `https://org-name.yourdomain.com`

### Security Notes

- Keep your Laravel application files outside public_html
- Regular backups recommended
- Keep dependencies updated
- Monitor error logs in `storage/logs/`

### Support

For issues related to:
- cPanel deployment: Contact your hosting provider
- Application errors: Check `storage/logs/laravel.log`
- Database issues: Verify credentials and permissions