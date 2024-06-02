import { Allow } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class PaginateQueryDto {
	@Allow()
	@Transform(({ value }) => Number(value))
	@ApiProperty({ default: 1, required: false, type: Number })
	page = 1

	@Allow()
	@Transform(({ value }) => Number(value))
	@ApiProperty({ default: 10, required: false, type: Number })
	limit = 10
}
