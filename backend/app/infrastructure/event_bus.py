import json
from app.infrastructure.redis import redis_client

ORDER_CHANNEL = "orders"

def publish_order_event(event: dict):
    redis_client.publish(ORDER_CHANNEL, json.dumps(event))
