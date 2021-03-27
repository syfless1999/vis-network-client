import React from 'react';
import { Row, Col, Statistic } from 'antd';
import { TeamOutlined, NodeIndexOutlined } from '@ant-design/icons';
import { count2String } from 'src/util/string';

interface StatisticPanelProps {
  nodeNum: number;
  nodeSum: number;
  edgeNum: number;
  edgeSum: number;
}
const StatisticPanel: React.FC<StatisticPanelProps> = (props) => {
  const {
    nodeNum, nodeSum, edgeNum, edgeSum,
  } = props;
  const nodeSuffix = `/ ${count2String(nodeSum)}`;
  const edgeSuffix = `/ ${count2String(edgeSum)}`;
  return (
    <Row align="middle" justify="center">
      <Col span={12}>
        <Statistic title="Nodes" value={nodeNum} suffix={nodeSuffix} prefix={<TeamOutlined />} />
      </Col>
      <Col span={12}>
        <Statistic title="Edges" value={edgeNum} suffix={edgeSuffix} prefix={<NodeIndexOutlined />} />
      </Col>
    </Row>
  );
};

export default React.memo(StatisticPanel);
