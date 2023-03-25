import { User } from '../types/User';
import { getSubscriptionType } from '@kafeasist/api/src/utils/getSubscriptionType';
import { SubscriptionTypes } from '@kafeasist/api/src/utils/SubscriptionInfo';
import { Component, createContext, createSignal, JSXElement } from 'solid-js';

export const AuthContext = createContext();

type IAuthProvider = {
	isAuth: boolean;
	user: User;
	children: JSXElement;
};

export const AuthProvider: Component<IAuthProvider> = (props) => {
	const [user, setUser] = createSignal<User>(props.user),
		auth = [
			user,
			{
				setUser,
				getId() {
					return user().id;
				},
				getName() {
					return user().firstName + ' ' + user().lastName;
				},
				getPhone() {
					return user().phone;
				},
				getEmail() {
					return user().email;
				},
				isVerified() {
					return user().verified;
				},
				getSubsType() {
					const subsType = getSubscriptionType(user().subsType);
					if (!subsType) return SubscriptionTypes.FREE;
					return subsType;
				},
			},
		];

	return (
		<AuthContext.Provider value={auth}>
			{props.children}
		</AuthContext.Provider>
	);
};
