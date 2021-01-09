import AuthRepository from '../../repository/auth/AuthRepository';
import AuthHolder from '../../entity/auth/models/AuthHolder';
import AuthorizationResult from '../../entity/auth/structures/AuthorizationResult';

export default class LoginUseCase {
	private authRepository: AuthRepository;
	private authHolder: AuthHolder;

	public constructor(authRepository: AuthRepository, authHolder: AuthHolder) {
		this.authRepository = authRepository;
		this.authHolder = authHolder;
	}

	public async loginUser(email: string, password: string): Promise<AuthorizationResult> {
		const authResult = await this.authRepository.login(
			email,
			password,
		);

		this.authHolder.onSignedIn(authResult.user.token);
		localStorage.setItem('token', authResult.user.token);

		return authResult;
	}
};