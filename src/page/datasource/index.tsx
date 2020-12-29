import React, { useCallback, useState } from 'react';
import useDataSourceList, { DataSource } from 'src/model/datasource';
import SearchAndAddBar from 'src/page/component/SearchAndAddBar';
import { createDataSource, CreateDataSourceParams } from 'src/service/datasource';
import AddDataSourceDrawer from './AddDataSourceDrawer';
import DataSourceList from './DataSourceList';

const DataSourcePanel = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [list] = useDataSourceList();

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
      <SearchAndAddBar title="Data Source List" handleClick={changeDrawerVisible} />
      <DataSourceList dataSource={list as Array<DataSource>} />
      <AddDataSourceDrawer
        visible={drawerVisible}
        handleCancel={changeDrawerVisible}
        handleSubmit={handleAddSubmit}
      />
    </div>
  );
};

export default DataSourcePanel;
