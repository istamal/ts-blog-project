import AuthViewModel from './AuthViewModel';
import BaseView from '../../view/BaseView';
import LoginUseCase from '../../../domain/interactors/auth/LoginUseCase';
import AuthHolder from '../../../domain/entity/auth/models/AuthHolder';
import { AuthListener } from '../../../domain/entity/listeners/Listeners';

export default class AuthViewModelImpl implements AuthViewModel, AuthListener {
	public emailQuerie: string;
	public passwordQuerie: string;
	public isSignInButtonVisible: boolean;
	public isSignOutButtonVisible: boolean;

	public isShowError: boolean;
	public errorMessage: string;

	public authStatus: string;
	public isAuthStatusPositive: boolean;

	private baseView?: BaseView;
	private loginUseCase: LoginUseCase;
	private authHolder: AuthHolder;

	public constructor(loginUseCase: LoginUseCase, authHolder: AuthHolder) {
		this.emailQuerie = '';
		this.passwordQuerie = '';
		this.isSignInButtonVisible = true;
		this.isSignOutButtonVisible = true;
		
		this.isShowError = false;
		this.errorMessage = '';

		this.authStatus = 'Is not authorized';
		this.isAuthStatusPositive = false;

		this.loginUseCase = loginUseCase;
		this.authHolder = authHolder;

		this.authHolder.addAuthListener(this);
	}

	public attachView(baseView: BaseView): void {
		this.baseView = baseView;
	}

	public detachView(): void {
		this.baseView = undefined;
	}

	public onAuthChanged = (): void => {
		if (this.authHolder.isUserAuthorized()) {
      this.isSignInButtonVisible = false;
      this.isSignOutButtonVisible = true;
      this.authStatus = 'authorized';
      this.isAuthStatusPositive = true;
    } else {
      this.isSignInButtonVisible = true;
      this.isSignOutButtonVisible = false;
      this.authStatus = 'is not autorized';
      this.isAuthStatusPositive = false;
    }

    this.notifyViewAboutChanges();
	}

	public onEmailQueryChanged(loginQuery: string): void {
		this.emailQuerie = loginQuery;
		this.notifyViewAboutChanges();
		return;
	}

	public onPasswordQuerieChanged(passwordQuerie: string): void {
		this.passwordQuerie = passwordQuerie;
		this.notifyViewAboutChanges();
		return;
	}

	public onClickSignIn = async (): Promise<void> => {
		const result = await this.loginUseCase.loginUser(this.emailQuerie, this.passwordQuerie);
		if (result.error === '401' ) {
			this.errorMessage = 'Please sign in for fovoriting';
			this.isShowError = true;
		} else {
			this.authHolder.onSignedIn(result.user.token);
			this.isShowError = false;
			this.errorMessage = '';
		};

		this.notifyViewAboutChanges();
	}

	public onClickSignOut = (): void => {
		this.authHolder.onSignOut();
		localStorage.clear();
	}

	private notifyViewAboutChanges = (): void => {
    if (this.baseView) {
      this.baseView.onViewModelChanged();
    }
  };
}

