import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateGroupDto {
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Не должно быть пустым' })
	readonly name: string

	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Не должно быть пустым' })
	readonly type: string

	@IsOptional()
	owner?: string

	@IsOptional()
	members?: string[]

	@IsOptional()
	admins?: string[]

	@IsOptional()
	joinRequests?: string[]
}
