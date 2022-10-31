import { Migration } from '@mikro-orm/migrations';

export class Migration20221031221803 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_profile_image_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_profile_image_id_unique";');
    this.addSql('alter table "user" rename column "profile_image_id" to "profile_image";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" rename column "profile_image" to "profile_image_id";');
    this.addSql('alter table "user" add constraint "user_profile_image_id_foreign" foreign key ("profile_image_id") references "image" ("id") on update cascade;');
    this.addSql('alter table "user" add constraint "user_profile_image_id_unique" unique ("profile_image_id");');
  }

}
