import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePropertiesTable1790203555899 implements MigrationInterface {
    name = 'CreatePropertiesTable1790203555899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."properties_type_enum" AS ENUM('casa', 'departamento', 'terreno', 'local', 'oficina')`);
        await queryRunner.query(`CREATE TYPE "public"."properties_operation_enum" AS ENUM('venta', 'alquiler')`);
        await queryRunner.query(`CREATE TYPE "public"."properties_status_enum" AS ENUM('disponible', 'reservada', 'vendida', 'alquilada')`);
        await queryRunner.query(`CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" text NOT NULL, "type" "public"."properties_type_enum" NOT NULL, "operation" "public"."properties_operation_enum" NOT NULL, "price" numeric(12,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'USD', "address" character varying NOT NULL, "city" character varying NOT NULL, "neighborhood" character varying, "areaM2" integer, "rooms" integer, "bathrooms" integer, "status" "public"."properties_status_enum" NOT NULL DEFAULT 'disponible', "featured" boolean NOT NULL DEFAULT false, "publishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "agentId" uuid NOT NULL, CONSTRAINT "UQ_089e10e6f1282e7b4bd0c58263e" UNIQUE ("slug"), CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_353db6091069783cf1673cc82f6" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_353db6091069783cf1673cc82f6"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TYPE "public"."properties_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."properties_operation_enum"`);
        await queryRunner.query(`DROP TYPE "public"."properties_type_enum"`);
    }

}
