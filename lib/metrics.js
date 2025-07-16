export class MetricsCollector {
  constructor() {
    this.results = new Map();
  }

  recordSuccess(clientId, totalTime, logs) {
    this.results.set(clientId, {
      success: true,
      error: null,
      totalTime,
      logs,
      steps: logs.length,
    });
  }

  recordFailure(clientId, error, logs) {
    this.results.set(clientId, {
      success: false,
      error,
      totalTime: 0,
      logs,
      steps: logs.length,
    });
  }

  getResults() {
    return Array.from(this.results.values());
  }
}
