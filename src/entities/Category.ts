import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Company } from './Company';
import { Food } from './Food';
import { DefaultEntity } from './_DefaultEntity';

@Entity()
export class Category extends DefaultEntity {
	@Column()
	name: string;

	@Column({ nullable: true })
	description?: string;

	@OneToMany(() => Food, (food) => food.category)
	foods: Food[];

	@ManyToOne(() => Company, (company) => company.categories)
	company: Company;
}
