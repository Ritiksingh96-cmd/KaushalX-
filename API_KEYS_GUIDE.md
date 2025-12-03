# 🔐 API Keys Setup Guide for KaushalX Skillswap

This guide will help you obtain all the necessary API keys and credentials for your platform.

## 📋 Quick Setup Checklist

- [ ] Google OAuth Credentials
- [ ] Google AI API Key
- [ ] MongoDB Connection (Optional)
- [ ] Blockchain RPC URLs (Infura/Alchemy)
- [ ] Cloudinary Account
- [ ] Email SMTP Settings
- [ ] Payment Gateways (Optional)

---

## 🔑 Essential API Keys (Required for Core Features)

### 1. Google OAuth Credentials (For Login)

**Why needed:** Allows users to sign in with their Google account

**Steps to get:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. Choose **Web application** as application type
7. Add authorized redirect URI: `http://localhost:3005/api/auth/callback/google`
8. For production, add: `https://yourdomain.com/api/auth/callback/google`
9. Copy the **Client ID** and **Client Secret**

**Add to .env.local:**
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

### 2. Google AI API Key (For Chatbot)

**Why needed:** Powers the AI chatbot feature

**Steps to get:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the generated API key

**Add to .env.local:**
```env
GOOGLE_API_KEY=AIzaSy...your-api-key
```

---

### 3. NextAuth Secret (Required)

**Why needed:** Secures authentication sessions

**Steps to generate:**

**Option 1 - Using OpenSSL (Recommended):**
```bash
openssl rand -base64 32
```

**Option 2 - Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3 - Online Generator:**
Visit [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

**Add to .env.local:**
```env
NEXTAUTH_SECRET=your-generated-secret-here
```

---

## 🌐 Blockchain & Crypto (For Testnet Features)

### 4. Infura Project ID (For Blockchain Access)

**Why needed:** Connects to Ethereum and Polygon testnets

**Steps to get:**
1. Go to [Infura.io](https://infura.io/)
2. Sign up for a free account
3. Create a new project
4. Select **Web3 API**
5. Copy your **Project ID** from the dashboard

**Add to .env.local:**
```env
INFURA_PROJECT_ID=your-infura-project-id
ETHEREUM_TESTNET_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
POLYGON_TESTNET_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

**Alternative: Alchemy**
1. Go to [Alchemy.com](https://www.alchemy.com/)
2. Create a free account
3. Create a new app (select Sepolia testnet)
4. Copy the API key

```env
ALCHEMY_API_KEY=your-alchemy-api-key
```

---

## ☁️ Optional Services (Enhance Features)

### 5. Cloudinary (For Image/Video Upload)

**Why needed:** Stores user profile images and video content

**Steps to get:**
1. Go to [Cloudinary.com](https://cloudinary.com/)
2. Sign up for a free account
3. Go to **Dashboard**
4. Copy **Cloud Name**, **API Key**, and **API Secret**

**Add to .env.local:**
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

### 6. MongoDB Atlas (Database)

**Why needed:** Stores user data, skills, transactions (Optional - app works without it)

**Steps to get:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click **Connect** > **Connect your application**
5. Copy the connection string
6. Replace `<password>` with your database password

**Add to .env.local:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kaushalx_skillswap
SKIP_DATABASE=false
```

**Note:** If you don't have MongoDB, keep `SKIP_DATABASE=true`

---

### 7. Email SMTP (For Notifications)

**Why needed:** Sends email notifications to users

**Using Gmail:**
1. Enable 2-factor authentication on your Google account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password
4. Use this password (not your regular Gmail password)

**Add to .env.local:**
```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-16-char-app-password
EMAIL_FROM=noreply@kaushalx.com
```

---

### 8. Payment Gateways (Optional)

#### Stripe
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account
3. Get test API keys from **Developers** > **API keys**

```env
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

#### Razorpay (For India)
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create an account
3. Get test keys from **Settings** > **API Keys**

```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

---

## 🚀 Quick Start Configuration

**Minimum required to run the app:**

```env
PORT=3005
NEXTAUTH_SECRET=generate-a-random-32-char-string
NEXTAUTH_URL=http://localhost:3005
SKIP_DATABASE=true
BLOCKCHAIN_NETWORK=testnet
NEXT_PUBLIC_TESTNET_MODE=true
```

**For full features, add:**
- Google OAuth credentials (for login)
- Google AI API key (for chatbot)
- Infura/Alchemy (for crypto features)

---

## 🧪 Testing Your Configuration

After adding your API keys:

1. **Restart the development server:**
   ```bash
   npm run dev
   ```

2. **Test Google Login:**
   - Click "Sign In" on the homepage
   - Try logging in with Google

3. **Test AI Chatbot:**
   - Click the AI chat icon
   - Ask a question

4. **Test Crypto Features:**
   - Navigate to `/crypto` page
   - Check if testnet information loads

---

## 🔒 Security Best Practices

1. **Never commit `.env.local` to Git**
   - It's already in `.gitignore`
   - Keep your API keys private

2. **Use different keys for development and production**

3. **Rotate keys regularly**

4. **Use test/sandbox keys during development**

5. **For production deployment:**
   - Use environment variables in your hosting platform
   - Never expose keys in client-side code

---

## 📞 Need Help?

- **Google OAuth Issues:** Check redirect URIs match exactly
- **AI Chatbot Not Working:** Verify Google AI API key is valid
- **Crypto Features:** Ensure Infura/Alchemy project ID is correct
- **Database Errors:** Set `SKIP_DATABASE=true` if MongoDB isn't set up

---

## 🎯 Priority Setup Order

1. **First:** NextAuth Secret (required for auth)
2. **Second:** Google OAuth (for user login)
3. **Third:** Google AI API (for chatbot)
4. **Fourth:** Infura/Alchemy (for crypto features)
5. **Optional:** Cloudinary, Email, Payment gateways

---

**Happy Coding! 🚀**
