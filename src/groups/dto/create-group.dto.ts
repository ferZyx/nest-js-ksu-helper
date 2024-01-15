import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import mongoose, { Types } from 'mongoose'

export class CreateGroupDto {
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Не должно быть пустым' })
	readonly name: string

	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Не должно быть пустым' })
	readonly type: string

	@IsOptional()
	owner?: Types.ObjectId

	@IsOptional()
	members?: mongoose.Schema.Types.ObjectId[]

	@IsOptional()
	admins?: mongoose.Schema.Types.ObjectId[]

	@IsOptional()
	joinRequests?: mongoose.Schema.Types.ObjectId[]
}
