import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class LoginUserDto {
	@ApiProperty({ example: 'user@mail.ru', description: 'Почтовый адрес' })
	@IsNotEmpty({ message: 'Не указана почта' })
	readonly email: string

	@ApiProperty({ example: '123123', description: 'Пароль' })
	@IsNotEmpty({ message: 'Не указан пароль' })
	readonly password: string
}
