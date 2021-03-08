/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import {
  communityStyleWrapper,
  nodes2Map,
  isHeadCluster,
  isHead,
  isCluster,
  isNode,
  fillDisplayEdges,
} from 'src/util/network';
import {
  Community, DisplayNetwork, LayerNetwork, Edge, NodeMap, HeadCluster,
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
  const {
    displayData, setDisplayData, communityMap, sourceData,
  } = props;
  const graphin = React.useContext(GraphinContext);
  const { contextmenu, graph } = graphin;
  const model: Community = contextmenu.node.item.getModel();

  const handleExpand = () => {
    if (isHeadCluster(model)) {
      const { nodes, edges } = displayData;
      const displayNodes = [...nodes];
      const displayEdges = [...edges];
      // 1 节点
      // 1.1 删除已有节点
      deleteItemWithoutOrder(displayNodes, (node) => node.id === model.id);
      // 1.2 添加并装饰新节点
      model.nodes.forEach((nodeId) => {
        if (communityMap.has(nodeId)) {
          displayNodes.push(communityStyleWrapper(communityMap.get(nodeId)!));
        }
      });
      const displayNodeMap = nodes2Map(displayNodes);
      // 2. 边
      // 21. 删除和model有关的边
      deleteItemWithoutOrder(displayEdges,
        (edge) => edge.source === model.id || edge.target === model.id);
      // 22. 加边：遍历被扩展层级所有的边，添加与新节点们有关的边
      const allEdges = sourceData.reduce((prev: Edge[], cur) => prev.concat(cur!.edges), []);
      fillDisplayEdges(
        displayEdges,
        allEdges,
        displayNodeMap,
        communityMap,
      );
      setDisplayData({
        nodes: displayNodes,
        edges: displayEdges,
      });
    }
  };
  const handleShrink = () => {
    if (isCluster(model) || isNode(model)) {
      const { nodes, edges } = displayData;
      const displayNodes = [...nodes];
      const displayEdges = [...edges];
      // 1. 点: 删同级点 / 加cluster
      if (!communityMap.has(model.clusterId)) {
        return;
      }
      const clusterNode = communityMap.get(model.clusterId)!;
      const { nodes: sameLevelNodeIds } = clusterNode as HeadCluster;
      // 11. 加点
      displayNodes.push(communityStyleWrapper(clusterNode));
      // 12. 删点
      const sameLevelNodeMap = nodes2Map(
        sameLevelNodeIds.map((nodeId) => communityMap.get(nodeId)!),
      );
      deleteItemWithoutOrder(
        displayNodes,
        (node) => sameLevelNodeMap.has(node.id),
      );
      const displayNodeMap = nodes2Map(displayNodes);
      // 2. 边: 删原来的点的边 / 加新点的边
      // 21. 删边
      deleteItemWithoutOrder(
        displayEdges,
        (edge) => sameLevelNodeMap.has(edge.source) || sameLevelNodeMap.has(edge.target),
      );
      // 22. 加边
      const allEdges = sourceData.reduce((prev: Edge[], cur) => prev.concat(cur!.edges), []);
      fillDisplayEdges(
        displayEdges,
        allEdges,
        displayNodeMap,
        communityMap,
      );
      setDisplayData({
        nodes: displayNodes,
        edges: displayEdges,
      });
    }
  };
  const handleHide = () => {
    graph.remove(model.id);
  };

  return (
    <Menu bindType="node">
      {isHeadCluster(model) ? <Menu.Item onClick={handleExpand}>Expand</Menu.Item> : <></>}
      {!isHead(model) ? <Menu.Item onClick={handleShrink}>Shrink</Menu.Item> : <></>}
      <Menu.Item onClick={handleHide}>Hide</Menu.Item>
    </Menu>
  );
};

export default CustomMenu;
