import { Migration } from '@mikro-orm/migrations';

export class Migration20221101152510 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "comment" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content" text not null, "author_id" varchar(255) not null, "reply_to_id" varchar(255) not null, "post_id" varchar(255) not null);');
    this.addSql('alter table "comment" add constraint "comment_pkey" primary key ("id");');

    this.addSql('create table "like_on_comment" ("comment_id" varchar(255) not null, "user_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "like_on_comment" add constraint "like_on_comment_pkey" primary key ("comment_id", "user_id");');

    this.addSql('alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_reply_to_id_foreign" foreign key ("reply_to_id") references "comment" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');

    this.addSql('alter table "like_on_comment" add constraint "like_on_comment_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');
    this.addSql('alter table "like_on_comment" add constraint "like_on_comment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" drop constraint "comment_reply_to_id_foreign";');

    this.addSql('alter table "like_on_comment" drop constraint "like_on_comment_comment_id_foreign";');

    this.addSql('drop table if exists "comment" cascade;');

    this.addSql('drop table if exists "like_on_comment" cascade;');
  }

}
