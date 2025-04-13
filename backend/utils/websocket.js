import { WebSocketServer } from 'ws';

let wss;
const users = new Map();

const addUser = (userId, ws) => {
  if (!users.has(userId)) {
    users.set(userId, new Set());
  }
  users.get(userId).add(ws);
}

const removeUser = (userId, ws) => {
  if (users.has(userId)) {
    users.get(userId).delete(ws);
    if (users.get(userId).size === 0) {
      users.delete(userId);
    }
  }
}

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      console.log('Received message:', message.toString());
      message = JSON.parse(message.toString());
      if (message.type === 'register') {
        const { userId } = message;
        if (!userId) {
          console.error('User ID not provided in registration message');
          return;
        }
        addUser(userId, ws);
        ws.userId = userId;
        console.log(`User registered: ${ws.userId}`);
      }
    });

    ws.on('close', () => {
      removeUser(ws.userId, ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log('WebSocket server initialized and listening.');
};


export const broadcast = (userId, data) => {
  if (!wss) {
    console.error('WebSocket server not initialized. Cannot broadcast.');
    return;
  }
  if (!users.has(userId.toString())) {
    console.error(`User ${userId} not connected. Cannot broadcast.`);
    return;
  }
  const messageString = typeof data === 'string' ? data : JSON.stringify(data);
  users.get(userId.toString()).forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    }
  });
  console.log("Broadcasted!")
};


export const getWss = () => {
  if (!wss) {
    throw new Error('WebSocket server has not been initialized. Call initWebSocket first.');
  }
  return wss;
};