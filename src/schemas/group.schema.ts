import mongoose, { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from './user.schema'

export type GroupDocument = HydratedDocument<Group>

export enum GroupTypeEnum {
	'public',
	'requests',
	'private'
}

@Schema({ timestamps: true })
export class Group {
	@Prop({ required: true })
	name: string

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	owner: User

	@Prop({
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		required: true
	})
	members: User[]

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
	joinRequests: User[]

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
	admins: User[]

	@Prop({ required: true, enum: GroupTypeEnum })
	type: string
}

export const GroupSchema = SchemaFactory.createForClass(Group)
