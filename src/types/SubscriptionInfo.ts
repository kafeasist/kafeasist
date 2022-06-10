export enum SubscriptionTypes {
	FREE,
	SMALL,
	MEDIUM,
	LARGE,
}

export enum SubscriptionLength {
	MONTHLY,
	ANNUALY,
	INF,
}

export enum Amount {
	INF,
}

interface Limits {
	FREE: number | Amount;
	SMALL: number | Amount;
	MEDIUM: number | Amount;
	LARGE: number | Amount;
}

export class SubscriptionLimits {
	private company: Limits = {
		FREE: 1,
		SMALL: 3,
		MEDIUM: 7,
		LARGE: Amount.INF,
	};

	private table: Limits = {
		FREE: 12,
		SMALL: Amount.INF,
		MEDIUM: Amount.INF,
		LARGE: Amount.INF,
	};

	public getCompany = (type: SubscriptionTypes): number => {
		switch (type) {
			case SubscriptionTypes.FREE:
				return this.company.FREE;
			case SubscriptionTypes.SMALL:
				return this.company.SMALL;
			case SubscriptionTypes.MEDIUM:
				return this.company.MEDIUM;
			default:
				return this.company.LARGE;
		}
	};

	public getTable = (type: SubscriptionTypes): number => {
		switch (type) {
			case SubscriptionTypes.FREE:
				return this.table.FREE;
			case SubscriptionTypes.SMALL:
				return this.table.SMALL;
			case SubscriptionTypes.MEDIUM:
				return this.table.MEDIUM;
			default:
				return this.table.LARGE;
		}
	};
}
