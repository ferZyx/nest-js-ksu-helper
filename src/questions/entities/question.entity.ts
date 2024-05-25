import { BaseEntity } from '../../utils/entities/base.entity'
import { Answer } from '../../schemas/answer.schema'
import { Type } from 'class-transformer'
import { AnswerEntity } from '../../answers/entities/answer.entity'

export class QuestionEntity extends BaseEntity {
	// TODO: Add formatting and api decorators
	value: string

	@Type(() => AnswerEntity)
	answers: Answer[]

	constructor(partial: Partial<QuestionEntity>) {
		super()
		Object.assign(this, partial)
	}
}
