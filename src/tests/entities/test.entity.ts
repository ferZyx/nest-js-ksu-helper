import { BaseEntity } from '../../utils/entities/base.entity'
import { QuestionEntity } from '../../questions/entities/question.entity'
import { Type } from 'class-transformer'
import { Question } from '../../schemas/question.schema'

export class TestEntity extends BaseEntity {
	@Type(() => QuestionEntity)
	questions: Question[]

	name: string
	privacy: string

	constructor(partial: Partial<TestEntity>) {
		super()
		Object.assign(this, partial)
	}
}
