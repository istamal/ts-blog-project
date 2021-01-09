import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Id {
	id: string
}

const Post: React.FC = (): JSX.Element => {
	const [article, setArticle] = useState({});

	const { id }: Id = useParams();

	useEffect( (): void => {
		const fetchArticle = async () => {
			const result = await axios.get(`https://conduit.productionready.io/api/articles/${id}`);
			setArticle(result.data);
		}

		fetchArticle();
	});

	console.log(article);

	return(
		<>
			<h1>fdghdfghfdhf</h1>
			<p>gfdhgfdhfdghfg</p>
		</>
	);
}

export default Post;