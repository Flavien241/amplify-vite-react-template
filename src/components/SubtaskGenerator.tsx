import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";

const client = generateClient<Schema>();

interface SubtaskGeneratorProps {
  parentTodo: Schema["Todo"]["type"];
  onSubtasksGenerated: () => void;
}

function SubtaskGenerator({
  parentTodo,
  onSubtasksGenerated,
}: SubtaskGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [subtasks, setSubtasks] = useState<string[]>([]);

  async function generateSubtasks() {
    setIsGenerating(true);
    try {
      // Récupérer l'URL de la fonction Lambda depuis les outputs
      const functionUrl = (outputs as any).custom?.generateSubtasksUrl;

      if (!functionUrl) {
        throw new Error(
          "URL de la fonction Lambda non configurée. Déployez d'abord la fonction AWS avec: npx ampx sandbox"
        );
      }

      console.log("🤖 Appel à la fonction Lambda...", {
        functionUrl,
        todoContent: parentTodo.content,
      });

      const requestBody = JSON.stringify({ todoContent: parentTodo.content });
      console.log("📤 Corps de la requête:", requestBody);

      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      console.log("📡 Réponse reçue:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erreur réponse Lambda:", errorText);
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Réponse Lambda:", data);

      if (!data.subtasks || !Array.isArray(data.subtasks)) {
        throw new Error("Format de réponse invalide");
      }

      setSubtasks(data.subtasks);
    } catch (error) {
      console.error("❌ Erreur lors de la génération:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      alert(
        `Erreur lors de la génération des sous-tâches: ${errorMessage}\n\nVérifiez que:\n- La clé API OpenAI est configurée\n- La fonction Lambda est déployée\n- Vous êtes bien connecté`
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function createSubtask(subtaskContent: string) {
    try {
      await client.models.Todo.create({
        content: `↳ ${subtaskContent}`, // Préfixe pour indiquer que c'est une sous-tâche
      });
      onSubtasksGenerated();
    } catch (error) {
      console.error("Erreur lors de la création de la sous-tâche:", error);
    }
  }

  async function createAllSubtasks() {
    for (const subtask of subtasks) {
      await createSubtask(subtask);
    }
    setSubtasks([]);
    alert("Toutes les sous-tâches ont été créées !");
  }

  return (
    <div className="subtask-generator">
      <h4>Générateur de sous-tâches IA 🤖</h4>

      <div className="task-info">
        <strong>Tâche principale :</strong> {parentTodo.content}
      </div>

      <button
        onClick={generateSubtasks}
        disabled={isGenerating}
        className={`btn-primary ${isGenerating ? "btn-disabled" : ""}`}
      >
        {isGenerating ? "🤖 Génération..." : "🤖 Générer des sous-tâches"}
      </button>

      {subtasks.length > 0 && (
        <div className="subtask-suggestions">
          <h5>Sous-tâches suggérées :</h5>
          <ul>
            {subtasks.map((subtask, index) => (
              <li key={index}>
                {subtask}
                <button
                  onClick={() => createSubtask(subtask)}
                  className="btn-small"
                >
                  + Ajouter
                </button>
              </li>
            ))}
          </ul>
          <button onClick={createAllSubtasks} className="btn-secondary">
            ✅ Créer toutes les sous-tâches
          </button>
        </div>
      )}

      <div className="ai-status">
        🤖 IA OpenAI activée - Génération en temps réel de sous-tâches
        personnalisées
      </div>
    </div>
  );
}

export default SubtaskGenerator;
