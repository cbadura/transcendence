export interface Achievement {
	id: number,
	date_unlocked: string,
	achievementDefinition: {
		id: number,
		name: string,
		description: string,
		criteria: {
			matches: number
		}
	}
}

