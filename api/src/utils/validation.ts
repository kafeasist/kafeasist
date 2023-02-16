export const usernameValidation = (username: string | undefined) => {
	if (!username) return false;

	if (username.toLowerCase() !== username) return false;

	const regex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

	return regex.test(username);
};

export const nameValidation = (name: string | undefined) => {
	if (!name) return false;

	if (name.length < 2 || name.length > 24) return false;

	const regex =
		/^[a-zA-ZàáâäãåąčćęèéêëėıįìíîïłńòóôöõøùúûüųūÿýżźñçčşšžğÀÁÂÄÃÅĄĆÇČĖĘÈÉÊËÌİÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŞŽĞ∂ð']+$/u;

	return regex.test(name);
};

export const phoneValidation = (phone: string | undefined) => {
	if (!phone) return false;

	const regex = /^(\+90\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

	return regex.test(phone);
};

export const emailValidation = (email: string | undefined) => {
	if (!email) return false;

	const regex =
		/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

	return regex.test(email);
};

export const passwordValidation = (password: string | undefined) => {
	if (!password) return false;

	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,24}$/;

	return regex.test(password);
};

export const addressValidation = (address: string | undefined) => {
	if (!address) return false;

	const regex =
		/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

	return regex.test(address);
};
