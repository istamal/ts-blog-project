import PostsViewModel from './PostsViewModel';
import PostsUseCase from '../../../domain/interactors/posts/postsUseCase';
import PostsHolder from '../../../domain/entity/posts/models/PostsHolder';
import { PostsListener } from '../../../domain/entity/listeners/Listeners';
import BaseView from '../../view/BaseView';
import { Article } from '../../../domain/entity/posts/structures/PostsResult';

export default class PostsViewModelImpl implements PostsViewModel, PostsListener {
	public posts: Array<Article>;
	public urlQuery: string;
	public slug: string;

	public isShowError: boolean;
	public errorMessage: string;

	public postsUseCase: PostsUseCase;
	public postsHolder: PostsHolder;

	public baseView?: BaseView;

	public constructor(postsHolder: PostsHolder, postsUseCase: PostsUseCase) {
		this.posts = [];
		this.isShowError = false;
		this.slug = '';
		this.errorMessage = '';
		this.postsHolder = postsHolder;
		this.postsUseCase = postsUseCase;
		this.postsHolder.addPostsListener(this);
		this.urlQuery = '/api/articles';
	}

	public setSlug(slug: string): void {
		this.slug = slug;
		console.log(this.slug);
		this.notifyViewsAboutChanges();
	};

	public attachView(baseView: BaseView): void {
		this.baseView = baseView;
	}

	public detachView(): void {
		this.baseView = undefined;
	}

	public onPostsChanged(): void {
		this.posts = this.postsHolder.getPosts();

		this.notifyViewsAboutChanges();
	}

	public fetchPosts = async(page?: number): Promise<void> => {
		try {
			await this.postsUseCase.fetchPosts(page);
			this.isShowError = false;
			this.errorMessage = '';
		} catch (err) {
			this.isShowError = true;
			this.errorMessage = err.message;
		}

		this.notifyViewsAboutChanges();
	}

	public favorite = async(slug: string): Promise<void> => {
		try {
			await this.postsUseCase.favoritePost(slug);
		} catch (err) {
			this.isShowError = true;
			this.errorMessage = err.message;
		}

		this.notifyViewsAboutChanges();
	}

	public unfavorite = async(slug: string): Promise<void> => {
		try {
			await this.postsUseCase.unfavoritePost(slug);
		} catch (err) {
			this.isShowError = true;
			this.errorMessage = err.message;
		}

		this.notifyViewsAboutChanges();
	}

	private notifyViewsAboutChanges(): void {
		if (this.baseView) {
			this.baseView.onViewModelChanged();
		}
	}
}
