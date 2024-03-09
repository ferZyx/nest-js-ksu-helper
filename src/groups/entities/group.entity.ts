import mongoose from 'mongoose'
import { Exclude, Transform, Type } from 'class-transformer'
import { UserEntity } from '../../users/entities/user.entity'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '../../schemas/user.schema'

export class GroupEntity {
	readonly name: string

	readonly type: string

	@ApiProperty({
		example: '6597d87f09da1c01b87fe7d7',
		description: 'Уникальный идентификатор'
	})
	@Transform(({ value }) => value.toString())
	_id: mongoose.Schema.Types.ObjectId

	@Type(() => UserEntity)
	members: User[]

	@Type(() => UserEntity)
	joinRequests: mongoose.Schema.Types.ObjectId[]

	@Exclude()
	readonly __v: number

	constructor(partial: Partial<GroupEntity>) {
		Object.assign(this, partial)
	}
}
