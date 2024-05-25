import { CreateQuestionDto } from '../../questions/dto/create-question.dto'
import { TestPrivacyEnum } from '../../schemas/test.schema'
import { IsEnum, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateTestDto {
	// TODO: Разобарться с вложенной валидацией таких штук в ДТО
	@Type(() => CreateQuestionDto)
	@ValidateNested({ each: true })
	questions: CreateQuestionDto[]

	@IsString()
	name: string

	@IsEnum(TestPrivacyEnum)
	privacy: TestPrivacyEnum
}
