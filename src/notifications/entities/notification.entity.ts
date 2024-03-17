import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity } from '../../utils/entities/base.entity'

export class NotificationEntity extends BaseEntity {
	@ApiProperty({ example: 'Новое уведомление', description: 'Заголовок' })
	readonly title: string

	@ApiProperty({ example: 'Текст уведомления', description: 'Сообщение' })
	readonly message: string

	@ApiProperty({ example: false, description: 'Прочитано ли сообщение' })
	readonly hasRead: boolean

	constructor(partial: Partial<NotificationEntity>) {
		super()
		Object.assign(this, partial)
	}
}
