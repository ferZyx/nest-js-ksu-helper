import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform, Type } from 'class-transformer'
import { Types } from 'mongoose'
import { RoleEntity } from '../../roles/entities/role.entity'
import { GroupEntity } from '../../groups/entities/group.entity'
import { NotificationEntity } from '../../notifications/entities/notification.entity'
import { Group } from '../../schemas/group.schema'
import { Notification } from '../../schemas/notification.schema'

export class UserEntity {
	@ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
	readonly email: string

	@Transform(({ value }) => value?._id.toString() || null)
	@Type(() => GroupEntity)
	readonly group: Group

	// group role field

	@Type(() => NotificationEntity)
	readonly notifications: Notification[]

	@ApiProperty({ example: '123123', description: 'Пароль' })
	@Exclude()
	readonly password: string

	@ApiProperty({
		example: '6597d87f09da1c01b87fe7d7',
		description: 'Уникальный идентификатор'
	})
	@Transform(({ value }) => value.toString())
	readonly _id: Types.ObjectId

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
