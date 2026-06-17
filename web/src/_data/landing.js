import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import yaml from "js-yaml";

const DATA_DIR = path.dirname(fileURLToPath(import.meta.url));
const LANDING_FILE = path.join(DATA_DIR, "landing.yml");

export default function () {
  return yaml.load(fs.readFileSync(LANDING_FILE, "utf8")) || {};
}
