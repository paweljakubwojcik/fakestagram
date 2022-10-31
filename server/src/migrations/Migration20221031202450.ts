import { Migration } from '@mikro-orm/migrations';

export class Migration20221031202450 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "image" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "post_id" varchar(255) not null);');
    this.addSql('alter table "image" add constraint "image_pkey" primary key ("id");');

    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" text not null, "password" text not null, "profile_image_id" varchar(255) not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('alter table "user" add constraint "user_profile_image_id_unique" unique ("profile_image_id");');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');

    this.addSql('create table "post" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "description" text not null, "author_id" varchar(255) not null, "aspect_ratio" varchar(255) not null default \'16/9\');');
    this.addSql('alter table "post" add constraint "post_pkey" primary key ("id");');

    this.addSql('create table "like" ("post_id" varchar(255) not null, "user_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "like" add constraint "like_pkey" primary key ("post_id", "user_id");');

    this.addSql('create table "user_saved" ("user_id" varchar(255) not null, "post_id" varchar(255) not null);');
    this.addSql('alter table "user_saved" add constraint "user_saved_pkey" primary key ("user_id", "post_id");');

    this.addSql('create table "user_followers" ("user_1_id" varchar(255) not null, "user_2_id" varchar(255) not null);');
    this.addSql('alter table "user_followers" add constraint "user_followers_pkey" primary key ("user_1_id", "user_2_id");');

    this.addSql('alter table "image" add constraint "image_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');

    this.addSql('alter table "user" add constraint "user_profile_image_id_foreign" foreign key ("profile_image_id") references "image" ("id") on update cascade;');

    this.addSql('alter table "post" add constraint "post_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "like" add constraint "like_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');
    this.addSql('alter table "like" add constraint "like_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "user_saved" add constraint "user_saved_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_saved" add constraint "user_saved_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_followers" add constraint "user_followers_user_1_id_foreign" foreign key ("user_1_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_followers" add constraint "user_followers_user_2_id_foreign" foreign key ("user_2_id") references "user" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_profile_image_id_foreign";');

    this.addSql('alter table "post" drop constraint "post_author_id_foreign";');

    this.addSql('alter table "like" drop constraint "like_user_id_foreign";');

    this.addSql('alter table "user_saved" drop constraint "user_saved_user_id_foreign";');

    this.addSql('alter table "user_followers" drop constraint "user_followers_user_1_id_foreign";');

    this.addSql('alter table "user_followers" drop constraint "user_followers_user_2_id_foreign";');

    this.addSql('alter table "image" drop constraint "image_post_id_foreign";');

    this.addSql('alter table "like" drop constraint "like_post_id_foreign";');

    this.addSql('alter table "user_saved" drop constraint "user_saved_post_id_foreign";');

    this.addSql('drop table if exists "image" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "post" cascade;');

    this.addSql('drop table if exists "like" cascade;');

    this.addSql('drop table if exists "user_saved" cascade;');

    this.addSql('drop table if exists "user_followers" cascade;');
  }

}
