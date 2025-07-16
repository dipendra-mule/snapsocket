#!/usr/bin/env node
import { program } from "commander";
import fs from "fs";
import path from "path";
import yaml from "yaml";
import { runTest } from "../lib/clientPool.js";

function loadYaml(filePath) {
  const absPath = path.resolve(filePath);
  const content = fs.readFileSync(absPath, "utf8");
  return yaml.parse(content);
}

program
  .name("snapsocket")
  .description("WebSocket Load Testing CLI")
  .version("1.0.0");

program
  .command("run <file>")
  .description("Run test workflow from YAML file")
  .option("-c, --clients <number>", "Number of clients", "100")
  .option("-e, --export <format>", "Export format (json/csv)", "json")
  .option("-a, --adapter <type>", "Adapter type (ws/socketio)", "ws")
  .action(async (file, options) => {
    try {
      const filePath = path.resolve(file);

      if (!fs.existsSync(filePath)) {
        console.error(`Error: File ${file} not found`);
        process.exit(1);
      }

      const parsedYaml = loadYaml(filePath);

      const config = {
        flow: parsedYaml.flow,
        filePath,
        clients: parseInt(options.clients, 10),
        exportFormat: options.export,
        adapterType: options.adapter,
      };

      await runTest(config);
    } catch (err) {
      console.error(`CLI Error: ${err.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
