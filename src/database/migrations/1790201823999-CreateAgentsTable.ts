import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAgentsTable1790201823999 implements MigrationInterface {
    name = 'CreateAgentsTable1790201823999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "agents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "photoUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_f535e5b2c0f0dc7b7fc656ebc9" UNIQUE ("userId"), CONSTRAINT "PK_9c653f28ae19c5884d5baf6a1d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "agents" ADD CONSTRAINT "FK_f535e5b2c0f0dc7b7fc656ebc91" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agents" DROP CONSTRAINT "FK_f535e5b2c0f0dc7b7fc656ebc91"`);
        await queryRunner.query(`DROP TABLE "agents"`);
    }

}
