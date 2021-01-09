import { PostsListener } from '../../listeners/Listeners';
import { Article } from '../structures/PostsResult';

export default class PostsHolder {
	private postsListeners: Array<PostsListener>;
	private isPostsLouded: boolean;
	private posts: Array<Article>;

	public constructor() {
		this.isPostsLouded = false;
		this.postsListeners = [];
		this.posts = [];
	}

	public setPosts(posts: Array<Article>): void {
		this.posts = posts;
		this.isPostsLouded = true;
		this.notifyListeners();
	}

	public getPosts(): Array<Article> {
		return this.posts;
	}

	public setFallowed(slug: string, post: Article): void {
		const newPosts = this.posts.map(article => {
			if (article.slug === post.slug) return post;
			return article;
		});
		this.posts = newPosts;
		this.notifyListeners();
	};

	public unsetFallowed(slug: string, post: Article): void {
		const newPosts = this.posts.map(article => {
			if (article.slug === post.slug) return post;
			return article;
		});
		this.posts = newPosts;
		this.notifyListeners();
	}

	public isLouded(): boolean {
		return this.isPostsLouded;
	}

	public addPostsListener(postsListener: PostsListener): void {
		this.postsListeners.push(postsListener);
	}

	public removePostsListener(postsListener: PostsListener): void {
		this.postsListeners.slice(this.postsListeners.indexOf(postsListener), 1);
	}

	private notifyListeners(): void {
		this.postsListeners.forEach((listener) => listener.onPostsChanged());
	}
}