import { Migration } from '@mikro-orm/migrations';

export class Migration20221031223448 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "image" add column "original_url" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "image" drop column "original_url";');
  }

}
