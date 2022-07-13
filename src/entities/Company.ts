import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './Category';
import { Employee } from './Employee';
import { Food } from './Food';
import { Table } from './Table';
import { User } from './User';
import { DefaultEntity } from './_DefaultEntity';

@Entity()
export class Company extends DefaultEntity {
	@Column({ unique: true })
	name: string;

	@Column()
	address: string;

	@Column({ unique: true })
	phone: string;

	@Column({ nullable: true })
	image_url?: string;

	@Column({ nullable: true })
	description?: boolean;

	@ManyToOne(() => User, (user) => user.companies)
	owner: User;

	@OneToMany(() => Table, (table) => table.company)
	tables: Table[];

	@OneToMany(() => Food, (food) => food.company)
	foods: Food[];

	@OneToMany(() => Category, (category) => category.company)
	categories: Category[];

	@OneToMany(() => Employee, (employee) => employee.company)
	employees: Employee[];
}
