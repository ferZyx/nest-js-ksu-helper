import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform, Type } from 'class-transformer'
import mongoose from 'mongoose'
import { RoleDto } from '../../roles/dto/role.dto'

export class UserDto {
	@ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
	readonly email: string

	@ApiProperty({ example: '123123', description: 'Пароль' })
	@Exclude()
	readonly password: string

	@ApiProperty({
		example: '6597d87f09da1c01b87fe7d7',
		description: 'Уникальный идентификатор'
	})
	@Transform(({ value }) => value.toString())
	_id: mongoose.Schema.Types.ObjectId

	@ApiProperty({
		example: 'User',
		description: 'Роли пользователя',
		type: [RoleDto]
	})
	@Type(() => RoleDto)
	readonly roles: RoleDto[]

	constructor(partial: Partial<UserDto>) {
		Object.assign(this, partial)
	}
}
