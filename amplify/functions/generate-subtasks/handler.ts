import type { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event) => {
  // CORS géré par Function URL, pas besoin de headers manuels

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Corps de requête manquant" }),
      };
    }

    const { todoContent } = JSON.parse(event.body);

    if (!todoContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "todoContent est requis" }),
      };
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    console.log(
      "🔑 Clé API OpenAI présente:",
      !!openaiApiKey,
      "Longueur:",
      openaiApiKey?.length
    );

    if (!openaiApiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Clé API OpenAI non configurée" }),
      };
    }

    const requestPayload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Tu es un assistant qui aide à décomposer les tâches en sous-tâches plus petites et réalisables. Réponds avec une liste de 3-5 sous-tâches concrètes en français, une par ligne, sans numérotation.",
        },
        {
          role: "user",
          content: `Décompose cette tâche en sous-tâches : "${todoContent}"`,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    };

    console.log(
      "📤 Requête vers OpenAI:",
      JSON.stringify(requestPayload, null, 2)
    );

    // Appel à l'API OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ Erreur OpenAI détaillée:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorData,
      });
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Erreur lors de l'appel à OpenAI",
          details: `HTTP ${response.status}: ${errorData}`,
          openaiStatus: response.status,
        }),
      };
    }

    const data = await response.json();
    const subtasks =
      data.choices[0]?.message?.content
        ?.split("\n")
        .filter((task: string) => task.trim())
        .map((task: string) => task.replace(/^[-*•]\s*/, "").trim()) || [];

    return {
      statusCode: 200,
      body: JSON.stringify({ subtasks }),
    };
  } catch (error) {
    console.error("Erreur dans la fonction lambda:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur interne du serveur" }),
    };
  }
};
