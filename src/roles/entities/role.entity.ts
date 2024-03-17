import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity } from '../../utils/entities/base.entity'

export class RoleEntity extends BaseEntity {
	@ApiProperty({ example: 'User', description: 'Название роли' })
	readonly name: string

	constructor(partial: Partial<RoleEntity>) {
		super()
		Object.assign(this, partial)
	}
}
