import AuthorizationResult from '../../entity/auth/structures/AuthorizationResult';

export default interface AuthRepository {
	login(email: string, password: string): Promise<AuthorizationResult>;
};

