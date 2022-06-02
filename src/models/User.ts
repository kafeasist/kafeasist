import { Schema, model } from 'mongoose';

export interface UserInterface {
	name: string;
	last_name: string;
	phone: string;
	address: string;
	email: string;
	password: string;
	companies?: number[];
	created_at?: Date;
	updated_at?: Date;
}

const userModel = new Schema<UserInterface>({
	name: { type: String, required: true },
	last_name: { type: String, required: true },
	phone: { type: String, required: true, unique: true },
	address: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	companies: [{ type: Number, unique: true }],
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

export default model<UserInterface>('User', userModel);
