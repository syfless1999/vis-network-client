import request from 'src/util/Request';
import Task from 'src/model/task';

export function createTask(params: Task) {
  return request('/task', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export function getTaskList() {
  return request('/task');
}
