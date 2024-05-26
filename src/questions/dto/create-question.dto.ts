import { Answer } from '../../schemas/answer.schema'
import { IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateAnswerDto } from '../../answers/dto/create-answer.dto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateQuestionDto {
	@ApiProperty({ example: 'Вопрос' })
	@IsString()
	readonly value: string

	@ApiProperty({
		type: [CreateAnswerDto],
		example: [{ value: 'Ответ на вопрос', isCorrect: true }]
	})
	@Type(() => CreateAnswerDto)
	@ValidateNested({ each: true })
	answers: Answer[]
}
