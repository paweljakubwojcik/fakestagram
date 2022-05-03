import { Migration } from '@mikro-orm/migrations';

export class Migration20220417221636 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "like" ("user_id" varchar(255) not null, "post_id" varchar(255) not null, "post_creator_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "like" add constraint "like_pkey" primary key ("user_id", "post_id", "post_creator_id");');

    this.addSql('alter table "like" add constraint "like_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "like" add constraint "like_post_id_post_creator_id_foreign" foreign key ("post_id", "post_creator_id") references "post" ("id", "creator_id") on update cascade;');

    this.addSql('alter table "post" alter column "creator_id" type varchar(255) using ("creator_id"::varchar(255));');
    this.addSql('alter table "post" alter column "creator_id" set not null;');
    this.addSql('alter table "post" drop column "likes";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "like" cascade;');

    this.addSql('alter table "post" add column "likes" int not null;');
    this.addSql('alter table "post" alter column "creator_id" type varchar(255) using ("creator_id"::varchar(255));');
    this.addSql('alter table "post" alter column "creator_id" drop not null;');
  }

}
