export const getUniqueItem = (detail: string) => {
	return detail.split(' ')[1].split('=')[0].replace('(', '').replace(')', '');
};
