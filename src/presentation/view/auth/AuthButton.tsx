import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';

type AuthButtonProps = {
	isAuth: boolean
	handleLogout: () => void
}

const AuthButton: React.FC<AuthButtonProps> = (props): JSX.Element => {
	const { isAuth, handleLogout } = props;

	return (
		<>
			<Button type="link">
				{isAuth ? <Button type="link" onClick={handleLogout}>Logout</Button> : <Link to="/login">Login</Link>}
			</Button>
			<Button
				icon={<PlusOutlined />}
				type="primary" shape="round"
			>
				<Link style={{ color: "white" }} to="add_post">Add Post</Link>
			</Button>
		</>
	);
};

export default AuthButton;