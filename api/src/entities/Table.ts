/* eslint-disable indent */
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Company } from './Company';
import { OrderItem } from './OrderItem';
import { DefaultEntity } from './_DefaultEntity';

@Entity()
export class Table extends DefaultEntity {
	@Column()
	name!: string;

	@Column({ type: 'float', default: 0.0 })
	total!: number;

	@Column({ nullable: true })
	description?: string;

	@ManyToOne(() => Company, (company) => company.tables)
	company!: Company;

	@OneToMany(() => OrderItem, (order) => order.table, { cascade: true })
	items?: OrderItem[];
}
