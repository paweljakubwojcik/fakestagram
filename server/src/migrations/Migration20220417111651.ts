import { Migration } from '@mikro-orm/migrations';

export class Migration20220417111651 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');

    this.addSql('create table "post" ("id" varchar(255) not null, "creator_id" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null, "body" text not null, "likes" int not null);');
    this.addSql('alter table "post" add constraint "post_pkey" primary key ("id", "creator_id");');

    this.addSql('alter table "post" add constraint "post_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade on delete cascade;');
  }

}
