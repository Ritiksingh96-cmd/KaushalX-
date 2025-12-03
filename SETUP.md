# KAUSHALX SKILLSWAP - Environment Setup Guide

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
cd "Source code"
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
copy .env.example .env.local
```

### 3. Configure Required API Keys

Open `.env.local` and configure the following **required** variables:

#### **MongoDB (Required)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kaushalx?retryWrites=true&w=majority
```
Get your MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

#### **NextAuth Secret (Required)**
```env
NEXTAUTH_SECRET=your-random-secret-here
```
Generate a secure secret:
```bash
openssl rand -base64 32
```

#### **Google AI API (Required for Chatbot)**
```env
GOOGLE_API_KEY=your-google-gemini-api-key-here
```
Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. Optional Configuration

#### **Blockchain Testnet (Optional - for crypto features)**
```env
BLOCKCHAIN_NETWORK=testnet
INFURA_PROJECT_ID=your-infura-project-id
```
Get Infura credentials from [Infura.io](https://infura.io/)

#### **Cloudinary (Optional - for image uploads)**
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```
Get credentials from [Cloudinary](https://cloudinary.com/)

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Crypto Features (Testnet Mode)

The platform supports testnet transactions for testing crypto payments without real money.

### Supported Testnets

- **Ethereum Sepolia** (Chain ID: 11155111)
- **Polygon Mumbai** (Chain ID: 80001)

### Getting Test Tokens

#### Ethereum Sepolia Faucets:
- [Sepolia Faucet](https://sepoliafaucet.com)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

#### Polygon Mumbai Faucets:
- [Polygon Faucet](https://faucet.polygon.technology)

### Testing Payments

1. Set `BLOCKCHAIN_NETWORK=testnet` in your `.env.local`
2. Get test tokens from faucets above
3. Use the platform's payment features
4. Transactions will show "Testnet Mode" indicator
5. View transactions on testnet block explorers

---

## 🎨 Theme Support

The platform supports both light and dark themes:

- **Default**: Dark mode
- **Toggle**: Use the theme toggle in the header
- **System**: Automatically follows your system preference

---

## 🤖 AI Chatbot

The AI chatbot has two modes:

### Rule-Based Mode (Always Available)
Responds to common questions about:
- Finding skill partners
- Crypto/credits system
- Platform navigation
- Testnet information

### AI-Powered Mode (Requires Google API Key)
- Advanced conversational AI
- Context-aware responses
- Powered by Google Gemini

**Note**: If `GOOGLE_API_KEY` is not configured, the chatbot will run in limited rule-based mode.

---

## 📝 Environment Variables Reference

See `.env.example` for a complete list of all available environment variables with descriptions.

### Minimum Required Variables
```env
MONGODB_URI=<your-mongodb-connection-string>
NEXTAUTH_SECRET=<random-secret>
NEXTAUTH_URL=http://localhost:3000
```

### Recommended for Full Features
```env
GOOGLE_API_KEY=<your-google-ai-key>
BLOCKCHAIN_NETWORK=testnet
INFURA_PROJECT_ID=<your-infura-id>
```

---

## 🔧 Troubleshooting

### Chatbot Not Working
- ✅ Check `GOOGLE_API_KEY` is set in `.env.local`
- ✅ Verify API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- ✅ Restart the development server after adding the key

### Database Connection Issues
- ✅ Verify `MONGODB_URI` is correct
- ✅ Check MongoDB Atlas allows connections from your IP
- ✅ Ensure database user has proper permissions

### Crypto Payments Not Working
- ✅ Confirm `BLOCKCHAIN_NETWORK=testnet` is set
- ✅ Verify `INFURA_PROJECT_ID` is configured
- ✅ Check you have test tokens in your wallet

### Theme Not Switching
- ✅ Clear browser cache
- ✅ Check browser console for errors
- ✅ Verify `next-themes` package is installed

---

## 🚢 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

**Important**: Never commit `.env.local` to version control!

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)
- [Google AI Documentation](https://ai.google.dev/docs)
- [Infura Documentation](https://docs.infura.io/)

---

## 🆘 Support

If you encounter any issues:

1. Check this guide
2. Review `.env.example` for correct variable names
3. Check the browser console for errors
4. Verify all required API keys are valid

---

**Happy Coding! 🎉**
