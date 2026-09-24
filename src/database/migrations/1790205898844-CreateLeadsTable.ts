import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLeadsTable1790205898844 implements MigrationInterface {
    name = 'CreateLeadsTable1790205898844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."leads_source_enum" AS ENUM('landing_form', 'whatsapp', 'telefono', 'referido')`);
        await queryRunner.query(`CREATE TYPE "public"."leads_status_enum" AS ENUM('nuevo', 'contactado', 'visita_agendada', 'en_negociacion', 'ganado', 'perdido')`);
        await queryRunner.query(`CREATE TABLE "leads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "message" text NOT NULL, "source" "public"."leads_source_enum" NOT NULL DEFAULT 'landing_form', "status" "public"."leads_status_enum" NOT NULL DEFAULT 'nuevo', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "propertyId" uuid, "agentId" uuid, CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lead_notes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "leadId" uuid NOT NULL, "authorUserId" uuid NOT NULL, CONSTRAINT "PK_1fa7d688fd75d75ea298a98e290" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "leads" ADD CONSTRAINT "FK_7ac03134445b9b807c2f44910a5" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leads" ADD CONSTRAINT "FK_9f995d5db8cf0d58f5bf6773735" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lead_notes" ADD CONSTRAINT "FK_f7632933386d769db804a4917d0" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lead_notes" ADD CONSTRAINT "FK_99ca559dcd56a3532f3079c071f" FOREIGN KEY ("authorUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead_notes" DROP CONSTRAINT "FK_99ca559dcd56a3532f3079c071f"`);
        await queryRunner.query(`ALTER TABLE "lead_notes" DROP CONSTRAINT "FK_f7632933386d769db804a4917d0"`);
        await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "FK_9f995d5db8cf0d58f5bf6773735"`);
        await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "FK_7ac03134445b9b807c2f44910a5"`);
        await queryRunner.query(`DROP TABLE "lead_notes"`);
        await queryRunner.query(`DROP TABLE "leads"`);
        await queryRunner.query(`DROP TYPE "public"."leads_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."leads_source_enum"`);
    }

}
