/* eslint-disable indent */
import { Column, Entity, ManyToOne } from 'typeorm';
import { Company } from './Company';
import { DefaultEntity } from './_DefaultEntity';

export type UserRoles = 'admin' | 'regular';

export const isValidRole = (role: string): role is UserRoles => {
	return ['admin', 'regular'].includes(role);
};

@Entity()
export class Employee extends DefaultEntity {
	@Column({ unique: true })
	username!: string;

	@Column()
	name!: string;

	@Column({ nullable: true })
	image_url?: string;

	@Column({ default: 'regular' as UserRoles })
	role!: string;

	@Column()
	password!: string;

	@ManyToOne(() => Company, (company) => company.employees, {
		onDelete: 'CASCADE',
	})
	company!: Company;
}
