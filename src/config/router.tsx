import React from 'react';

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
    component: (<h1>dataset</h1>),
  },
  {
    key: 'task',
    text: 'Task',
    url: '/task',
    component: (<h1>task</h1>),
  },
  {
    key: 'network',
    text: 'Network',
    url: '/network',
    component: (<h1>network</h1>),
  },
];

export default routers;
