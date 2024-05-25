import { Answer } from '../../schemas/answer.schema'
import { IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateAnswerDto } from '../../answers/dto/create-answer.dto'

export class CreateQuestionDto {
	// TODO: Add validation and ApiProperty decorators
	@IsString()
	readonly value: string

	// TODO: Разобарться с этим полем. Какое оно должно быть на выходе: обджект айди или объект целиком.
	@Type(() => CreateAnswerDto)
	@ValidateNested({ each: true })
	answers: Answer[]
}
