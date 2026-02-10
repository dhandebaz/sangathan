# Sangathan Setup Wizard Documentation

## Overview

The Sangathan Setup Wizard provides a complete first-run installation experience that automatically configures the application without requiring manual file editing or command-line access. This is essential for cPanel shared hosting environments where users don't have SSH access.

## Features

### 🔄 Automatic Installation Detection
- **Lock File System**: Creates `storage/installed` file after successful installation
- **Environment Variable**: Sets `APP_INSTALLED=true` in `.env` file
- **Database Check**: Verifies that core tables exist in the database
- **Multi-layer Verification**: Uses multiple methods to ensure reliable installation detection

### 🛡️ Security Features
- **Setup Route Protection**: Setup routes are permanently disabled after installation
- **Password Hashing**: All passwords are hashed using bcrypt
- **No Sensitive Logging**: Database credentials and passwords are never logged
- **Input Validation**: Comprehensive validation for all user inputs
- **CSRF Protection**: All forms include CSRF tokens

### 📋 Installation Process (Step-by-Step)

#### 1. Welcome Screen
- Introduction to the setup process
- System requirements overview

#### 2. System Requirements Check
- **PHP Version**: Requires PHP 8.1+
- **Required Extensions**: PDO MySQL, OpenSSL, Mbstring, Tokenizer, XML, JSON, cURL, GD, Fileinfo
- **Directory Permissions**: Checks `storage/` and `bootstrap/cache/` writability
- **Blocking Requirements**: Prevents continuation if requirements aren't met

#### 3. Database Configuration
**Required Inputs:**
- Database Host (default: localhost)
- Database Port (default: 3306)
- Database Name (alphanumeric + underscores only)
- Database Username
- Database Password

**Validation Process:**
- Real-time connection testing
- Character validation for database names
- Port range validation (1-65535)

#### 4. Application Configuration
**Required Inputs:**
- Application Name (default: "Sangathan")
- Administrator Email (valid email format)
- Administrator Password (minimum 8 characters)
- Password Confirmation (must match)

#### 5. Installation Process
**Automated Steps:**
1. **Environment Configuration**: Updates `.env` file with database credentials
2. **Application Key Generation**: Creates secure Laravel application key
3. **Database Migration**: Runs all pending migrations
4. **Admin User Creation**: Creates system administrator account
5. **Installation Marking**: Creates lock file and updates environment

**Progress Tracking:**
- Real-time progress updates via AJAX
- Visual step completion indicators
- Error handling with retry capability

### 🔧 Future Schema Management

#### Automatic Migration Detection
The application automatically checks for pending migrations on each request (in production):

```php
// Automatic migration check in MigrationServiceProvider
if ($this->shouldRunAutoMigration()) {
    $migrationService->runPendingMigrations();
}
```

#### Safe Migration Process
- **Step-by-Step Execution**: Migrations run individually to prevent partial failures
- **Error Recovery**: Failed migrations don't crash the application
- **Logging**: Migration activities are logged to `storage/logs/migrations.log`
- **Admin Notification**: Future admin dashboard will show migration status

#### Manual Migration Commands
```bash
# Check and run pending migrations
php artisan migrate:auto

# Manual migration check (for admin use)
php artisan migrate:status
```

### 🗄️ Database Management

#### No Manual SQL Required
- **Automatic Schema Creation**: Laravel migrations handle all database structure
- **Seed Data**: Initial admin user and system settings created automatically
- **Version Control**: All schema changes tracked in version control
- **Rollback Support**: Migrations can be rolled back if needed

#### Multi-tenant Ready
- **Central Database**: Manages tenant information
- **Tenant Databases**: Each organization gets isolated database
- **Migration Separation**: Central and tenant migrations handled separately

### 🔒 Security Implementation

#### Setup Route Protection
```php
// CheckInstallation middleware
if (!$isInstalled && !$this->isSetupRoute($request)) {
    return redirect()->route('setup.welcome');
}

if ($isInstalled && $this->isSetupRoute($request)) {
    return redirect('/'); // Block access to setup after installation
}
```

#### Password Security
- **Bcrypt Hashing**: All passwords use Laravel's bcrypt hashing
- **Minimum Requirements**: 8 character minimum with complexity validation
- **No Plain Text Storage**: Passwords never stored in plain text
- **Secure Session Management**: Session data encrypted and protected

#### Sensitive Data Protection
- **No Database Logging**: Connection details never logged
- **Environment File Security**: `.env` file protected by `.htaccess`
- **Input Sanitization**: All user inputs validated and sanitized
- **CSRF Protection**: All forms include CSRF tokens

### 🚀 Deployment Process

#### cPanel Deployment Steps
1. **Upload Files**: Upload all files to hosting account
2. **Database Creation**: Create MySQL database in cPanel
3. **Access Setup**: Navigate to `https://yourdomain.com/setup`
4. **Follow Wizard**: Complete 5-step installation process
5. **Automatic Configuration**: No manual file editing required

#### Post-Installation
- **Setup Disabled**: Setup routes permanently inaccessible
- **Admin Ready**: Administrator account created and ready
- **Database Migrated**: All tables and relationships established
- **Security Configured**: Application key generated and configured

### 🛠️ Troubleshooting

#### Common Issues
1. **Database Connection Failed**
   - Verify database credentials
   - Check database server accessibility
   - Confirm user has proper permissions

2. **Requirements Check Failed**
   - Contact hosting provider for PHP version upgrade
   - Request missing extensions installation
   - Verify directory permissions

3. **Migration Failures**
   - Check `storage/logs/migrations.log` for details
   - Verify database user has CREATE/DROP privileges
   - Ensure sufficient database storage space

#### Recovery Options
- **Retry Installation**: Wizard allows retry on failure
- **Manual Migration**: Use `php artisan migrate` if needed
- **Clean Slate**: Delete `storage/installed` to restart setup

### 📊 Monitoring & Maintenance

#### Installation Logs
- **Migration Logs**: `storage/logs/migrations.log`
- **Laravel Logs**: `storage/logs/laravel.log`
- **Setup Progress**: Real-time feedback during installation

#### Future Admin Features
- **Migration Status**: Dashboard showing pending migrations
- **System Health**: Overview of application status
- **Update Management**: Safe update process with rollback capability

## Technical Architecture

### Service Classes
- **InstallationService**: Handles installation logic and validation
- **MigrationService**: Manages automatic migration detection and execution
- **CheckInstallation**: Middleware for route protection

### Configuration Files
- **config/installation.php**: Installation behavior settings
- **.env**: Environment variables (auto-generated)
- **storage/installed**: Installation lock file

### Database Structure
- **users**: System users (admin and regular users)
- **migrations**: Laravel migration tracking
- **tenants**: Multi-tenant organization data (future)

This setup wizard ensures that Sangathan can be deployed on any cPanel shared hosting environment without requiring technical expertise or command-line access.