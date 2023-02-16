export enum SubscriptionTypes {
	FREE,
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
	MEDIUM: number | Amount;
	LARGE: number | Amount;
}

export class SubscriptionLimits {
	private company: Limits = {
		FREE: 1,
		MEDIUM: 3,
		LARGE: Amount.INF,
	};

	private table: Limits = {
		FREE: 12,
		MEDIUM: Amount.INF,
		LARGE: Amount.INF,
	};

	private CATEGORY = 12;

	private category: Limits = {
		FREE: this.CATEGORY,
		MEDIUM: this.CATEGORY * this.company.MEDIUM,
		LARGE: Amount.INF,
	};

	public getCompany = (type: SubscriptionTypes): number => {
		switch (type) {
			case SubscriptionTypes.FREE:
				return this.company.FREE;
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
			case SubscriptionTypes.MEDIUM:
				return this.table.MEDIUM;
			default:
				return this.table.LARGE;
		}
	};

	public getCategory = (type: SubscriptionTypes): number => {
		switch (type) {
			case SubscriptionTypes.FREE:
				return this.category.FREE;
			case SubscriptionTypes.MEDIUM:
				return this.category.MEDIUM;
			default:
				return this.category.LARGE;
		}
	};
}
