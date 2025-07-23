# SnapSocket CLI
<img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/01d0e5b5-dba5-4609-bd81-8354f400b74c" />

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

<img width="419" height="199" alt="Screenshot 2025-07-16 202857" src="https://github.com/user-attachments/assets/f884a704-421f-4096-930b-da42653d8366" />

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
