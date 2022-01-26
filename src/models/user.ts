import PointsAtTime from "./points_at_time";
import Statistics from "./statistics";

class User {
	constructor(
		public id: number = 0,
		public nickname: string = "",
		public pointsAtTimes: PointsAtTime[] = [],
		public stats: Statistics = null,
	) { }

	// Assuming our pointsAtTimes has been filled, compute our statistics from it.
	public computeStatistics() {
		if(!this.pointsAtTimes || !this.pointsAtTimes[0]) {
			console.error("Null points at times object");
			return;
		}

		// Sort in ascending time order
		this.pointsAtTimes.sort( (a, b) => (a.time - b.time));
		this.stats = new Statistics();

		// Useful consts
		const mostRecentPoints = this.pointsAtTimes[this.pointsAtTimes.length - 1];
		const milisecondsPerMinute = 60 * 1000;
		const tenMinutesBeforeNowMs = Date.now() - (10 * milisecondsPerMinute);
		const oneHourBeforeNowMs = Date.now() - (60 * milisecondsPerMinute);



		// Okay, actual computations

		// Computed time
		this.stats.computedAtTime = Date.now();

		// Grab current ep!
		this.stats.eventPoints = mostRecentPoints.points

		// Total games
		let totalGames = 0;
		for (let i = 1; i < this.pointsAtTimes.length; i++) {
			if (this.pointsAtTimes[i].points > this.pointsAtTimes[i - 1].points) {
				totalGames++;
			}
		}
		this.stats.totalGames = totalGames;

		// Has the user registered an increase in score in the last 10 minutes
		let hasScoreIncreased = false;
		for(let i = 1; i < this.pointsAtTimes.length; i++) {
			if(this.pointsAtTimes[i].time >= tenMinutesBeforeNowMs) {
				if(this.pointsAtTimes[i].points > this.pointsAtTimes[i - 1].points) {
					hasScoreIncreased = true;
					break;
				}
			}
		}
		this.stats.isPlaying = hasScoreIncreased;

		// How many ep did they score in the last sliding window hour?
		for(let pointsAtTime of this.pointsAtTimes) {
			if(pointsAtTime.time >= oneHourBeforeNowMs) {
				this.stats.epLastHourWindow = mostRecentPoints.points - pointsAtTime.points
				break;
			}
		}

		// How many games did they play in the last sliding window hour
		let games = 0
		for(let i = 1; i < this.pointsAtTimes.length; i++) {
			if (this.pointsAtTimes[i].time >= oneHourBeforeNowMs) {
				if (this.pointsAtTimes[i].points > this.pointsAtTimes[i - 1].points) {
					games++;
				}
			}
		}
		this.stats.gamesLastHourWindow = games;

		// When the user is active, how much ep / hour do they average?
		// When the user is active, how many games / hour do they manage?
		let lastActiveGame: PointsAtTime = this.pointsAtTimes[0];
		let isActiveNow: boolean = false;
		let activeMs: number = 0;
		for (let i = 5; i < this.pointsAtTimes.length; i++) {
			const thisGame = this.pointsAtTimes[i];
			if (thisGame.points > lastActiveGame.points) {
				lastActiveGame = thisGame;
			}
			
			//If last active game was more than 10 minutes ago, we're no longer active.
			// This approach adds 10 extra minutes onto your playtime whenever you take a break, which hurts
			// your averages. Buuuut getting the exact logic right seems tricky so I think this is good enough....
			isActiveNow = (lastActiveGame.time > (thisGame.time - (10 * milisecondsPerMinute)));
			const hasBeenPlayingFor10Minutes = this.pointsAtTimes[i - 5].points < thisGame.points

			// Increase active ms if we r active!
			if (isActiveNow && hasBeenPlayingFor10Minutes) {
				activeMs += thisGame.time - this.pointsAtTimes[i - 1].time;
			}
		}
		this.stats.activeAverageEpPerHour = this.stats.eventPoints / activeMs * milisecondsPerMinute * 60
		this.stats.activeAverageGamesPerHour = totalGames / activeMs * milisecondsPerMinute * 60
		if (!isFinite(this.stats.activeAverageEpPerHour)) {
			this.stats.activeAverageEpPerHour = 0;
		}
		if (!isFinite(this.stats.activeAverageGamesPerHour)) {
			this.stats.activeAverageGamesPerHour = 0;
		}


	}
}

export default User;