import React from 'react';
import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import {
  communityStyleWrapper, edgeStyleWrapper, getNetworkMap, isHeadCluster,
} from 'src/util/network';
import {
  Community, DisplayNetwork, HeadCluster, Node, LayerNetwork, Edge,
} from 'src/type/network';
import { deleteItemWithoutOrder } from 'src/util/array';

interface NodeMenuProps {
  displayData: DisplayNetwork;
  sourceData: LayerNetwork;
  communityMap: Map<string, Node | HeadCluster>;
  setDisplayData: (newDisplayData: DisplayNetwork) => void;
}

const { Menu } = ContextMenu;

const CustomMenu = (props: NodeMenuProps) => {
  // props
  const {
    displayData, setDisplayData, communityMap, sourceData,
  } = props;
  const graphin = React.useContext(GraphinContext);
  const { contextmenu, graph } = graphin;
  const model: Community = contextmenu.node.item.getModel();

  const handleExpand = () => {
    if (isHeadCluster(model)) {
      // 1. 添加节点
      //  11. 删除已有节点
      const { nodes, edges } = displayData;
      const myIndex = nodes.findIndex((node) => node.id === model.id);
      nodes.splice(myIndex, 1);
      //  12. 装饰新节点
      const displayNodes = [...nodes];
      model.nodes.forEach((nodeId) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        displayNodes.push(communityStyleWrapper(communityMap.get(nodeId)!));
      });
      const displayNodeMap = getNetworkMap(displayNodes);
      // 2. 添加边
      const { level } = model;
      const { edges: levelEdges } = sourceData[level - 1];
      const displayEdges: Edge[] = [...edges];
      //  21. 删除被扩展节点原先的边
      deleteItemWithoutOrder(displayEdges,
        (edge) => edge.source === model.id || edge.target === model.id);
      //  22. 遍历被扩展层级所有的边，添加与新节点们有关的边
      levelEdges.forEach((edge) => {
        const { source, target } = edge;
        if (displayNodeMap.has(source) && displayNodeMap.has(target)) {
          displayEdges.push(edgeStyleWrapper(edge));
        }
      });

      setDisplayData({
        ...displayData,
        nodes: displayNodes,
        edges: displayEdges,
      });
    }
  };
  const handleShrink = () => {
    // TODO
    console.log('shrink');
  };
  const handleHide = () => {
    graph.remove(model.id);
  };

  if (isHeadCluster(model)) {
    return (
      <Menu bindType="node">
        <Menu.Item onClick={handleExpand}>Expand</Menu.Item>
        <Menu.Item onClick={handleHide}>Hide</Menu.Item>
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
