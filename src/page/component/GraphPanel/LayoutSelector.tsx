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
      const nodeSize = 30;
      const Sdegree = source.data.layout.degree;
      const Tdegree = target.data.layout.degree;
      const minDegree = Math.min(Sdegree, Tdegree);
      return minDegree < 3 ? nodeSize * 5 : (minDegree + 2) * nodeSize;
    },
  },
  {
    type: 'grid',
  },
  {
    type: 'circular',
  },
  {
    type: 'radial',
  },
];

interface LayoutSelectorProps {
  value: string,
  onChange: (value: string) => void,
}

const LayoutSelector: React.FC<LayoutSelectorProps> = (props) => {
  const { value, onChange } = props;
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
