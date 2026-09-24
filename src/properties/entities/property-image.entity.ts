import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Property } from './property.entity';

@Entity('property_images')
export class PropertyImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Property, (property) => property.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  property!: Property;

  @Column()
  url!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;
}