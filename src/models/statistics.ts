class Statistics {
	constructor(
		public computedAtTime: number = 0,
		public eventPoints: number = 0,
		public epLeadOnNextPlayer: number = 0,
		public hoursLeadOnNextPlayer: number = 0,
		public lastEventPoints: number = 0,
		public totalGames: number = 0,
		public isPlaying: boolean = false,
		public uptimeDowntime: number = 0, // Negative is downtime, positive is uptime.
		public epLastCompleteHour: number = 0,
		public epLastHourWindow: number = 0,
		public gamesLastCompleteHour: number = 0,
		public gamesLastHourWindow: number = 0,
		public activeAverageEpPerHour: number = 0,
		public activeAverageGamesPerHour: number = 0,
	) { }
}

export default Statistics;