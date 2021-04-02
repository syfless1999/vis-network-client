import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from 'antd';

import Header from 'src/page/layout/Header';
import Footer from 'src/page/layout/Footer';

import 'src/app.less';

const DataSource = React.lazy(() => import('src/page/datasource'));
const Task = React.lazy(() => import('src/page/task'));
const SingleNetwork = React.lazy(() => import('src/page/network/Network'));

const { Suspense } = React;
const { Content } = Layout;

const MyContent = styled(Content)`
  padding: 0 50px;
  margin-top: 64px;
`;
const Container = styled.div`
  margin: 16px auto;
  padding: 24px;
  min-height:380px;
  background-color: #fff;
`;

function App() {
  const Router = () => (
    <Switch>
      <Suspense fallback={<div>wait</div>}>
        <Route path="/datasource"><DataSource /></Route>
        <Route path="/task"><Task /></Route>
        <Route path="/network/:taskId"><SingleNetwork /></Route>
        <Route path="/"><h1>home</h1></Route>
      </Suspense>
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
