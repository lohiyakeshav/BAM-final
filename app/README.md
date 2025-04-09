# BAM Backend Application

This is the FastAPI backend for the Wealth Management platform, providing API endpoints for financial news and wealth management advice services.

## Setup and Installation

### Option 1: Local Development

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
GEMINI_API_KEY=your_gemini_api_key
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
# Add any other required environment variables
```

4. Start the FastAPI server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at `http://localhost:8000`

### Option 2: Docker Deployment

The backend can be deployed using Docker either individually or as part of the whole application using docker-compose from the root directory.

#### Individual Deployment:

```bash
# Build the Docker image
docker build -t bam-backend .

# Run the container
docker run -p 8000:8000 --env-file ../.env bam-backend
```

Access the API at `http://localhost:8000`

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

- `app/main.py` - Application entry point
- `app/api/` - API endpoints
- `app/models/` - Database models
- `app/schemas/` - Pydantic schemas for request/response validation
- `app/services/` - Business logic services
- `app/database/` - Database connection and utilities
- `app/utils/` - Utility functions
- `app/dependencies/` - FastAPI dependencies
- `app/migrations/` - Database migrations using Alembic 