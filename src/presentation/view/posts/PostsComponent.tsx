import React from 'react';
import {
	Card,
	Avatar,
	notification,
	Breadcrumb,
	Pagination,
	Tag,
	Divider
} from 'antd';

import { RouteComponentProps, withRouter } from 'react-router-dom';

import { EditOutlined, EllipsisOutlined } from '@ant-design/icons';

import './posts-component.css';
import BaseView from '../BaseView';
import { Article } from '../../../domain/entity/posts/structures/PostsResult';
import PostsViewModel from '../../view-models/posts/PostsViewModel';
import PostsSkeleton from './PostsSkeleton';
import FavoritePost from './FavoritePost';

const { Meta } = Card;

export interface PostsComponentProps extends RouteComponentProps {
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

class PostsComponent extends React.Component<PostsComponentProps, PostsComponentState>  implements BaseView {
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

	public getPosts = async (page?: number): Promise<void> => {
		this.setState({ isPostsLouded: true });
		if (page) {
			await this.postsViewModel.fetchPosts(page);
		} else {
			await this.postsViewModel.fetchPosts();
		}
		this.setState({ isPostsLouded: false });
		this.postsViewModel.attachView(this);
		this.onViewModelChanged();
	}

	public componentDidMount = async (): Promise<void> => {
		await this.getPosts();
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
		const post = this.state.posts.find(post => post.slug === slug);
		if (localStorage.getItem('token')) {
			this.setState({ isFavoriteLouding: true, slug });
			if (post?.favorited) {
				await this.postsViewModel.unfavorite(slug);
			} else {
				await this.postsViewModel.favorite(slug);
			}
			this.setState({ isFavoriteLouding: false, slug: '' });
		} else {
			this.openNotificationWithIcon(
				'Please sing in',
				'You are not authorized, please sign in',
			);
		}
	}

	// public onPostClick = (e: React.MouseEvent, slug: string) => {
	// 	const clickedElement = e.currentTarget.className;
	// 	console.log(clickedElement);
	// 	if (e.currentTarget) {
	// 		this.postsViewModel.setSlug(slug);
	// 		this.props.history.push(slug);
	// 	}
	// }

	public handleNextPage = async(page: number) => {
		await this.getPosts(page);
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
								// onClick={(e) => this.onPostClick(e, post.slug)}
								hoverable
								style={{ width: "100%" }}
								actions={[
									<FavoritePost
										onClick={this.handleFavorite}
										favorited={post.favorited}
										slug={slug}
										post={post}
										isLoading={isFavoriteLouding}
									/>,
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

export default withRouter(PostsComponent);
