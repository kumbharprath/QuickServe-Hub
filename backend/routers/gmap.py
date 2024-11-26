from fastapi import APIRouter, HTTPException, Depends
from core.database import service_collection
from bson import ObjectId
from fastapi.responses import JSONResponse