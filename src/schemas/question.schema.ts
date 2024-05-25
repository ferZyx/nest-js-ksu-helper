import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Answer } from './answer.schema'
import mongoose from 'mongoose'

export type QuestionDocument = mongoose.Document & Question

@Schema()
export class Question {
	@Prop({ required: true })
	value: string

	@Prop({
		required: true,
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
	})
	answers: Answer[]
}

export const QuestionSchema = SchemaFactory.createForClass(Question)
