import React from 'react';
import { Table, Statistic, Typography } from 'antd';
import Task from 'src/model/task';

const { Title } = Typography;
const { Column } = Table;

function DataSourceList(props: { list: Array<Task> }) {
  const { list } = props;
  return (
    <Table rowKey="_id" dataSource={list}>
      <Column
        title="datasource"
        dataIndex="dataSourceName"
        key="dataSource"
        render={(value) => <Title level={4}>{value}</Title>}
      />
      <Column
        title="cluster type"
        dataIndex="clusterType"
        key="clusterType"
      />
      <Column
        title="progress"
        dataIndex="progress"
        key="progress"
        render={(progress: number) => (
          <Statistic
            title={progress < 100 ? 'Active' : 'Finished'}
            value={progress}
            precision={1}
            valueStyle={{ color: progress < 100 ? '#cf1322' : '#3f8600' }}
            suffix="%"
          />
        )}
      />
    </Table>
  );
}

export default DataSourceList;
