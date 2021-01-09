import PostsRepository from '../../repository/posts/PostsRepository';
import PostsHolder from '../../entity/posts/models/PostsHolder';

export default class PostsUseCase {
	private postsRepository: PostsRepository;
	private postsHolder: PostsHolder;

	public constructor(postsRepository: PostsRepository, postsHolder: PostsHolder) {
		this.postsRepository = postsRepository;
		this.postsHolder = postsHolder;
	};

	public fetchPosts = async (page?: number): Promise<void> => {
		const fetchedPosts = await this.postsRepository.fetchPosts(page);
		this.postsHolder.setPosts(fetchedPosts.articles);
	}

	//TODO Синхронизировать с запросом

	public favoritePost = async (slug: string): Promise<void> => {
		try {
			const result = await this.postsRepository.favoritePost(slug);
			this.postsHolder.setFallowed(slug, result.article);
		} catch(err) {
			throw new Error('You are not authorized. Please singin and try again');
		}
	}

	public unfavoritePost = async (slug: string): Promise<void> => {
		try {
			const result = await this.postsRepository.unfavoritePost(slug);
			this.postsHolder.unsetFallowed(slug, result.article);
		} catch(err) {
			throw new Error('You are not authorized. Please singin and try again');
		}
	}
}
