import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, Length } from 'class-validator'

export class CreateUserDto {
	@ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
	@IsEmail({}, { message: 'Указан некорректный email' })
	readonly email: string

	@ApiProperty({ example: '123123', description: 'Пароль' })
	@Length(5, 1000, { message: 'Укажите более длинный пароль.' })
	readonly password: string
}
