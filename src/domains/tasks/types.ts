import { Model } from 'miragejs';
import { ModelDefinition } from 'miragejs/-types';

export type Task = {
  id?: string;
  description: string;
  status: TaskStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export const ModelTask: ModelDefinition<Task> = Model.extend({});

export enum TaskStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
  COMPLETED = 'completed',
  NOT_UPLOADED = 'not_uploaded',
  ERROR_TO_UPLOAD = 'error_to_upload',
}

export type RequestCreateTask = {
  description: string;
};

export type RequestUpdateTask = {
  id: string;
  description: string;
  status: TaskStatus;
};

export type ResponseGetTasks = {
  tasks: Task[];
};
