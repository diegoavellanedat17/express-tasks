export interface Task {
  id?: number;
  title: string;
  description: string;
  due_date?: string;
  completed?: boolean;
  user_id: number;
}
