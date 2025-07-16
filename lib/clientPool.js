import { TestRunner } from "./testRunner.js";
import { MetricsCollector } from "./metrics.js";
import { exporter } from "./exporter.js";
import ora from "ora";
import chalk from "chalk";

export async function runTest(config) {
  const spinner = ora(`Launching ${config.clients} clients...`).start();
  const metrics = new MetricsCollector();
  const runners = [];

  // Create client runners
  for (let i = 0; i < config.clients; i++) {
    runners.push(new TestRunner(i, config, metrics));
  }

  // Stagger connection starts
  const CONCURRENCY_LIMIT = 50;
  for (let i = 0; i < runners.length; i += CONCURRENCY_LIMIT) {
    const batch = runners.slice(i, i + CONCURRENCY_LIMIT);
    await Promise.allSettled(batch.map((runner) => runner.execute()));
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  // Collect results
  const results = metrics.getResults();
  spinner.succeed(chalk.green(`Test completed!`));

  // Show summary
  showSummary(results);

  // Export results
  if (config.exportFormat) {
    const exportPath = await exporter(results, config.exportFormat);
    console.log(chalk.blue(`\nResults exported to: ${exportPath}`));
  }
}

function showSummary(results) {
  const succeeded = results.filter((r) => r.success).length;
  const failed = results.length - succeeded;
  const latencies = results.map((r) => r.totalTime).filter((t) => t > 0);
  const avgLatency =
    latencies.reduce((a, b) => a + b, 0) / latencies.length || 0;
  const maxLatency = Math.max(...latencies, 0);

  console.log(chalk.bold("\nTest Summary:"));
  console.log("┌" + "─".repeat(30) + "┐");
  console.log(
    `│ ${chalk.bold("Clients:")} ${results.length.toString().padEnd(20)} │`
  );
  console.log(
    `│ ${chalk.bold("Success:")} ${chalk.green(
      succeeded.toString().padEnd(20)
    )} │`
  );
  console.log(
    `│ ${chalk.bold("Failed:")} ${chalk.red(failed.toString().padEnd(21))} │`
  );
  console.log(
    `│ ${chalk.bold("Avg Latency:")} ${avgLatency.toFixed(2)}ms`.padEnd(30) +
      "│"
  );
  console.log(
    `│ ${chalk.bold("Max Latency:")} ${maxLatency.toFixed(2)}ms`.padEnd(30) +
      "│"
  );
  console.log("└" + "─".repeat(30) + "┘");
}
