import BaseViewModel from '../BaseViewModel';

export default interface AuthViewModel extends BaseViewModel {
	emailQuerie: string;
	passwordQuerie: string;
	isSignInButtonVisible: boolean;
	isSignOutButtonVisible: boolean;

	isShowError: boolean;
	errorMessage: string;

	authStatus: string;
	isAuthStatusPositive: boolean;

	onEmailQueryChanged(loginQuery: string): void;
	onPasswordQuerieChanged(passwordQuerie: string): void;
	onClickSignIn(): void;
	onClickSignOut(): void;
};