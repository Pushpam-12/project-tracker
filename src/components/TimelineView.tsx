import { type Task } from "../store/useTaskStore";

type Props = {
  tasks: Task[];
  darkMode?: boolean;
};

const DAY_WIDTH = 40;

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "low":
      return "#22c55e";
    case "medium":
      return "#f59e0b";
    case "high":
      return "#ef4444";
    case "critical":
      return "#8b5cf6";
    default:
      return "#3b82f6";
  }
};

function TimelineView({ tasks, darkMode }: Props) {
  const today = new Date();

  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const theme = darkMode
    ? {
        page: "#111827",
        header: "#1f2937",
        border: "#374151",
        text: "#f9fafb",
        today: "#f87171",
      }
    : {
        page: "#ffffff",
        header: "#fafafa",
        border: "#e5e7eb",
        text: "#111827",
        today: "#ef4444",
      };

  return (
   <div
  style={{
    overflowX: "auto",
    overflowY: "auto", // ✅ ADD THIS
    padding: "20px",
    background: theme.page,
    color: theme.text,
    height: "100%", // ✅ FIXED
  }}
>
      {/* ✅ MONTH LABEL */}
<h3
  style={{
    marginBottom: "10px",
    position: "sticky",   // ✅ make sticky
    top: 0,               // ✅ top layer
    background: theme.page,
    zIndex: 20,           // ✅ above everything
    padding: "5px 0",
  }}
>        {today.toLocaleString("default", { month: "long", year: "numeric" })}
      </h3>

      <div style={{ position: "relative" }}>
        {/* HEADER */}
        <div
  style={{
    display: "flex",
    fontWeight: "bold",
    background: theme.header,
    borderBottom: `1px solid ${theme.border}`,

    position: "sticky", // ✅ KEY FIX
    top: 30,              // ✅ stick to top
    zIndex: 10,          // ✅ stay above tasks
  }}
>
          {Array.from({ length: daysInMonth }).map((_, i) => (
            <div
              key={i}
              style={{
                width: DAY_WIDTH,
                textAlign: "center",
                borderRight: `1px solid ${theme.border}`,
                padding: "4px 0",
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* ✅ IMPROVED TODAY LINE */}
        <div
          style={{
            position: "absolute",
            left: (today.getDate() - 1) * DAY_WIDTH,
            top: 0,
            bottom: 0,
            width: "2px",
            background: theme.today,
            boxShadow: "0 0 6px red",
            zIndex: 5,
          }}
        />

        {/* TASKS */}
        {tasks.map((task) => {
          const start = new Date(task.startDate || task.dueDate);
          const end = new Date(task.dueDate);

          const startDay = start.getDate();
          const endDay = end.getDate();

          const left = (startDay - 1) * DAY_WIDTH;
          const width =
            Math.max(endDay - startDay + 1, 1) * DAY_WIDTH;

          // ✅ OVERDUE LOGIC
          const isOverdue =
            end < new Date() && task.status !== "done";

          return (
            <div
              key={task.id}
              style={{
                position: "relative",
                height: "40px",
                marginTop: "10px",
              }}
            >
              <div
                title={`${task.title} (${task.assignee})`} // ✅ TOOLTIP
                style={{
                  position: "absolute",
                  left,
                  width,
                  height: "30px",
                  background: getPriorityColor(task.priority),
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "6px",
                  color: "white",
                  fontSize: "12px",
                  overflow: "hidden",

                  // ✅ OVERDUE HIGHLIGHT
                  border: isOverdue ? "2px solid red" : "none",

                  boxShadow: darkMode
                    ? "0 2px 6px rgba(0,0,0,0.5)"
                    : "0 2px 4px rgba(0,0,0,0.15)",
                }}
              >
                {task.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimelineView;