import { Body, Controller, Post } from '@nestjs/common'
import { QuestionsService } from './questions.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { Roles } from '../auth/roles-auth.decorator'
import { ApiTags } from '@nestjs/swagger'
import { UseMongooseInterceptor } from '../utils/interceptros/mongoose-class-serializer.interceptor'
import { QuestionEntity } from './entities/question.entity'

@ApiTags('Вопросы теста')
@Controller('questions')
export class QuestionsController {
	constructor(private readonly questionsService: QuestionsService) {}

	@UseMongooseInterceptor(QuestionEntity)
	@Roles('Admin')
	@Post()
	create(@Body() createQuestionDto: CreateQuestionDto) {
		return this.questionsService.create(createQuestionDto)
	}

	// @Get()
	// findAll() {
	// 	return this.questionsService.findAll()
	// }
	//
	// @Get(':id')
	// findOne(@Param('id') id: string) {
	// 	return this.questionsService.findOne(+id)
	// }
	//
	// @Patch(':id')
	// update(
	// 	@Param('id') id: string,
	// 	@Body() updateQuestionDto: UpdateQuestionDto
	// ) {
	// 	return this.questionsService.update(+id, updateQuestionDto)
	// }
	//
	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.questionsService.remove(+id)
	// }
}
