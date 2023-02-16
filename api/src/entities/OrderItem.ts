/* eslint-disable indent */
import { Column, Entity, ManyToOne } from 'typeorm';
import { Food } from './Food';
import { Table } from './Table';
import { DefaultEntity } from './_DefaultEntity';

@Entity()
export class OrderItem extends DefaultEntity {
	@Column('int')
	amount!: number;

	@ManyToOne(() => Food, (food) => food.orders)
	food!: Food;

	@ManyToOne(() => Table, (table) => table.items)
	table!: Table;
}
