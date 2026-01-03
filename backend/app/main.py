from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.auth import router as auth_router
from app.api.restaurants import router as restaurant_router
from app.api.orders import router as order_router
from app.api.order_actions import router as order_actions_router
from app.api.websocket import router as websocket_router
from app.api.payment_actions import router as payment_router

app = FastAPI(title="Food Ordering Backend")

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(restaurant_router)
app.include_router(order_router)
app.include_router(order_actions_router)
app.include_router(websocket_router)
app.include_router(payment_router)