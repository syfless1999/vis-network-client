import { Select } from 'antd';
import React from 'react';

interface LevelSelectorProps {
  level: number;
  maxLevel: number;
  onChange: (level: number) => void;
}
const { Option } = Select;

export const getDisplayLevelText = (level: number, maxLevel: number) => {
  const conditions: [boolean, string][] = [
    [level > maxLevel, 'oversized level'],
    [level === 0, 'source network'],
    [true, `level-${level}`],
  ];
  let res = '';
  for (let i = 0; i < conditions.length; i += 1) {
    if (conditions[i][0]) {
      [, res] = conditions[i];
      break;
    }
  }
  return res;
};

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
