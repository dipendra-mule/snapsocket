import WebSocket from "ws";

export class WSAdapter {
  constructor() {
    this.socket = null;
    this.messageQueue = [];
    this.pendingExpectations = [];
  }

  connect(url) {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(url);

      this.socket.on("open", () => resolve());
      this.socket.on("error", reject);
      this.socket.on("message", (data) => {
        const message = data.toString();
        this.messageQueue.push(message);
        this.checkExpectations(message);
      });
    });
  }

  send(data) {
    this.socket.send(data);
  }

  waitFor(expected, timeout = 5000) {
    return new Promise((resolve, reject) => {
      // Check if already received
      if (this.messageQueue.some((msg) => msg.includes(expected))) {
        return resolve();
      }

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
      this.socket.close();
    }
  }
}
