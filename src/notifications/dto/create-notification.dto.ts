import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateNotificationDto {
	@ApiProperty({ example: 'Новое уведомление', description: 'Заголовок' })
	@IsNotEmpty({ message: 'Заголовок не может быть пустым' })
	@IsString({ message: 'Поле title должно быть строкой' })
	readonly title: string

	@ApiProperty({ example: 'Текст уведомления', description: 'Сообщение' })
	@IsNotEmpty({ message: 'Сообщение не может быть пустым' })
	@IsString({ message: 'Поле message должно быть строкой' })
	readonly message: string

	@ApiProperty({
		example: '6597d87f09da1c01b87fe7d7',
		description: 'Уникальный идентификатор пользователя'
	})
	@IsNotEmpty({ message: 'Поле userId не может быть пустым' })
	@IsString({ message: 'Поле userId должно быть строкой' })
	readonly userId: string
}
