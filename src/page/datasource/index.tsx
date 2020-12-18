import React, { useMemo } from 'react';
import { Table, Tag } from 'antd';
import useDataSourceList, { DataParam, DataSource } from 'src/model/datasource';

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'scale',
    dataIndex: 'scale',
    key: 'scale',
  },
  {
    title: 'node params',
    dataIndex: 'param',
    key: 'nodeParams',
    render: (params: DataParam) => (
      <>
        {params.node && params.node.map((p) => <Tag key={p}>{p}</Tag>)}
      </>
    ),
  },
  {
    title: 'edge params',
    dataIndex: 'param',
    key: 'edgeParams',
    render: (params: DataParam) => (
      <>
        {params.edge && params.edge.map((p) => <Tag key={p}>{p}</Tag>)}
      </>
    ),
  },
];

const DataSourcePanel = () => {
  const [list] = useDataSourceList();
  return (
    <div>
      <Table columns={columns} dataSource={list as Array<DataSource>} />
    </div>
  );
};

export default DataSourcePanel;
