import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentsRepository: Repository<Agent>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateAgentDto): Promise<Agent> {
    const agent = this.agentsRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      photoUrl: dto.photoUrl,
    });

    if (dto.userId) {
      agent.user = await this.usersService.findOne(dto.userId);
    }

    return this.agentsRepository.save(agent);
  }

  findAll(): Promise<Agent[]> {
    return this.agentsRepository.find();
  }

  async findOne(id: string): Promise<Agent> {
    const agent = await this.agentsRepository.findOne({ where: { id } });
    if (!agent) {
      throw new NotFoundException('Agente no encontrado');
    }
    return agent;
  }

  async update(id: string, dto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.findOne(id);

    Object.assign(agent, {
      firstName: dto.firstName ?? agent.firstName,
      lastName: dto.lastName ?? agent.lastName,
      email: dto.email ?? agent.email,
      phone: dto.phone ?? agent.phone,
      photoUrl: dto.photoUrl ?? agent.photoUrl,
    });

    if (dto.userId) {
      agent.user = await this.usersService.findOne(dto.userId);
    }

    return this.agentsRepository.save(agent);
  }

  async remove(id: string): Promise<void> {
    const agent = await this.findOne(id);
    await this.agentsRepository.remove(agent);
  }
}