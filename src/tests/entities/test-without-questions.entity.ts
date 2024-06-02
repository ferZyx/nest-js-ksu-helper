import { TestEntity } from './test.entity'
import { QuestionEntity } from '../../questions/entities/question.entity'
import { Exclude, Expose, Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class TestWithoutQuestionsEntity extends TestEntity {
	@ApiProperty()
	@Transform(({ obj }) => {
		return obj.questions?.length || 0
	})
	@Expose()
	questionsCount: number

	@Exclude()
	questions: QuestionEntity[]

	constructor(partial: Partial<TestWithoutQuestionsEntity>) {
		super(partial)
		Object.assign(this, partial)
	}
}
