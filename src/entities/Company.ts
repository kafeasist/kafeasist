import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './Category';
import { Employee } from './Employee';
import { Food } from './Food';
import { Table } from './Table';
import { User } from './User';
import { DefaultEntity } from './_DefaultEntity';

@Entity()
export class Company extends DefaultEntity {
	@Column()
	name: string;

	@Column()
	address: string;

	@Column()
	phone: string;

	@Column({ nullable: true })
	image_url?: string;

	@Column({ nullable: true })
	description?: string;

	@ManyToOne(() => User, (user) => user.companies, { onDelete: 'CASCADE' })
	owner: User;

	@OneToMany(() => Table, (table) => table.company, { onDelete: 'CASCADE' })
	tables: Table[];

	@OneToMany(() => Food, (food) => food.company, { onDelete: 'CASCADE' })
	foods: Food[];

	@OneToMany(() => Category, (category) => category.company, {
		onDelete: 'CASCADE',
	})
	categories: Category[];

	@OneToMany(() => Employee, (employee) => employee.company, {
		onDelete: 'CASCADE',
	})
	employees: Employee[];
}
