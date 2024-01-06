import { ApiProperty } from '@nestjs/swagger'

export class LoginUserDto {
	@ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
	readonly email: string

	@ApiProperty({ example: '123123', description: 'Пароль' })
	readonly password: string
}
