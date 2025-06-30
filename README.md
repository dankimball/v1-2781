# Foundations of Tai Chi - Learning App

A comprehensive Tai Chi learning platform built with React, featuring course modules, journaling, quizzes, and premium content.

## Features

- **5 Course Modules**: Structured learning from basics to advanced practice
- **Authentication**: Secure user accounts with Supabase
- **Progress Tracking**: Monitor completion and learning journey
- **Practice Journal**: Daily reflections with AI-powered feedback
- **Knowledge Quiz**: Test understanding with interactive assessments
- **Premium Paywall**: Stripe integration for monetization
- **Responsive Design**: Mobile-first, beautiful UI
- **Analytics Dashboard**: Track user engagement and progress

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Auth, Database, Storage)
- **Payment**: Stripe
- **AI**: OpenAI GPT-4 for journal feedback
- **Icons**: React Icons
- **Routing**: React Router DOM

## Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase and Stripe credentials.

3. **Database Setup**
   Create these tables in Supabase:

   ```sql
   -- User profiles
   CREATE TABLE user_profiles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     has_premium BOOLEAN DEFAULT FALSE,
     intention TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Course progress
   CREATE TABLE user_progress (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     module_id INTEGER NOT NULL,
     completed BOOLEAN DEFAULT FALSE,
     completed_at TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Journal entries
   CREATE TABLE journal_entries (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     entry TEXT NOT NULL,
     ai_response TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Quiz attempts
   CREATE TABLE quiz_attempts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     score DECIMAL(5,2) NOT NULL,
     answers JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Course Structure

1. **Module 1** (Free): What Is Tai Chi?
2. **Module 2** (Premium): Yin-Yang & Daoist Roots
3. **Module 3** (Premium): Movement + Breath Connection
4. **Module 4** (Premium): Everyday Mindfulness Practices
5. **Module 5** (Premium): Integrating Tai Chi Into Daily Life

## Key Components

- **Authentication**: Email/password login with Supabase
- **Course System**: Sequential module unlocking
- **Journal**: Daily practice reflections with AI feedback
- **Quiz**: 5-question assessment with explanations
- **Dashboard**: Progress tracking and analytics
- **Paywall**: Stripe integration for premium access

## Customization

- **Modules**: Edit `src/data/modules.js` to modify course content
- **Styling**: Tailwind classes with custom Tai Chi color palette
- **AI Prompts**: Customize journal feedback in API calls
- **Payment**: Configure Stripe products and pricing

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to your preferred hosting platform
3. Set up environment variables in production
4. Configure Stripe webhooks for payment processing

## Environment Variables

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
OPENAI_API_KEY=your-openai-api-key
```

## License

MIT License - feel free to use this template for your own learning platforms!