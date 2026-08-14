import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

if (!projectId) {
  throw new Error(
    "SANITY_STUDIO_PROJECT_ID is not set. Copy studio/.env.example to studio/.env and fill it in."
  );
}

export default defineConfig({
  name: "zhavilah",
  title: "ZHAVILAH BUSINESS GROUP",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
