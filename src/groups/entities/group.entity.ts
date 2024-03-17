import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity } from '../../utils/entities/base.entity'
import { GroupTypeEnum } from '../../schemas/group.schema'
import { Type } from 'class-transformer'
import { UserEntity } from '../../users/entities/user.entity'
import { User } from '../../schemas/user.schema'

export class GroupEntity extends BaseEntity {
	@ApiProperty({
		example: 'Группа 1',
		description: 'Название группы'
	})
	readonly name: string

	@ApiProperty({
		example: 'group',
		description: 'Тип группы',
		enum: GroupTypeEnum
	})
	readonly type: string

	@Type(() => UserEntity)
	members: User[]

	@Type(() => UserEntity)
	joinRequests: User[]
}
