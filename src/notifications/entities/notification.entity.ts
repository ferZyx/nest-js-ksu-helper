import { Types } from 'mongoose'
import { Exclude, Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class NotificationEntity {
	@ApiProperty({
		example: '6597d87f09da1c01b87fe7d7',
		description: 'Уникальный идентификатор'
	})
	@Transform(({ value }) => value.toString())
	_id: Types.ObjectId

	readonly title: string

	readonly message: string

	@Exclude()
	readonly user: Types.ObjectId[]

	readonly hasRead: boolean

	@Exclude()
	readonly __v: number

	constructor(partial: Partial<Notification>) {
		Object.assign(this, partial)
	}
}
