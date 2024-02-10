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

@Schema({ timestamps: true })
export class Group {
	@ApiProperty({ example: 'Group name', description: 'Название группы' })
	@Prop({ required: true })
	name: string

	@ApiProperty({
		example: '6597d87f09da1c01b87fe7d7',
		description: 'Создатель'
	})
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		autopopulate: true
	})
	owner: User

	@ApiProperty({
		example: ['6597d87f09da1c01b87fe7d7'],
		description: 'Участники'
	})
	@Prop({
		type: [
			{ type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true }
		],
		required: true
	})
	members: User[]

	@ApiProperty({
		example: ['6597d87f09da1c01b87fe7d7'],
		description: 'Заявки на вступление'
	})
	@Prop({
		type: [
			{ type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true }
		]
	})
	joinRequests: User[]

	@ApiProperty({
		example: ['6597d87f09da1c01b87fe7d7'],
		description: 'Администраторы группы'
	})
	@Prop({
		type: [
			{ type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true }
		]
	})
	admins: User[]

	@ApiProperty({ example: 'public', description: 'Тип группы' })
	@Prop({ required: true, enum: GroupTypeEnum })
	type: string
}

export const GroupSchema = SchemaFactory.createForClass(Group)
