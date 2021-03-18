/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { GraphinContext, Utils } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import {
  communityStyleWrapper,
  nodes2Map,
  isHeadCluster,
  isHead,
  isCluster,
  isNode,
  fillDisplayEdges,
  edges2Map,
} from 'src/util/network';
import {
  Community, DisplayNetwork, Edge, NodeMap, HeadCluster, EdgeMap, LayerNetwork,
} from 'src/type/network';
import { deleteItemWithoutOrder } from 'src/util/array';

interface NodeMenuProps {
  displayData: DisplayNetwork;
  communityMap: NodeMap;
  edgeMap: EdgeMap;
  sourceData: LayerNetwork;
  setDisplayData: (newDisplayData: DisplayNetwork) => void;
}

const { Menu } = ContextMenu;

const CustomMenu = (props: NodeMenuProps) => {
  const {
    displayData, setDisplayData, communityMap, edgeMap, sourceData,
  } = props;
  const graphin = React.useContext(GraphinContext);
  const { contextmenu, graph } = graphin;
  const model: Community = contextmenu.node.item.getModel();

  const handleExpand = () => {
    if (isHeadCluster(model)) {
      const { nodes, edges } = displayData;
      const displayNodes = [...nodes];
      const displayEdges = [...edges];
      console.log(`current: nodes ${displayNodes.length} edges ${displayEdges.length}`);
      // 1 节点
      // 1.1 删除已有节点
      deleteItemWithoutOrder(displayNodes, (node) => node.id === model.id);
      console.log(`after delete node: nodes ${displayNodes.length} edges ${displayEdges.length}`);

      // 1.2 添加并装饰新节点
      model.nodes.forEach((nodeId) => {
        if (communityMap.has(nodeId)) {
          displayNodes.push(communityStyleWrapper(communityMap.get(nodeId)!));
        }
      });
      console.log(`after add node: nodes ${displayNodes.length} edges ${displayEdges.length}`);
      const displayNodeMap = nodes2Map(displayNodes);
      // 2. 边
      // 21. 删除和model有关的边
      deleteItemWithoutOrder(displayEdges,
        (edge) => edge.source === model.id || edge.target === model.id);
      console.log(`after delete edge: nodes ${displayNodes.length} edges ${displayEdges.length}`);

      // 22. 加边：遍历被扩展层级所有的边，添加与新节点们有关的边
      const allEdges = sourceData.reduce(
        (prev: Edge[], cur) => (cur && cur.edges ? prev.concat(cur.edges) : prev), [],
      );
      const displayEdgesMap = edges2Map(displayEdges);
      fillDisplayEdges(
        displayEdges,
        displayEdgesMap,
        allEdges,
        displayNodeMap,
        communityMap,
      );
      console.log(`after add edge: nodes ${displayNodes.length} edges ${displayEdges.length}`);
      const allDisplayEdges = Utils.processEdges(displayEdges, { poly: 50, loop: 10 });
      setDisplayData({
        nodes: displayNodes,
        edges: allDisplayEdges,
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

      console.log(`after delete node: nodes ${displayNodes.length} edges ${displayEdges.length}`);
      // 11. 加点
      displayNodes.push(communityStyleWrapper(clusterNode));
      console.log(`after add node: nodes ${displayNodes.length} edges ${displayEdges.length}`);

      // 12. 删点
      const sameLevelNodeMap = nodes2Map(
        sameLevelNodeIds.map((nodeId) => communityMap.get(nodeId)!),
      );
      deleteItemWithoutOrder(
        displayNodes,
        (node) => sameLevelNodeMap.has(node.id),
      );
      console.log(`after delete node: nodes ${displayNodes.length} edges ${displayEdges.length}`);
      const displayNodeMap = nodes2Map(displayNodes);
      // 2. 边: 删原来的点的边 / 加新点的边
      // 21. 删边
      deleteItemWithoutOrder(
        displayEdges,
        (edge) => sameLevelNodeMap.has(edge.source) || sameLevelNodeMap.has(edge.target),
      );
      console.log(`after delete edge: nodes ${displayNodes.length} edges ${displayEdges.length}`);
      // 22. 加边
      const allEdges = sourceData.reduce(
        (prev: Edge[], cur) => (cur && cur.edges ? prev.concat(cur.edges) : prev), [],
      );
      const displayEdgesMap = edges2Map(displayEdges);
      fillDisplayEdges(
        displayEdges,
        displayEdgesMap,
        allEdges,
        displayNodeMap,
        communityMap,
      );
      console.log(`after add edge: nodes ${displayNodes.length} edges ${displayEdges.length}`);
      displayEdges.forEach((e) => console.log(`${e.source}-->${e.target}`));
      const allDisplayEdges = Utils.processEdges(displayEdges, { poly: 50, loop: 10 });
      setDisplayData({
        nodes: displayNodes,
        edges: allDisplayEdges,
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
