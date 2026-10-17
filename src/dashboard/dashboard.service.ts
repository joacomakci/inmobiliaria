import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStatus } from '../leads/entities/lead.entity';
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
        this.leadsRepository.count({ where: { status: LeadStatus.GANADO } }),
        this.leadsRepository.count({ where: { status: LeadStatus.NUEVO } }),
      ]);

    const conversionRate =
      totalLeads > 0
        ? Number(((leadsGanados / totalLeads) * 100).toFixed(1))
        : 0;

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

  async leadsByDay(days: number) {
    const pad = (n: number) => String(n).padStart(2, '0');
    const toKey = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    const rows = await this.leadsRepository
      .createQueryBuilder('lead')
      .select(`TO_CHAR(lead."createdAt", 'YYYY-MM-DD')`, 'day')
      .addSelect('COUNT(*)', 'count')
      .where('lead."createdAt" >= :start', { start: toKey(start) })
      .groupBy('"day"')
      .orderBy('"day"', 'ASC')
      .getRawMany<{ day: string; count: string }>();

    const counts = new Map(
      rows.map((row) => [row.day, Number(row.count)] as [string, number]),
    );

    // Rellenamos los días sin consultas con 0, así el gráfico no tiene huecos
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = toKey(date);
      return { date: key, count: counts.get(key) ?? 0 };
    });
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
