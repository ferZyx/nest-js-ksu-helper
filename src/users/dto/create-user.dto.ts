import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, Length } from 'class-validator'

export class CreateUserDto {
	@ApiProperty({ example: 'user@mail.ru', description: 'Почтовый адрес' })
	@IsEmail({}, { message: 'Указан некорректный email' })
	readonly email: string

	@ApiProperty({ example: '123123', description: 'Пароль' })
	@Length(4, 16, {
		message: 'Пароль должен быть не менее 4 и не более 16 символов'
	})
	readonly password: string
}
