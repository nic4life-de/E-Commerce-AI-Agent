"""
Hauptanwendungsdatei - FastAPI Server
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import analysis, advanced

# Initialisiere FastAPI App
app = FastAPI(
    title="E-Commerce AI Agent",
    description="AI-gesteuerter Agent zur Optimierung von E-Commerce Shops",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registriere Routes
app.include_router(analysis.router)
app.include_router(advanced.router)


@app.get("/")
async def root():
    """Root Endpoint"""
    return {
        "message": "Welcome to E-Commerce AI Agent",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
