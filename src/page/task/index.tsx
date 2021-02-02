import React, { useCallback, useState } from 'react';
import SearchAndAddBar from 'src/page/component/SearchAndAddBar';
import useList from 'src/util/hook/useList';
import { createTask, CreateTaskParams, getTaskList } from 'src/service/task';
import Task from 'src/model/task';
import AddTaskDrawer from './AddTaskDrawer';
import TaskList from './TaskList';

const DataSourcePanel = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [list, , forceUpdate] = useList<Task>(async () => {
    const data = await getTaskList();
    data.forEach((task: any) => {
      // eslint-disable-next-line no-param-reassign
      task.dataSourceName = task.dataSource[0].name;
    });
    return data;
  });

  const changeDrawerVisible = useCallback(
    () => setDrawerVisible(!drawerVisible),
    [drawerVisible],
  );

  const handleAddSubmit = (values: any) => {
    const params: any = {};
    params.paramWeight = [];

    Object.keys(values).forEach((key) => {
      if (key.startsWith('param,')) {
        const paramName = key.split(',')[1];
        params.paramWeight.push([paramName, values[key]]);
      } else if (key !== 'paramWeight') {
        params[key] = values[key];
      }
    });
    createTask(params as unknown as CreateTaskParams)
      .then(() => {
        changeDrawerVisible();
        forceUpdate();
      });
  };

  return (
    <div>
      <SearchAndAddBar title="Task List" handleClick={changeDrawerVisible} />
      <TaskList list={list} />
      <AddTaskDrawer
        visible={drawerVisible}
        handleCancel={changeDrawerVisible}
        handleSubmit={handleAddSubmit}
      />
    </div>
  );
};

export default DataSourcePanel;
