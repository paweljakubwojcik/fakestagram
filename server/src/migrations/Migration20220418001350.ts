import { Migration } from '@mikro-orm/migrations';

export class Migration20220418001350 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" drop constraint "post_creator_id_foreign";');

    this.addSql('alter table "like" drop constraint "like_post_id_post_creator_id_foreign";');

    this.addSql('alter table "post" drop constraint "post_pkey";');
    this.addSql('alter table "post" add constraint "post_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "post" add constraint "post_pkey" primary key ("id");');

    this.addSql('alter table "like" drop constraint "like_pkey";');
    this.addSql('alter table "like" drop column "post_creator_id";');
    this.addSql('alter table "like" add constraint "like_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');
    this.addSql('alter table "like" add constraint "like_pkey" primary key ("user_id", "post_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" drop constraint "post_creator_id_foreign";');

    this.addSql('alter table "like" drop constraint "like_post_id_foreign";');

    this.addSql('alter table "post" drop constraint "post_pkey";');
    this.addSql('alter table "post" add constraint "post_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "post" add constraint "post_pkey" primary key ("id", "creator_id");');

    this.addSql('alter table "like" add column "post_creator_id" varchar(255) not null;');
    this.addSql('alter table "like" drop constraint "like_pkey";');
    this.addSql('alter table "like" add constraint "like_post_id_post_creator_id_foreign" foreign key ("post_id", "post_creator_id") references "post" ("id", "creator_id") on update cascade;');
    this.addSql('alter table "like" add constraint "like_pkey" primary key ("user_id", "post_id", "post_creator_id");');
  }

}
