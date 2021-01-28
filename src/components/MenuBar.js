import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Item } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';

function MenuBar() {
	const { user, logout } = useContext(AuthContext);

	const handleItemClick = (e, { name }) => setActiveItem(name);
	const pathname = window.location.pathname;
	const path = pathname === '/' ? 'home' : pathname.substr(1);

	const [activeItem, setActiveItem] = useState(path);

	const menuBar = user ? (
		<Menu className="menu-bar" pointing secondary size="large" color="teal">
			<Menu.Item name={user.username} active as={Link} to="/">
				<Item>
					<Item.Image
						size="mini"
						circular
						src="https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
					/>
					<Item.Content verticalAlign="middle">
						<Item.Header
							color="teal"
							className="user-title" 
							content={`What's new, ${user.username}?`}
						/>
					</Item.Content>
				</Item>
			</Menu.Item>

			<Menu.Menu position="right">
				<Menu.Item name="logout" onClick={logout} />
			</Menu.Menu>
		</Menu>
	) : (
		<Menu pointing secondary size="massive" color="teal">
			<Menu.Item
				name="home"
				active={activeItem === 'home'}
				onClick={handleItemClick}
				as={Link}
				to="/"
			/>

			<Menu.Menu position="right">
				<Menu.Item
					name="login"
					active={activeItem === 'login'}
					onClick={handleItemClick}
					as={Link}
					to="/login"
				/>
				<Menu.Item
					name="register"
					active={activeItem === 'register'}
					onClick={handleItemClick}
					as={Link}
					to="/register"
				/>
			</Menu.Menu>
		</Menu>
	);

	return menuBar;
}

export default MenuBar;
