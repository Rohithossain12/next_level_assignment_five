# 📦 Parcel Delivery API

### 🎯 Project Overview

**Parcel Delivery API** is a secure, modular, and role-based backend system for a parcel delivery service inspired by Pathao Courier and Sundarban.  
It allows **senders**, **receivers**, and **admins** to manage parcels with **status tracking**, **role-based access**, and **secure authentication**.

Built with:

- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JWT Authentication**
- **Role-based Authorization**
- **Zod validation for request payloads**
- **OTP-based verification using Redis**

---

## 🏗️ Features

### 🔐 Authentication
- JWT-based login
- Passwords hashed with bcrypt
- Support for multiple auth providers (e.g., credentials, Google)

### 🎭 Role-based Authorization
- **Sender**: Create/cancel parcels, track parcels
- **Receiver**: View incoming parcels, confirm delivery
- **Admin**: Manage all users, parcels, block/unblock, update statuses
  
### 🔑 OTP Verification & Redis Integration

This project supports **OTP-based verification** for user registration/login, using **Redis** for temporary storage.

#### Workflow:

1. **User requests OTP**:
   - User provides email.
   - System generates a 6-digit OTP.
   - OTP is stored in Redis with expiration (e.g., 2 minutes).

2. **Send OTP**:
   - OTP sent via **email** (using Nodemailer) or **SMS**.
   - Stored OTP key format: `OTP:<user_email_or_phone>`

3. **Verify OTP**:
   - User submits OTP for verification.
   - Backend checks Redis for the OTP.
   - If correct and not expired:
     - Mark user as verified (`isVerified = true`)
     - Generate JWT for authentication
   - If wrong/expired:
     - Return error message

### 📦 Parcel Management
- Parcel creation with sender/receiver info
- Status tracking (Requested → Approved → Dispatched → In Transit → Delivered)
- Embedded **status logs** with timestamps and notes
- Unique **tracking ID** per parcel (format: `TRK-YYYYMMDD-XXXXXX`)
- Fee calculation based on configurable rules (optional)

### 🧩 Additional Features
- Role-protected routes
- Parcel ownership validation
- Search/filter parcels by status or user
- Prevent blocked users from accessing features

---

## 🗂️ Project Structure

```bash
src/
├── config/            # Environment variables, DB config
├── middlewares/       # Auth, role checks, error handling
├── modules/
│   ├── auth/          # Login, register, token refresh
│   ├── user/          # User CRUD, roles
│   └── parcel/        # Parcel CRUD + status log handling
├── utils/             # Helper functions (sendResponse, catchAsync)
├── app.ts             # Entry point
