import { Migration } from '@mikro-orm/migrations';

export class Migration20220605114427 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" add column "aspect_ratio" varchar(255) not null default \'16/9\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" drop column "aspect_ratio";');
  }

}
