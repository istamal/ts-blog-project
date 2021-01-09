import React from 'react';
import {
	Card,
	Avatar,
	notification,
	Badge,
	Spin,
	Breadcrumb,
	Pagination,
	Tag,
	Divider
} from 'antd';

import {
	EditOutlined,
	EllipsisOutlined,
	LikeOutlined,
	LikeFilled,
	LoadingOutlined
} from '@ant-design/icons';

import './posts-component.css';
import BaseView from '../BaseView';
import { Article } from '../../../domain/entity/posts/structures/PostsResult';
import PostsViewModel from '../../view-models/posts/PostsViewModel';
import PostsSkeleton from './PostsSkeleton';

const { Meta } = Card;

const antIcon: JSX.Element = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export interface PostsComponentProps {
	postsViewModel: PostsViewModel;
};

export interface PostsComponentState {
	slug: string;
	isFavoriteLouding: boolean;
	isPostsLouded: boolean;
	posts: Array<Article>;
	isShowError: boolean;
	errorMessage: string;
};

export default class PostsComponent extends React.Component<PostsComponentProps, PostsComponentState>  implements BaseView {
	private postsViewModel: PostsViewModel;

	public constructor(props: PostsComponentProps) {
		super(props);

		const { postsViewModel } = this.props;
		this.postsViewModel = postsViewModel;

		this.state = {
			slug: '',
			isFavoriteLouding: false,
			posts: [],
			isPostsLouded: false,
			isShowError: postsViewModel.isShowError,
			errorMessage: postsViewModel.errorMessage,
		}
	}

	public componentDidMount = async (): Promise<void> => {
		this.setState({ isPostsLouded: true });
		await this.postsViewModel.fetchPosts();
		this.setState({ isPostsLouded: false });
		this.postsViewModel.attachView(this);
		this.onViewModelChanged();
	}

	public componentWillUnmount() {
		this.postsViewModel.detachView();
	}

	public onViewModelChanged(): void {
    this.setState({
      posts: this.postsViewModel.posts,
      isShowError: this.postsViewModel.isShowError,
      errorMessage: this.postsViewModel.errorMessage,
		});
	}

	public openNotificationWithIcon = (message: string, description: string): void => {
    notification.warning({
      message,
      description,
    });
	};

	public handleFavorite = async (slug: string): Promise<void> => {
		if (localStorage.getItem('token')) {
			this.setState({ isFavoriteLouding: true, slug });
			await this.postsViewModel.favorite(slug);
			this.setState({ isFavoriteLouding: false, slug: '' });
		} else {
			this.openNotificationWithIcon(
				'Please sing in',
				'You are not authorized, please sign in',
			);
		}
	}

	public handleUnfavorite = async (slug: string): Promise<void> => {
		if (localStorage.getItem('token')) {
			this.setState({ isFavoriteLouding: true, slug });
			await this.postsViewModel.unfavorite(slug);
			this.setState({ isFavoriteLouding: false, slug: '' });
		} else {
			this.openNotificationWithIcon(
				'Please sing in',
				'You are not authorized, please sign in',
			);
		}
	}

	public handleNextPage = async(page: number) => {
		this.setState({ isPostsLouded: true });
		await this.postsViewModel.fetchPosts(page);
		this.setState({ isPostsLouded: false });
		this.postsViewModel.attachView(this);
		this.onViewModelChanged();
	}
	
	public render(): JSX.Element {
		const { posts, isFavoriteLouding, slug, isPostsLouded } = this.state;

		return (
			<>
				<Breadcrumb style={{ margin: '16px 0' }}>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
				</Breadcrumb>
				{isPostsLouded ? (
					<PostsSkeleton />
				) : posts.map(post => (
					<div className="post" key={post.slug}>
						<Card
							hoverable
							style={{ width: 500 }}
							actions={[
									//TODO Можно вывести в отдельный компонент
									//TODO: done Исправить запрос (Ошибка 404)
									//TODO Улучшить фичу со спинером
								post.favorited
								? (
									<div className="favorite-container">
										<Spin indicator={antIcon} spinning={post.slug === slug && isFavoriteLouding}>
											<LikeFilled
												className="favorite-btn" style={{ color: "#0a6fff" }}
												onClick={() => this.handleUnfavorite(post.slug)}
											/>
											<Badge
												className="site-badge-count-109"
												count={post.favoritesCount}
												style={{ backgroundColor: '#52c41a' }}
											/>
										</Spin>
									</div>
								) : (
									<div className="favorite-container">
										<Spin indicator={antIcon} spinning={post.slug === slug && isFavoriteLouding}>
											<LikeOutlined
												className="favorite-btn"
												onClick={() => this.handleFavorite(post.slug)}
											/>
											<Badge
												className="site-badge-count-109"
												count={post.favoritesCount}
												style={{ backgroundColor: '#52c41a' }}
											/>
										</Spin>
									</div>
								),
								<EditOutlined key="edit" />,
								<EllipsisOutlined key="ellipsis" />,
							]}
						>
							<Meta
									avatar={<Avatar src={post.author.image} />}
									title={post.slug}
									description={post.description}
							/>
							{ post.tagList.length ? (
								<div className="tags">
									{post.tagList.map(tag => (
										<Tag color="gold" key={tag}>{tag}</Tag>
									))}
								</div>
							) : null}
						</Card>
					</div>
				))}
				<Divider />
				<Pagination onChange={this.handleNextPage} size="small" total={500} />
				<Divider />
			</>
		);
	}
};
