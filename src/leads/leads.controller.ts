import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ChangeLeadStatusDto } from './dto/change-lead-status.dto';
import { AssignAgentDto } from './dto/assign-agent.dto';
import { CreateLeadNoteDto } from './dto/create-lead-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una consulta (público, formulario landing)' })
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.AGENTE)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar leads, con filtros opcionales de status y agente',
  })
  findAll(
    @Query('status') status?: string,
    @Query('agentId') agentId?: string,
  ) {
    return this.leadsService.findAll(status, agentId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.AGENTE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un lead por id, con notas e historial' })
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id/agent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Asignar un agente al lead (solo admin)' })
  assignAgent(@Param('id') id: string, @Body() dto: AssignAgentDto) {
    return this.leadsService.assignAgent(id, dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.AGENTE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar el estado del lead' })
  changeStatus(@Param('id') id: string, @Body() dto: ChangeLeadStatusDto) {
    return this.leadsService.changeStatus(id, dto);
  }

  @Post(':id/notes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.AGENTE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar una nota de seguimiento al lead' })
  addNote(
    @Param('id') id: string,
    @Body() dto: CreateLeadNoteDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.leadsService.addNote(id, user.userId, dto);
  }
}
