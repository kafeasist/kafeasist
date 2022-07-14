import { Column, Entity, ManyToOne } from 'typeorm';
import { Company } from './Company';
import { DefaultEntity } from './_DefaultEntity';

export enum UserRoles {
	ADMIN = 'admin',
	REGULAR = 'regular',
}

@Entity()
export class Employee extends DefaultEntity {
	@Column()
	name: string;

	@Column()
	image_url: string;

	@Column({ type: 'enum', enum: UserRoles, default: UserRoles.REGULAR })
	role: UserRoles;

	@Column()
	password: string;

	@ManyToOne(() => Company, (company) => company.employees, {
		onDelete: 'CASCADE',
	})
	company: Company;
}
