import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumen general: propiedades, leads, conversión' })
  summary() {
    return this.dashboardService.summary();
  }

  @Get('leads-by-status')
  @ApiOperation({ summary: 'Cantidad de leads agrupados por estado' })
  leadsByStatus() {
    return this.dashboardService.leadsByStatus();
  }

  @Get('leads-by-agent')
  @ApiOperation({ summary: 'Cantidad de leads agrupados por agente' })
  leadsByAgent() {
    return this.dashboardService.leadsByAgent();
  }

  @Get('properties-by-status')
  @ApiOperation({ summary: 'Cantidad de propiedades agrupadas por estado' })
  propertiesByStatus() {
    return this.dashboardService.propertiesByStatus();
  }

  @Get('most-viewed')
  @ApiOperation({
    summary: 'Propiedades más recientes (placeholder de "más vistas")',
  })
  mostViewedProperties() {
    return this.dashboardService.mostViewedProperties();
  }
}
