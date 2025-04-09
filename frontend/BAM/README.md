# BAM Frontend Application

This is the frontend application for the Wealth Management platform, providing a user interface for accessing financial news and wealth management advice.

## Setup and Installation

### Option 1: Local Development

```sh
# Step 1: Navigate to the project directory
cd frontend/BAM

# Step 2: Install the necessary dependencies
npm install

# Step 3: Start the development server with auto-reloading
npm run dev
```

The development server will start at `http://localhost:5173`

### Option 2: Docker Deployment

The frontend can be deployed using Docker either individually or as part of the whole application using docker-compose from the root directory.

#### Individual Deployment:

```sh
# Build the Docker image
docker build -t bam-frontend .

# Run the container
docker run -p 3000:3000 bam-frontend
```

Access the application at `http://localhost:3000`

## Configuration

The application uses environment variables for configuration. Create a `.env` file in the root of the frontend directory with the following variables:

```
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_FINANCE_API_URL=https://query1.finance.yahoo.com/v8/finance
```

- `VITE_API_URL`: Base URL for the backend API
- `VITE_FINANCE_API_URL`: Base URL for the Yahoo Finance API

You can modify these values to point to different API endpoints as needed.

## Build for Production

```sh
# Build the application for production
npm run build

# Preview the production build locally
npm run preview
```

## Technologies Used

This project is built with:

- Vite - Next generation frontend tooling
- TypeScript - Typed JavaScript
- React - UI library
- shadcn-ui - Beautifully designed components
- Tailwind CSS - Utility-first CSS framework
- React Router - For navigation
- React Query - For data fetching
- Chart.js - For data visualization
