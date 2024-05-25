import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type AnswerDocument = mongoose.Document & Answer

@Schema()
export class Answer {
	@Prop({ required: true })
	value: string

	@Prop({ required: true })
	isCorrect: boolean
}

export const AnswerSchema = SchemaFactory.createForClass(Answer)
