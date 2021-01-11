import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Input, Button, Spin, Card } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, ExportOutlined, LoadingOutlined } from '@ant-design/icons';
import './auth-component.css';
import BaseView from '../BaseView';
import AuthViewModel from '../../view-models/auth/AuthViewModel';

const antIcon = <LoadingOutlined style={{ fontSize: 18, color: "white", marginLeft: 10 }} spin />;

export interface AuthComponentProps {
	authViewModel: AuthViewModel;
}

export interface AuthComponentState {
  isLouding: boolean;
  emailQuery: string;
  passwordQuery: string;
  isSignInButtonVisible: boolean;
  isSignOutButtonVisible: boolean;

  isShowError: boolean;
  errorMessage: string;

  authStatus: string;
  isAuthStatusPositive: boolean;
}

export default class AuthComponent 
  extends React.Component<AuthComponentProps, AuthComponentState>
  implements BaseView {
  private authViewModel: AuthViewModel;

  public constructor(props: AuthComponentProps) {
    super(props);

    const { authViewModel } = this.props;
    this.authViewModel = authViewModel;

    this.state = {
      isLouding: false,
      emailQuery: authViewModel.emailQuerie,
      passwordQuery: authViewModel.passwordQuerie,
      isSignInButtonVisible: authViewModel.isSignInButtonVisible,
      isSignOutButtonVisible: authViewModel.isSignOutButtonVisible,

      isShowError: authViewModel.isShowError,
      errorMessage: authViewModel.errorMessage,

      authStatus: authViewModel.authStatus,
      isAuthStatusPositive: authViewModel.isAuthStatusPositive,
    };
  }

  public componentDidMount(): void {
    this.authViewModel.attachView(this);
  }

  public componentWillUnmount(): void {
    this.authViewModel.detachView();
  }

  public handleInput = (e: React.FormEvent<HTMLInputElement>): void => {
    this.authViewModel.onEmailQueryChanged(e.currentTarget.value);
  }

  // При каждом обновлении ViewModel, мы обновляем 
  // state нашего компонента
  public onViewModelChanged(): void {
    this.setState({
      isLouding: false,
      emailQuery: this.authViewModel.emailQuerie,
      passwordQuery: this.authViewModel.passwordQuerie,
      isSignInButtonVisible: this.authViewModel.isSignInButtonVisible,
      isSignOutButtonVisible: this.authViewModel.isSignOutButtonVisible,

      isShowError: this.authViewModel.isShowError,
      errorMessage: this.authViewModel.errorMessage,

      authStatus: this.authViewModel.authStatus,
      isAuthStatusPositive: this.authViewModel.isAuthStatusPositive,
    });
  }

  public handleSubmit = (): void => {
    this.setState({ isLouding: true });
    this.authViewModel.onClickSignIn();
  }

  public render(): JSX.Element {
    const {
      isLouding,
      emailQuery,
      passwordQuery,
      isSignInButtonVisible,
      isSignOutButtonVisible,

      isShowError,
      errorMessage,

      authStatus,
      isAuthStatusPositive,
    } = this.state;

    return (
      <>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Add Post</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-card-border-less-wrapper">
          <Card title="Sign in" bordered={false} style={{ width: "100%" }}>
            <div className="margin-bottom">
              Status: 
              <span className={`${isAuthStatusPositive ? 'text-success' : 'text-danger'}`}>
                {authStatus}
              </span>
            </div>
            <div className="margin-bottom">
              <Input
                type="text"
                placeholder="user@email.com"
                onChange={this.handleInput}
                value={emailQuery}
                className="form-control"
              />
            </div>
            <div className="margin-bottom">
              <Input.Password
                placeholder="password"
                onChange={(e: React.FormEvent<HTMLInputElement>): void => {
                  this.authViewModel.onPasswordQuerieChanged(e.currentTarget.value);
                }}
                value={passwordQuery}
                className="form-control"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </div>
            {isShowError && (
              <div className="row my-3 text-danger justify-content-center">{errorMessage}</div>
            )}
            {isSignInButtonVisible && (
              <div className="row mt-4">
                <Button
                  type="primary"
                  htmlType="button"
                  className="col btn btn-primary"
                  onClick={this.handleSubmit}
                >
                  Sign in
                  {isLouding ? (
                    <Spin indicator={antIcon} />
                  ) : (
                    <ExportOutlined />
                  )}
                </Button>
              </div>
            )}

            {isSignOutButtonVisible && (
              <div className="row mt-4">
                <Button
                  type="primary"
                  className="col btn btn-primary"
                  onClick={(): void => this.authViewModel.onClickSignOut()}
                >
                  Sign out
                  <ExportOutlined />
                </Button>
              </div>
            )}
          </Card>
        </div>
      </>
    );
  }
};