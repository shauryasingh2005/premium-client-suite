import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Fallback in-memory DB in case local MongoDB is not running
let messageHistory: any[] = [];
let mongoConnected = false;

// Define message schema
const MessageSchema = new mongoose.Schema({
  user: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", MessageSchema);

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/warriorforge")
  .then(() => {
    console.log("✓ Connected to MongoDB.");
    mongoConnected = true;
  })
  .catch((err) => {
    console.warn("⚠️ Local MongoDB not detected. Running with in-memory database fallback.");
  });

// HTTP Get API
app.get("/api/messages", async (req, res) => {
  if (mongoConnected) {
    try {
      const dbMessages = await Message.find().sort({ timestamp: -1 }).limit(50);
      res.json(dbMessages.reverse());
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  } else {
    res.json(messageHistory.slice(-50));
  }
});

// Upgrade HTTP to WS
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// WebSocket Connection handler
wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected via WebSocket");

  // Send current message history on connection
  const initHistory = mongoConnected ? [] : messageHistory;
  if (mongoConnected) {
    Message.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .then((docs) => {
        ws.send(JSON.stringify({ type: "history", data: docs.reverse() }));
      });
  } else {
    ws.send(JSON.stringify({ type: "history", data: initHistory }));
  }

  // Handle incoming socket message
  ws.on("message", async (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === "chat") {
        const msgObj = {
          user: parsed.user || "Guest Athlete",
          text: parsed.text,
          timestamp: new Date(),
        };

        if (mongoConnected) {
          const newMsg = new Message(msgObj);
          await newMsg.save();
        } else {
          messageHistory.push(msgObj);
        }

        // Broadcast to everyone
        const broadcastData = JSON.stringify({ type: "chat", data: msgObj });
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(broadcastData);
          }
        });
      } else if (parsed.type === "notification") {
        // Broadcast workout check-in notifications
        const broadcastData = JSON.stringify({ type: "notification", data: parsed.data });
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(broadcastData);
          }
        });
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`✓ Express/WebSocket Server running on port ${PORT}`);
});
