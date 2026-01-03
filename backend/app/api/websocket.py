import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket.manager import ConnectionManager
from app.infrastructure.redis import redis_client
from app.infrastructure.event_bus import ORDER_CHANNEL

router = APIRouter()
manager = ConnectionManager()

@router.websocket("/ws/restaurants/{restaurant_id}")
async def restaurant_ws(websocket: WebSocket, restaurant_id: int):
    await manager.connect(restaurant_id, websocket)

    pubsub = redis_client.pubsub()
    pubsub.subscribe(ORDER_CHANNEL)

    try:
        while True:
            message = pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                data = json.loads(message["data"])
                if data["restaurant_id"] == restaurant_id:
                    await manager.broadcast(restaurant_id, data)
            await asyncio.sleep(0.05)
    except WebSocketDisconnect:
        manager.disconnect(restaurant_id, websocket)
