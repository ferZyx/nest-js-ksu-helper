import { IsBoolean, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateAnswerDto {
	@ApiProperty({ example: 'Ответ на вопрос' })
	@IsString()
	value: string

	@ApiProperty({ example: true })
	@IsBoolean()
	isCorrect: boolean
}
