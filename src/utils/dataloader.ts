import User from "src/models/user";
import Region from "src/models/region";
import PointsAtTime from "src/models/points_at_time";
import GbpEvent from "src/models/gbp_event";

class DataLoader {
	private static readonly corsProxyUrl: string = "https://peaceful-escarpment-08242.herokuapp.com/";
	private static instance: DataLoader

	// User configured
	selectedEvent: GbpEvent = new GbpEvent(0, "Loading...");
	region: Region = Region.EN;

	// Loaded
	users: {[uid: number]: User} = {};
	events: GbpEvent[] = [];

	static getInstance(): DataLoader {
		if (this.instance == null) {
			this.instance = new DataLoader();
		}
		return this.instance;
	}

	public async loadEvents() {
		let currentEvent = null;

		const response = await fetch(`${DataLoader.corsProxyUrl}https://bestdori.com/api/events/all.6.json`)
		const json = await response.json() as JSON
		
		this.events = []
		for (let i in json) {
			// Current event is the event right before the event that hasn't started yet.
			const thisEvent = new GbpEvent(parseInt(i), json[i]["eventName"][Region.EN]);

			const startTime = json[i]["startAt"][Region.EN]
			if (!currentEvent && ( (startTime > Date.now()) || startTime == undefined ) ) {
				currentEvent = this.events[this.events.length - 1];
			}

			this.events.push(thisEvent)
		}

		this.selectedEvent = currentEvent;
	}

	public async loadData(): Promise<unknown> {
		this.users = [];

		const dataPromise = new Promise( (resolve, reject) => {
			// fetch(`${DataLoader.corsProxyUrl}https://bestdori.com/api/eventtop/data?server=${this.region}&event=${this.eventId}&mid=0&interval=3600000`, {mode: 'cors'})
			fetch(`${DataLoader.corsProxyUrl}https://bestdori.com/api/eventtop/data?server=${this.region}&event=${this.selectedEvent.id}&mid=0&interval=0`)
			.then( response => {
				response.json().then(json => {
						this.processRawData(json);
						resolve(json)
					})
				})
				.catch( error => {
					console.error(error);
					reject();
				})
		});
		return dataPromise;
	}

	private processRawData(rawData: JSON) {
		// Load user data
		for(let userData of rawData["users"]) {
			let user = new User(userData["uid"], userData["name"]);

			this.users[user.id] = user;
		}

		// Process points
		for(let points of rawData["points"]) {
			let user = this.users[points["uid"]]
			
			if(!user) {
				console.error("Couldn't find user with id: " + points["uid"])
				continue;
			}

			user.pointsAtTimes.push(
				new PointsAtTime(points["time"], points["value"])
			);
		}

		// Compute stats!
		for(let uid in this.users) {
			let user = this.users[uid];
			user.computeStatistics();

		}
		// console.log(this.users);
	}
}

export default DataLoader;