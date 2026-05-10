import { fileURLToPath } from "node:url";

import { writeActivitySnapshot } from "./generate-activity.mjs";
import {
  generateProjectMetadataSnapshot,
  writeProjectMetadataSnapshot,
} from "./project-metadata.mjs";

export async function buildData() {
  const projectMetadataSnapshot = await generateProjectMetadataSnapshot();
  writeProjectMetadataSnapshot(projectMetadataSnapshot);
  await writeActivitySnapshot();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await buildData();
}
