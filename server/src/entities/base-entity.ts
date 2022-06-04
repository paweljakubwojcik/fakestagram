import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core"
import { Field, ObjectType } from "type-graphql"
import { v4 } from "uuid"

@ObjectType()
@Entity({ abstract: true })
export abstract class BaseEntityWithoutId {
  @Field()
  @Property()
  createdAt: Date = new Date()

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  [OptionalProps]: "createdAt" | "updatedAt"
}

@ObjectType()
@Entity({ abstract: true })
export abstract class BaseEntity extends BaseEntityWithoutId {
  @Field()
  @PrimaryKey()
  readonly id: string = v4()
}

@ObjectType()
@Entity({ abstract: true })
export abstract class BaseEntityWithOnlyId {
  @Field()
  @PrimaryKey()
  readonly id: string = v4()
}
