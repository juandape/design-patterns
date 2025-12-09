import { Task } from '../types/task.type';
import { TaskCommandBase } from './TaskCommandBase';

export class RemoveTaskCommand extends TaskCommandBase {
  private readonly removeIndex: number;
  private removedTask: Task | null = null;

  constructor(tasks: Task[], index: number) {
    super(tasks, null);
    this.removeIndex = index;
  }

  execute(): void {
    if (this.removeIndex >= 0 && this.removeIndex < this.tasks.length) {
      this.removedTask = this.tasks[this.removeIndex];
      this.tasks.splice(this.removeIndex, 1);
    }
  }
  undo(): void {
    if (this.removedTask) {
      this.tasks.splice(this.removeIndex, 0, this.removedTask);
      this.removedTask = null;
    }
  }
}
