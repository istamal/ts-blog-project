interface User {
	bio: string | null
	createdAt: string
	email: string
	id: number
	image: string | null
	token: string
	updatedAt: string
	username: string
}

export default interface AuthorizationResult {
	user: User
	error?: string
};