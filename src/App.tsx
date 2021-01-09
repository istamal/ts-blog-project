import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './App.css';
import 'antd/dist/antd.css';

import AuthComponent from './presentation/view/auth/AuthComponent';
import AuthViewModelImpl from './presentation/view-models/auth/AuthViewModelImpl';
import LoginUseCase from './domain/interactors/auth/LoginUseCase';
import AuthHolder from './domain/entity/auth/models/AuthHolder';
import PostsHolder from './domain/entity/posts/models/PostsHolder';
import PostsUseCase from './domain/interactors/posts/postsUseCase';
import AuthApi from './data/auth/AuthApi';
import PostsRepository from './data/posts/PostsApi';
import PostsViewModelImpl from './presentation/view-models/posts/PostsViewModelImpl';
import PostsComponent from './presentation/view/posts/PostsComponent';
import AddPostComponent from './presentation/view/posts/AddPostComponent';

const { Header, Content, Footer } = Layout;

function App() {
  // data layer
  const authRepository = new AuthApi();
  const postsRepository = new PostsRepository();
  // domain layer
  const postsHolder = new PostsHolder();
  const authHolder = new AuthHolder();
  const postsUseCase = new PostsUseCase(postsRepository, postsHolder);
  const loginUseCase = new LoginUseCase(authRepository, authHolder);
  // view layer
  const authViewModel = new AuthViewModelImpl(loginUseCase, authHolder);
  const postsViewModel = new PostsViewModelImpl(postsHolder, postsUseCase);

  const token = localStorage.getItem('token');

  const [isAuth, setIsAuth] = React.useState(false);

  React.useEffect(() => {
    if (token) {
      setIsAuth(true);
    }
  }, [token]);

  const handleLogout = () => {
    authViewModel.onClickSignOut()
    setIsAuth(false);
  }

  return (
      <Layout className="layout">
        <Router basename="blog">
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal">

            {/* TODO Вынести в отдельный компонент и улучшить работу */}
            <Button type="link">
              {isAuth ? <Button type="link" onClick={handleLogout}>Logout</Button> : <Link to="/login">Login</Link>}
            </Button>
            <Button
              icon={<PlusOutlined />}
              type="primary" shape="round"
            >
              <Link style={{ color: "white" }} to="add_post">Add Post</Link>
            </Button>
          </Menu>
        </Header>
        <Content className="content" style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
              <Switch>
                <Route exact path="/" render={() => <PostsComponent postsViewModel={postsViewModel} />} />
                <Route exact path="/login" render={() => <AuthComponent authViewModel={authViewModel} /> } />
                <Route path="/add_post" render={() => <AddPostComponent /> } />
              </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>dagalaev@gmail.com ©2018 Created by Istamal</Footer>
        </Router>
      </Layout>
  );
}

export default App;
