/* eslint-disable indent */
import {
	BaseEntity,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DefaultEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@CreateDateColumn()
	created_at!: Date;

	@UpdateDateColumn()
	updated_at!: Date;
}
