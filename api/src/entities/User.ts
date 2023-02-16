/* eslint-disable indent */
import { Column, Entity, OneToMany } from 'typeorm';
import { Company } from './Company';
import { DefaultEntity } from './_DefaultEntity';

@Entity()
export class User extends DefaultEntity {
	@Column()
	first_name!: string;

	@Column()
	last_name!: string;

	@Column({ unique: true })
	phone!: string;

	@Column({ unique: true })
	email!: string;

	@Column()
	password!: string;

	@Column({ default: false })
	verified!: boolean;

	@Column({ nullable: true })
	mfa?: string;

	@Column({ default: 0 })
	subs_type!: number;

	@OneToMany(() => Company, (company) => company.owner, {
		onDelete: 'CASCADE',
	})
	companies?: Company[];
}
