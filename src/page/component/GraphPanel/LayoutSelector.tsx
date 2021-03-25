import React from 'react';
import { Select } from 'antd';

const SelectOption = Select.Option;

export const layouts = [
  { type: 'graphin-force' },
  { type: 'random' },
  { type: 'grid' },
  { type: 'circular' },
  { type: 'radial' },
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
