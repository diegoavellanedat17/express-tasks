export interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: Date;
  completed?: boolean;
  user_id: number;
}
