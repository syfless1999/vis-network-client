import React from 'react';
import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import {
  communityStyleWrapper,
  edgeStyleWrapper,
  nodes2Map,
  isHeadCluster,
  getTargetCommunity,
} from 'src/util/network';
import {
  Community, DisplayNetwork, LayerNetwork, Edge, NodeMap,
} from 'src/type/network';
import { deleteItemWithoutOrder } from 'src/util/array';

interface NodeMenuProps {
  displayData: DisplayNetwork;
  sourceData: LayerNetwork;
  communityMap: NodeMap;
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
      deleteItemWithoutOrder(nodes, (node) => node.id === model.id);
      //  12. 装饰并添加新节点
      const displayNodes = [...nodes];
      model.nodes.forEach((nodeId) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        displayNodes.push(communityStyleWrapper(communityMap.get(nodeId)!));
      });
      const displayNodeMap = nodes2Map(displayNodes);
      // 2. 添加边
      const displayEdges: Edge[] = [...edges];
      //  21. 删除和model有关的边
      deleteItemWithoutOrder(displayEdges,
        (edge) => edge.source === model.id || edge.target === model.id);
      //  22. 遍历被扩展层级所有的边，添加与新节点们有关的边
      const allEdges = sourceData.reduce((prev: Edge[], cur) => prev.concat(cur.edges), []);
      allEdges.forEach((edge) => {
        const { source, target } = edge;
        if (displayNodeMap.has(source) && displayNodeMap.has(target)) {
          // 221. 如果两个端点都在图上，则直接styled加入
          displayEdges.push(edgeStyleWrapper(edge));
          return;
        }
        if (displayNodeMap.has(source)) {
          const targetId = getTargetCommunity(target, displayNodeMap, communityMap);
          if (targetId) {
            displayEdges.push(edgeStyleWrapper({
              source,
              target: targetId,
            }));
          }
        } else if (displayNodeMap.has(target)) {
          const sourceId = getTargetCommunity(source, displayNodeMap, communityMap);
          if (sourceId) {
            displayEdges.push(edgeStyleWrapper({
              source: sourceId,
              target,
            }));
          }
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
