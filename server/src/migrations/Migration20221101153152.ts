import { Migration } from '@mikro-orm/migrations';

export class Migration20221101153152 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "comment" drop constraint "comment_reply_to_id_foreign";');

    this.addSql('alter table "comment" alter column "reply_to_id" type varchar(255) using ("reply_to_id"::varchar(255));');
    this.addSql('alter table "comment" alter column "reply_to_id" drop not null;');
    this.addSql('alter table "comment" add constraint "comment_reply_to_id_foreign" foreign key ("reply_to_id") references "comment" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" drop constraint "comment_reply_to_id_foreign";');

    this.addSql('alter table "comment" alter column "reply_to_id" type varchar(255) using ("reply_to_id"::varchar(255));');
    this.addSql('alter table "comment" alter column "reply_to_id" set not null;');
    this.addSql('alter table "comment" add constraint "comment_reply_to_id_foreign" foreign key ("reply_to_id") references "comment" ("id") on update cascade;');
  }

}
