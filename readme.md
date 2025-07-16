# SnapSocket CLI

WebSocket Load Testing Tool

## Installation

```bash
npm install -g snapsocket-cli
```

## Usage

```bash
snapsocket run samples/chat-flow.yaml --clients 200 --adapter socketio --export csv
```

## Sample Workflow

```yaml
flow:
  - connect: "ws://localhost:3000"
  - send: '{"event":"auth","token":"abc"}'
  - wait_for: '{"event":"auth_success"}'
  - send: '{"event":"join","room":"general"}'
  - wait_for: '{"event":"joined"}'
  - disconnect
```

## Features

- Simulate 100-500 concurrent clients
- Execute custom YAML workflows
- Measure latency and error rates
- Export results to JSON/CSV
- Supports raw WebSocket and Socket.IO

## Run Test Server (Local)

To simulate a WebSocket server with fake auth:

```bash
node examples/test-server.js
```
