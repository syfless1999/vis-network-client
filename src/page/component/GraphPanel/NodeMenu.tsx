import React from 'react';
import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';

import { isHeadCluster } from 'src/util/network';
import { Community, DisplayNetwork } from 'src/type/network';

interface NodeMenuProps {
  displayData: DisplayNetwork
}

const { Menu } = ContextMenu;

const CustomMenu = (props: NodeMenuProps) => {
  // props
  const { displayData } = props;
  const graphin = React.useContext(GraphinContext);
  const { contextmenu } = graphin;
  const model: Community = contextmenu.node.item.getModel();

  const isCluster = isHeadCluster(model);

  const handleExpand = () => {
    // TODO
    console.log('expand');
  };
  const handleShrink = () => {
    // TODO
    console.log('shrink');
  };

  if (isCluster) {
    return (
      <Menu bindType="node">
        <Menu.Item onClick={handleExpand}>Expand</Menu.Item>
        <Menu.Item>Hide</Menu.Item>
      </Menu>
    );
  }
  return (
    <Menu bindType="node">
      <Menu.Item onClick={handleShrink}>ShrinkCluster</Menu.Item>
      <Menu.Item>Hide</Menu.Item>
    </Menu>
  );
};

export default CustomMenu;
