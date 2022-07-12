import 'reflect-metadata';
import { __port__ } from './config/constants';
import { orm } from './config/typeorm.config';
import app from './app';

if (require.main === module) {
	orm.initialize()
		.then(() => {
			console.log('Database connected');
			app.listen(__port__, () =>
				console.log(`Listening on :${__port__}`),
			);
		})
		.catch((err) => console.log(err.message));
}
