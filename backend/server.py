from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

# Set up root directory and load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create the main app
app = FastAPI(title="Tomiwa Portfolio API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Pydantic Models
class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ContactSubmissionCreate(BaseModel):
    name: str
    email: str
    message: str

class ProjectMetrics(BaseModel):
    metric_name: str
    value: str
    description: Optional[str] = None

class Client(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    display_name: str
    description: str
    period: str
    metrics: List[ProjectMetrics]
    testimonial: Optional[str] = None
    testimonial_author: Optional[str] = None
    image_url: Optional[str] = None
    analytics_images: List[str] = []
    project_type: str = "social_media"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PortfolioStats(BaseModel):
    total_clients: int
    total_reach: str
    success_rate: str
    experience_years: int

# Portfolio API endpoints
@api_router.get("/")
async def root():
    return {"message": "Tomiwa Portfolio API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

@api_router.get("/portfolio/stats", response_model=PortfolioStats)
async def get_portfolio_stats():
    try:
        clients_count = await db.clients.count_documents({})
        return PortfolioStats(
            total_clients=clients_count,
            total_reach="50K+",
            success_rate="100%",
            experience_years=3
        )
    except Exception as e:
        logger.error(f"Error fetching portfolio stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch portfolio stats")

@api_router.get("/portfolio/clients", response_model=List[Client])
async def get_clients():
    try:
        clients = await db.clients.find().to_list(1000)
        return [Client(**client) for client in clients]
    except Exception as e:
        logger.error(f"Error fetching clients: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch clients")

@api_router.post("/portfolio/clients", response_model=Client)
async def create_client(client: Client):
    try:
        client_dict = client.dict()
        result = await db.clients.insert_one(client_dict)
        if result.inserted_id:
            return client
        raise HTTPException(status_code=400, detail="Failed to create client")
    except Exception as e:
        logger.error(f"Error creating client: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/contact", response_model=ContactSubmission)
async def create_contact_submission(contact: ContactSubmissionCreate):
    try:
        contact_dict = contact.dict()
        contact_obj = ContactSubmission(**contact_dict)
        result = await db.contact_submissions.insert_one(contact_obj.dict())
        if result.inserted_id:
            logger.info(f"Contact submission received from {contact_obj.email}")
            return contact_obj
        raise HTTPException(status_code=400, detail="Failed to submit contact form")
    except Exception as e:
        logger.error(f"Error submitting contact form: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/contact", response_model=List[ContactSubmission])
async def get_contact_submissions():
    try:
        submissions = await db.contact_submissions.find().sort("timestamp", -1).to_list(1000)
        return [ContactSubmission(**submission) for submission in submissions]
    except Exception as e:
        logger.error(f"Error fetching contact submissions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch contact submissions")

# Initialize database with sample data
@api_router.post("/portfolio/init")
async def initialize_portfolio_data():
    try:
        existing_clients = await db.clients.count_documents({})
        if existing_clients > 0:
            logger.info("Portfolio data already exists, skipping initialization")
            return {"message": "Portfolio data already exists"}

        clients_data = [
            {
                "id": str(uuid.uuid4()),
                "name": "coremarsassetmanagement",
                "display_name": "CoreMars Asset Management",
                "description": "Investment Management Company focusing on mutual funds and financial products",
                "period": "November 2024 - June 2025",
                "metrics": [
                    {"metric_name": "Posts", "value": "135", "description": "Total posts created"},
                    {"metric_name": "Followers", "value": "265", "description": "Followers gained"},
                    {"metric_name": "Following", "value": "2,229", "description": "Strategic following"},
                    {"metric_name": "Average Views", "value": "1,200+", "description": "Per post engagement"}
                ],
                "testimonial": "Tomiwa helped us increase our reach from 77 to 4.4k in just 2 months!",
                "testimonial_author": "CoreMars Team",
                "project_type": "social_media",
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "yellowatlas",
                "display_name": "Yellow Atlas Properties",
                "description": "Lagos Land Safety Experts specializing in property verification and investment guidance",
                "period": "6 months in 2025",
                "metrics": [
                    {"metric_name": "Posts", "value": "23", "description": "Strategic content posts"},
                    {"metric_name": "Followers", "value": "58", "description": "Quality followers"},
                    {"metric_name": "Total Views", "value": "14,162", "description": "Total content views"},
                    {"metric_name": "Accounts Reached", "value": "7,532", "description": "Unique accounts reached"},
                    {"metric_name": "Non-Follower Views", "value": "71.2%", "description": "Organic reach expansion"}
                ],
                "testimonial": "Professional social media management with excellent engagement rates",
                "testimonial_author": "Yellow Atlas Team",
                "project_type": "social_media",
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "bosah_oak_roe",
                "display_name": "Bosah Oak Roe",
                "description": "Personal brand development and social media growth",
                "period": "Campaign Duration: 4 months",
                "metrics": [
                    {"metric_name": "Social Media Reach", "value": "0 to 10k", "description": "Organic reach growth"},
                    {"metric_name": "Engagement Rate", "value": "High", "description": "Quality engagement"},
                    {"metric_name": "Brand Visibility", "value": "Increased", "description": "Enhanced online presence"}
                ],
                "testimonial": "Our social media presence went from 0 to 10k reach. Highly recommended!",
                "testimonial_author": "Bosah Oak Roe",
                "project_type": "social_media",
                "created_at": datetime.utcnow()
            }
        ]

        result = await db.clients.insert_many(clients_data)
        logger.info(f"Initialized {len(result.inserted_ids)} clients")
        return {"message": f"Initialized {len(result.inserted_ids)} clients"}
    except Exception as e:
        logger.error(f"Error initializing portfolio data: {e}")
        raise HTTPException(status_code=500, detail="Failed to initialize portfolio data")

# Include the router and middleware
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shutdown event to close MongoDB client
@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Closing MongoDB client connection")
    client.close()