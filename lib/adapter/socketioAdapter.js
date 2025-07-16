import { io } from "socket.io-client";

export class SocketIOAdapter {
  constructor() {
    this.socket = null;
    this.pendingExpectations = [];
  }

  connect(url) {
    return new Promise((resolve, reject) => {
      this.socket = io(url, {
        transports: ["websocket"],
        reconnection: false,
      });

      this.socket.on("connect", () => resolve());
      this.socket.on("connect_error", reject);

      // Handle all events
      this.socket.onAny((event, ...args) => {
        const message = JSON.stringify({ event, args });
        this.checkExpectations(message);
      });
    });
  }

  send(data) {
    try {
      const { event, payload } = JSON.parse(data);
      this.socket.emit(event, payload);
    } catch {
      this.socket.emit("message", data);
    }
  }

  waitFor(expected, timeout = 5000) {
    return new Promise((resolve, reject) => {
      // Setup timeout
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for: ${expected}`));
      }, timeout);

      // Add to pending expectations
      this.pendingExpectations.push({
        expected,
        resolve: () => {
          clearTimeout(timer);
          resolve();
        },
        reject,
      });
    });
  }

  checkExpectations(message) {
    this.pendingExpectations = this.pendingExpectations.filter(
      (expectation) => {
        if (message.includes(expectation.expected)) {
          expectation.resolve();
          return false;
        }
        return true;
      }
    );
  }

  close() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
