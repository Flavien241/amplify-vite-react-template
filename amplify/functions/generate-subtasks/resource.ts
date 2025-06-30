import { defineFunction } from "@aws-amplify/backend";

export const generateSubtasks = defineFunction({
  name: "generate-subtasks",
  entry: "./handler.ts",
  environment: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  },
});
