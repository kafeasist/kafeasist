export const logger = (message: string) => {
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	const d = new Date();
	const date = `${d.getDate()}-${
		months[d.getMonth()]
	}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}.${d.getSeconds()}`;

	return console.info(`[${date}] ${message}`);
};
