import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class UpdateNotificationDto {
	@ApiProperty({ example: true, description: 'Прочитано ли' })
	@IsBoolean()
	readonly hasRead: boolean
}
