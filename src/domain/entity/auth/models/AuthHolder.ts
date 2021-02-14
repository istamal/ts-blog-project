import { AuthListener } from '../../listeners/Listeners';

export default class AuthHolder {
	private authListeners: Array<AuthListener>; // Объекты подписчики на изменения состояния AuthHolder
	private isAuthorized: boolean;
	private authToken: string;

	public constructor() {
		this.isAuthorized = false;
		this.authListeners = [];
		this.authToken = '';
	}

	public onSignedIn(authToken: string): void {
		this.isAuthorized = true;
		this.authToken = authToken;
		this.notifyListeners();
	}

	public onSignOut(): void {
		this.isAuthorized = false;
		this.authToken = '';
		this.notifyListeners();
	}

	public isUserAuthorized(): boolean {
		return this.isAuthorized;
	}

	public getAuthTocken(): string {
		if (!this.isAuthorized) {
			throw new Error('User are not Authorized');
		}

		return this.authToken;
	}

	public addAuthListener(authListener: AuthListener): void {
		this.authListeners.push(authListener);
	}

	public removeAuthListener(authListener: AuthListener): void {
		this.authListeners.slice(this.authListeners.indexOf(authListener), 1);
	}

	private notifyListeners(): void {
		this.authListeners.forEach((listener) => listener.onAuthChanged());
	}
};