import React from 'react';

import Dataset from 'src/page/dataset';
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
    key: 'dataset',
    text: 'Dataset',
    url: '/dataset',
    component: <Dataset />,
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
