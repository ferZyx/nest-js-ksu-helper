import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

export type RoleDocument = HydratedDocument<Role>

@Schema()
export class Role {
	@ApiProperty({ example: 'User', description: 'Название роли' })
	@Prop({ required: true, unique: true })
	name: string
}

export const RoleSchema = SchemaFactory.createForClass(Role)
