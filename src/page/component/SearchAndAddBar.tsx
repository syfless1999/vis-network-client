import React from 'react';
import {
  Button, Col, Row, Typography,
} from 'antd';

import SearchBar from './SearchBar';

export interface SearchAndAddBarProps {
  title: string;
  onSearch: (v: string) => Promise<void>,
  onClick: () => void;
}

const { Title } = Typography;
function SearchAndAddBar(props: SearchAndAddBarProps) {
  const { title, onClick, onSearch } = props;
  return (
    <Row align="middle" justify="start" gutter={16} style={{ marginBottom: 10 }}>
      <Col span={6}>
        <Title level={3} mark>{title}</Title>
      </Col>
      <Col span={6}>
        <SearchBar onSearch={onSearch} />
      </Col>
      <Col>
        <Button type="primary" onClick={onClick}>ADD</Button>
      </Col>
    </Row>
  );
}

export default SearchAndAddBar;
