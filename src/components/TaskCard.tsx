import { type Task } from "../store/useTaskStore";

type Props = {
  task: Task;
  onDragStart: (task: Task) => void;
  darkMode?: boolean;
};

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "low":
      return "#22c55e";
    case "medium":
      return "#f59e0b";
    case "high":
      return "#ef4444";
    case "critical":
      return "#a855f7";
    default:
      return "#6b7280";
  }
};

function TaskCard({ task, onDragStart, darkMode }: Props) {
  const theme = darkMode
    ? {
        bg: "#1f2937",
        text: "#f9fafb",
        subText: "#9ca3af",
      }
    : {
        bg: "#ffffff",
        text: "#111827",
        subText: "#6b7280",
      };

  return (
    <div
      onPointerDown={(e) => {
        e.preventDefault();
        onDragStart(task);
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      style={{
        width: "100%",              // ✅ full column width
        maxWidth: "100%",           // ✅ prevent overflow
        boxSizing: "border-box",    // ✅ include padding
        padding: "12px",
        marginBottom: "10px",
        background: theme.bg,
        color: theme.text,
        borderRadius: "12px",
        cursor: "grab",
        userSelect: "none",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease",
        overflow: "hidden",         // ✅ prevent spill
      }}
    >
      {/* Title */}
      <div
        style={{
          fontWeight: 600,
          fontSize: "14px",
          wordBreak: "break-word",     // ✅ wrap long text
          overflowWrap: "anywhere",    // ✅ extra safety
        }}
      >
        {task.title}
      </div>

      {/* Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
          gap: "8px",
          flexWrap: "wrap", // ✅ prevents overflow
        }}
      >
        {/* Assignee */}
        <div
          style={{
            minWidth: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#e5e7eb",
            color: "#111",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            flexShrink: 0, // ✅ prevent shrinking weirdly
          }}
        >
          {task.assignee}
        </div>

        {/* Priority */}
        <span
          style={{
            background: getPriorityColor(task.priority),
            color: "white",
            padding: "4px 8px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 500,
            whiteSpace: "nowrap", // ✅ prevent breaking
          }}
        >
          {task.priority}
        </span>
      </div>

      {/* Due Date */}
      <div
        style={{
          marginTop: "10px",
          fontSize: "12px",
          color: theme.subText,
          wordBreak: "break-word",
        }}
      >
        📅 {new Date(task.dueDate).toLocaleDateString()}
      </div>
    </div>
  );
}

export default TaskCard;