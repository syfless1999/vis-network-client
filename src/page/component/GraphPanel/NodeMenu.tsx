import React from 'react';
import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import {
  communityStyleWrapper, edgeStyleWrapper, getNetworkMap, isHeadCluster, getRelatedCommunities,
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
      deleteItemWithoutOrder(nodes, (node) => node.id === model.id);
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
      const deletedEdges = deleteItemWithoutOrder(displayEdges,
        (edge) => edge.source === model.id || edge.target === model.id);
      //  22. 遍历被扩展层级所有的边，添加与新节点们有关的边
      levelEdges.forEach((edge) => {
        const { source, target } = edge;
        if (displayNodeMap.has(source) && displayNodeMap.has(target)) {
          // 221. 如果两个端点都在图上，则直接styled加入
          displayEdges.push(edgeStyleWrapper(edge));
        } else if (displayNodeMap.has(source)) {
          const newEdge: Edge = {
            source,
            target: '',
          };
          // 221. 如果其中一点不在图上，找到另一端的所有相关点，然后map到图上点加入
          const relatedCommunities = getRelatedCommunities(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            communityMap.get(target)!,
            sourceData,
            communityMap,
          );
          const rcmap = getNetworkMap(relatedCommunities);
          deletedEdges.forEach((edge) => {
            if (rcmap.has(edge.target)) {
              newEdge.target = edge.target;
              displayEdges.push(edgeStyleWrapper(newEdge));
              // TODO 添加边上的数额
            } else if (rcmap.has(edge.source)) {
              newEdge.target = edge.source;
              // TODO 添加边上的数额
              displayEdges.push(edgeStyleWrapper(newEdge));
            }
          });
        } else if (displayNodeMap.has(target)) {
          const newEdge: Edge = {
            source: '',
            target,
          };
          // 221. 如果其中一点不在图上，找到另一端的所有相关点，然后map到图上点加入
          const relatedCommunities = getRelatedCommunities(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            communityMap.get(source)!,
            sourceData,
            communityMap,
          );
          const rcmap = getNetworkMap(relatedCommunities);
          deletedEdges.forEach((edge) => {
            if (rcmap.has(edge.target)) {
              newEdge.source = edge.target;
              displayEdges.push(edgeStyleWrapper(newEdge));
              // TODO 添加边上的数额
            } else if (rcmap.has(edge.source)) {
              newEdge.source = edge.source;
              // TODO 添加边上的数额
              displayEdges.push(edgeStyleWrapper(newEdge));
            }
          });
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
