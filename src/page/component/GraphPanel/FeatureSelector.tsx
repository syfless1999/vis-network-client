import React from 'react';
import { Radio, RadioChangeEvent } from 'antd';

interface LayoutSelectorProps {
  feature: string,
  features: string[],
  onChange: (value: string) => void,
}

const LayoutSelector: React.FC<LayoutSelectorProps> = (props) => {
  const { feature, features, onChange } = props;
  const handleChange = (e: RadioChangeEvent) => {
    const v = e.target.value;
    onChange(v);
  };
  return (
    <Radio.Group onChange={handleChange} value={feature}>
      {features.map((f) => (
        <Radio key={f} value={f}>
          {f}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default LayoutSelector;
