import { Migration } from '@mikro-orm/migrations';

export class Migration20221101164738 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "comment" drop constraint "comment_post_id_foreign";');

    this.addSql('alter table "comment" alter column "post_id" type varchar(255) using ("post_id"::varchar(255));');
    this.addSql('alter table "comment" alter column "post_id" drop not null;');
    this.addSql('alter table "comment" add constraint "comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" drop constraint "comment_post_id_foreign";');

    this.addSql('alter table "comment" alter column "post_id" type varchar(255) using ("post_id"::varchar(255));');
    this.addSql('alter table "comment" alter column "post_id" set not null;');
    this.addSql('alter table "comment" add constraint "comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');
  }

}
