import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

export type NotificationDocument = mongoose.Document & Notification

@Schema({ timestamps: true })
export class Notification {
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
