import { Controller } from '@nestjs/common'
import { AnswersService } from './answers.service'

@Controller('answers')
export class AnswersController {
	constructor(private readonly answersService: AnswersService) {}

	// @UseMongooseInterceptor(AnswerEntity)
	// @Roles('Admin')
	// @Post()
	// create(@Body() createAnswerDto: CreateAnswerDto) {
	// 	return this.answersService.create(createAnswerDto)
	// }

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
