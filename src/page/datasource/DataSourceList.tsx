import React from 'react';
import {
  Table, Tag, Badge, Progress, Switch,
} from 'antd';
import styled from 'styled-components';
import { DataSource, EdgeFeature, NodeFeature } from 'src/model/datasource';
import { getRandomColor } from 'src/util/color';
import { numberSimplify } from 'src/util/number';

const SBadge = styled(Badge)`
  margin-right: 10px;
`;
const ImportProgress = (props: { progress: number }) => {
  const { progress } = props;
  const status = progress < 100 ? 'active' : 'success';
  return <Progress percent={progress} size="small" status={status} />;
};

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'api url',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'node count / param',
    dataIndex: 'node',
    key: 'node',
    render: (nodeFeature: NodeFeature) => (
      <>
        <SBadge overflowCount={999} count={numberSimplify(nodeFeature.count)} />
        {nodeFeature.param && nodeFeature.param.map(
          (p) => (
            <Tag key={p} color={getRandomColor()}>{p}</Tag>
          ),
        )}
      </>
    ),
  },
  {
    title: 'edge count / param',
    dataIndex: 'edge',
    key: 'edge',
    render: (edgeFeature: EdgeFeature) => (
      <>
        <SBadge overflowCount={999} count={numberSimplify(edgeFeature.count)} />
        {edgeFeature.param && edgeFeature.param.map(
          (p) => (
            <Tag key={p} color={getRandomColor()}>{p}</Tag>
          ),
        )}
      </>
    ),
  },
  {
    title: 'import progress',
    dataIndex: 'progress',
    key: 'progress',
    render: (progress: number) => <ImportProgress progress={progress} />,
  },
  {
    title: 'auto expand',
    dataIndex: 'needExpand',
    key: 'expand',
    render: (needExpand: boolean) => <Switch size="small" defaultChecked={needExpand} />,
  },
];
function DataSourceList(props: { dataSource: Array<DataSource> }) {
  const { dataSource } = props;
  return (
    <Table rowKey="id" columns={columns} dataSource={dataSource} />
  );
}

export default DataSourceList;
