import { PaginateQueryDto } from '../../utils/dto/paginate-query.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class TestQueryDto extends PaginateQueryDto {
	@ApiPropertyOptional()
	@IsOptional()
	authorId?: string
}
