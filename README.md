# AskEBL - Banking Assistant

A modern banking application with an intelligent chatbot assistant for seamless customer support.

## Features

- Real-time account balance and transaction viewing
- Interactive banking assistant (AskEBL)
- Multi-user account switching
- Loan management and tracking
- FAQ system with intelligent responses
- Responsive design for all devices

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI Framework**: shadcn-ui, Tailwind CSS
- **Backend**: Supabase (Database, Authentication, Real-time)
- **State Management**: TanStack Query (React Query)

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Database Setup

This project uses Supabase for backend services. The database includes:

- **profiles**: User account information
- **transactions**: Transaction history
- **loans**: Loan details and payment tracking
- **faqs**: Frequently asked questions for the chatbot

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn-ui components
│   ├── BankingDashboard.tsx
│   ├── BankingSidebar.tsx
│   └── ChatBot.tsx
├── hooks/              # Custom React hooks
├── pages/              # Page components
└── integrations/       # External service integrations
```

## Development

To add new features:

1. **Add new users**: Insert records into the `profiles` table
2. **Add new FAQs**: Insert records into the `faqs` table with keywords for better matching
3. **Customize UI**: Modify components in the `src/components` directory

## Deployment

Deploy your application to any hosting platform that supports Node.js applications.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request
