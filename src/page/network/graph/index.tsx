import React from 'react';
import Graphin, { Utils } from '@antv/graphin';

import '@antv/graphin/dist/index.css';
import '@antv/graphin-components/dist/index.css'; // Graphin 组件 CSS

const index = () => {
  const data = Utils.mock(13)
    .circle()
    .graphin();

  return (
    <Graphin data={data} />
  );
};

export default index;
