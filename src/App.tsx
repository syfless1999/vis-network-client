import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from 'antd';

import Header from 'src/page/layout/Header';
import Footer from 'src/page/layout/Footer';

import DataSource from 'src/page/datasource';
import Task from 'src/page/task';
import Network from 'src/page/network';
import SingleNetwork from 'src/page/network/Network';

import 'src/app.less';

const { Content } = Layout;

const MyContent = styled(Content)`
  padding: 0 50px;
  margin-top: 64px;
`;
const Container = styled.div`
  margin: 16px auto;
  padding: 24px;
  min-height:380px;
  background-color: ${(props) => props.theme['@panel-background']};
`;

function App() {
  const Router = () => (
    <Switch>
      <Route path="/datasource"><DataSource /></Route>
      <Route path="/task"><Task /></Route>
      <Route path="/network/:taskId"><SingleNetwork /></Route>
      <Route path="/network"><Network /></Route>
      <Route path="/"><h1>home</h1></Route>
    </Switch>
  );
  return (
    <Layout>
      <Header />
      <MyContent>
        <Container>
          <Router />
        </Container>
      </MyContent>
      <Footer />
    </Layout>
  );
}

export default App;
