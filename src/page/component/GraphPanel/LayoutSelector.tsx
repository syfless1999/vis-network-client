/* eslint-disable no-undef */
import React from 'react';
import { Select } from 'antd';
import { Edge } from 'src/type/network';

const SelectOption = Select.Option;

export const layouts = [
  {
    type: 'graphin-force',
    preset: {
      type: 'concentric',
    },
    animation: true,
    defSpringLen: (
      _edge: Edge,
      source: { data: { layout: { degree: number; }; }; },
      target: { data: { layout: { degree: number; }; }; },
    ) => {
      /** 默认返回的是 200 的弹簧长度 */
      /** 如果你要想要产生聚类的效果，可以考虑 根据边两边节点的度数来动态设置边的初始化长度：度数越小，则边越短 */
      const nodeSize = 30;
      const Sdegree = source.data.layout.degree;
      const Tdegree = target.data.layout.degree;
      const minDegree = Math.min(Sdegree, Tdegree);
      return minDegree < 3 ? nodeSize * 5 : (minDegree + 2) * nodeSize;
    },
  },
  {
    type: 'random',
  },
  {
    type: 'grid',
    // begin: [0, 0], // 可选，
    // preventOverlap: true, // 可选，必须配合 nodeSize
    // preventOverlapPdding: 20, // 可选
    // nodeSize: 30, // 可选
    // condense: false, // 可选
    // rows: 5, // 可选
    // cols: 5, // 可选
    // sortBy: 'degree', // 可选
    // workerEnabled: false, // 可选，开启 web-worker
  },
  {
    type: 'circular',
    // center: [200, 200], // 可选，默认为图的中心
    // radius: null, // 可选
    // startRadius: 10, // 可选
    // endRadius: 100, // 可选
    // clockwise: false, // 可选
    // divisions: 5, // 可选
    // ordering: 'degree', // 可选
    // angleRatio: 1, // 可选
  },
  {
    type: 'radial',
    // center: [200, 200], // 可选，默认为图的中心
    // linkDistance: 50, // 可选，边长
    // maxIteration: 1000, // 可选
    // focusNode: 'node11', // 可选
    // unitRadius: 100, // 可选
    // preventOverlap: true, // 可选，必须配合 nodeSize
    // nodeSize: 30, // 可选
    // strictRadial: false, // 可选
    // workerEnabled: false, // 可选，开启 web-worker
  },
];

interface LayoutSelectorProps {
  value: string,
  onChange: (value: string) => void,
}

const LayoutSelector: React.FC<LayoutSelectorProps> = (props) => {
  const { value, onChange } = props;
  // 包裹在graphin内部的组件，将获得graphin提供的额外props

  return (
    <Select
      bordered={false}
      value={value}
      onChange={onChange}
      placeholder="layout type"
    >
      {layouts.map((item) => {
        const { type } = item;
        return (
          <SelectOption key={type} value={type}>
            {type}
          </SelectOption>
        );
      })}
    </Select>
  );
};

export default LayoutSelector;
