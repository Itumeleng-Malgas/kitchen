from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, restaurant_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.setdefault(restaurant_id, []).append(websocket)

    def disconnect(self, restaurant_id: int, websocket: WebSocket):
        self.active_connections[restaurant_id].remove(websocket)

    async def broadcast(self, restaurant_id: int, message: dict):
        for ws in self.active_connections.get(restaurant_id, []):
            await ws.send_json(message)
