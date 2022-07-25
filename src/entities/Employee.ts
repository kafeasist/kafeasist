import { Column, Entity, ManyToOne } from 'typeorm';
import { Company } from './Company';
import { DefaultEntity } from './_DefaultEntity';

export const isValidRole = (role: any) => {
	return Object.values(UserRoles).includes(role);
};

enum UserRoles {
	ADMIN = 'admin',
	REGULAR = 'regular',
}

@Entity()
export class Employee extends DefaultEntity {
	@Column({ unique: true })
	username: string;

	@Column()
	name: string;

	@Column({ nullable: true })
	image_url?: string;

	@Column({ type: 'enum', enum: UserRoles, default: UserRoles.REGULAR })
	role: UserRoles;

	@Column()
	password: string;

	@ManyToOne(() => Company, (company) => company.employees, {
		onDelete: 'CASCADE',
	})
	company: Company;
}
