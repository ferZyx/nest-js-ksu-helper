import * as mongoose from 'mongoose'
import { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Role } from './role.schema'

export type UserDocument = HydratedDocument<User>

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

	// @ApiProperty({example: "Vladik", description: "Имя", required:false})
	//     // @Prop()
	//     // fist_name: string;
	//     //
	//     // @ApiProperty({example: "Sorokin", description: "Фамилия", required:false})
	//     // @Prop()
	//     // last_name: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User)
