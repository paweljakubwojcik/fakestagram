import { Migration } from '@mikro-orm/migrations';

export class Migration20220715112059 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_followers" ("user_1_id" varchar(255) not null, "user_2_id" varchar(255) not null);');
    this.addSql('alter table "user_followers" add constraint "user_followers_pkey" primary key ("user_1_id", "user_2_id");');

    this.addSql('alter table "user_followers" add constraint "user_followers_user_1_id_foreign" foreign key ("user_1_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_followers" add constraint "user_followers_user_2_id_foreign" foreign key ("user_2_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "post" drop constraint "post_creator_id_foreign";');

    this.addSql('alter table "post" rename column "creator_id" to "author_id";');
    this.addSql('alter table "post" add constraint "post_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_followers" cascade;');

    this.addSql('alter table "post" drop constraint "post_author_id_foreign";');

    this.addSql('alter table "post" rename column "author_id" to "creator_id";');
    this.addSql('alter table "post" add constraint "post_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;');
  }

}
