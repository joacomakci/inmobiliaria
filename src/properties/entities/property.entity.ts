import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Agent } from '../../agents/entities/agent.entity';
import { PropertyImage } from './property-image.entity';

export enum PropertyType {
  CASA = 'casa',
  DEPARTAMENTO = 'departamento',
  TERRENO = 'terreno',
  LOCAL = 'local',
  OFICINA = 'oficina',
}

export enum PropertyOperation {
  VENTA = 'venta',
  ALQUILER = 'alquiler',
}

export enum PropertyStatus {
  DISPONIBLE = 'disponible',
  RESERVADA = 'reservada',
  VENDIDA = 'vendida',
  ALQUILADA = 'alquilada',
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: PropertyType })
  type!: PropertyType;

  @Column({ type: 'enum', enum: PropertyOperation })
  operation!: PropertyOperation;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price!: number;

  @Column({ length: 3, default: 'USD' })
  currency!: string;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column({ type: 'int', nullable: true })
  areaM2?: number;

  @Column({ type: 'int', nullable: true })
  rooms?: number;

  @Column({ type: 'int', nullable: true })
  bathrooms?: number;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.DISPONIBLE,
  })
  status!: PropertyStatus;

  @Column({ default: false })
  featured!: boolean;

  @ManyToOne(() => Agent, { nullable: false })
  agent!: Agent;

  @OneToMany(() => PropertyImage, (image) => image.property, {
  cascade: true,
  })
  images!: PropertyImage[];

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}