import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import dataSource from '../../config/data-source';
import { User, UserRole } from '../../users/entities/user.entity';
import { Agent } from '../../agents/entities/agent.entity';
import {
  Property,
  PropertyType,
  PropertyOperation,
} from '../../properties/entities/property.entity';
import { Lead, LeadStatus } from '../../leads/entities/lead.entity';
import { slugify } from '../../common/utils/slugify';

async function runSeed() {
  await dataSource.initialize();
  console.log('Conectado a la base de datos');

  const userRepo = dataSource.getRepository(User);
  const agentRepo = dataSource.getRepository(Agent);
  const propertyRepo = dataSource.getRepository(Property);
  const leadRepo = dataSource.getRepository(Lead);

  // --- Usuario admin ---
  let admin = await userRepo.findOne({
    where: { email: 'admin@inmobiliaria.com' },
  });

  if (!admin) {
    admin = userRepo.create({
      email: 'admin@inmobiliaria.com',
      passwordHash: await bcrypt.hash('password123', 10),
      role: UserRole.ADMIN,
    });
    await userRepo.save(admin);
    console.log(
      '✔ Usuario admin creado (admin@inmobiliaria.com / password123)',
    );
  } else {
    console.log('- Usuario admin ya existía, se omite');
  }

  // --- Agentes ---
  const agentsData = [
    {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@inmobiliaria.com',
      phone: '+54911111111',
    },
    {
      firstName: 'Ana',
      lastName: 'López',
      email: 'ana.lopez@inmobiliaria.com',
      phone: '+54911222333',
    },
  ];

  const agents: Agent[] = [];
  for (const data of agentsData) {
    let agent = await agentRepo.findOne({ where: { email: data.email } });
    if (!agent) {
      agent = agentRepo.create(data);
      await agentRepo.save(agent);
      console.log(`✔ Agente creado: ${data.firstName} ${data.lastName}`);
    } else {
      console.log(
        `- Agente ${data.firstName} ${data.lastName} ya existía, se omite`,
      );
    }
    agents.push(agent);
  }

  // --- Propiedades ---
  const propertiesData = [
    {
      title: 'Casa en Venta en Palermo',
      description: 'Hermosa casa de 3 ambientes con jardín',
      type: PropertyType.CASA,
      operation: PropertyOperation.VENTA,
      price: 150000,
      address: 'Av. Santa Fe 1234',
      city: 'Buenos Aires',
      neighborhood: 'Palermo',
      areaM2: 120,
      rooms: 3,
      bathrooms: 2,
      featured: true,
      agent: agents[0],
    },
    {
      title: 'Departamento en Alquiler en Belgrano',
      description: 'Departamento luminoso de 2 ambientes, a estrenar',
      type: PropertyType.DEPARTAMENTO,
      operation: PropertyOperation.ALQUILER,
      price: 800,
      address: 'Av. Cabildo 2500',
      city: 'Buenos Aires',
      neighborhood: 'Belgrano',
      areaM2: 55,
      rooms: 2,
      bathrooms: 1,
      featured: false,
      agent: agents[1],
    },
    {
      title: 'Terreno en Venta en Tigre',
      description: 'Amplio terreno apto para construcción, cerca del río',
      type: PropertyType.TERRENO,
      operation: PropertyOperation.VENTA,
      price: 45000,
      address: 'Camino de los Lagos km 3',
      city: 'Tigre',
      areaM2: 500,
      featured: false,
      agent: agents[0],
    },
  ];

  const properties: Property[] = [];
  for (const data of propertiesData) {
    let property = await propertyRepo.findOne({
      where: { slug: slugify(data.title) },
    });
    if (!property) {
      property = propertyRepo.create({
        ...data,
        slug: slugify(data.title),
        currency: 'USD',
        publishedAt: new Date(),
      });
      await propertyRepo.save(property);
      console.log(`✔ Propiedad creada: ${data.title}`);
    } else {
      console.log(`- Propiedad "${data.title}" ya existía, se omite`);
    }
    properties.push(property);
  }

  // --- Leads de ejemplo ---
  const existingLeadsCount = await leadRepo.count();
  if (existingLeadsCount === 0) {
    await leadRepo.save(
      leadRepo.create({
        firstName: 'María',
        lastName: 'González',
        email: 'maria@example.com',
        phone: '+54911222333',
        message: 'Me interesa esta propiedad, ¿se puede visitar este finde?',
        property: properties[0],
        agent: properties[0].agent,
        status: LeadStatus.NUEVO,
      }),
    );
    await leadRepo.save(
      leadRepo.create({
        firstName: 'Carlos',
        lastName: 'Ramírez',
        email: 'carlos@example.com',
        message: 'Quisiera más información sobre el terreno en Tigre',
        property: properties[2],
        agent: properties[2].agent,
        status: LeadStatus.CONTACTADO,
      }),
    );
    console.log('✔ Leads de ejemplo creados');
  } else {
    console.log('- Ya había leads cargados, se omite');
  }

  await dataSource.destroy();
  console.log('Seed completo ✅');
}

runSeed().catch((error) => {
  console.error('Error corriendo el seed:', error);
  process.exit(1);
});
