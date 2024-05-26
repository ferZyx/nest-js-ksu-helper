import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Question } from './question.schema'
import mongoose from 'mongoose'
import { User } from './user.schema'

export enum TestPrivacyEnum {
	'public' = 'public',
	'private' = 'private'
}

export type TestDocument = mongoose.Document & Test

@Schema({ timestamps: true })
export class Test {
	@Prop({
		required: true,
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
	})
	questions: Question[]

	@Prop({ required: true })
	name: string

	@Prop({ required: true })
	privacy: TestPrivacyEnum

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	author: User
}

export const TestSchema = SchemaFactory.createForClass(Test)
