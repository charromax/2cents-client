import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Label } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import MyPopup from '../utils/MyPopup';

function LikeButton({ user, post: { id, likeCount, likes } }) {
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		if (user && likes.find((like) => like.username === user.username)) {
			setLiked(true);
		} else setLiked(false);
	}, [user, likes]);

	const [likeDislikePost] = useMutation(LIKE_POST, {
		variables: { postId: id },
	});

	const likeButton = user ? (
		liked ? (
			<Button color="teal" >
				<Icon name="heart" />
			</Button>
		) : (
			<Button color="teal" basic>
				<Icon name="heart" />
			</Button>
		)
	) : (
		<Button color="teal" basic as={Link} to="/login">
			<Icon name="heart" />
		</Button>
	);

	return (
		<Button as="div" labelPosition="right" onClick={likeDislikePost}>
			<MyPopup content={liked ? 'Unlike' : 'Like'}>
				{likeButton}
			</MyPopup>
			
			<Label as="a" basic color="teal" pointing="left">
				{likeCount}
			</Label>
		</Button>
	);
}

const LIKE_POST = gql`
	mutation likeDislike($postId: ID!) {
		likeDislike(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`;

export default LikeButton;
