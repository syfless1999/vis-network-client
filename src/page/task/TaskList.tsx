import React from 'react';
import { Table, Statistic } from 'antd';
import Task from 'src/model/task';

const { Column } = Table;

function DataSourceList(props: { list: Array<Task> }) {
  const { list } = props;
  return (
    <Table rowKey="_id" dataSource={list}>
      <Column title="datasource id" dataIndex="dataSourceId" key="dataSourceId" />
      <Column title="cluster type" dataIndex="clusterType" key="clusterType" />
      <Column
        title="progress"
        dataIndex="progress"
        key="progress"
        render={(progress: number) => (
          <Statistic
            title="Active"
            value={progress || 11.28}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            suffix="%"
          />
        )}
      />
    </Table>
  );
}

export default DataSourceList;
