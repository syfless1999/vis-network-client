import React, { useMemo } from 'react';
import { Table, Tag } from 'antd';
import useDataSourceList, { DataParam, DataSource } from 'src/model/datasource';
import { getRandomColor } from 'src/util/color';

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
        {params.node && params.node.map(
          (p) => (
            <Tag key={p} color={getRandomColor()}>{p}</Tag>
          ),
        )}
      </>
    ),
  },
  {
    title: 'edge params',
    dataIndex: 'param',
    key: 'edgeParams',
    render: (params: DataParam) => (
      <>
        {params.edge && params.edge.map(
          (p) => (
            <Tag key={p} color={getRandomColor()}>{p}</Tag>
          ),
        )}
      </>
    ),
  },
];

const DataSourcePanel = () => {
  const [list] = useDataSourceList();
  Array.from({ length: 20 }).forEach(() => {
    console.log(getRandomColor());
  });
  return (
    <div>
      <Table columns={columns} dataSource={list as Array<DataSource>} />
    </div>
  );
};

export default DataSourcePanel;
