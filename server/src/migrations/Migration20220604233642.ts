import { Migration } from '@mikro-orm/migrations';

export class Migration20220604233642 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "image" add column "original_url" varchar(255) not null default \'https://instaclone.imgix.net/instaclone-posts/FSOTUDlaUAAnChz.jpg\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "image" drop column "original_url";');
  }

}
