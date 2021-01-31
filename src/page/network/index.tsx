import React from 'react';
import { Card } from 'antd';
import GraphPanel from 'src/page/component/GraphPanel';

export default function index() {
  return (
    <div>
      <Card title="Hierarchical Clustering Network">
        <GraphPanel />
      </Card>
    </div>
  );
}
