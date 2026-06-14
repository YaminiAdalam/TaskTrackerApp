import { FormEvent, useEffect, useMemo, useState } from 'react';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const STORAGE_KEY = 'basic-gitops-task-tracker';

function loadTasks(): Task[] {
  const storedTasks = window.localStorage.getItem(STORAGE_KEY);

  if (!storedTasks) {
    return [];
  }

  try {
    return JSON.parse(storedTasks) as Task[];
  } catch {
    return [];
  }
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [title, setTitle] = useState('');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    setTasks((currentTasks) => [
      {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        completed: false
      },
      ...currentTasks
    ]);
    setTitle('');
  }

  function toggleTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function deleteTask(taskId: string) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  return (
    <main className="app-shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">Basic GitOps Pipeline Assignment</p>
            <h1 id="page-title">Task Tracker</h1>
          </div>
          <div className="status-panel" aria-label="Task summary">
            <strong>{completedCount}</strong>
            <span>of {tasks.length} complete</span>
          </div>
        </header>

        <form className="task-form" onSubmit={addTask}>
          <label htmlFor="task-title">New task</label>
          <div className="task-entry">
            <input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Prepare release checklist"
            />
            <button type="submit">Add task</button>
          </div>
        </form>

        <section className="task-list" aria-label="Tasks">
          {tasks.length === 0 ? (
            <p className="empty-state">No tasks yet. Add the first production-readiness task.</p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className={task.completed ? 'complete' : undefined}>
                  <label>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span>{task.title}</span>
                  </label>
                  <button type="button" onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
