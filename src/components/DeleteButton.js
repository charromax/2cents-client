import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Confirm, Icon } from 'semantic-ui-react';
import { FETCH_ALL_POSTS, FETCH_POST, DELETE_POST, DELETE_COMMENT } from '../utils/graphql-queries';

function DeleteButton({ postId, callback, commentId }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

	const [deletePostOrComment] = useMutation(mutation, {
		update: (cache, response) => {
			setConfirmOpen(false);
			if (!commentId) {
				const existingCache = cache.readQuery({ query: FETCH_ALL_POSTS });
				if (existingCache) {
					const idToDelete = response.data.deletePost.id;
					const updatedPosts = existingCache.getPosts.filter(
						(p) => p.id !== idToDelete
					);

					const updatedCache = {
						...existingCache,
						getPosts: {
							...existingCache.getPosts,
							posts: updatedPosts,
						},
					};

					cache.writeQuery({
						query: FETCH_ALL_POSTS,
						data: updatedCache,
					});
				}
			} else {
				console.log('comment delete');
				const existingCache = cache.readQuery({ query: FETCH_POST });
				if (existingCache) {
					const updatedPost = existingCache.getPost.comments.filter(
						(comment) => comment.id !== commentId
					);

					const updatedCache = {
						...existingCache,
						getPost: {
							...existingCache.getPost,
							post: updatedPost,
						},
					};

					cache.writeQuery({
						query: FETCH_POST,
						data: updatedCache,
					});
				}
			}
			if (callback) callback();
		},
		variables: {
			postId,
			commentId,
		},
		onError(error) {
			console.log(error);
		},
	});
	return (
		<>
			<Button
				as="div"
				color="red"
				floated="right"
				icon
				onClick={() => setConfirmOpen(true)}
			>
				<Icon
					name="trash"
					style={{
						margin: 0,
					}}
				></Icon>
			</Button>
			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrComment}
			/>
		</>
	);
}



export default DeleteButton;
