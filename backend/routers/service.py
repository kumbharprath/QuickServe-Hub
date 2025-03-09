from fastapi import APIRouter, HTTPException, File, UploadFile, Query
import requests
from fastapi.responses import StreamingResponse, JSONResponse
from typing import List
from bson import ObjectId
from gridfs import GridFSBucket
from core.database import fs, user_reviews
from io import BytesIO
from models.service import ServiceProvider, UpdateServiceProviderDetails
from crud.service import create_service_provider, save_image, add_images, get_service_provider, update_service_provider, delete_service_provider, get_image_ids, get_service_provider_latlng
from core.database import service_collection
from core.config import settings
import logging
import base64


router = APIRouter()

# @router.post("/add-service/")
# async def add_service_provider_with_images(
#     service: ServiceProvider,
#     profile_image: UploadFile = File(None),
#     adhar_card: UploadFile = File(None),
#     office_images: List[UploadFile] = File(None)
# ):
#     try:
#         # Convert service data to dictionary
#         service_provider = service.dict(exclude_unset=False)
        
#         # Check for existing service provider
#         existing_service_provider = await service_collection.find_one({"phone_number": service_provider["phone_number"]})
#         if existing_service_provider is not None:
#             return {"message": "Service provider is already registered"}

#         # Create new service provider
#         result = await create_service_provider(service_provider)
#         service_id = str(result.inserted_id)

#         # Update location with latitude and longitude
#         latitude, longitude = get_service_provider_latlng(service_id)
#         await service_collection.update_one(
#             {"_id": ObjectId(service_id)},
#             {"$set": {
#                 "latitude": latitude,
#                 "longitude": longitude
#             }}
#         )

#         # Handle image uploads
#         profile_image_id = await save_image(profile_image) if profile_image else None
#         adhar_card_image_id = await save_image(adhar_card) if adhar_card else None
#         office_images_ids = [await save_image(image) for image in office_images] if office_images else []

#         # Prepare the images dictionary
#         images = {
#             "profile_image_id": profile_image_id,
#             "adhar_card_image_id": adhar_card_image_id,
#             "office_images_ids": office_images_ids
#         }

#         # Update service provider with image IDs
#         updated_result = await add_images(service_id, images)
#         if updated_result.modified_count == 0:
#             raise HTTPException(status_code=404, detail="Service provider not found")

#         return {"message": "Service provider created successfully", "service_id": service_id}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


@router.get("/service-provider/{service_id}")
async def get_service_provider_details(service_id: str):
    try:
        if not ObjectId.is_valid(service_id):
            raise HTTPException(status_code=400, detail="Invalid service provider ID")

        # Fetch service provider details
        service_provider = await get_service_provider(service_id)
        if not service_provider:
            raise HTTPException(status_code=404, detail="Service provider not found")

        # Initialize the response data with service provider details
        response_data = service_provider.copy()

        # Fetch and attach profile image
        if "profile_image_id" in service_provider and service_provider["profile_image_id"]:
            profile_image_data = await fetch_image(service_provider["profile_image_id"])
            response_data["profile_image"] = profile_image_data

        # Fetch and attach Aadhar card image
        if "adhar_card_image_id" in service_provider and service_provider["adhar_card_image_id"]:
            adhar_card_image_data = await fetch_image(service_provider["adhar_card_image_id"])
            response_data["adhar_card_image"] = adhar_card_image_data

        # Fetch and attach office images (if any)
        if "office_images_ids" in service_provider and service_provider["office_images_ids"]:
            office_images_data = []
            for image_id in service_provider["office_images_ids"]:
                image_data = await fetch_image(image_id)
                if image_data:
                    office_images_data.append(image_data)
            response_data["office_images"] = office_images_data

        # Return Reviews
        reviews = await user_reviews.find({"service_id": service_id}).to_list(length=10)
        if reviews:
            response_data["reviews"] = [{key: value for key, value in item.items() if key != '_id'} for item in reviews]

        # Return service provider details along with embedded images
        return JSONResponse(content=response_data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Helper function to fetch and encode images from GridFS
async def fetch_image(image_id: str):
    try:
        grid_out = await fs.open_download_stream(ObjectId(image_id))
        if not grid_out:
            return None

        file_data = await grid_out.read()

        # Convert image to base64-encoded string
        encoded_image = base64.b64encode(file_data).decode('utf-8')
        content_type = grid_out.metadata["contentType"]

        # Return the base64 image along with content type
        return {
            "image_id": str(grid_out._id),
            "content_type": content_type,
            "image_data": f"data:{content_type};base64,{encoded_image}"
        }

    except Exception as e:
        return None


@router.get("/service-providers")
async def get_service_providers(
    user_lat: float = Query(None),
    user_lng: float = Query(None),
    max_distance_km: float = Query(None)
):
    try:
        query = {}

        if user_lat is not None and user_lng is not None and max_distance_km is not None:
            query["latitude"] = {"$exists": True}  
            query["longitude"] = {"$exists": True}

            query["$expr"] = {
                "$lt": [
                    {
                        "$multiply": [
                            6371,  # Earth's radius in kilometers
                            {
                                "$acos": {
                                    "$add": [
                                        {"$multiply": [{"$cos": {"$radians": "$latitude"}}, {"$cos": {"$radians": user_lat}}, {"$cos": {"$radians": {"$subtract": [user_lng, "$longitude"]}}}]},
                                        {"$multiply": [{"$sin": {"$radians": "$latitude"}}, {"$sin": {"$radians": user_lat}}]}
                                    ]
                                }
                            }
                        ]
                    },
                    max_distance_km
                ]
            }

        # Get services based on filters, or all if no filters
        services = await service_collection.find(query).to_list(length=100)

        # Process each service
        service_providers = []
        for service in services:
            service["_id"] = str(service["_id"])  # Convert ObjectId to string

            # Attach images if available
            if "profile_image_id" in service and service["profile_image_id"]:
                service["profile_image"] = await fetch_image(service["profile_image_id"])
            
            if "adhar_card_image_id" in service and service["adhar_card_image_id"]:
                service["adhar_card_image"] = await fetch_image(service["adhar_card_image_id"])

            if "office_images_ids" in service and service["office_images_ids"]:
                service["office_images"] = [await fetch_image(image_id) for image_id in service["office_images_ids"]]

            service_providers.append(service)

        return service_providers

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/update_details/service-providers/{service_id}")
async def modify_service_provider(service_id: str, service: UpdateServiceProviderDetails):
    try:
        if not ObjectId.is_valid(service_id):
            raise HTTPException(status_code=400, detail="Invalid service provider ID")
 
        update_data = service.dict(exclude_unset=True)

        update_result = await update_service_provider(service_id, update_data)

        latitude, longitude = await get_service_provider_latlng(service_id)
        await service_collection.update_one(
            {"_id": ObjectId(service_id)},
            {"$set": {
                "latitude": latitude,
                "longitude": longitude
            }}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Service provider not found")

        return {"message": "Service provider details updated successfully", "service_id": service_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete/service-providers/{service_id}")
async def remove_service_provider(service_id: str):
    try:
        if not ObjectId.is_valid(service_id):
            raise HTTPException(status_code=400, detail="Invalid service provider ID")

        delete_result = await delete_service_provider(service_id)

        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Service provider not found")

        return {"message": "Service provider deleted successfully", "service_id": service_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/service-provider/{service_id}/profile-image")
async def service_provider_images(
    service_id: str,
    profile_image: UploadFile = File(None)
):
    try:
        profile_image_id = await save_image(profile_image) if profile_image else None
        
        images = {
                "profile_image_id": profile_image_id,
            }

        updated_result = await add_images(service_id, images)
        if updated_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Service provider not found")

        return {"message": "Images updated successfully", "service_id": service_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/service-provider/{service_id}/adhar_image")
async def service_provider_images(
    service_id: str,
    adhar_image: UploadFile = File(None)
):
    try:
        adhar_card_image_id = await save_image(adhar_image) if adhar_image else None
        
        images = {
                "adhar_card_image_id": adhar_card_image_id,
            }

        updated_result = await add_images(service_id, images)
        if updated_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Service provider not found")

        return {"message": "Images updated successfully", "service_id": service_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/service-provider/{service_id}/office-images")
async def service_provider_images(
    service_id: str,
    office_images: List[UploadFile] = File(...)
):
    try:
        if office_images is None or len(office_images) == 0:
            raise HTTPException(status_code=400, detail="No images provided")

        office_images_ids = [await save_image(image) for image in office_images] if office_images else []
        
        images = {
                "office_images_ids": office_images_ids
            }

        updated_result = await add_images(service_id, images)
        
        if updated_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Service provider not found")

        return {"message": "Images updated successfully", "service_id": service_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/service-providers/image/{image_id}")
async def get_image(image_id: str):
    try:
        grid_out = await fs.open_download_stream(ObjectId(image_id))
        if not grid_out:
            raise HTTPException(status_code=404, detail="Image not found")
        
        file_data = await grid_out.read()

        return StreamingResponse(BytesIO(file_data), media_type=grid_out.metadata["contentType"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        

@router.get("/service-providers/{service_id}/images/")
async def list_images(service_id: str):
    try:
        image_ids = await get_image_ids(service_id)
        if not image_ids:
            raise HTTPException(status_code=404, detail="Service provider not found or no images available")

        images = {}
        for key, image_id in image_ids.items():
            if image_id:
                images[key] = f"/service-providers/image/{image_id}"

        return images
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/service-providers/{service_id}/image/{image_key}")
async def delete_image(service_id: str, image_key: str):
    """
    Delete an image (profile_image, adhar_card, pan_card, or office_image) from a service provider's record
    and remove it from GridFS.
    
    :param image_key: The key indicating which image to delete (profile_image_id, adhar_card_image_id, etc.)
    """
    try:
        if not ObjectId.is_valid(service_id):
            raise HTTPException(status_code=400, detail="Invalid service provider ID")

        service_provider = await service_collection.find_one({"_id": ObjectId(service_id)})
        if not service_provider:
            raise HTTPException(status_code=404, detail="Service provider not found")

        image_id = service_provider.get(image_key)
        if not image_id:
            raise HTTPException(status_code=404, detail=f"No image found for the key: {image_key}")

        try:
            await fs.delete(ObjectId(image_id))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to delete image from GridFS: {str(e)}")

        update_data = {image_key: None}
        if image_key == "office_images_ids":
            update_data = {image_key: []} 

        update_result = await service_collection.update_one(
            {"_id": ObjectId(service_id)},
            {"$set": update_data}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Service provider not found or image could not be updated")

        return {"message": "Image deleted successfully", "service_id": service_id, "image_key": image_key}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete image: {str(e)}")


@router.delete("/service-providers/{service_id}/office-image/{image_id}")
async def delete_office_image(service_id: str, image_id: str):
    try:
        if not ObjectId.is_valid(service_id) or not ObjectId.is_valid(image_id):
            raise HTTPException(status_code=400, detail="Invalid service or image ID")

        service_provider = await service_collection.find_one({"_id": ObjectId(service_id)})
        if not service_provider:
            raise HTTPException(status_code=404, detail="Service provider not found")

        office_images_ids = service_provider.get("office_images_ids", [])
        if image_id not in office_images_ids:
            raise HTTPException(status_code=404, detail="Image not found in office images")

        office_images_ids.remove(image_id)
        
        update_result = await service_collection.update_one(
            {"_id": ObjectId(service_id)},
            {"$set": {"office_images_ids": office_images_ids}}
        )
        
        await fs.delete(ObjectId(image_id))
        
        if update_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Failed to update service provider")

        return {"message": "Office image deleted successfully", "image_id": image_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/service-providers/{service_id}/map")
async def get_service_provider_map(service_id: str):
    try:
        service_provider = await get_service_provider(service_id)
        latitude = service_provider['latitude']
        longitude = service_provider['longitude']

        # Generating the Google Maps Static API URL
        map_url = f"https://www.google.com/maps/search/?api=1&query={latitude},{longitude}"

        return {
            "map_url": map_url,
            "name": service_provider.get("name")
        }

    except Exception as e:
        logging.error(f"Error in service provider's map: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
