const fs = require("fs");
const file = "c:/Users/DELL/Downloads/EM SOCIETY/empirical-society-hub-main/src/lib/store.ts";
const content = fs.readFileSync(file, "utf-8");
const lines = content.split("\n");
const newLines = lines.slice(0, 56);
newLines.push('import { defaultContent } from "./data";');
newLines.push(...lines.slice(240));
fs.writeFileSync(file, newLines.join("\n"));
