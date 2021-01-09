import PostsRepository from '../../domain/repository/posts/PostsRepository';
import { ArticleResponse, PostsResult } from '../../domain/entity/posts/structures/PostsResult';
import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://conduit.productionready.io',
});

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    const newConfig = config;
    if (token) {
      newConfig.headers.common.Authorization = `Token ${token}`;
    }
    return newConfig;
  },
  error => Promise.reject(error),
);

export default class PostsApi implements PostsRepository {
	private num: number;

	public constructor() {
		this.num = 10;
	}

	async fetchPosts(page?: number): Promise<PostsResult> {
		let result;
		if (page) {
			let offset = page * 10;
			if (this.num > offset) offset = offset - (offset - page);
			this.num = offset;
			result = await instance.get(`/api/articles?offset=${offset}`);
		} else {
			result = await instance.get(`/api/articles`);
		}

		return result.data;
	};

	//TODO : done добавить обработку ошибки запроса favorite чтоб не изменять PostsHolder при ошибке

	async favoritePost(slug: string): Promise<ArticleResponse> {
		try {
			const result = await instance.post(`api/articles/${slug}/favorite`);
			return result.data;
		} catch (err) {
			throw err;
		}
	};

	async unfavoritePost(slug: string): Promise<ArticleResponse> {
		try {
			const result = await instance.delete(`api/articles/${slug}/favorite`);
			return result.data;
		} catch (err) {
			throw err;
		}
	}
};