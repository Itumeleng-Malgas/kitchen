import useSWR, { mutate } from 'swr';
import ReconnectingWebSocket from 'reconnecting-websocket';

export type Order = {
  id: number;
  restaurant_id: number;
  status: string;
  total_amount: number;
};

let ws: ReconnectingWebSocket | null = null;

export const useOrders = (restaurantId: number, enableRealtime = true) => {
  const { data: orders, error } = useSWR<Order[]>('/api/orders');

  // Initialize WebSocket only once per restaurant
  if (enableRealtime && restaurantId && !ws) {
    ws = new ReconnectingWebSocket(
      `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${
        window.location.host
      }/ws/restaurants/${restaurantId}`
    );

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'ORDER_CREATED') {
        mutate('/api/orders', (current: Order[] = []) => [msg, ...current], false);
      } else if (msg.type === 'ORDER_STATUS_CHANGED') {
        mutate('/api/orders', (current: Order[] = []) =>
          current.map((o) => (o.id === msg.order_id ? { ...o, status: msg.status } : o))
        );
      }
    });
  }

  return { orders, error };
};
