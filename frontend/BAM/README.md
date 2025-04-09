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

By default, the application connects to the backend API at `http://localhost:8000`. To change this, you can set the `VITE_API_URL` environment variable before building the application.

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
