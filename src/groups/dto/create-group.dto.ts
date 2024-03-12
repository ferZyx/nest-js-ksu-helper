import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { GroupTypeEnum } from '../../schemas/group.schema'

export class CreateGroupDto {
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Не должно быть пустым' })
	readonly name: string

	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Не должно быть пустым' })
	@IsEnum(GroupTypeEnum, {
		message: 'Type должно быть одним из: public, requests, private'
	})
	readonly type: GroupTypeEnum
}
