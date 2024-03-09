import mongoose, { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from './user.schema'
import { ApiProperty } from '@nestjs/swagger'

export type GroupDocument = HydratedDocument<Group>

export enum GroupTypeEnum {
	'public',
	'requests',
	'private'
}

export enum GroupRolesEnum {
	'member' = 'member',
	'admin' = 'admin',
	'owner' = 'owner'
}

@Schema({ timestamps: true })
export class Group {
	@ApiProperty({ example: 'Group name', description: 'Название группы' })
	@Prop({ required: true })
	name: string

	@ApiProperty({
		example: ['6597d87f09da1c01b87fe7d7'],
		description: 'Заявки на вступление'
	})
	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				autopopulate: true,
				default: []
			}
		]
	})
	joinRequests: User[]

	@ApiProperty({ example: 'public', description: 'Тип группы' })
	@Prop({ required: true, enum: GroupTypeEnum })
	type: string
}

export const GroupSchema = SchemaFactory.createForClass(Group)
