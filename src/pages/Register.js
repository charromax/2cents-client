import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from '../utils/hooks';
import { AuthContext } from '../context/auth';

function Register(props) {
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState({});

	const { onChange, onSubmit, values } = useForm(registerUser, {
		username: '',
		password: '',
		confirmPassword: '',
		email: '',
	});

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update(_, { data: { register: userData } }) {
			context.login(userData);
			props.history.push('/');
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
	});

	function registerUser() {
		addUser({ variables: values });
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
				<h1>Register</h1>
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
				<Form.Input
					label="Confirm Password"
					placeholder="Confirm Password..."
					name="confirmPassword"
					type="password"
					error={errors.confirmPassword ? true : false}
					value={values.confirmPassword}
					onChange={onChange}
				/>
				<Form.Input
					label="Email"
					placeholder="Email..."
					name="email"
					type="email"
					value={values.email}
					error={errors.email ? true : false}
					onChange={onChange}
				/>
				<Button type="submit" primary>
					Register
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

const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$password: String!
		$confirmPassword: String!
		$email: String!
	) {
		register(
			registerInput: {
				username: $username
				password: $password
				confirmPassword: $confirmPassword
				email: $email
			}
		) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Register;
