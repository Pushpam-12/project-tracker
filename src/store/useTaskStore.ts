import { create } from "zustand";

export type Task = {
  id: string;
  title: string;
  status: "todo" | "inprogress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assignee: string;
  dueDate: string;
  startDate?: string;
};

type Store = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
};

export const useTaskStore = create<Store>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
}));