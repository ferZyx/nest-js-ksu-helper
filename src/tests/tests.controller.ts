import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { TestsService } from './tests.service'
import { UpdateTestDto } from './dto/update-test.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { WordFileTypeValidationPipe } from '../utils/pipes/word-file-type-validation.pipe'
import { CreateTestDto } from './dto/create-test.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Тесты')
@ApiBearerAuth()
@Controller('tests')
export class TestsController {
	constructor(private readonly testsService: TestsService) {}

	// Есть страница где можно удобно создавать тесты. Эта страница присылает на сервер объект с вопросами и ответами.
	// Сервер же создает из этого TEST и сохраняет его в базу данных. Это в этом методе
	@Post()
	create(@Body() createTestDto: CreateTestDto) {
		return this.testsService.create(createTestDto)
	}

	// В ту страницу где можно создавать тесты можно импортировать данные из ворд файла, тем самыв автоматически заполнив форму создания теста.
	// Это метод который принимает ворд файл и возвращает данные в виде хтмл.
	// Нужно будет написать притер и вставить его сюда. ЧТобы не слать ужасно длинную хтмлку после libreOffice
	@ApiOperation({
		summary: 'Прочитать ворд файл. Возвращает хмтл',
		description: 'Принимает 1 ворд файлик в поле file в формдате'
	})
	@HttpCode(HttpStatus.OK)
	@Post('read-word-file')
	@UseInterceptors(FileInterceptor('file'))
	async uploadTest(
		@UploadedFile(new WordFileTypeValidationPipe())
		file: Express.Multer.File
	) {
		console.log(file)
		const htmlFile = await this.testsService.readWordFile(file)
		console.log(htmlFile)
		return htmlFile.data
	}

	@Get()
	findAll() {
		return this.testsService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.testsService.findOne(+id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
		return this.testsService.update(+id, updateTestDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.testsService.remove(+id)
	}
}
