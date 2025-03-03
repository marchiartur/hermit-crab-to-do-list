import { apiService } from '../api/service';
import { RequestCreateTask, RequestUpdateTask, ResponseGetTasks, Task } from './types';

export function getTasks() {
  return apiService.get<ResponseGetTasks>('tasks');
}

export function createTask(task: RequestCreateTask): Promise<Task | { error: string }> {
  return apiService.post<Task>('tasks', task);
}

export function updateTask(task: RequestUpdateTask) {
  return apiService.put<Task>(`tasks/${task.id}`, task);
}

export function deleteTask(id: string) {
  return apiService.delete<void>(`tasks/${id}`);
}

export function activateTask(id: string) {
  return apiService.put<Task>(`tasks/${id}/activate`);
}

export function completeTask(id: string) {
  return apiService.put<Task>(`tasks/${id}/complete`);
}
