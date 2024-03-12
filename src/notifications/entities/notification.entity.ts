import { Types } from 'mongoose'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class NotificationEntity {
	@ApiProperty({
		example: '6597d87f09da1c01b87fe7d7',
		description: 'Уникальный идентификатор уведомления'
	})
	_id: Types.ObjectId

	@ApiProperty({ example: 'Новое уведомление', description: 'Заголовок' })
	readonly title: string

	@ApiProperty({ example: 'Текст уведомления', description: 'Сообщение' })
	readonly message: string

	readonly user: Types.ObjectId[]

	readonly hasRead: boolean

	@Exclude()
	readonly __v: number

	constructor(partial: Partial<Notification>) {
		Object.assign(this, partial)
	}
}
