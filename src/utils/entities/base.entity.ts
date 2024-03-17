import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Transform } from 'class-transformer'

export class BaseEntity {
	@Exclude()
	readonly _id: string

	@ApiProperty({
		example: '6597d87f09da1c01b87fe7d7',
		description: 'Уникальный идентификатор документа'
	})
	@Transform(({ value, obj }) => {
		if (obj._id) {
			return obj._id.toString()
		}
		return value
	})
	@Expose()
	id: string

	@ApiProperty({
		example: '2021-07-01T14:00:00.000Z',
		description: 'Дата создания документа'
	})
	readonly createdAt: Date

	@ApiProperty({
		example: '2021-07-01T14:00:00.000Z',
		description: 'Дата обновления документа'
	})
	readonly updatedAt: Date

	@Exclude()
	__v: number
}
