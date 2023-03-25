import { useContext } from 'solid-js';
import { AuthContext } from '../context/AuthContext';

export const useAuthContext = () => {
	return useContext(AuthContext);
};
