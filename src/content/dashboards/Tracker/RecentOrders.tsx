import { Card } from '@mui/material';
import { CryptoOrder } from 'src/models/crypto_order';
import UsersTable from './UsersTable';
import { subDays } from 'date-fns';
import DataLoader from 'src/utils/dataloader';
import React from 'react';
import User from 'src/models/user';

interface IRecentOrdersProps {
	users: User[]
}

class RecentOrders extends React.Component<IRecentOrdersProps> {

	constructor(props) {
		super(props);
	}

	render(): JSX.Element {
		return (
			<Card>
				<UsersTable users={this.props.users} />
			</Card>
		);
	}
}

export default RecentOrders;
