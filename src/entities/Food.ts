import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './Category';
import { Company } from './Company';
import { OrderItem } from './OrderItem';
import { DefaultEntity } from './_DefaultEntity';

@Entity()
export class Food extends DefaultEntity {
	@Column()
	name: string;

	@Column({ type: 'float', default: 0.0 })
	price: number;

	@Column({ default: false })
	daily: boolean;

	@Column({ nullable: true })
	description?: string;

	@ManyToOne(() => Company, (company) => company.foods)
	company: Company;

	@OneToMany(() => OrderItem, (order) => order.food, { cascade: true })
	orders: OrderItem[];

	@ManyToOne(() => Category, (category) => category.foods)
	category: Category;
}
