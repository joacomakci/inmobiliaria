import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeLeadLastNameEmailOptional1791228244445 implements MigrationInterface {
    name = 'MakeLeadLastNameEmailOptional1791228244445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "lastName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "lastName" SET NOT NULL`);
    }

}
