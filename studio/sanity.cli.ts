import { defineCliConfig } from "sanity/cli";

// Both values come from the environment so no project identifier is committed.
// See studio/.env.example.
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
});
