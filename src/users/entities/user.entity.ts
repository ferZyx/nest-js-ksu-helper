import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform, Type } from 'class-transformer'
import mongoose from 'mongoose'
import { RoleEntity } from '../../roles/entities/role.entity'
import { GroupEntity } from '../../groups/entities/group.entity'
import { Group } from '../../schemas/group.schema'

export class UserEntity {
	@ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
	readonly email: string

	@Type(() => GroupEntity)
	readonly groups: Group[]

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
		type: [RoleEntity]
	})
	@Transform(({ value }) => value.map((role: { name: string }) => role.name))
	@Type(() => RoleEntity)
	readonly roles: RoleEntity[]

	@Exclude()
	readonly __v: number

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial)
	}
}
