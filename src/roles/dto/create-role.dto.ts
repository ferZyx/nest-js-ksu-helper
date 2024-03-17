import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateRoleDto {
	@ApiProperty({ example: 'User', description: 'Название роли' })
	@IsString({ message: 'Поле "name" должно быть строкой' })
	@IsNotEmpty({ message: 'Поле "name" не должно быть пустым' })
	readonly name: string
}
