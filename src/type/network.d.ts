// source data
export interface Node {
  id: string;
  [key: string]: unknown;
}
export interface Cluster extends Node {
  nodes: string[];
  lenEdge: number;
}
export interface Edge {
  source: string;
  target: string;
  [key: string]: unknown;
}
export interface ClusterEdge extends Edge {
  count: number;
}
export type Layer<T extends Cluster | Node> = {
  nodes: T[];
  edges: (T extends Cluster ? ClusterEdge : Edge)[];
}
export interface LayerNetwork {
  [index: number]: Layer<Cluster | Node>;
}
