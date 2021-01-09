import { PostsResult, ArticleResponse } from '../../entity/posts/structures/PostsResult';

export default interface PostsRepository {
	fetchPosts(page?: number): Promise<PostsResult>
	favoritePost(slug: string): Promise<ArticleResponse>
	unfavoritePost(slug: string): Promise<ArticleResponse>
};