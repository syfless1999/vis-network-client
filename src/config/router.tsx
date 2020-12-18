import React from 'react';

import DataSource from 'src/page/datasource';
import Task from 'src/page/task';
import Network from 'src/page/network';

export interface Router {
  key: string;
  text: string;
  url: string;
  component: JSX.Element;
}

const routers: Array<Router> = [
  {
    key: 'datasource',
    text: 'DataSource',
    url: '/datasource',
    component: <DataSource />,
  },
  {
    key: 'task',
    text: 'Task',
    url: '/task',
    component: <Task />,
  },
  {
    key: 'network',
    text: 'Network',
    url: '/network',
    component: <Network />,
  },
];

export default routers;
