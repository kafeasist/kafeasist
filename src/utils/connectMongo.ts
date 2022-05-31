import mongoose from 'mongoose';

export const connectMongo = (connectionString: string) => {
	mongoose.connect(connectionString, (err) => {
		if (!err) console.log('Connection established with Mongo server');
		else
			console.error(
				new Error(
					'Connection failed to initiate whilst connecting to Mongo server',
				),
			);
	});
};
