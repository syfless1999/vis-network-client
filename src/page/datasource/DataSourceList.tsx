import React from 'react';
import {
  Table, Tag, Badge, Progress, Switch,
} from 'antd';
import styled from 'styled-components';
import DataSource, { EdgeFeature, NodeFeature } from 'src/model/datasource';
import { getRandomColor } from 'src/util/color/dataSourceColor';
import { numberSimplify } from 'src/util/number';

const { Column } = Table;
const SBadge = styled(Badge)`
  margin-right: 10px;
`;
const ImportProgress = (props: { progress: number }) => {
  const { progress } = props;
  const status = progress < 100 ? 'active' : 'success';
  return <Progress percent={progress} size="small" status={status} />;
};

function DataSourceList(props: { dataSource: Array<DataSource> }) {
  const { dataSource } = props;
  return (
    <Table rowKey="_id" dataSource={dataSource}>
      <Column title="name" dataIndex="name" key="name" />
      <Column title="api url" dataIndex="url" key="url" />
      <Column
        key="node"
        dataIndex="node"
        title="node count / param"
        render={(nodeFeature: NodeFeature) => (
          <>
            <SBadge overflowCount={999} count={numberSimplify(nodeFeature.current)} />
            {nodeFeature.param && nodeFeature.param.map(
              (p) => (
                <Tag key={p} color={getRandomColor()}>{p}</Tag>
              ),
            )}
          </>
        )}
      />
      <Column
        key="edge"
        dataIndex="edge"
        title="edge count / param"
        render={(edgeFeature: EdgeFeature) => (
          <>
            <SBadge overflowCount={999} count={numberSimplify(edgeFeature.current)} />
            {edgeFeature.param && edgeFeature.param.map(
              (p) => (
                <Tag key={p} color={getRandomColor()}>{p}</Tag>
              ),
            )}
          </>
        )}
      />
      <Column
        title="import progress"
        dataIndex="progress"
        key="progress"
        render={(progress: number) => <ImportProgress progress={progress} />}
      />
      <Column
        title="auto expand"
        dataIndex="needExpand"
        key="expand"
        render={(needExpand: boolean) => <Switch size="small" defaultChecked={needExpand} />}
      />
    </Table>
  );
}

export default DataSourceList;
