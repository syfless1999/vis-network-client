import React from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import styled from 'styled-components';

interface LayoutSelectorProps {
  feature: string,
  features: string[],
  onChange: (value: string) => void,
}
const SRadio = styled(Radio)`
  display: block;
  height: 30px;
  line-height: 30px;
`;
const LayoutSelector: React.FC<LayoutSelectorProps> = (props) => {
  const { feature, features, onChange } = props;
  const handleChange = (e: RadioChangeEvent) => {
    const v = e.target.value;
    onChange(v);
  };
  return (
    <Radio.Group onChange={handleChange} value={feature}>
      {features.map((f) => (
        <SRadio key={f} value={f}>
          {f}
        </SRadio>
      ))}
    </Radio.Group>
  );
};

export default LayoutSelector;
