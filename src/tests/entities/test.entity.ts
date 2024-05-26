import { BaseEntity } from '../../utils/entities/base.entity'
import { QuestionEntity } from '../../questions/entities/question.entity'
import { Transform, Type } from 'class-transformer'
import { Question } from '../../schemas/question.schema'
import { TestPrivacyEnum } from '../../schemas/test.schema'
import { ApiProperty } from '@nestjs/swagger'

export class TestEntity extends BaseEntity {
	@ApiProperty()
	@Type(() => QuestionEntity)
	questions: Question[]

	@ApiProperty()
	name: string

	@ApiProperty()
	privacy: TestPrivacyEnum

	@ApiProperty()
	@Transform(({ value }) => value?.toString() || null)
	author: string

	constructor(partial: Partial<TestEntity>) {
		super()
		Object.assign(this, partial)
	}
}
