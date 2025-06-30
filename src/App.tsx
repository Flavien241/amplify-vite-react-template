import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import ProfilePhoto from "./components/ProfilePhoto";
import SubtaskGenerator from "./components/SubtaskGenerator";
import "./components/components.css";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [selectedTodo, setSelectedTodo] = useState<
    Schema["Todo"]["type"] | null
  >(null);
  const { signOut, user } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    const content = window.prompt("Contenu de la tâche");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  function toggleSubtaskGenerator(todo: Schema["Todo"]["type"]) {
    setSelectedTodo(selectedTodo?.id === todo.id ? null : todo);
  }

  // Séparer les tâches principales des sous-tâches
  const mainTodos = todos.filter((todo) => !todo.content?.startsWith("↳"));
  const subtasks = todos.filter((todo) => todo.content?.startsWith("↳"));

  return (
    <main className="app-container">
      <h1 className="app-title">My todos</h1>

      <ProfilePhoto />

      <button onClick={createTodo} className="btn-primary">
        + Nouvelle tâche
      </button>

      {/* Tâches principales */}
      {mainTodos.length > 0 && (
        <div className="section">
          <h2 className="section-title">
            Tâches principales ({mainTodos.length})
          </h2>
          <ul className="todo-list">
            {mainTodos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <div className="todo-item-content">
                  <span className="todo-text">{todo.content}</span>
                  <div className="todo-actions">
                    <button
                      onClick={() => toggleSubtaskGenerator(todo)}
                      className="btn-secondary"
                    >
                      🤖 Sous-tâches
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="btn-danger"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>

                {selectedTodo?.id === todo.id && (
                  <SubtaskGenerator
                    parentTodo={todo}
                    onSubtasksGenerated={() => {
                      // Les sous-tâches seront automatiquement mises à jour via observeQuery
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sous-tâches */}
      {subtasks.length > 0 && (
        <div className="section">
          <h2 className="section-title subtasks">
            Sous-tâches ({subtasks.length})
          </h2>
          <ul className="todo-list">
            {subtasks.map((subtask) => (
              <li key={subtask.id} className="subtask-item">
                <div className="todo-item-content">
                  <span className="subtask-text">{subtask.content}</span>
                  <button
                    onClick={() => deleteTodo(subtask.id)}
                    className="subtask-complete"
                  >
                    ✓ Terminé
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mainTodos.length === 0 && subtasks.length === 0 && (
        <div className="empty-state">
          <p>Aucune tâche pour le moment.</p>
          <p>Cliquez sur "Nouvelle tâche" pour commencer !</p>
        </div>
      )}

      <div className="app-footer">
        <p>
          🥳 App déployée avec succès ! Bonjour{" "}
          <strong>{user?.username}</strong>
        </p>
        <p className="footer-info">
          Fonctionnalités disponibles : Photos de profil, génération de
          sous-tâches IA
        </p>
        <button onClick={signOut} className="btn-logout">
          Se déconnecter
        </button>
      </div>
    </main>
  );
}

export default App;
