import { getAdapter } from "./adapter/baseAdapter.js";
import chalk from "chalk";
import fs from "fs";
import yaml from "yaml"; // Add YAML parser

export class TestRunner {
  constructor(id, config, metrics) {
    this.id = id;
    this.config = config;
    this.metrics = metrics;
    this.steps = [];
    this.logs = [];
  }

  async execute() {
    try {
      // FIX: Use YAML parsing instead of import()
      const fileContent = fs.readFileSync(this.config.filePath, "utf8");
      const workflow = yaml.parse(fileContent);
      this.steps = workflow.flow;

      const Adapter = getAdapter(this.config.adapterType);
      this.client = new Adapter();

      const startTime = Date.now();

      for (const step of this.steps) {
        await this.executeStep(step);
      }

      const totalTime = Date.now() - startTime;
      this.metrics.recordSuccess(this.id, totalTime, this.logs);
      this.client.close();
    } catch (error) {
      this.metrics.recordFailure(this.id, error.message, this.logs);
      if (this.client) this.client.close();
    }
  }

  async executeStep(step) {
    const [action] = Object.keys(step);
    const params = step[action];

    switch (action) {
      case "connect":
        await this.client.connect(params);
        this.log(`Connected to ${params}`);
        break;

      case "send":
        this.client.send(params);
        this.log(`Sent: ${params}`);
        break;

      case "wait_for":
        await this.client.waitFor(params, 5000); // 5s timeout
        this.log(`Received: ${params}`);
        break;

      case "disconnect":
        this.client.close();
        this.log("Disconnected");
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  log(message) {
    this.logs.push(message);
  }
}
