# SnapSocket CLI

WebSocket Load Testing Tool

## Installation

```bash
npm i snapsocket-cli
```

## Usage

```bash
snapsocket run <yaml-filepath> -c <number-of-clients> -a <ws/socketio> -e <json/csv>
```

```
-c --clients <number>, "Number of clients", 100
-a --adapter <type>, "ws/socketio", ws
-e --export <format>, "json/csv", json
```

#### example

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
