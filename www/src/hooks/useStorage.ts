type StorageTypes = 'SESSION';

export const useStorage = (type: StorageTypes) => {
	const storage = () => {
		return localStorage.getItem(type);
	};

	const setStorage = (value: any) => {
		localStorage.setItem(type, value);
	};

	return [storage, setStorage];
};
