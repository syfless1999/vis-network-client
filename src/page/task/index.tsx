import React, { useCallback, useState } from 'react';
import SearchAndAddBar from 'src/page/component/SearchAndAddBar';
import useList from 'src/util/hook/useList';
import { createTask, CreateTaskParams, getTaskList } from 'src/service/task';
import Task from 'src/model/task';
import AddTaskDrawer from './AddTaskDrawer';
import TaskList from './TaskList';

const DataSourcePanel = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [list] = useList(async () => {
    const { list } = await getTaskList();
    return list;
  });

  const changeDrawerVisible = useCallback(
    () => setDrawerVisible(!drawerVisible),
    [drawerVisible],
  );

  const handleAddSubmit = (params: any) => {
    console.log(params);
    // createTask(params as CreateTaskParams)
    //   .then(() => {
    //     changeDrawerVisible();
    //   });
  };

  return (
    <div>
      <SearchAndAddBar title="Task List" handleClick={changeDrawerVisible} />
      <TaskList list={list as Array<Task>} />
      <AddTaskDrawer
        visible={drawerVisible}
        handleCancel={changeDrawerVisible}
        handleSubmit={handleAddSubmit}
      />
    </div>
  );
};

export default DataSourcePanel;
