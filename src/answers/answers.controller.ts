import { Body, Controller, Post } from '@nestjs/common'
import { AnswersService } from './answers.service'
import { CreateAnswerDto } from './dto/create-answer.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/roles-auth.decorator'
import { UseMongooseInterceptor } from '../utils/interceptros/mongoose-class-serializer.interceptor'
import { AnswerEntity } from './entities/answer.entity'

@ApiTags('Варианты ответов на вопрос теста')
@ApiBearerAuth()
@Controller('answers')
export class AnswersController {
	constructor(private readonly answersService: AnswersService) {}

	@UseMongooseInterceptor(AnswerEntity)
	@Roles('Admin')
	@Post()
	create(@Body() createAnswerDto: CreateAnswerDto) {
		return this.answersService.create(createAnswerDto)
	}

	// @Get()
	// findAll() {
	// 	return this.answersService.findAll()
	// }
	//
	// @Get(':id')
	// findOne(@Param('id') id: string) {
	// 	return this.answersService.findOne(+id)
	// }
	//
	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
	// 	return this.answersService.update(+id, updateAnswerDto)
	// }
	//
	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.answersService.remove(+id)
	// }
}
