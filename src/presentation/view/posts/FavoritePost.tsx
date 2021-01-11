import React from 'react';
import { Badge, Spin } from 'antd';
import { LikeOutlined, LikeFilled, LoadingOutlined } from '@ant-design/icons';
import { Article } from '../../../domain/entity/posts/structures/PostsResult';

const antIcon: JSX.Element = <LoadingOutlined style={{ fontSize: 24 }} spin />;

type FavoritePostProps = {
	favorited: boolean
	slug: string
	post: Article
	isLoading: boolean
	onClick: (slug: string) => {}
};

const FavoritePost: React.FC<FavoritePostProps> = (props): JSX.Element => {
	const { post, slug, isLoading, onClick, favorited } = props;

	return favorited
	? (
		<div className="favorite-container">
			<Spin indicator={antIcon} spinning={post.slug === slug && isLoading}>
				<LikeFilled
					className="favorite-btn" style={{ color: "#0a6fff" }}
					onClick={() => onClick(post.slug)}
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
			<Spin indicator={antIcon} spinning={post.slug === slug && isLoading}>
				<LikeOutlined
					className="favorite-btn"
					onClick={() => props.onClick(post.slug)}
				/>
				<Badge
					className="site-badge-count-109"
					count={post.favoritesCount}
					style={{ backgroundColor: '#52c41a' }}
				/>
			</Spin>
		</div>
	);
};

export default FavoritePost;