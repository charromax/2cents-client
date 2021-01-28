import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from '../utils/hooks';
import { AuthContext } from '../context/auth';


function Login(props) {
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState({});
	const { onChange, onSubmit, values } = useForm(doLogin, {
		username: '',
		password: '',
	});

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(_, { data: { login: userData } }) {
			context.login(userData);
			props.history.push('/');
		},
		onError(err) {
			setErrors(err&&err.graphQLErrors[0]?err.graphQLErrors[0].extensions.exception.errors:{});
		},
	});

	function doLogin() {
		loginUser({ variables: values });
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
				<h1>Login</h1>
				<Form.Input
					label="Username"
					placeholder="Username..."
					name="username"
					type="text"
					value={values.username}
					error={errors.username ? true : false}
					onChange={onChange}
				/>
				<Form.Input
					label="Password"
					placeholder="Password..."
					name="password"
					type="password"
					error={errors.password ? true : false}
					value={values.password}
					onChange={onChange}
				/>
				<Button type="submit" primary>
					Login
				</Button>
			</Form>
			{Object.keys(errors).length > 0 && (
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors).map((value) => (
							<li key={value}>{value}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			username
			token
		}
	}
`;

export default Login;
