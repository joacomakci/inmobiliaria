import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { PropertyImage } from './entities/property-image.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { AgentsService } from '../agents/agents.service';
import { slugify } from '../common/utils/slugify';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertiesRepository: Repository<Property>,
    @InjectRepository(PropertyImage)
    private readonly propertyImagesRepository: Repository<PropertyImage>,
    private readonly agentsService: AgentsService,
  ) {}

  async create(dto: CreatePropertyDto): Promise<Property> {
    const agent = await this.agentsService.findOne(dto.agentId);
    const slug = await this.generateUniqueSlug(dto.title);

    const property = this.propertiesRepository.create({
      title: dto.title,
      slug,
      description: dto.description,
      type: dto.type,
      operation: dto.operation,
      price: dto.price,
      currency: dto.currency ?? 'USD',
      address: dto.address,
      city: dto.city,
      neighborhood: dto.neighborhood,
      areaM2: dto.areaM2,
      rooms: dto.rooms,
      bathrooms: dto.bathrooms,
      featured: dto.featured ?? false,
      agent,
      publishedAt: new Date(),
    });

    return this.propertiesRepository.save(property);
  }

  async findAll(filters?: {
    operation?: string;
    type?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    rooms?: number;
  }): Promise<Property[]> {
    const query = this.propertiesRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.agent', 'agent')
      .leftJoinAndSelect('property.images', 'images');

    if (filters?.operation) {
      query.andWhere('property.operation = :operation', {
        operation: filters.operation,
      });
    }

    if (filters?.type) {
      query.andWhere('property.type = :type', { type: filters.type });
    }

    if (filters?.city) {
      query.andWhere(
        '(property.city ILIKE :city OR property.neighborhood ILIKE :city)',
        { city: `%${filters.city}%` },
      );
    }

    if (filters?.minPrice) {
      query.andWhere('property.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters?.maxPrice) {
      query.andWhere('property.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    if (filters?.rooms) {
      query.andWhere('property.rooms >= :rooms', { rooms: filters.rooms });
    }

    query.orderBy('property.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertiesRepository.findOne({
      where: { id },
      relations: { agent: true, images: true },
    });
    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }
    return property;
  }

  async findBySlug(slug: string): Promise<Property> {
    const property = await this.propertiesRepository.findOne({
      where: { slug },
      relations: { agent: true, images: true },
    });
    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }
    return property;
  }

  async update(id: string, dto: UpdatePropertyDto): Promise<Property> {
    const property = await this.findOne(id);

    if (dto.agentId) {
      property.agent = await this.agentsService.findOne(dto.agentId);
    }

    Object.assign(property, {
      title: dto.title ?? property.title,
      description: dto.description ?? property.description,
      type: dto.type ?? property.type,
      operation: dto.operation ?? property.operation,
      price: dto.price ?? property.price,
      currency: dto.currency ?? property.currency,
      address: dto.address ?? property.address,
      city: dto.city ?? property.city,
      neighborhood: dto.neighborhood ?? property.neighborhood,
      areaM2: dto.areaM2 ?? property.areaM2,
      rooms: dto.rooms ?? property.rooms,
      bathrooms: dto.bathrooms ?? property.bathrooms,
      featured: dto.featured ?? property.featured,
    });

    return this.propertiesRepository.save(property);
  }

  async remove(id: string): Promise<void> {
    const property = await this.findOne(id);
    await this.propertiesRepository.remove(property);
  }

  async addImage(
    propertyId: string,
    dto: CreatePropertyImageDto,
  ): Promise<PropertyImage> {
    const property = await this.findOne(propertyId);

    const order = dto.order ?? (await this.nextImageOrder(propertyId));

    const image = this.propertyImagesRepository.create({
      property,
      url: dto.url,
      order,
    });

    return this.propertyImagesRepository.save(image);
  }

  async removeImage(propertyId: string, imageId: string): Promise<void> {
    const image = await this.propertyImagesRepository.findOne({
      where: { id: imageId, property: { id: propertyId } },
    });

    if (!image) {
      throw new NotFoundException('Imagen no encontrada');
    }

    await this.propertyImagesRepository.remove(image);
  }

  async reorderImage(
    propertyId: string,
    imageId: string,
    newOrder: number,
  ): Promise<PropertyImage> {
    const image = await this.propertyImagesRepository.findOne({
      where: { id: imageId, property: { id: propertyId } },
    });

    if (!image) {
      throw new NotFoundException('Imagen no encontrada');
    }

    image.order = newOrder;
    return this.propertyImagesRepository.save(image);
  }

  private async nextImageOrder(propertyId: string): Promise<number> {
    const count = await this.propertyImagesRepository.count({
      where: { property: { id: propertyId } },
    });
    return count;
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = slugify(title);
    let slug = base;
    let counter = 1;

    while (await this.propertiesRepository.findOne({ where: { slug } })) {
      slug = `${base}-${counter}`;
      counter++;
    }

    return slug;
  }
}
