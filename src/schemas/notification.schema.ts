import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from './user.schema'
import mongoose from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

export type NotificationDocument = mongoose.Document & Notification

@Schema({ timestamps: true })
export class Notification {
	@ApiProperty({
		example: '6597d87f09da1c01b87fe7d7',
		description: 'Уникальный идентификатор пользователя'
	})
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
	user: User

	@ApiProperty({ example: 'Some message', description: 'Сообщение' })
	@Prop({ required: true })
	message: string


	@ApiProperty({ example: 'Some title', description: 'Заголовок' })
	@Prop({ required: true })
	title: string

	@ApiProperty({ example: false, description: 'Прочитано ли сообщение' })
	@Prop({ default: false })
	hasRead: boolean
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
