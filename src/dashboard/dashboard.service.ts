import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../leads/entities/lead.entity';
import { Property } from '../properties/entities/property.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadsRepository: Repository<Lead>,
    @InjectRepository(Property)
    private readonly propertiesRepository: Repository<Property>,
  ) {}

  async summary() {
    const [totalProperties, totalLeads, leadsGanados, leadsAbiertos] =
      await Promise.all([
        this.propertiesRepository.count(),
        this.leadsRepository.count(),
        this.leadsRepository.count({ where: { status: 'ganado' as any } }),
        this.leadsRepository.count({
          where: { status: 'nuevo' as any },
        }),
      ]);

    const conversionRate =
      totalLeads > 0 ? Number(((leadsGanados / totalLeads) * 100).toFixed(1)) : 0;

    return {
      totalProperties,
      totalLeads,
      leadsGanados,
      leadsNuevos: leadsAbiertos,
      conversionRate,
    };
  }

  async leadsByStatus() {
    return this.leadsRepository
      .createQueryBuilder('lead')
      .select('lead.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('lead.status')
      .getRawMany();
  }

  async leadsByAgent() {
    return this.leadsRepository
      .createQueryBuilder('lead')
      .leftJoin('lead.agent', 'agent')
      .select('agent.id', 'agentId')
      .addSelect('agent.firstName', 'firstName')
      .addSelect('agent.lastName', 'lastName')
      .addSelect('COUNT(lead.id)', 'totalLeads')
      .where('lead.agentId IS NOT NULL')
      .groupBy('agent.id')
      .addGroupBy('agent.firstName')
      .addGroupBy('agent.lastName')
      .orderBy('"totalLeads"', 'DESC')
      .getRawMany();
  }

  async propertiesByStatus() {
    return this.propertiesRepository
      .createQueryBuilder('property')
      .select('property.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('property.status')
      .getRawMany();
  }

  async mostViewedProperties() {
    // Placeholder: todavía no llevamos un contador de vistas.
    // Cuando se implemente, acá se ordenaría por ese campo.
    return this.propertiesRepository.find({
      take: 5,
      order: { createdAt: 'DESC' },
    });
  }
}