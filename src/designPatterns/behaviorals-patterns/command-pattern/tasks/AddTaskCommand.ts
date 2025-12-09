import { Task } from '../types/task.type';
import { TaskCommandBase } from './TaskCommandBase';

export class AddTaskCommand extends TaskCommandBase {
  constructor(tasks: Task[], task: Task) {
    super(tasks, task);
  }

  execute(): void {
    if(this.task) {
      this.tasks.push(this.task);
    }
  }

  undo(): void {
    this.tasks.pop();
  }
}
