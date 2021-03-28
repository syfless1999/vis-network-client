import React from 'react';
import { List, Typography } from 'antd';
import { Node } from 'src/type/network';
import { isCluster } from 'src/util/network';
import { strings2FeatureArray } from 'src/util/string';

const NodeInfo = (props: { node: Node, feats: string[] }) => {
  const { node, feats } = props;
  let data: [string, string][] = [];
  if (isCluster(node)) {
    data = strings2FeatureArray(node.features || '');
  } else {
    feats.forEach((f) => {
      const d = node[f];
      if (d) {
        data.push([f, `${d}`]);
      }
    });
  }
  return (
    <List
      header={<div>Node Info</div>}
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Typography.Text mark>{item[0]}</Typography.Text>
          {' '}
          {item[1]}
        </List.Item>
      )}
    />
  );
};

export default React.memo(NodeInfo);
