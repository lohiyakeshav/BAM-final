# Wealth Management Application

This application provides two main services:
1. Financial News Summarization
2. Personalized Wealth Management Advice

The project consists of a FastAPI backend and a React frontend.

## Setup Options

### Option 1: Local Development

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_db_url
```

4. Start the FastAPI server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

5. Start the frontend in a separate terminal:
```bash
cd frontend/BAM
npm install
npm run dev
```

### Option 2: Docker Deployment

1. Make sure you have Docker and Docker Compose installed on your system.

2. Set up environment variables:
Create a `.env` file in the root directory with:
```
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_db_url
# Add any other required environment variables
```

3. Build and start the containers:
```bash
docker-compose up -d
```

4. Access the services:
   - Backend API: `http://localhost:8000`
   - Frontend: `http://localhost:3000`

5. Stop the containers:
```bash
docker-compose down
```

## Project Structure

- `/app` - Backend FastAPI application
- `/frontend/BAM` - Frontend React application

## API Endpoints

### 1. Get News Summaries
- **Endpoint**: `POST /news`
- **Request Body**:
```json
{
    "query": "optional search query",
    "language": "en"
}
```

### 2. Get Wealth Management Advice
- **Endpoint**: `POST /wealth-management`
- **Request Body**:
```json
{
    "age": 30,
    "income": 1000000,
    "dependents": 2,
    "investment_horizon": 10,
    "existing_investments": {
        "stocks": 100000,
        "mutual_funds": 200000,
        "fixed_deposits": 300000
    },
    "risk_tolerance": "moderate",
    "goals": [
        {
            "type": "retirement",
            "target_amount": 5000000,
            "timeline": 25
        },
        {
            "type": "tax_saving",
            "target_amount": 150000,
            "timeline": 1
        }
    ]
}
```

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc` 