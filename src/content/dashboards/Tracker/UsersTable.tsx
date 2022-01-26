import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
	Tooltip,
	Divider,
	Box,
	FormControl,
	InputLabel,
	Card,
	Checkbox,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	TableContainer,
	Select,
	MenuItem,
	Typography,
	useTheme,
	CardHeader
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import User from 'src/models/user';

interface UsersTableProps {
	className?: string;
	users: User[];
}

const applyPagination = (
	users: User[],
	page: number,
	limit: number
): User[] => {
	return users.slice(page * limit, page * limit + limit);
};

const UsersTable: FC<UsersTableProps> = ({ users }) => {

	const [selectedUsers, setSelectedUsers] = useState<string[]>(
		[]
	);
	const selectedBulkActions = selectedUsers.length > 0;
	const [page, setPage] = useState<number>(0);
	const [limit, setLimit] = useState<number>(10);

	const statusOptions = [
		{
			id: 'all',
			name: 'All'
		},
		{
			id: 'completed',
			name: 'Completed'
		},
		{
			id: 'pending',
			name: 'Pending'
		},
		{
			id: 'failed',
			name: 'Failed'
		}
	];

	const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
		let value = null;

		if (e.target.value !== 'all') {
			value = e.target.value;
		}
	};

	const handleSelectAllUsers = (
		event: ChangeEvent<HTMLInputElement>
	): void => {
		setSelectedUsers(
			event.target.checked
				? users.map((user) => user.id.toString())
				: []
		);
	};

	const handleSelectOneUser = (
		event: ChangeEvent<HTMLInputElement>,
		userId: string
	): void => {
		if (!selectedUsers.includes(userId)) {
			setSelectedUsers((prevSelected) => [
				...prevSelected,
				userId
			]);
		} else {
			setSelectedUsers((prevSelected) =>
				prevSelected.filter((id) => id !== userId)
			);
		}
	};

	const handlePageChange = (event: any, newPage: number): void => {
		setPage(newPage);
	};

	const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setLimit(parseInt(event.target.value));
	};

	const paginatedUsers = applyPagination(
		users,
		page,
		limit
	);
	const selectedSomeUsers =
		selectedUsers.length > 0 &&
		selectedUsers.length < users.length;
	const selectedAllUsers =
		selectedUsers.length === users.length;
	const theme = useTheme();

	const timeStampNow = new Date(users[0].stats.computedAtTime)
	const timeStampAnHourAgo = new Date(users[0].stats.computedAtTime - (60 * 60 * 1000));

	return (
		<Card>
			<CardHeader
				title="T10+ Runners"
				subheader={`Last updated ${timeStampNow}`}
			/>
			<Divider />
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Nickname</TableCell>
							<TableCell align="left">Total EP</TableCell>
							<Tooltip arrow title={`This may be slightly undercounted. The (rather infrequent) case when a user completes 2 games in the same 2 minute window is considered a single game.`} placement="top">
								<TableCell align="left">Total Games</TableCell>
							</Tooltip>
							<Tooltip arrow title={`Event points scored for games completed between 60 minutes ago (${timeStampAnHourAgo}) and now (${timeStampNow})`} placement="top">
								<TableCell align="left">EP last hour</TableCell>
							</Tooltip>
							<Tooltip arrow title={`Games completed between 60 minutes ago (${timeStampAnHourAgo}) and now (${timeStampNow})`} placement="top">
								<TableCell align="left">Games last hour</TableCell>
							</Tooltip>
							<Tooltip arrow title="Has their score changed in the last 10 minutes?" placement="top">
								<TableCell align="left">Active</TableCell>
							</Tooltip>
							<Tooltip arrow title="Average games / hour when the user is active (somewhat innacurate)" placement="top">
								<TableCell align="left">AAG/H</TableCell>
							</Tooltip>
							<Tooltip arrow title="Average ep / hour when the user is active (somewhat innacurate)" placement="top">
								<TableCell align="left">AAEP/H</TableCell>
							</Tooltip>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedUsers.map((user) => {
							const isUserSelected = selectedUsers.includes(
								user.id.toString()
							);
							return (
								<TableRow
									hover
									key={user.id}
									selected={isUserSelected}
								>
									<TableCell padding="checkbox">
										<Typography
											variant="body1"
											color="text.primary"
											gutterBottom
											noWrap
										>
											{user.id}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											variant="body1"
											fontWeight="bold"
											color="text.primary"
											gutterBottom
											noWrap
										>
											{user.nickname}
										</Typography>
									</TableCell>
									<TableCell align="left">
										<Typography
											variant="body1"
											fontWeight="bold"
											color="text.primary"
											gutterBottom
											noWrap
										>
											{"" + user.stats.eventPoints.toLocaleString("en-US")}
										</Typography>
									</TableCell>
									<TableCell align="left">
										<Typography
											variant="body1"
											fontWeight="bold"
											color="text.primary"
											gutterBottom
											noWrap
										>
											{"" + user.stats.totalGames.toLocaleString("en-US")}
										</Typography>
									</TableCell>
									<TableCell align="left">
										<Typography
											variant="body1"
											fontWeight="bold"
											color="text.primary"
											gutterBottom
											noWrap
										>
											{"" + user.stats.epLastHourWindow.toLocaleString("en-US")}
										</Typography>
										{/* <Typography variant="body2" color="text.secondary" noWrap>
                      {user.stats.epLastCompleteHour}
                    </Typography> */}
									</TableCell>
									<TableCell align="left">
										<Typography
											variant="body1"
											fontWeight="bold"
											color="text.primary"
											gutterBottom
											noWrap
										>
											{user.stats.gamesLastHourWindow}
										</Typography>
										{/* <Typography variant="body2" color="text.secondary" noWrap>
                      {user.stats.gamesLastCompleteHour}
                    </Typography> */}
									</TableCell>
									<TableCell align="left">
										<Typography
											variant="body1"
											fontWeight="bold"
											color="text.primary"
											gutterBottom
											noWrap
										>
											{user.stats.isPlaying ? "\u2705" : "\u274c"}
										</Typography>
									</TableCell>
									<TableCell align="left">
										<Typography
											variant="body1"
											fontWeight="bold"
											color="text.primary"
											gutterBottom
											noWrap
										>
											{user.stats.activeAverageGamesPerHour.toFixed(2)}
										</Typography>
									</TableCell>
									<TableCell align="left">
										<Typography
											variant="body1"
											fontWeight="bold"
											color="text.primary"
											gutterBottom
											noWrap
										>
											{"" + Math.round(user.stats.activeAverageEpPerHour).toLocaleString("en-US")}
										</Typography>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<Box p={2}>
				<TablePagination
					component="div"
					count={users.length}
					onPageChange={handlePageChange}
					onRowsPerPageChange={handleLimitChange}
					page={page}
					rowsPerPage={limit}
					rowsPerPageOptions={[5, 10, 25, 30]}
				/>
			</Box>
		</Card>
	);
};

UsersTable.propTypes = {
	users: PropTypes.array.isRequired
};

UsersTable.defaultProps = {
	users: []
};

export default UsersTable;
