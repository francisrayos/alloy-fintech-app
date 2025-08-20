# Alloy Financial Application Form

A Next.js application that integrates with Alloy's identity verification and fraud prevention API to process financial applications with dynamic form generation.

## Features

- **Dynamic Form Generation**: Automatically builds forms based on Alloy's parameter requirements
- **Identity Verification**: Collects and validates personal information
- **Fraud Prevention**: Integrates with Alloy's screening services
- **Real-time Processing**: Immediate application evaluation
- **Responsive Design**: Works on desktop and mobile devices
- **Outcome Handling**: Different UI states for Approved, Manual Review, and Denied applications
- **Parameter Validation**: Uses Alloy's field specifications for accurate validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Alloy API credentials (token and secret)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd alloy-financial-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file in the root directory:
\`\`\`
ALLOY_API_TOKEN=your_alloy_api_token_here
ALLOY_API_SECRET=your_alloy_api_secret_here
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ALLOY_API_TOKEN` | Your Alloy API token | Yes |
| `ALLOY_API_SECRET` | Your Alloy API secret | Yes |

## Dynamic Form Generation

The application automatically fetches field requirements from Alloy's parameters endpoint and builds the form dynamically. This ensures:
- Always up-to-date field requirements
- Proper validation rules
- Automatic adaptation to API changes
- Consistent field naming and formatting

## Testing with Sandbox Personas

The application supports Alloy's sandbox personas for testing different outcomes:

- **Approved**: Use any last name except "Review" or "Deny"
- **Manual Review**: Use last name "Review"
- **Denied**: Use last name "Deny"

## API Integration

The application integrates with Alloy's sandbox environment:
- **Parameters Endpoint**: `https://sandbox.alloy.co/v1/parameters/` (for form generation)
- **Evaluations Endpoint**: `https://sandbox.alloy.co/v1/evaluations/` (for application submission)
- **Authentication**: Basic Auth using API token and secret
- **Method**: GET for parameters, POST for evaluations

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Ensure your deployment platform supports:
- Node.js 18+
- Environment variables
- Next.js applications

## Security Notes

- Never commit API credentials to version control
- Use environment variables for all sensitive data
- The application uses HTTPS for all API communications
- Input validation is performed on both client and server side
- Dynamic form generation prevents hardcoded field assumptions

## Support

For issues with the Alloy API, consult the [Alloy Documentation](https://docs.alloy.co/).

## License

This project is for educational/demonstration purposes.
