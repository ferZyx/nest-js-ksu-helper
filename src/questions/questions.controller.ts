import { Controller } from '@nestjs/common'
import { QuestionsService } from './questions.service'

@Controller('questions')
export class QuestionsController {
	constructor(private readonly questionsService: QuestionsService) {}

	// @UseMongooseInterceptor(QuestionEntity)
	// @Roles('Admin')
	// @Post()
	// create(@Body() createQuestionDto: CreateQuestionDto) {
	// 	return this.questionsService.create(createQuestionDto)
	// }

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
