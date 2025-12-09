import { ICommand } from '../types/command.type';
import { Task } from '../types/task.type';

export abstract class TaskCommandBase implements ICommand {
  protected readonly tasks: Task[];
  protected readonly task: Task | null;

  constructor(tasks: Task[], task: Task | null = null) {
    this.tasks = tasks;
    this.task = task;
  }

  abstract execute(): void;
  abstract undo(): void;
}
