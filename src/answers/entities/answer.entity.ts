import { BaseEntity } from '../../utils/entities/base.entity'

export class AnswerEntity extends BaseEntity {
	// TODO: Задать описание для сваггера
	readonly value: string

	readonly isCorrect: boolean

	constructor(partial: Partial<AnswerEntity>) {
		super()
		Object.assign(this, partial)
	}
}
