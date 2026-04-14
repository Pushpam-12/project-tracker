import { type Task } from "../store/useTaskStore";

export const generateTasks = (): Task[] => {
  const statuses = ["todo", "inprogress", "review", "done"] as const;
  const priorities = ["low", "medium", "high", "critical"] as const;
  const assignees = ["A", "B", "C", "D", "E"];

  return Array.from({ length: 100 }).map((_, i) => {
    const today = new Date();

    // random start date (last 7 days)
    const startDate = new Date( 
      today.getTime() - Math.random() * 7 * 86400000
    );

    // random due date (after start)
    const dueDate = new Date(
      startDate.getTime() + Math.random() * 7 * 86400000
    );

    return {
      id: `task-${i}`,
      title: `Task ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assignee:
        assignees[Math.floor(Math.random() * assignees.length)],

      // ✅ important for timeline view
      startDate: startDate.toISOString(),
      dueDate: dueDate.toISOString(),
    };
  });
};