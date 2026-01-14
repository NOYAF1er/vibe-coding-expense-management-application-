# Authentication System - Analysis & Requirements

## 📋 Requirements Analysis

### Backend Requirements

#### 1. Data Model Changes

**User Entity Modification**:
- ✅ Existing fields: id, firstName, lastName, email, password, role, isActive, createdAt, updatedAt, deletedAt
- ➕ Add: `lastLoginAt: Date | null`
- ⚠️ **Important**: Password field must be nullable for OAuth users

**New Entity: UserAuthProvider**:
```typescript
{
  id: UUID
  provider: enum (LOCAL, GOOGLE, MICROSOFT)
  providerUserId: string
  userId: UUID (FK to User)
  createdAt: Date
  updatedAt: Date
  
  // Unique constraint on (provider, providerUserId)
}
```

#### 2. Authentication Strategies

**Local Authentication**:
- Email + password login
- bcrypt password comparison
- JWT token generation
- Update `lastLoginAt` on success

**OAuth Authentication**:
- Google OAuth 2.0
- Microsoft OAuth 2.0
- Auto-create User if not exists
- Link via UserAuthProvider
- No password required for OAuth users

#### 3. API Endpoints Required

```
POST /auth/login              - Local login
POST /auth/register           - User registration
POST /auth/forgot-password    - Password reset request
GET  /auth/google             - Google OAuth redirect
GET  /auth/google/callback    - Google OAuth callback
GET  /auth/microsoft          - Microsoft OAuth redirect
GET  /auth/microsoft/callback - Microsoft OAuth callback
GET  /auth/profile            - Get current user (protected)
POST /auth/logout             - Logout (optional)
```

#### 4. JWT Strategy
- Access token (short-lived: 15min - 1h)
- Refresh token (long-lived: 7-30 days) - optional for MVP
- Payload: { userId, email, role }
- Guards for protected routes

---

## ⚠️ Issues & Recommendations

### 🔴 CRITICAL ISSUES

#### 1. **Password Field Must Be Nullable**
**Problem**: OAuth users don't have passwords
```typescript
// Current
@Column({ length: 255 })
password!: string;

// Should be
@Column({ length: 255, nullable: true })
password?: string;
```

#### 2. **Missing Dependencies**
Need to install:
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @nestjs/config  # For environment variables
npm install passport-google-oauth20 passport-microsoft
npm install -D @types/passport-jwt @types/passport-google-oauth20
```

#### 3. **Environment Variables Required**
```env
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
MICROSOFT_CLIENT_ID=xxx
MICROSOFT_CLIENT_SECRET=xxx
MICROSOFT_CALLBACK_URL=http://localhost:3000/auth/microsoft/callback
```

#### 4. **Frontend Image Missing**
**Problem**: Cannot create pixel-perfect UI without reference image
**Action**: Waiting for user to provide login page screenshot

---

### 🟡 DESIGN CONSIDERATIONS

#### 5. **User Registration Flow**
**Question**: Should registration require email verification?
**Recommendation**: 
- MVP: No email verification
- Phase 2: Add email verification with tokens

#### 6. **Password Reset Flow**
**Question**: How to handle password reset?
**Recommendation**:
- Generate reset token
- Send email with reset link
- Token expires after 1 hour
- Requires email service (not in scope for MVP)

#### 7. **OAuth User Data Mapping**
**Question**: How to map OAuth profile to User entity?
**Recommendation**:
```typescript
Google/Microsoft Profile → User
- email → email
- given_name → firstName
- family_name → lastName
- No password (nullable)
- Default role: EMPLOYEE
```

#### 8. **Refresh Token Strategy**
**Question**: Implement refresh tokens?
**Recommendation**:
- MVP: Access token only (1h expiration)
- Phase 2: Add refresh tokens for better UX

---

## 🏗️ Proposed Architecture

### Backend Structure

```
backend/src/
├── common/
│   ├── entities/base.entity.ts
│   ├── enums/
│   │   ├── user-role.enum.ts
│   │   ├── auth-provider.enum.ts (NEW)
│   ├── guards/
│   │   ├── jwt-auth.guard.ts (NEW)
│   │   ├── roles.guard.ts (NEW)
│   ├── decorators/
│   │   ├── current-user.decorator.ts (NEW)
│   │   ├── roles.decorator.ts (NEW)
│   └── strategies/
│       ├── jwt.strategy.ts (NEW)
│       ├── google.strategy.ts (NEW)
│       └── microsoft.strategy.ts (NEW)
│
├── modules/
│   ├── users/
│   │   ├── entities/
│   │   │   ├── user.entity.ts (MODIFY - add lastLoginAt, nullable password)
│   │   │   └── user-auth-provider.entity.ts (NEW)
│   │   └── ... (existing files)
│   │
│   └── auth/ (NEW MODULE)
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       ├── auth.module.ts
│       ├── dto/
│       │   ├── login.dto.ts
│       │   ├── register.dto.ts
│       │   ├── forgot-password.dto.ts
│       │   └── auth-response.dto.ts
│       └── tests/
│           ├── auth.service.spec.ts
│           └── auth.controller.spec.ts
```

### Frontend Structure

```
frontend/src/
├── pages/
│   ├── LoginPage.tsx (NEW)
│   └── ... (existing)
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx (NEW)
│   │   ├── SocialLoginButton.tsx (NEW)
│   │   └── Input.tsx (NEW)
│   └── ... (existing)
│
├── services/
│   ├── auth.service.ts (NEW)
│   └── ... (existing)
│
├── hooks/
│   ├── useAuth.ts (NEW)
│   └── ... (existing)
│
├── contexts/
│   └── AuthContext.tsx (NEW)
│
└── types/
    └── auth.types.ts (NEW)
```

---

## 🎯 Implementation Phases

### Phase 1: Backend - Data Model (30 min)
1. Add `lastLoginAt` to User entity
2. Make `password` nullable in User entity
3. Create AuthProvider enum
4. Create UserAuthProvider entity
5. Update User module

### Phase 2: Backend - JWT Setup (45 min)
1. Install dependencies (@nestjs/jwt, @nestjs/passport, etc.)
2. Configure JWT module
3. Create JWT strategy
4. Create JWT auth guard
5. Create current user decorator

### Phase 3: Backend - Auth Module (1.5 hours)
1. Create Auth module structure
2. Implement local login (email/password)
3. Implement register endpoint
4. Implement forgot-password endpoint
5. Create DTOs with validation
6. Add Swagger documentation

### Phase 4: Backend - OAuth Integration (2 hours)
1. Configure Google OAuth strategy
2. Configure Microsoft OAuth strategy
3. Implement OAuth callback handlers
4. Auto-create users from OAuth profiles
5. Link OAuth accounts via UserAuthProvider

### Phase 5: Backend - Testing (1.5 hours)
1. Unit tests for Auth service
2. Unit tests for Auth controller
3. Integration tests for login flow
4. Test OAuth flows (mocked)
5. Test JWT generation and validation

### Phase 6: Frontend - Auth Context (45 min)
1. Create AuthContext
2. Create useAuth hook
3. Implement token storage (localStorage)
4. Implement auth state management
5. Create protected route wrapper

### Phase 7: Frontend - Login UI (2 hours)
**⚠️ WAITING FOR IMAGE**
1. Analyze provided screenshot
2. Extract exact colors, spacing, typography
3. Create reusable Input component
4. Create SocialLoginButton component
5. Create LoginForm component
6. Create LoginPage
7. Implement responsive breakpoints

### Phase 8: Frontend - Integration (1 hour)
1. Connect LoginForm to auth.service
2. Implement error handling
3. Implement loading states
4. Add form validation
5. Implement OAuth redirects

### Phase 9: Frontend - Testing (1.5 hours)
1. Component tests (LoginForm, Input, etc.)
2. Integration tests (login flow)
3. Responsive tests
4. Mock API calls
5. Coverage ≥ 80%

---

## 🔐 Security Considerations

### Backend
✅ Password hashing with bcrypt  
✅ JWT tokens with expiration  
✅ HTTP-only cookies (recommended for tokens)  
✅ CORS configuration  
✅ Rate limiting on auth endpoints (recommended)  
✅ Input validation  
✅ SQL injection prevention (TypeORM)  

### Frontend
✅ No password storage  
✅ Secure token storage  
✅ HTTPS only in production  
✅ XSS prevention  
✅ CSRF protection  

---

## 📝 Questions for Clarification

### Critical (Need Answers)
1. **UI Design**: Where is the login page screenshot? (WAITING)
2. **OAuth Credentials**: Do you have Google/Microsoft OAuth app credentials?
3. **Email Service**: Do you have an email service for password reset?

### Important (Can Assume)
4. **Token Storage**: localStorage or HTTP-only cookies? (Assume localStorage for MVP)
5. **Refresh Tokens**: Implement or skip for MVP? (Assume skip for MVP)
6. **Email Verification**: Required for registration? (Assume no for MVP)
7. **Password Requirements**: Min length, complexity? (Assume 8 chars minimum)

### Nice to Have
8. **Remember Me**: Implement? (Assume no for MVP)
9. **2FA**: Two-factor authentication? (Assume no for MVP)
10. **Session Management**: Track active sessions? (Assume no for MVP)

---

## 🎨 Assumed UI Design (Until Image Provided)

Based on modern login page standards:

```
┌─────────────────────────────────────┐
│  ← Back          Expenses           │
├─────────────────────────────────────┤
│                                     │
│         Welcome back                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Email                       │   │
│  │ [email input field]         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Password                    │   │
│  │ [password input field]      │   │
│  └─────────────────────────────┘   │
│                                     │
│           Forgot Password?          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         Login               │   │
│  └─────────────────────────────┘   │
│                                     │
│              OR                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🔵 Login with Google       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ⊞  Login with Microsoft    │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Colors** (to be confirmed with image):
- Primary button: Green (#10B981 or similar)
- Social buttons: White with borders
- Background: Light gray or white
- Text: Dark gray/black

---

## 📊 Estimated Timeline

| Phase | Task | Time | Dependencies |
|-------|------|------|--------------|
| 1 | Backend - Data Model | 30 min | None |
| 2 | Backend - JWT Setup | 45 min | Phase 1 |
| 3 | Backend - Auth Module | 1.5 hours | Phase 2 |
| 4 | Backend - OAuth | 2 hours | Phase 3, OAuth credentials |
| 5 | Backend - Testing | 1.5 hours | Phases 1-4 |
| 6 | Frontend - Auth Context | 45 min | Phase 3 |
| 7 | Frontend - Login UI | 2 hours | **IMAGE REQUIRED** |
| 8 | Frontend - Integration | 1 hour | Phases 6-7 |
| 9 | Frontend - Testing | 1.5 hours | Phase 8 |
| **TOTAL** | **~11 hours** | **~40 files** |

---

## 🚦 Next Steps

1. **WAITING**: User to provide login page screenshot
2. **READY**: Can start backend implementation (Phases 1-5)
3. **BLOCKED**: Frontend UI implementation (Phase 7) until image provided

**Recommendation**: Start with backend implementation while waiting for the UI design image.

---

## ✅ Ready to Proceed

Once the image is provided, I will:
1. Analyze exact colors, spacing, typography, and layout
2. Create pixel-perfect Tailwind CSS classes
3. Implement responsive breakpoints
4. Ensure mobile-first design

For now, I can proceed with backend authentication implementation (Phases 1-5).
