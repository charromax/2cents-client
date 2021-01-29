import { FETCH_ALL_POSTS, CREATE_POST } from '../utils/graphql-queries';
import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useForm } from '../utils/hooks';
import { useMutation } from '@apollo/client';
import MyPopup from '../utils/MyPopup';

function PostForm() {
	const { values, onChange, onSubmit } = useForm(doCreatePost, {
		body: '',
	});

	const [createPost, { error }] = useMutation(CREATE_POST, {
		update(proxy, result) {
			const data = proxy.readQuery({
				query: FETCH_ALL_POSTS,
			});
			proxy.writeQuery({
				query: FETCH_ALL_POSTS,
				data: {
					getPosts: [result.data.createPost, ...data.getPosts],
				},
			});
			values.body = '';
		},
		onError(error) {
			console.log(error);
		},
	});

	function doCreatePost() {
		createPost({ variables: values });
	}

	return (
		<>
			<Form onSubmit={onSubmit}>
				<h2>Your 2 cents:</h2>
				<Form.Field>
					<Form.Input
						placeholder="Hello world!"
						name="body"
						onChange={onChange}
						value={values.body}
						error={error ? true : false}
					/>
					<MyPopup content="give us your 2 cents!">
						<Button type="submit" color="teal">
							Submit
						</Button>
					</MyPopup>
				</Form.Field>
			</Form>
			{error && (
				<div className="ui error message">
					<ul className="list">
						<li>{error.graphQLErrors[0].message}</li>
					</ul>
				</div>
			)}
		</>
	);
}

export default PostForm;
