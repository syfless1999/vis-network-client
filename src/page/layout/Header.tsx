import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, Menu } from 'antd';
import routers from 'src/config/router';

const { Header } = Layout;
const MyHeader = styled(Header)`
  position: fixed;
  box-sizing: border-box;
  width: 100%;
  z-index: 1;
`;

const index = () => (
  <MyHeader>
    <Menu theme="light" mode="horizontal" defaultSelectedKeys={['home']}>
      <Menu.Item key="home">
        <Link to="/">Home</Link>
      </Menu.Item>
      {routers.map((item) => (
        <Menu.Item key={item.key}>
          <Link to={item.url}>
            {item.text}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  </MyHeader>
);

export default index;
