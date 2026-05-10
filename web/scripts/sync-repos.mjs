import { fileURLToPath } from "node:url";

import { printSyncReport, syncReposConfigFromProjectMetadata } from "./project-metadata.mjs";

export function syncRepos() {
  const report = syncReposConfigFromProjectMetadata();
  printSyncReport(report);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncRepos();
}
