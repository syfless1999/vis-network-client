import React, { useCallback, useState } from 'react';
import useDataSourceList, { DataSource } from 'src/model/datasource';
import SearchAndAddBar from 'src/page/component/SearchAndAddBar';
import AddDataSourceDrawer from './AddDataSourceDrawer';
import DataSourceList from './DataSourceList';

const DataSourcePanel = () => {
  const [list] = useDataSourceList();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const changeDrawerVisible = useCallback(
    () => setDrawerVisible(!drawerVisible),
    [drawerVisible],
  );

  return (
    <div>
      <SearchAndAddBar title="Data Source List" handleClick={changeDrawerVisible} />
      <DataSourceList dataSource={list as Array<DataSource>} />
      <AddDataSourceDrawer
        visible={drawerVisible}
        handleCancel={changeDrawerVisible}
        handleSubmit={changeDrawerVisible}
      />
    </div>
  );
};

export default DataSourcePanel;
