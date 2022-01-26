import { Typography, Button, Grid, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import React from 'react';
import DataLoader from 'src/utils/dataloader';
import Region from 'src/models/region';
import { WatchLater, WatchLaterTwoTone } from '@mui/icons-material';


interface IDashboardTrackerProps {
	setEventInfo: (eventId?: number, region?: Region) => void;
}

interface IDashboardTrackerState {
}

class PageHeader extends React.Component<IDashboardTrackerProps, IDashboardTrackerState> {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<Grid container justifyContent="flex-start" alignItems="center" spacing={3}>
				<Grid item xs={4} md={3}>
					<Typography variant="h3" component="h3" gutterBottom>
						{DataLoader.getInstance().selectedEvent.name}
					</Typography>
					<Typography variant="subtitle2">
						{"Event number " + DataLoader.getInstance().selectedEvent.id}
					</Typography>
				</Grid>
				<Grid item xs={4} md={3}>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Event</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={DataLoader.getInstance().selectedEvent.id}
							label="Event"
							onChange={(event) => {
								this.props.setEventInfo(event.target.value as number);
							}}
						>
							{DataLoader.getInstance().events.map(event => (
								<MenuItem key={event.id} value={event.id}>{event.name}</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={4} md={3}>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Region</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={DataLoader.getInstance().region}
							label="Region"
							onChange={(event) => {
								this.props.setEventInfo(null, event.target.value as Region);
							}}
						>
							{Object.keys(Region).filter(k => typeof Region[k as any] === "number").map(region => (
								<MenuItem key={region} value={Region[region]}>{region}</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				{/* <Grid item xs={3}>
					<Button
						variant="contained"
						startIcon={<WatchLater />}
					>
						Current event
					</Button>
				</Grid> */}
			</Grid>
		);
	}
}

export default PageHeader;
