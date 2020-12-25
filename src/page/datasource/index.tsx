import React, { useCallback, useState } from 'react';
import { io } from 'socket.io-client';
import useDataSourceList, { DataSource } from 'src/model/datasource';
import SearchAndAddBar from 'src/page/component/SearchAndAddBar';
import { createDataSource, CreateDataSourceParams } from 'src/service/datasource';
import AddDataSourceDrawer from './AddDataSourceDrawer';
import DataSourceList from './DataSourceList';

const DataSourcePanel = () => {
  const socket = io('http://127.0.0.1:5000/');
  const handleClick = () => {
    socket.emit('chat message', 'hello');
    socket.on('chat message', (msg: string) => {
      console.log(msg);
    });
  };

  const [list] = useDataSourceList();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
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
      .then((data) => {
        console.log(data);
        changeDrawerVisible();
      });
  };

  return (
    <div>
      <SearchAndAddBar title="Data Source List" handleClick={changeDrawerVisible} />
      <DataSourceList dataSource={list as Array<DataSource>} />
      <AddDataSourceDrawer
        visible={drawerVisible}
        handleCancel={changeDrawerVisible}
        handleSubmit={handleAddSubmit}
      />
      <button type="button" onClick={handleClick}>click</button>
    </div>
  );
};

export default DataSourcePanel;
