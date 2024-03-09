import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class CreateNotificationDto {
	@ApiProperty({ example: 'Новое уведомление', description: 'Заголовок' })
	@IsNotEmpty({ message: 'Не должно быть пустым' })
	@IsString({ message: 'Должно быть строкой' })
	readonly title: string

	@ApiProperty({ example: 'Текст уведомления', description: 'Сообщение' })
	@IsNotEmpty({ message: 'Не должно быть пустым' })
	@IsString({ message: 'Должно быть строкой' })
	readonly message: string

	@ApiProperty({
		example: '6597d87f09da1c01b87fe7d7',
		description: 'Уникальный идентификатор пользователя'
	})
	@IsNotEmpty({ message: 'Не должно быть пустым' })
	@IsString({ message: 'Должно быть строкой' })
	readonly user: string

	@Expose()
	readonly hasRead: boolean
}
