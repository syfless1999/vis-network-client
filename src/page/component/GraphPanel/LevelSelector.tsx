import { Select } from 'antd';
import React from 'react';
import { getDisplayLevelText } from 'src/util/network';

interface LevelSelectorProps {
  level: number;
  maxLevel: number;
  onChange: (level: number) => void;
}
const { Option } = Select;

const LevelSelector: React.FC<LevelSelectorProps> = (props) => {
  const { level, maxLevel, onChange } = props;
  return (
    <Select
      bordered={false}
      value={level}
      onChange={onChange}
      placeholder="cluster level"
    >
      {
        Array.from({ length: maxLevel + 1 }).map((_, index) => {
          const levelText = getDisplayLevelText(index, maxLevel);
          return (
            <Option key={levelText} value={index}>
              {levelText}
            </Option>
          );
        })
      }
    </Select>
  );
};

export default React.memo(LevelSelector);
