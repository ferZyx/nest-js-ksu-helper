import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class PaginateResultEntity<T> {
	@ApiProperty({ isArray: true })
	docs: T[]

	@ApiProperty()
	@Expose()
	totalDocs: number

	@ApiProperty()
	@Expose()
	limit: number

	@ApiProperty()
	@Expose()
	totalPages: number

	@ApiProperty()
	@Expose()
	page: number
}
