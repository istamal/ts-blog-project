import { Article } from '../../../domain/entity/posts/structures/PostsResult';
import BaseViewModel from '../BaseViewModel';

export default interface PostsViewModel extends BaseViewModel {
	posts: Array<Article>;

	isShowError: boolean;
	errorMessage: string;

	setSlug(slug: string): void;
	onPostsChanged(): void;
	fetchPosts(page?: number): Promise<void>;
	favorite(slug: string): Promise<void>;
	unfavorite(slug: string): Promise<void>;
};