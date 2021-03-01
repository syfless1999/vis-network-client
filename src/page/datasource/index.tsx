import React, { useCallback, useState } from 'react';
import useDataSourceList from 'src/util/hook/useDataSourceList';
import SearchAndAddBar from 'src/page/component/SearchAndAddBar';
import { createDataSource, getDataSourceList } from 'src/service/datasource';
import AddDataSourceDrawer, { AddDataSourceParam } from './AddDataSourceDrawer';
import DataSourceList from './DataSourceList';

const DataSourcePanel = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [list, setList] = useDataSourceList();

  const changeDrawerVisible = useCallback(
    () => setDrawerVisible(!drawerVisible),
    [drawerVisible],
  );

  const handleAddSubmit = (values: AddDataSourceParam) => {
    const params = {
      ...values,
      expandSource: {
        url: values.expandSourceUrl,
        updateCycle: values.updateCycle,
      },
    };
    createDataSource(params)
      .then(async () => {
        changeDrawerVisible();
        const dsList = await getDataSourceList();
        setList(dsList);
      });
  };

  return (
    <div>
      <SearchAndAddBar title="Data Source List" handleClick={changeDrawerVisible} />
      <DataSourceList dataSource={list} />
      <AddDataSourceDrawer
        visible={drawerVisible}
        handleCancel={changeDrawerVisible}
        handleSubmit={handleAddSubmit}
      />
    </div>
  );
};

export default DataSourcePanel;
