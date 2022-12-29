import 'reflect-metadata';
import { env } from './config/constants';
import { orm } from './config/typeorm.config';
import app from './app';

if (require.main === module) {
	orm.initialize()
		.then(() => {
			console.log('Database connected');
			app.listen(env.PORT, () =>
				console.log(`Listening on :${env.PORT}`),
			);
		})
		.catch((err) => console.log(err.message));
}
