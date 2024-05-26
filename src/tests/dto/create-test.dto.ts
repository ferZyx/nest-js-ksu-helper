import { CreateQuestionDto } from '../../questions/dto/create-question.dto'
import { TestPrivacyEnum } from '../../schemas/test.schema'
import { IsEnum, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTestDto {
	@ApiProperty({
		type: [CreateQuestionDto],
		example: [
			{
				value: 'Вопрос',
				answers: [{ value: 'Ответ на вопрос', isCorrect: true }]
			}
		]
	})
	@Type(() => CreateQuestionDto)
	@ValidateNested({ each: true })
	questions: CreateQuestionDto[]

	@ApiProperty({ example: 'Биология 2022' })
	@IsString()
	name: string

	@ApiProperty({ enum: TestPrivacyEnum, example: TestPrivacyEnum.private })
	@IsEnum(TestPrivacyEnum)
	privacy: TestPrivacyEnum
}
