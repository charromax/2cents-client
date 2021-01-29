import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import {
	Container,
	Grid,
	Header,
	Transition
} from 'semantic-ui-react';

import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { AuthContext } from '../context/auth';
import { FETCH_ALL_POSTS } from '../utils/graphql-queries';

function Home() {
	const { user } = useContext(AuthContext);
	const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_ALL_POSTS);
	const home = user ? (
		<Container>
			
			<Grid stackable columns={3}>
				<Grid.Row className="page-title">
					<h1>Recent Posts</h1>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<PostForm></PostForm>
					</Grid.Column>
					{loading ? (
						<h1>Loading posts...</h1>
					) : (
						<Transition.Group>
							{posts && posts.map((post) => (
							<Grid.Column key={post.id} style={{ marginBottom: 20 }}>
								<PostCard post={post} />
							</Grid.Column>
							))}
						</Transition.Group>
					)}
				</Grid.Row>
			</Grid>
		</Container>
	) : (
		<Container>
			<Header content="Please login or register to see all of the awesome posts we have here"></Header>
		</Container>
	);
	return home;
}

export default Home;
