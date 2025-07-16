import fs from "fs";
import { Parser } from "json2csv";

export async function exporter(results, format = "json") {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `./exportedData/snapsocket-report-${timestamp}.${format}`;

  if (format === "csv") {
    const parser = new Parser();
    const csv = parser.parse(results);
    fs.writeFileSync(filename, csv);
  } else {
    fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  }

  return filename;
}
