import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
	@ApiProperty({ example: 'User', description: 'Название роли' })
	readonly name: string
}
