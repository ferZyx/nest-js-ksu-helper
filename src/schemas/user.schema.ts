import * as mongoose from 'mongoose'
import { Types } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Role } from './role.schema'
import { GroupRolesEnum } from './group.schema'
import { NotificationDocument } from './notification.schema'

export type UserDocument = mongoose.Document & User

@Schema({ timestamps: true })
export class User {
	@ApiProperty({
		example: 'user@gmail.com',
		description: 'Почтовый адрес',
		uniqueItems: true,
		required: true
	})
	@Prop({ unique: true, required: true })
	email: string

	@ApiProperty({ example: '123123', description: 'Пароль' })
	@Prop({ required: true })
	password: string

	@ApiProperty({
		example: 'User',
		description: 'Роли пользователя',
		required: true
	})
	@Prop({
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
		required: true
	})
	roles: Role[]

	@ApiProperty({
		example: 'User',
		description: 'Группа пользователя',
		required: false
	})
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
		default: null
	})
	group: Types.ObjectId

	@ApiProperty({
		example: 'user',
		description: 'Роль пользователя в группе',
		required: false
	})
	@ApiProperty({ example: 'member', description: 'Роль пользователя в группе' })
	@Prop({
		required: false,
		enum: GroupRolesEnum,
		default: null
	})
	groupRole: string

	@ApiProperty({
		description: 'Уведомления пользователя',
		required: false
	})
	@Prop({
		required: false,
		type: [
			{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification', default: [] }
		]
	})
	notifications: NotificationDocument[]
}

export const UserSchema = SchemaFactory.createForClass(User)
