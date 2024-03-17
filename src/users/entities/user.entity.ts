import { Exclude, Transform, Type } from 'class-transformer'
import { Role } from '../../schemas/role.schema'
import { BaseEntity } from '../../utils/entities/base.entity'
import { ApiProperty } from '@nestjs/swagger'
import { RoleEntity } from '../../roles/entities/role.entity'
import { NotificationEntity } from '../../notifications/entities/notification.entity'
import { GroupRolesEnum } from '../../schemas/group.schema'

export class UserEntity extends BaseEntity {
	@ApiProperty({ example: '123123', description: 'Пароль' })
	@Exclude()
	readonly password: string

	@ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
	readonly email: string

	@ApiProperty({
		example: 'User',
		description: 'Роли пользователя',
		type: [RoleEntity]
	})
	@Transform(({ value }) => value.map((role: Role) => role.name))
	readonly roles: Role[]

	@ApiProperty({
		description: 'Идентификатор группы',
		example: '6597d87f09da1c01b87fe7d7'
	})
	@Transform(({ value }) => value?.toString() || null)
	readonly group: string

	@ApiProperty({
		example: 'member',
		description: 'Роль пользователя в группе',
		enum: GroupRolesEnum
	})
	readonly groupRole: string

	@ApiProperty({
		description: 'Уведомления пользователя',
		type: [NotificationEntity]
	})
	@Type(() => NotificationEntity)
	readonly notifications: Notification[]

	constructor(partial: Partial<UserEntity>) {
		super()
		Object.assign(this, partial)
	}
}
