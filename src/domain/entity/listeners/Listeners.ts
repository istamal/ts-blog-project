export interface AuthListener {
	onAuthChanged(): void;
};

export interface PostsListener {
	onPostsChanged(): void;
}