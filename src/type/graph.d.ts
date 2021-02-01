export interface NodeConfig {
  id: string;
  clusterId?: string;
  [key?: string]: unknown;
}
export interface EdgeConfig {
  source: string;
  target: string;
  weight?: number;
  [key?: string]: unknown;
}
export interface GraphData {
  nodes: NodeConfig[];
  edges?: EdgeConfig[];
  [key?: string]: unknown;
}
export interface Cluster {
  id: string;
  nodes: NodeConfig[];
  sumTot?: number;
}
export interface ClusterEdge extends EdgeConfig {
  count?: number;
}
export interface ClusterData {
  clusters: Cluster[];
  clusterEdges: ClusterEdge[];
}
