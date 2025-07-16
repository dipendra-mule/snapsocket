// This server is used for testing SnapSocket CLI
// Run with: `node examples/test-server.js`

import { WebSocketServer } from "ws";

const VALID_TOKENS = ["token123", "admin-token", "valid-user"];

const wss = new WebSocketServer({ port: 3000 });
console.log("WebSocket server running on ws://localhost:3000");

wss.on("connection", (ws) => {
  console.log("🔌 Client connected");

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data);
      console.log("📩 Received:", msg);
      console.log(msg.event);

      switch (msg.event) {
        case "auth":
          if (VALID_TOKENS.includes(msg.token)) {
            ws.send(
              JSON.stringify({ event: "auth_success", userId: msg.token })
            );
          } else {
            ws.send(
              JSON.stringify({ event: "auth_failed", reason: "Invalid token" })
            );
            ws.close();
          }
          break;

        case "join":
          if (msg.room) {
            ws.send(JSON.stringify({ event: "joined", room: msg.room }));
          }
          break;

        case "message":
          if (msg.text) {
            ws.send(JSON.stringify({ event: "message_ack", text: msg.text }));
          }
          break;

        default:
          ws.send(JSON.stringify({ event: "error", message: "Unknown event" }));
      }
    } catch (err) {
      ws.send(JSON.stringify({ event: "error", message: "Invalid JSON" }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
