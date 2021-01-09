import AuthRepository from '../../domain/repository/auth/AuthRepository';
import AuthorizationResult from '../../domain/entity/auth/structures/AuthorizationResult';

export default class AuthApi implements AuthRepository {
	login(email: string, password: string): Promise<AuthorizationResult> {
		const result = fetch(`https://conduit.productionready.io/api/users/login`, {
			method: "post",
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user: {
					email,
					password,
				}
			}),
		}).then(data => data.json());

		return result;
	}
}