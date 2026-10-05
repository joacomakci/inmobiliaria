import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';
import { Agent } from '../../agents/entities/agent.entity';
import { LeadNote } from './lead-note.entity';

export enum LeadSource {
  LANDING_FORM = 'landing_form',
  WHATSAPP = 'whatsapp',
  TELEFONO = 'telefono',
  REFERIDO = 'referido',
}

export enum LeadStatus {
  NUEVO = 'nuevo',
  CONTACTADO = 'contactado',
  VISITA_AGENDADA = 'visita_agendada',
  EN_NEGOCIACION = 'en_negociacion',
  GANADO = 'ganado',
  PERDIDO = 'perdido',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({
    type: 'enum',
    enum: LeadSource,
    default: LeadSource.LANDING_FORM,
  })
  source!: LeadSource;

  @ManyToOne(() => Property, { nullable: true })
  property?: Property;

  @ManyToOne(() => Agent, { nullable: true })
  agent?: Agent;

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NUEVO })
  status!: LeadStatus;

  @OneToMany(() => LeadNote, (note) => note.lead, { cascade: true })
  notes!: LeadNote[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
