import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, Menu } from 'antd';
import routers from 'src/config/router';

const { Header } = Layout;
const Container = styled(Header)`
  position: fixed;
  box-sizing: border-box;
  width: 100%;
  z-index: 1;
`;

const MyHeader = () => {
  const location = useLocation();
  const pathname = location.pathname.substr(1) || 'home';
  return (
    <Container>
      <Menu theme="light" mode="horizontal" selectedKeys={[pathname]}>
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
    </Container>
  );
};

export default MyHeader;
