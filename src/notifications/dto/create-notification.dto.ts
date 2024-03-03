import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateNotificationDto {
	@IsNotEmpty({ message: 'Не должно быть пустым' })
	@IsString({ message: 'Должно быть строкой' })
	readonly title: string

	@IsNotEmpty({ message: 'Не должно быть пустым' })
	@IsString({ message: 'Должно быть строкой' })
	readonly message: string

	@IsNotEmpty({ message: 'Не должно быть пустым' })
	@IsString({ message: 'Должно быть строкой' })
	readonly user: string

	@IsOptional()
	readonly hasRead: boolean
}
