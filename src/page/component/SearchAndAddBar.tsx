import React from 'react';
import {
  Button, Col, Row, Input, Typography,
} from 'antd';

export interface SearchAndAddBarProps {
  title: string;
  handleClick: () => void;
}

const { Search } = Input;
const { Title } = Typography;

function SearchAndAddBar(props: SearchAndAddBarProps) {
  const { title, handleClick } = props;
  return (
    <Row align="middle" justify="start" gutter={16} style={{ marginBottom: 10 }}>
      <Col span={6}>
        <Title level={3} mark>{title}</Title>
      </Col>
      <Col span={6}>
        <Search placeholder="input search text" enterButton />
      </Col>
      <Col>
        <Button type="primary" onClick={handleClick}>ADD</Button>
      </Col>
    </Row>
  );
}

export default SearchAndAddBar;
