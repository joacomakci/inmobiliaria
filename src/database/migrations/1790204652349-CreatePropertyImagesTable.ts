import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePropertyImagesTable1790204652349 implements MigrationInterface {
    name = 'CreatePropertyImagesTable1790204652349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "property_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "order" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "propertyId" uuid NOT NULL, CONSTRAINT "PK_317c3774ee70c26d70c4f80e200" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "property_images" ADD CONSTRAINT "FK_7a07b6b7f9418bf1d5160106694" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_images" DROP CONSTRAINT "FK_7a07b6b7f9418bf1d5160106694"`);
        await queryRunner.query(`DROP TABLE "property_images"`);
    }

}
