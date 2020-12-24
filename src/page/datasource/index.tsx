import React, { useCallback, useState } from 'react';
import { io } from 'socket.io-client';
import useDataSourceList, { DataSource } from 'src/model/datasource';
import SearchAndAddBar from 'src/page/component/SearchAndAddBar';
import AddDataSourceDrawer from './AddDataSourceDrawer';
import DataSourceList from './DataSourceList';

const DataSourcePanel = () => {
  const socket = io('http://127.0.0.1:5000/');

  const [list] = useDataSourceList();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const changeDrawerVisible = useCallback(
    () => setDrawerVisible(!drawerVisible),
    [drawerVisible],
  );

  const handleClick = () => {
    socket.emit('chat message', 'hello');
    socket.on('chat message', (msg: string) => {
      console.log(msg);
    });
  };

  return (
    <div>
      <SearchAndAddBar title="Data Source List" handleClick={changeDrawerVisible} />
      <DataSourceList dataSource={list as Array<DataSource>} />
      <AddDataSourceDrawer
        visible={drawerVisible}
        handleCancel={changeDrawerVisible}
        handleSubmit={changeDrawerVisible}
      />
      <button type="button" onClick={handleClick}>socket</button>
    </div>
  );
};

export default DataSourcePanel;
