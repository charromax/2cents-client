import React, { useContext } from 'react';
import { Card, Button, Image, Icon, Label, Popup } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from '../utils/MyPopup';

function PostCard({
	post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
	const { user } = useContext(AuthContext);

	return (
		<Card fluid>
			<Card.Content>
				<Image
					circular
					floated="right"
					size="mini"
					src="https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
				/>
				<Card.Header>{username}</Card.Header>
				<Card.Meta as={Link} to={`posts/${id}`}>
					{moment(createdAt).fromNow()}
				</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton user={user} post={{ id, likeCount, likes }} />
				<MyPopup content={'give OP your 2 cents!'}>
					<Button labelPosition="right" as={Link} to={`/posts/${id}`}>
						<Button basic color="blue">
							<Icon name="comments" />
						</Button>
						<Label as="a" basic color="blue" pointing="left">
							{commentCount}
						</Label>
					</Button>
				</MyPopup>

				{user && user.username === username && (
					<DeleteButton
						postId={
							id //if there's a user logged in and matches your username then you can delete post
						}
					/>
				)}
			</Card.Content>
		</Card>
	);
}

export default PostCard;
