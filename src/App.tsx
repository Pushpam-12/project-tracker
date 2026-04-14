import { useEffect, useState } from "react";
import { useTaskStore } from "./store/useTaskStore";
import { type Task } from "./store/useTaskStore";
import { generateTasks } from "./utils/generateTasks";
import TaskCard from "./components/TaskCard";
import ListView from "./components/ListView";
import TimelineView from "./components/TimelineView";



const columns: Task["status"][] = [
  "todo",
  "inprogress",
  "review",
  "done",
];

// ✅ FAKE USERS
const users = [
  { id: "A", color: "#ef4444" },
  { id: "B", color: "#3b82f6" },
  { id: "C", color: "#22c55e" },
  { id: "D", color: "#f59e0b" },
];

function App() {
  const [view, setView] = useState<
    "kanban" | "list" | "timeline"
  >("kanban");

  const [darkMode, setDarkMode] = useState(false);

 const [filters, setFilters] = useState({
  status: [] as Task["status"][],
  priority: [] as Task["priority"][],
  assignee: [] as string[],
  from: "", // ✅ NEW
  to: "",   // ✅ NEW
});

  const [draggingTask, setDraggingTask] =
    useState<Task | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  const setTasks = useTaskStore((s) => s.setTasks);
  const tasks = useTaskStore((s) => s.tasks);

  useEffect(() => {
    setTasks(generateTasks());
  }, []);

  // ✅ LOAD FROM URL (FIXED TYPES)
useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const status = (params.get("status")?.split(",") || []).filter(
    (s): s is Task["status"] =>
      ["todo", "inprogress", "review", "done"].includes(s)
  );

  const priority = (params.get("priority")?.split(",") || []).filter(
    (p): p is Task["priority"] =>
      ["low", "medium", "high", "critical"].includes(p)
  );

  const assignee = params.get("assignee")?.split(",") || [];

  const from = params.get("from") || "";
  const to = params.get("to") || "";

  setFilters({
    status,
    priority,
    assignee,
    from,
    to,
  });
}, []); // ✅ CLOSE properly
  


  // ✅ UPDATE URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.status.length)
      params.set("status", filters.status.join(","));
    if (filters.priority.length)
      params.set("priority", filters.priority.join(","));
    if (filters.assignee.length)
      params.set("assignee", filters.assignee.join(","));
    if (filters.from) params.set("from", filters.from);
if (filters.to) params.set("to", filters.to);

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  }, [filters]);

  // ✅ LIVE USERS SIMULATION
  useEffect(() => {
    const interval = setInterval(() => {
      const randomUsers = users
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * users.length) + 1)
        .map((u) => u.id);

      setActiveUsers(randomUsers);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ✅ DRAG
const handleDragStart = (task: Task) => {
  if (task.status === "done") return;

  setDraggingTask(task);

  // ✅ ADD THIS
  setDragPosition({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
};
 const handleDrop = (newStatus: Task["status"]) => {
  if (!draggingTask) return;

  // ❗ Only drop if actually hovered
  if (hoveredColumn === newStatus) {
    const updated = tasks.map((t) =>
      t.id === draggingTask.id
        ? { ...t, status: newStatus }
        : t
    );

    setTasks(updated);
  }

  // ✅ always reset (this causes snap-back)
  setDraggingTask(null);
  setHoveredColumn(null);
};

  // ✅ FILTER LOGIC
const listFilteredTasks = tasks.filter((t) => {
  const due = new Date(t.dueDate).getTime();

  const fromOk = filters.from
    ? due >= new Date(filters.from).getTime()
    : true;

  const toOk = filters.to
    ? due <= new Date(filters.to).getTime()
    : true;

  return (
    (filters.status.length === 0 ||
      filters.status.includes(t.status)) &&
    (filters.priority.length === 0 ||
      filters.priority.includes(t.priority)) &&
    (filters.assignee.length === 0 ||
      filters.assignee.includes(t.assignee)) &&
    fromOk &&
    toOk
  );
});

  const visibleColumns =
    filters.status.length > 0
      ? columns.filter((c) => filters.status.includes(c))
      : columns;

  const theme = darkMode
    ? {
        bg: "#111827",
        card: "#1f2937",
        text: "#f9fafb",
        border: "#374151",
      }
    : {
        bg: "#f9fafb",
        card: "#ffffff",
        text: "#0f0f0f",
        border: "#e5e7eb",
      };
      
const [hoveredColumn, setHoveredColumn] =
  useState<Task["status"] | null>(null);

  return (
   <div
  onPointerMove={(e) => {
    if (draggingTask) {
      setDragPosition({
        x: e.clientX + 10,
        y: e.clientY + 10,
      });
    }
  }}
  style={{
    background: theme.bg,
    color: theme.text,
    height: "100vh",
    width: "100%",
    overflow: "hidden",
  }}
>

      {/* HEADER */}
      <div style={{ padding: "20px", background: theme.card }}>
<h1
  style={{
    textAlign: "center",
    color: theme.text,        // ✅ changes with mode
    fontWeight: "bold",
    letterSpacing: "0.5px",
  }}
>
  Task Board
</h1>
        {/* 🔥 LIVE USERS */}
        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          
          {activeUsers.map((u) => {
            const user = users.find((x) => x.id === u);
            return (
              <div
                key={u}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: user?.color,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {u}
              </div>
            );
          })}
          <span style={{ fontSize: "12px", marginLeft: "8px" }}>
            {activeUsers.length} online
          </span>
        </div>

        {/* FILTERS */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
{/* STATUS */}
<select
  value={filters.status[0] || ""}
  onChange={(e) =>
    setFilters((prev) => ({
      ...prev,
      status: e.target.value
        ? [e.target.value as Task["status"]]
        : [],
    }))
  }
>
  <option value="">All Status</option>
  <option value="todo">To Do</option>
  <option value="inprogress">In Progress</option>
  <option value="review">Review</option>
  <option value="done">Done</option>
</select>

{/* PRIORITY */}
<select
  value={filters.priority[0] || ""}
  onChange={(e) =>
    setFilters((prev) => ({
      ...prev,
      priority: e.target.value
        ? [e.target.value as Task["priority"]]
        : [],
    }))
  }
>
  <option value="">All Priority</option>
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="high">High</option>
  <option value="critical">Critical</option>
</select>

{/* ASSIGNEE */}
<select
  value={filters.assignee[0] || ""}
  onChange={(e) =>
    setFilters((prev) => ({
      ...prev,
      assignee: e.target.value
        ? [e.target.value]
        : [],
    }))
  }
>
  <option value="">All Assignee</option>
  <option value="A">A</option>
  <option value="B">B</option>
  <option value="C">C</option>
  <option value="D">D</option>
  <option value="E">E</option>
</select>

          <button
            onClick={() => {
              setFilters({
                status: [],
                priority: [],
                assignee: [],
              });
              window.history.replaceState(
                null,
                "",
                window.location.pathname
              );
            }}
          >
            Clear
          </button>
          <input
  type="date"
  value={filters.from}
  onChange={(e) =>
    setFilters((prev) => ({ ...prev, from: e.target.value }))
  }
/>

<input
  type="date"
  value={filters.to}
  onChange={(e) =>
    setFilters((prev) => ({ ...prev, to: e.target.value }))
  }
/>
        </div>

        {/* VIEW + MODE */}
        <div style={{ marginTop: "10px" }}>
          {["kanban", "list", "timeline"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as any)}
              style={{
                marginRight: "5px",
                background:
                  view === v ? "#3b82f6" : theme.card,
                color: view === v ? "#fff" : theme.text,
              }}
            >
              {v}
            </button>
          ))}

          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {view === "kanban" ? (
        <div style={{ display: "flex", padding: "10px" }}>
          {visibleColumns.map((col) => (
            <div
  key={col}
  onPointerUp={() => handleDrop(col)}
  onPointerEnter={() => {
    if (draggingTask) setHoveredColumn(col);
  }}
  onPointerLeave={() => {
    setHoveredColumn(null);
  }}
              style={{
  flex: 1,
  padding: "10px",
  height: "600px",
  overflowY: "auto",

  border:
    hoveredColumn === col
      ? "2px solid #3b82f6"
      : `1px solid ${theme.border}`,

  background:
    hoveredColumn === col
      ? darkMode
        ? "#1e3a8a33"
        : "#3b82f611"
      : theme.card,
}}
            >
<h3>
  {col} ({listFilteredTasks.filter(t => t.status === col).length})
</h3>
          {listFilteredTasks
  .filter((t) => t.status === col)
  .map((task) => {
    const isDragging = draggingTask?.id === task.id;
const today = new Date().toDateString();
const dueDateObj = new Date(task.dueDate);

const isOverdue =
  dueDateObj < new Date() && task.status !== "done";

const isToday =
  dueDateObj.toDateString() === today;
    return (
      <div key={task.id}>
        {/* ✅ PLACEHOLDER */}
        {isDragging && (
          <div
            style={{
              height: "70px",
              marginBottom: "10px",
              border: "2px dashed #ccc",
              borderRadius: "8px",
            }}
          />
        )}
{isToday && (
  <div style={{ fontSize: "10px", color: "#f59e0b" }}>
    Due Today
  </div>
)}

{isOverdue && (
  <div style={{ fontSize: "10px", color: "red" }}>
    Overdue
  </div>
)}
        {/* ✅ HIDE ORIGINAL CARD */}
        {!isDragging && (
          <TaskCard
            task={task}
            onDragStart={handleDragStart}
            darkMode={darkMode}
          />
        )}

        {/* existing active user */}
        {activeUsers.includes(task.assignee) && (
          <div style={{ fontSize: "10px", color: "green" }}>
            ● Active
          </div>
        )}
      </div>
    );
  })}
            </div>
          ))}
        </div>
      ) : view === "list" ? (
        <ListView
          tasks={listFilteredTasks}
          onUpdateStatus={(id, status) => {
            const updated = tasks.map((t) =>
              t.id === id && t.status !== "done"
                ? { ...t, status }
                : t
            );
            setTasks(updated);
          }}
        />
      ) : (
        <TimelineView
          tasks={listFilteredTasks}
          darkMode={darkMode}
        />
      )}
{draggingTask && (
  <div
    style={{
      position: "fixed",
      top: dragPosition.y,
      left: dragPosition.x,
      width: "250px",
      pointerEvents: "none",
      zIndex: 999,
      opacity: 0.8,
      transform: "rotate(2deg)",
    }}
  >
    <div
      style={{
        opacity: draggingTask.status === "done" ? 0.6 : 1,
        cursor:
          draggingTask.status === "done"
            ? "not-allowed"
            : "grab",
      }}
    >
      <TaskCard
        task={draggingTask}
        onDragStart={() => {}}
        darkMode={darkMode}
      />
    </div>
  </div>
)}

 
    </div>
  );
}

export default App;