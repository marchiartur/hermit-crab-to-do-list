import { useState } from 'react';
import { trashBinOutline, refreshOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { Task, TaskStatus } from '../types';
import { IonIcon, IonInput, IonItem, IonLabel, useIonAlert, useIonToast } from '@ionic/react';
import { activateTask, completeTask, deleteTask } from '../api';
import { InputChangeEventDetail, IonInputCustomEvent } from '@ionic/core';

type TaskItemProps = {
  task: Task;
  handleUpload?: (index: number) => void;
  index: number;
  onCallbackDelete: (id: string, deleted: boolean) => void;
};

const TaskItem = ({ task, index, handleUpload, onCallbackDelete }: TaskItemProps) => {
  const [inputValue, setInputValue] = useState<any>(task.description);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  function onErrorDelete() {
    presentToast({
      message: 'There was an error trying to delete the task',
      duration: 3000,
      color: 'danger',
      position: 'top',
    });
  }

  async function onClickDeleteTask() {
    if (!task.id) return;

    try {
      deleteTask(task.id);

      onCallbackDelete(task.id, true);
    } catch (error) {
      onErrorDelete();
      onCallbackDelete(task.id, false);
    }
  }

  function onClickDeleteIcon() {
    presentAlert({
      message: 'Are you sure you want to delete this task?',
      buttons: [
        'Cancel',
        {
          text: 'Delete',
          handler: onClickDeleteTask,
        },
      ],
    });
  }

  function onChangeInputValue(event: IonInputCustomEvent<InputChangeEventDetail>) {
    setInputValue(event.detail.value);
  }

  function onClickUpload() {
    handleUpload?.(index);
  }

  const statusLabel = {
    [TaskStatus.ACTIVE]: 'Active',
    [TaskStatus.DELETED]: 'Deleted',
    [TaskStatus.COMPLETED]: 'Completed',
    [TaskStatus.NOT_UPLOADED]: 'Not uploaded',
    [TaskStatus.ERROR_TO_UPLOAD]: 'Error to upload',
  }[task.status];

  async function onClickCompletedIcon() {
    if (!task.id) return;

    try {
      await activateTask(task.id);

      presentToast({
        message: 'Task deactivated',
        duration: 3000,
        color: 'success',
        position: 'top',
      });
    } catch (error) {
      presentToast({
        message: 'There was an error trying to complete the task',
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
    }
  }

  async function onClickActiveIcon() {
    if (!task.id) return;

    try {
      await completeTask(task.id);

      presentToast({
        message: 'Task activated',
        duration: 3000,
        color: 'success',
        position: 'top',
      });
    } catch (error) {
      presentToast({
        message: 'There was an error trying to complete the task',
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
    }
  }

  return (
    <IonItem key={task.id}>
      <IonInput
        onIonChange={onChangeInputValue}
        defaultValue={task.description}
        value={inputValue}
      />

      <IonLabel>{statusLabel}</IonLabel>

      {task?.status === TaskStatus.ACTIVE && (
        <IonIcon slot="end" onClick={onClickActiveIcon} icon={checkmarkCircleOutline} />
      )}

      {task?.status === TaskStatus.COMPLETED && (
        <IonIcon
          slot="end"
          color="success"
          onClick={onClickCompletedIcon}
          icon={checkmarkCircleOutline}
        />
      )}

      {task?.status === TaskStatus.ERROR_TO_UPLOAD && (
        <IonIcon slot="end" color="warning" onClick={onClickUpload} icon={refreshOutline} />
      )}

      {!task?.deletedAt && (
        <>
          <IonIcon slot="end" color="danger" onClick={onClickDeleteIcon} icon={trashBinOutline} />
        </>
      )}
    </IonItem>
  );
};

export default TaskItem;
