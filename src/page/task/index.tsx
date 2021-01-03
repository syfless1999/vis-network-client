import React, { useCallback, useState } from 'react';
import DataSource from 'src/model/datasource';
import useDataSourceList from 'src/util/hook/useDataSourceList';
import SearchAndAddBar from 'src/page/component/SearchAndAddBar';
import { createDataSource, CreateDataSourceParams } from 'src/service/datasource';
import useList from 'src/util/hook/useList';
import request from 'src/util/Request';
import { getTaskList } from 'src/service/task';
import AddTaskDrawer from './AddTaskDrawer';
import TaskList from './TaskList';

const DataSourcePanel = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [list] = useList(async () => {
    const list = await getTaskList();
    return list;
  });

  const changeDrawerVisible = useCallback(
    () => setDrawerVisible(!drawerVisible),
    [drawerVisible],
  );

  const handleAddSubmit = (values: any) => {
    const params = {
      ...values,
      expandSource: {
        url: values.expandSourceUrl,
        updateCycle: values.updateCycle,
      },
    };
    createDataSource(params as CreateDataSourceParams)
      .then(() => {
        changeDrawerVisible();
      });
  };

  return (
    <div>
      <SearchAndAddBar title="Task List" handleClick={changeDrawerVisible} />
      <TaskList dataSource={list as Array<DataSource>} />
      <AddTaskDrawer
        visible={drawerVisible}
        handleCancel={changeDrawerVisible}
        handleSubmit={handleAddSubmit}
      />
    </div>
  );
};

export default DataSourcePanel;
