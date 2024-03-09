import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

export type RoleDocument = HydratedDocument<Role>

@Schema()
export class Role {
	@ApiProperty({ example: 'User', description: 'Название роли' })
	@Prop({ required: true, unique: true })
	name: string

	@ApiProperty({
		example: '6597d87f09da1c01b87fe7d7',
		description: 'Уникальный идентификатор'
	})
	_id: mongoose.Schema.Types.ObjectId
}

export const RoleSchema = SchemaFactory.createForClass(Role)
