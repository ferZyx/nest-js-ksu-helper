import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import mongoose from 'mongoose'

export class CreateGroupDto {
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Не должно быть пустым' })
	readonly name: string

	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Не должно быть пустым' })
	readonly type: string

	@IsOptional()
	joinRequests?: mongoose.Schema.Types.ObjectId[]
}
