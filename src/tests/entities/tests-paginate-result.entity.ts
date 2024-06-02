import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { PaginateResultEntity } from '../../utils/entities/paginate-result.entity'
import { TestWithoutQuestionsEntity } from './test-without-questions.entity'

export class TestsPaginateResultEntity extends PaginateResultEntity<TestWithoutQuestionsEntity> {
	@Type(() => TestWithoutQuestionsEntity)
	@ApiProperty({ type: TestWithoutQuestionsEntity, isArray: true })
	docs: TestWithoutQuestionsEntity[]

	constructor(partial: Partial<TestsPaginateResultEntity>) {
		super()
		Object.assign(this, partial)
	}
}
