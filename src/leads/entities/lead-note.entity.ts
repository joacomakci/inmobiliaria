import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Lead } from './lead.entity';
import { User } from '../../users/entities/user.entity';

@Entity('lead_notes')
export class LeadNote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Lead, (lead) => lead.notes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  lead!: Lead;

  @ManyToOne(() => User, { nullable: false })
  authorUser!: User;

  @Column({ type: 'text' })
  text!: string;

  @CreateDateColumn()
  createdAt!: Date;
}