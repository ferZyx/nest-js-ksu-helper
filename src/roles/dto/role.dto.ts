import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import mongoose from 'mongoose'

export class RoleDto {
	@ApiProperty({ example: 'User', description: 'Название роли' })
	readonly name: string

	@ApiProperty({
		example: '6597d87f09da1c01b87fe7d7',
		description: 'Уникальный идентификатор'
	})
	@Transform(({ value }) => value.toString())
	_id: mongoose.Schema.Types.ObjectId
}
