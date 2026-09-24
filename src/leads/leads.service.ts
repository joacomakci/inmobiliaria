import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { LeadNote } from './entities/lead-note.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ChangeLeadStatusDto } from './dto/change-lead-status.dto';
import { AssignAgentDto } from './dto/assign-agent.dto';
import { CreateLeadNoteDto } from './dto/create-lead-note.dto';
import { PropertiesService } from '../properties/properties.service';
import { AgentsService } from '../agents/agents.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadsRepository: Repository<Lead>,
    @InjectRepository(LeadNote)
    private readonly leadNotesRepository: Repository<LeadNote>,
    private readonly propertiesService: PropertiesService,
    private readonly agentsService: AgentsService,
  ) {}

  async create(dto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadsRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      message: dto.message,
      source: dto.source,
    });

    if (dto.propertyId) {
      const property = await this.propertiesService.findOne(dto.propertyId);
      lead.property = property;
      // si la propiedad tiene agente, se lo asignamos de entrada
      lead.agent = property.agent;
    }

    return this.leadsRepository.save(lead);
  }

  findAll(status?: string, agentId?: string): Promise<Lead[]> {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (agentId) where.agent = { id: agentId };

    return this.leadsRepository.find({
      where,
      relations: { property: true, agent: true, notes: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadsRepository.findOne({
      where: { id },
      relations: {
        property: true,
        agent: true,
        notes: { authorUser: true },
      },
      order: { notes: { createdAt: 'ASC' } },
    });
    if (!lead) {
      throw new NotFoundException('Lead no encontrado');
    }
    return lead;
  }

  async assignAgent(id: string, dto: AssignAgentDto): Promise<Lead> {
    const lead = await this.findOne(id);
    lead.agent = await this.agentsService.findOne(dto.agentId);
    return this.leadsRepository.save(lead);
  }

  async changeStatus(id: string, dto: ChangeLeadStatusDto): Promise<Lead> {
    const lead = await this.findOne(id);
    lead.status = dto.status;
    return this.leadsRepository.save(lead);
  }

  async addNote(
    leadId: string,
    authorUserId: string,
    dto: CreateLeadNoteDto,
  ): Promise<LeadNote> {
    const lead = await this.findOne(leadId);

    const note = this.leadNotesRepository.create({
      lead,
      authorUser: { id: authorUserId } as any,
      text: dto.text,
    });

    return this.leadNotesRepository.save(note);
  }
}