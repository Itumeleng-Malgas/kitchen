## Frontend Consumption Pattern (Reference)

const ws = new WebSocket(
  `ws://localhost:8000/ws/restaurants/${restaurantId}`
);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'ORDER_CREATED') {
    addOrderToList(data);
  }

  if (data.type === 'ORDER_STATUS_CHANGED') {
    updateOrderStatus(data);
  }
};


[
  { "product_name": "...", "quantity": 2, "unit_price": 50 }
]

psql -U app_user -h localhost -p 5432 -d app_db

DROP DATABASE app_db;
CREATE DATABASE app_db OWNER app_user;

