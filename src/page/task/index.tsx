import React, { useCallback, useState } from 'react';
import SearchAndAddBar from 'src/page/component/SearchAndAddBar';
import useList from 'src/util/hook/useList';
import { createTask, CreateTaskParams, getTaskList } from 'src/service/task';
import Task, { TaskClusterType } from 'src/model/task';
import AddTaskDrawer, { AddTaskParams } from './AddTaskDrawer';
import TaskList from './TaskList';

const DataSourcePanel = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [list, , forceUpdate] = useList<Task>(async () => {
    const data = await getTaskList();
    data.forEach((task: Task) => {
      // eslint-disable-next-line no-param-reassign
      task.dataSourceName = task.dataSource[0].name;
    });
    return data;
  });

  const changeDrawerVisible = useCallback(
    () => setDrawerVisible(!drawerVisible),
    [drawerVisible],
  );

  const handleAddSubmit = (values: AddTaskParams) => {
    const params: CreateTaskParams = {
      dataSourceId: values.dataSourceId,
      clusterType: values.clusterType,
      updateCycle: values.updateCycle,
      needCustomizeSimilarityApi: values.needCustomizeSimilarityApi,
    };
    if (params.similarityApi) {
      params.similarityApi = values.similarityApi;
    }
    if (params.clusterType === TaskClusterType.PARAM_AND_TOPOLOGY) {
      params.topologyWeight = values.topologyWeight;
    }
    if (params.clusterType !== TaskClusterType.TOPOLOGY_ONLY) {
      Object.keys(values).forEach((key) => {
        if (key.startsWith('param,')) {
          if (!params.paramWeight) params.paramWeight = [];
          const paramName = key.split(',')[1];
          params.paramWeight.push([paramName, (values[key] as number)]);
        }
      });
    }
    createTask(params)
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
