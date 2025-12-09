'use client';

import { useState } from 'react';
import { TaskCommandBase } from '../tasks/TaskCommandBase';
import { AddTaskCommand } from '../tasks/AddTaskCommand';
import { RemoveTaskCommand } from '../tasks/RemoveTaskCommand';
import { Task } from '../types/task.type';

export const useTaskManager = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [undoStack, setUndoStack] = useState<TaskCommandBase[]>([]);
  const [redoStack, setRedoStack] = useState<TaskCommandBase[]>([]);

  const addTask = () => {
    const taskText = prompt('Enter a new task:');
    if (taskText) {
      const newTask = { id: Date.now(), text: taskText };
      const newList = [...taskList];
      const command = new AddTaskCommand(newList, newTask);
      command.execute();
      setTaskList(newList);
      setUndoStack([...undoStack, command]);
      setRedoStack([]);
    }
  };

  const removeTask = () => {
    const taskNumber = Number(prompt('Enter the number of the task to remove:'));
    if (!Number.isNaN(taskNumber) && taskNumber >= 1 && taskNumber <= taskList.length) {
      const index = taskNumber - 1;
      const newList = [...taskList];
      const command = new RemoveTaskCommand(newList, index);
      command.execute();
      setTaskList(newList);
      setUndoStack([...undoStack, command]);
      setRedoStack([]);
    }
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const newUndoStack = [...undoStack];
    const lastCommand = newUndoStack.pop();
    if (lastCommand) {
      lastCommand.undo();
      setTaskList([...lastCommand['tasks']]);
      setUndoStack(newUndoStack);
      setRedoStack([...redoStack, lastCommand]);
    }
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const newRedoStack = [...redoStack];
    const lastCommand = newRedoStack.pop();
    if (lastCommand) {
      lastCommand.execute();
      setTaskList([...lastCommand['tasks']]);
      setUndoStack([...undoStack, lastCommand]);
      setRedoStack(newRedoStack);
    }
  };

  return {
    addTask,
    removeTask,
    undo,
    redo,
    taskList
  };
};
