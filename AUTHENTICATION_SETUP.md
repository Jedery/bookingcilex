# 🔐 Authentication System Setup Instructions

## 📋 Steps to Complete Setup

### 1. Run Database Migration
The authentication fields need to be added to the database. Run this command in your terminal:

```powershell
npx prisma migrate dev --name add_auth_fields
```

When prompted, type `yes` to create and apply the migration.

### 2. Seed the Database
Create the first founder user by running:

```powershell
npm run seed
```

This will create:
- **Email:** `founder@cilex.com`
- **Password:** `cilex2024`
- 10 boat party events (5 AM, 5 PM)

### 3. Restart the Dev Server
Stop the current dev server (Ctrl+C) and restart it:

```powershell
npm run dev
```

### 4. Login to the System
1. Open [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. Login with:
   - Email: `founder@cilex.com`
   - Password: `cilex2024`

## ✨ New Features Available

### 🔑 Authentication System
- **Login Page**: Secure login with email/password at `/auth/login`
- **Logout**: Click logout button in sidebar to exit
- **Session Management**: User session stored in localStorage
- **Password Hashing**: All passwords are securely hashed with bcrypt

### 👤 Personal Profiles
- **My Profile**: View your personal info at `/my-profile`
  - Shows your name, email, role, and user ID
  - Different role colors (Founder: Red, Manager: Cyan, Promoter: Orange, Collaboratore: Green)

### 🎟️ Invite System (Founder Only)
- **Generate Invite Links**: Click "Generate Invite Link" button in User Management
- **Share Invites**: Copy the generated link and share with new team members
- **Register Page**: New users register at `/auth/register?token=xxxxx`
- **Automatic Role Assignment**: Invited users get "Collaboratore" role by default
- **One-Time Use**: Each invite link is tied to the inviter's account

### 🔒 Role-Based Access
- **Founder**: Full access to everything including:
  - User management (see all users)
  - Invite generation
  - All booking operations
  
- **Manager/Promoter/Collaboratore**: 
  - View their own profile
  - Create and manage bookings
  - No access to user management

### 🎨 Updated Design
- Luxury login/register pages matching CILEX branding
- Glass morphism effects
- Gold gradient accents (#c89664)
- Smooth animations and transitions

## 🔧 Technical Details

### New Files Created
- `app/context/AuthContext.tsx` - Authentication context provider
- `app/auth/login/page.tsx` - Login page
- `app/auth/register/page.tsx` - Registration page with invite validation
- `app/my-profile/page.tsx` - Personal profile page
- `app/api/auth/login/route.ts` - Login API endpoint
- `app/api/auth/register/route.ts` - Registration API endpoint
- `app/api/auth/invite/route.ts` - Invite generation API endpoint

### Updated Files
- `app/layout.tsx` - Added AuthProvider wrapper
- `app/components/Sidebar.tsx` - Added logout functionality and role-based menu
- `app/api/users/route.ts` - Added password hashing for user creation
- `app/profile/page.tsx` - Added invite generation button
- `prisma/schema.prisma` - Added inviteToken and invitedBy fields
- `prisma/seed.js` - Added founder user creation

### Database Schema Changes
```prisma
model User {
  inviteToken String? @unique  // Unique token for generating invites
  invitedBy   String?          // Email of user who invited this user
}
```

## 🚀 Next Steps (Optional)

### Recommended Enhancements
1. **JWT Tokens**: Replace localStorage with JWT tokens for better security
2. **Session Expiry**: Add automatic logout after inactivity
3. **Password Reset**: Add forgot password functionality
4. **Email Verification**: Send verification emails for new registrations
5. **Role Permissions**: Implement granular permissions system
6. **Audit Logs**: Track who made what changes

### Security Notes
- Change the default founder password after first login
- Never commit `.env` file with database credentials
- Consider using environment variables for sensitive data
- Implement rate limiting on login endpoint to prevent brute force attacks

## 📞 Support
If you encounter any issues, check:
1. Database migration completed successfully
2. Seed script ran without errors
3. Dev server restarted after changes
4. Browser cache cleared if styles look wrong

Enjoy your secure CILEX booking system! 🎉
