import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateNotificationDto } from './create-notification.dto'
import { IsBoolean, IsNotEmpty } from 'class-validator'
import { Exclude } from 'class-transformer'

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
	@Exclude()
	readonly title: string

	@Exclude()
	readonly message: string

	@Exclude()
	readonly user: string

	@ApiProperty({ example: true, description: 'Прочитано ли' })
	@IsNotEmpty({ message: 'Не должно быть пустым' })
	@IsBoolean()
	readonly hasRead: boolean
}
