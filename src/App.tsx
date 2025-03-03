import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import { createServer, Registry } from 'miragejs';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { TaskStatus, ModelTask } from './domains/tasks/types';
import Schema from 'miragejs/orm/schema';

setupIonicReact();

type AppRegistry = Registry<{ task: typeof ModelTask }, {}>;
type AppSchema = Schema<AppRegistry>;

createServer({
  models: {
    task: ModelTask,
  },
  routes() {
    this.namespace = 'api';

    this.get('/tasks', (schema: AppSchema, request) => {
      return schema.all('task');
    });

    this.get('/tasks/:id', (schema: AppSchema, request) => {
      let id = request.params.id;

      return schema.find('task', id);
    });

    this.post('/tasks', (schema: AppSchema, request) => {
      const body = JSON.parse(request.requestBody);

      console.log('bod', body);

      if (body?.description?.length > 0) {
        const created = schema.create('task', {
          modelName: 'task',
          description: body.description,
          status: TaskStatus.ACTIVE,
          createdAt: new Date(),
        });

        console.log('ccc', created);

        return created;
      } else {
        console.log('else');

        return { error: 'Description is required' };
      }
    });

    this.delete('/tasks/:id', (schema: AppSchema, request) => {
      let id = request.params.id;

      const task = schema.find('task', id);

      if (task) {
        task.update({
          status: TaskStatus.DELETED,
          deletedAt: new Date(),
        });

        return task;
      }

      return { error: 'Task not found' };
    });

    this.put('/tasks/:id', (schema: AppSchema, request) => {
      let id = request.params.id;
      const body = JSON.parse(request.requestBody);

      const task = schema.find('task', id);

      if (task) {
        task.update({
          description: body.description,
        });

        return task;
      }

      return { error: 'Task not found' };
    });

    this.put('/tasks/:id/complete', (schema: AppSchema, request) => {
      let id = request.params.id;

      const task = schema.find('task', id);

      if (task) {
        task.update({
          status: TaskStatus.COMPLETED,
        });

        return task;
      }

      return { error: 'Task not found' };
    });

    this.put('/tasks/:id/activate', (schema: AppSchema, request) => {
      let id = request.params.id;

      const task = schema.find('task', id);

      if (task) {
        task.update({
          status: TaskStatus.ACTIVE,
        });

        return task;
      }

      return { error: 'Task not found' };
    });
  },
  seeds(server) {
    server.create('task', {
      modelName: 'task',
      description: 'Clean house',
      status: TaskStatus.ACTIVE,
      createdAt: new Date(),
    });
    server.create('task', {
      modelName: 'task',
      description: 'Do the math homework',
      status: TaskStatus.COMPLETED,
      createdAt: new Date(),
    });
    server.create('task', {
      modelName: 'task',
      description: 'Take out the trash',
      status: TaskStatus.DELETED,
      createdAt: new Date(),
      deletedAt: new Date(),
    });
  },
});

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/" exact={true}>
          <Redirect to="/home" />
        </Route>

        <Route path="/home" exact={true}>
          <Home />
        </Route>

        <Route path="/task/:id"></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
