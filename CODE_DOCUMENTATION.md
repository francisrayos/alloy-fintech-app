# Code Documentation

This document explains the structure and functionality of each component in the Alloy Financial Application with dynamic form generation.

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── parameters/
│   │   │   └── route.ts          # API endpoint for fetching Alloy parameters
│   │   └── submit-application/
│   │       └── route.ts          # API endpoint for form submission
│   ├── globals.css               # Global styles and Alloy brand colors
│   ├── layout.tsx               # Root layout with fonts and metadata
│   └── page.tsx                 # Main application form page with dynamic generation
├── public/
│   └── alloy-logo.png           # Alloy company logo
├── README.md                    # Project setup and usage instructions
└── CODE_DOCUMENTATION.md       # This file
\`\`\`

## File Breakdown

### `/app/page.tsx` - Main Application Component

**Purpose**: The primary user interface with dynamic form generation and result display.

**Key Features**:
- **Dynamic Form Generation**: Fetches parameters from Alloy API and builds form automatically
- **Parameter-Based Validation**: Uses Alloy's field specifications for validation rules
- **Adaptive Field Layout**: Intelligently groups and displays fields based on type
- **Form State Management**: Uses React `useState` to manage dynamic form data
- **Dynamic UI States**: Shows different screens based on application outcome

**Key Functions**:
- `fetchParameters()`: Retrieves field requirements from Alloy's parameters endpoint
- `renderFormField()`: Dynamically creates form fields based on parameter specifications
- `groupFields()`: Organizes fields into logical sections (name, address, personal)
- `validateForm()`: Validates form using parameter-defined rules
- `handleSubmit()`: Processes form submission with dynamic field data

**Dynamic Features**:
- Automatically adapts to API field changes
- Generates appropriate input types (email, date, text)
- Applies validation rules from parameter specifications
- Handles field grouping and responsive layout

### `/app/api/parameters/route.ts` - Parameters API Endpoint

**Purpose**: Fetches field requirements and validation rules from Alloy's parameters endpoint.

**Key Features**:
- **Parameter Retrieval**: Gets current field specifications from Alloy
- **Authentication**: Uses Basic Auth with Alloy API credentials
- **Error Handling**: Comprehensive error handling for API failures
- **Caching Ready**: Structured for potential caching implementation

**API Flow**:
1. Receives GET request from frontend
2. Authenticates with Alloy using API credentials
3. Fetches parameters from Alloy's parameters endpoint
4. Returns field specifications to frontend
5. Logs parameter retrieval for debugging

### `/app/api/submit-application/route.ts` - Application Submission API

**Purpose**: Server-side API route that handles dynamic form submissions and communicates with Alloy's API.

**Key Features**:
- **Dynamic Data Handling**: Accepts any field structure based on parameters
- **Flexible Logging**: Logs available fields without assuming specific structure
- **Authentication**: Uses Basic Auth with Alloy API credentials
- **Error Handling**: Comprehensive error handling with detailed logging

**API Flow**:
1. Receives POST request with dynamic form data
2. Logs available fields and key information
3. Validates API credentials are configured
4. Sends dynamic payload to Alloy evaluations endpoint
5. Processes response and returns to frontend

### `/app/layout.tsx` - Root Layout

**Purpose**: Defines the HTML structure, fonts, and global configuration.

**Features**:
- **Font Loading**: Imports and configures Google Fonts (Geist, Manrope)
- **Metadata**: Sets page title, description, and viewport
- **Global Styles**: Applies CSS variables and font families
- **Theme Provider**: Sets up shadcn/ui theme system

### `/app/globals.css` - Global Styles

**Purpose**: Contains global CSS styles, Tailwind configuration, and custom Alloy brand colors.

**Key Elements**:
- **Tailwind CSS**: Imports and configures Tailwind utilities
- **Custom Colors**: Defines Alloy brand colors (pink, purple, coral gradients)
- **Font Configuration**: Maps Google Fonts to Tailwind font families
- **Component Styles**: Base styles for form elements and layouts

**Brand Colors**:
- Primary: Pink to purple gradients
- Accent: Coral and teal
- Neutrals: Grays and whites for text and background

### `/public/alloy-logo.png` - Brand Asset

**Purpose**: The official Alloy company logo used in the application header.

**Usage**: Displayed prominently in the hero section, sized at 600x180px for maximum brand impact.

## Data Flow

1. **Parameter Fetch**: Application loads and fetches field requirements from Alloy
2. **Dynamic Form Build**: Frontend generates form based on parameter specifications
3. **User Input**: User fills out the dynamically generated form
4. **Parameter Validation**: Form validates data using Alloy's validation rules
5. **API Call**: Frontend sends POST request with dynamic field data
6. **Server Processing**: API route validates and forwards to Alloy
7. **Alloy Response**: Alloy returns evaluation results
8. **UI Update**: Frontend displays appropriate outcome screen

## Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework
- **Alloy API**: Identity verification, fraud prevention, and parameter management
- **React Hooks**: State management and dynamic form handling

## Environment Configuration

The application requires two environment variables:
- `ALLOY_API_TOKEN`: Your Alloy API authentication token
- `ALLOY_API_SECRET`: Your Alloy API secret key

These are used for Basic Authentication when calling Alloy's API endpoints.

## Dynamic Form Architecture

The application uses a sophisticated dynamic form system:

**Parameter Structure**:
\`\`\`typescript
interface ParameterField {
  name: string
  type: string
  required: boolean
  description?: string
  validation?: {
    pattern?: string
    min_length?: number
    max_length?: number
  }
}
\`\`\`

**Field Generation**:
- Automatically creates appropriate input types
- Applies validation rules from parameters
- Groups related fields intelligently
- Handles special cases (SSN formatting, state codes, etc.)

## Error Handling

The application includes comprehensive error handling:
- **Parameter Loading**: Handles API failures during form generation
- **Client-side**: Dynamic validation based on parameter rules
- **Server-side**: API error handling and logging
- **Network**: Handles API timeouts and connection issues
- **User Experience**: Clear error messages and recovery options

## Logging and Debugging

Console logging is implemented throughout the application:
- Parameter fetching and processing logs
- Dynamic field generation tracking
- Input validation and processing logs
- API request and response logging
- Error tracking and debugging information
