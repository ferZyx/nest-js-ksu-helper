import { IsBoolean, IsString } from 'class-validator'

export class CreateAnswerDto {
	@IsString()
	value: string

	@IsBoolean()
	isCorrect: boolean
}
