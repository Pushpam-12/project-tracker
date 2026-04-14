import { useState } from "react";
import { type Task } from "../store/useTaskStore";
import { useVirtualScroll } from "../hooks/useVirtualScroll";

type Props = {
  tasks: Task[];
  onUpdateStatus: (id: string, status: Task["status"]) => void;
};

type SortKey = "title" | "priority" | "dueDate";

function ListView({ tasks, onUpdateStatus }: Props) {
  const rowHeight = 60; // 🔥 slightly increased for labels
  const containerHeight = 600;

  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  };

  // ✅ Sort first
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortKey === "title") {
      return direction === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }

    if (sortKey === "priority") {
      const order = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1,
      };

      return direction === "asc"
        ? order[b.priority] - order[a.priority]
        : order[a.priority] - order[b.priority];
    }

    if (sortKey === "dueDate") {
      return direction === "asc"
        ? new Date(a.dueDate).getTime() -
            new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() -
            new Date(a.dueDate).getTime();
    }

    return 0;
  });

  // ✅ Virtual scroll
  const {
    startIndex,
    endIndex,
    totalHeight,
    setScrollTop,
  } = useVirtualScroll(
    sortedTasks.length,
    rowHeight,
    containerHeight
  );

  const visibleTasks = sortedTasks.slice(startIndex, endIndex);

  return (
    <div style={{ padding: "20px" }}>
      <table width="100%" border={1} cellPadding={10}>
        <thead>
          <tr>
            <th onClick={() => handleSort("title")}>Title</th>
            <th>Assignee</th>
            <th onClick={() => handleSort("priority")}>Priority</th>
            <th onClick={() => handleSort("dueDate")}>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan={5}>
              <div
                style={{
                  height: containerHeight,
                  overflowY: "auto",
                }}
                onScroll={(e) =>
                  setScrollTop(e.currentTarget.scrollTop)
                }
              >
                <div
                  style={{
                    height: totalHeight,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: startIndex * rowHeight,
                      left: 0,
                      right: 0,
                    }}
                  >
                    {visibleTasks.map((task) => {
                      // ✅ ADD THIS (per task)
                      const today = new Date().toDateString();
                      const dueDateObj = new Date(task.dueDate);

                      const isOverdue =
                        dueDateObj < new Date() &&
                        task.status !== "done";

                      const isToday =
                        dueDateObj.toDateString() === today;

                      return (
                        <div
                          key={task.id}
                          style={{
                            height: rowHeight,
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "1px solid #ddd",
                            padding: "4px 0",
                          }}
                        >
                          {/* Title */}
                          <div style={{ flex: 1 }}>
                            <div>{task.title}</div>

                            {/* ✅ LABELS */}
                            {isToday && (
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "#f59e0b",
                                }}
                              >
                                Due Today
                              </div>
                            )}

                            {isOverdue && (
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "red",
                                }}
                              >
                                Overdue
                              </div>
                            )}
                          </div>

                          {/* Assignee */}
                          <div style={{ flex: 1 }}>
                            {task.assignee}
                          </div>

                          {/* Priority */}
                          <div style={{ flex: 1 }}>
                            {task.priority}
                          </div>

                          {/* Due Date */}
                          <div style={{ flex: 1 }}>
                            {new Date(
                              task.dueDate
                            ).toLocaleDateString()}
                          </div>

                          {/* Status */}
                          <div style={{ flex: 1 }}>
                            <select
                              value={task.status}
                              onChange={(e) =>
                                onUpdateStatus(
                                  task.id,
                                  e.target.value as Task["status"]
                                )
                              }
                            >
                              <option value="todo">To Do</option>
                              <option value="inprogress">
                                In Progress
                              </option>
                              <option value="review">
                                Review
                              </option>
                              <option value="done">Done</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ListView;