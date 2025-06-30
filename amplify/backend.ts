import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { generateSubtasks } from "./functions/generate-subtasks/resource";
import { FunctionUrlAuthType, HttpMethod } from "aws-cdk-lib/aws-lambda";

export const backend = defineBackend({
  auth,
  data,
  storage,
  generateSubtasks,
});

// Donner à la fonction l'accès aux données pour authentification
backend.generateSubtasks.addEnvironment(
  "AMPLIFY_DATA_GRAPHQL_ENDPOINT",
  backend.data.graphqlUrl
);

// Créer une Function URL pour l'accès HTTP direct
const functionUrl = backend.generateSubtasks.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE, // Simplifié pour le développement
  cors: {
    allowCredentials: false,
    allowedHeaders: ["Content-Type", "Authorization"],
    allowedMethods: [HttpMethod.GET, HttpMethod.POST],
    allowedOrigins: ["*"],
  },
});

// Exporter l'URL pour le frontend
backend.addOutput({
  custom: {
    generateSubtasksUrl: functionUrl.url,
  },
});
