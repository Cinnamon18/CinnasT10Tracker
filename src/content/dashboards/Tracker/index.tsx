import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import RecentOrders from './RecentOrders';
import DataLoader from 'src/utils/dataloader';
import Region from 'src/models/region';
import React from 'react';
import User from 'src/models/user';
import GbpEvent from "src/models/gbp_event";

interface IDashboardTrackerProps { }
interface IDashboardTrackerState {
	users: { [uid: number]: User } | null,
	isLoading: boolean,
}

class DashboardTracker extends React.Component<IDashboardTrackerProps, IDashboardTrackerState> {
	private id: number | undefined;
	private region: Region;
	private timerId: any;

	constructor(props) {
		super(props);
		this.state = {
			users: null,
			isLoading: false,
		};

		this.id = undefined;
		this.region = Region.EN;

		this.loadData();
	}


	componentDidMount() {
		// Reload data every 120 seconds
		this.timerId = setInterval(
			() => {
				this.loadData()
			},
			120 * 1000
		);
	}

	componentWillUnmount() {
		clearInterval(this.timerId);
	}

	private async loadData() {
		this.setState({
			isLoading: true,
		});
		const dataLoader = DataLoader.getInstance();
		await dataLoader.loadEvents();

		dataLoader.region = this.region;
		if (this.id) {
			// Events are 1 indexed.... why.... (thus index is 1 less than id)
			dataLoader.selectedEvent = dataLoader.events[this.id - 1];
		}

		await dataLoader.loadData()
		
		this.setState({
			users: dataLoader.users,
			isLoading: false,
		});
	}

	public setEventInfo(newEventId?: number, newRegion?: Region): void {
		console.log(newEventId + " " + newRegion);
		this.id = newEventId ?? this.id;
		this.region = newRegion ?? this.region;
		this.loadData();
	}

	render() {
		return (
			<>
				<Helmet>
					<title>T10 Tracker</title>
				</Helmet>
				<PageTitleWrapper>
					<PageHeader
						setEventInfo={this.setEventInfo.bind(this)}
						isLoading={this.state.isLoading}
					/>
				</PageTitleWrapper>
				<Container maxWidth="lg">
					<Grid
						container
						direction="row"
						justifyContent="center"
						alignItems="stretch"
						spacing={3}
					>
						<Grid item xs={12}>
							{this.state.users ?
								<div>
									{
										Object.keys(this.state.users).length > 0 ?
											<RecentOrders
												// Sort in descending order of EP
												users={Object.values(this.state.users).sort((a, b) => (b.stats.eventPoints - a.stats.eventPoints))}
											/>
											:
											<div>No data available. Bestdori doesn't have detailed data for many early events (And, of course, future events).</div>
									}
								</div>
								:
								<div>Loading...</div>
							}
						</Grid>
					</Grid>
				</Container>
				<Footer />
			</>
		);
	}
}

export default DashboardTracker;
