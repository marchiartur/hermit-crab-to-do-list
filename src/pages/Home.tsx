import { useCallback, useState } from 'react';
import {
  InputChangeEventDetail,
  IonContent,
  IonHeader,
  IonInput,
  IonList,
  IonListHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
  useIonViewWillEnter,
} from '@ionic/react';
import './Home.css';
import { createTask, getTasks } from '../domains/tasks/api';
import { Task, TaskStatus } from '../domains/tasks/types';
import List from '../components/List';
import TaskItem from '../domains/tasks/components/TaskItem';
import { IonInputCustomEvent } from '@ionic/core';

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [presentToast] = useIonToast();

  const [inputNewTask, setInputNewTask] = useState<any>('');

  const [presentLoading, dismissLoading] = useIonLoading();

  async function request() {
    try {
      presentLoading();

      const data = await getTasks();

      setTasks(data.tasks);
    } catch (error) {
      presentToast({
        message: 'Error fetching tasks',
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
    } finally {
      dismissLoading();
    }
  }

  useIonViewWillEnter(() => {
    request();
  });

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  function presentToastErrorCreateTask() {
    presentToast({
      message: 'Error creating task',
      duration: 3000,
      color: 'danger',
      position: 'top',
    });
  }

  async function routineUploadTask(description: string): Promise<Task | undefined> {
    try {
      const response = await createTask({
        description,
      });

      if (response?.error?.length > 0) {
        throw new Error(response.error);
      }

      return response;
    } catch (error) {
      presentToastErrorCreateTask();

      return undefined;
    }
  }

  async function uploadFromIndex(index: number) {
    const task = tasks[index];

    if (task.status === TaskStatus.NOT_UPLOADED) {
      const newTask = await routineUploadTask(task.description);

      if (newTask) {
        const formattedTasks = [...tasks];
        formattedTasks[index] = newTask;
        setTasks(formattedTasks);
      } else {
        presentToastErrorCreateTask();
      }
    }
  }

  const uploadFromInput = useCallback(
    async (inputValue?: string) => {
      let formattedTasks = [...tasks];

      const newTask: Task = {
        description: inputValue ?? inputNewTask,
        status: TaskStatus.NOT_UPLOADED,
      };

      formattedTasks.push(newTask);
      setTasks(formattedTasks);
      setInputNewTask('');

      const uploadedTask = await routineUploadTask(newTask?.description);

      if (uploadedTask) {
        formattedTasks.pop();
        formattedTasks.push(uploadedTask);
      } else {
        formattedTasks.pop();

        formattedTasks.push({
          ...newTask,
          status: TaskStatus.NOT_UPLOADED,
        });

        setTasks(formattedTasks);
      }
    },
    [inputNewTask, tasks],
  );

  function onCallbackDelete(id: string, deleted: boolean) {
    if (deleted) {
      const filteredTasks = tasks.filter((task) => task.id !== id);
      setTasks(filteredTasks);
    }
  }

  function renderTask(task: Task, index: number) {
    return (
      <TaskItem
        task={task}
        key={index}
        index={index}
        handleUpload={uploadFromIndex}
        onCallbackDelete={onCallbackDelete}
      />
    );
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLIonInputElement>) {
    const value = event.currentTarget.value as string;

    if (event.key === 'Enter' && value?.length > 0) {
      uploadFromInput(value);
    }
  }

  function onChangeInputNewTask(event: IonInputCustomEvent<InputChangeEventDetail>) {
    setInputNewTask(event.detail.value);
  }

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <IonListHeader>
            <IonInput
              placeholder="Add new task..."
              value={inputNewTask}
              onIonChange={onChangeInputNewTask}
              onKeyDown={onKeyDown}
              style={{
                marginTop: '8px',
                marginBottom: '16px',
                width: '100%',
                marginRight: '8px',
              }}
            />
          </IonListHeader>

          <List data={tasks} renderItem={renderTask} />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
