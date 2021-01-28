import React, { useContext, useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
	Button,
	Card,
	Form,
	Grid,
	Icon,
	Image,
	Label,
} from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';
import { FETCH_POST, CREATE_COMMENT } from '../utils/graphql-queries';

function SinglePost(props) {
	const { user } = useContext(AuthContext);
	const commentInputRef = useRef(null);

	const postId = props.match.params.postId;
	console.log(postId);
	const { data: { getPost } = {} } = useQuery(FETCH_POST, {
		variables: { postId },
	});

	const [comment, setComment] = useState('');

	const [submitComment] = useMutation(CREATE_COMMENT, {
		update() {
			setComment('');
			commentInputRef.current.blur();
		},
		variables: {
			postId: postId,
			body: comment,
		},
	});

	function postDeletedCallback() {
		props.history.push('/');
	}

	let postMarkup;
	if (!getPost) {
		postMarkup = <p>Loading post...</p>;
	} else {
		const {
			id,
			body,
			createdAt,
			username,
			comments,
			likes,
			likeCount,
			commentCount,
		} = getPost;

		postMarkup = (
			<Grid>
				<Grid.Row>
					<Grid.Column width={2}>
						<Image
							circular
							floated="right"
							size="small"
							src="https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
						/>
					</Grid.Column>
					<Grid.Column width={10}>
						<Card fluid>
							<Card.Content>
								<Card.Header>{username}</Card.Header>
								<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
								<Card.Description>{body}</Card.Description>
							</Card.Content>
							<hr />
							<Card.Content extra>
								<LikeButton user={user} post={{ id, likeCount, likes }} />
								<Button
									as="div"
									labelPosition="right"
									onClick={() => console.log('comment!')}
								>
									<Button basic color="blue">
										<Icon name="comments" />
									</Button>
									<Label basic color="blue" pointing="left">
										{commentCount}
									</Label>
								</Button>
								{user && user.username === username && (
									<DeleteButton postId={id} callback={postDeletedCallback} />
								)}
							</Card.Content>
						</Card>
						{user && (
							<Card fluid>
								<Card.Content>
									<Form>
										<div className="ui action input fluid">
											<input
												type="text"
												placeholder="give OP your 2 cents..."
												name="comment"
												value={comment}
												ref={commentInputRef}
												onChange={(event) => setComment(event.target.value)}
											></input>
											<button
												type="submit"
												className="ui button teal"
												disabled={comment.trim() === ''}
												onClick={submitComment}
											>
												Submit
											</button>
										</div>
									</Form>
								</Card.Content>
							</Card>
						)}
						{comments.map((comment) => (
							<Card fluid key={comment.id}>
								<Card.Content>
									<Image
										circular
										floated="left"
										size="mini"
										src="https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
									/>
									<Card.Header>{comment.username}</Card.Header>
									<Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
									<Card.Description>{comment.body}</Card.Description>
									{user && user.username === comment.username && (
										<DeleteButton postId={id} commentId={comment.id} />
									)}
								</Card.Content>
							</Card>
						))}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
	return postMarkup;
}

export default SinglePost;
