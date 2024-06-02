import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { TestsService } from './tests.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { WordFileTypeValidationPipe } from '../utils/pipes/word-file-type-validation.pipe'
import { CreateTestDto } from './dto/create-test.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UseMongooseInterceptor } from '../utils/interceptros/mongoose-class-serializer.interceptor'
import { TestEntity } from './entities/test.entity'
import { CurrentUser } from '../utils/decorators/current-user.decorator'
import { TestDocument } from '../schemas/test.schema'
import { ParseObjectIdPipe } from '../utils/pipes/parse-object-id.pipe'
import { TestsPaginateResultEntity } from './entities/tests-paginate-result.entity'
import { TestQueryDto } from './dto/test-query.dto'

@ApiTags('Тесты')
@ApiBearerAuth()
@Controller('tests')
export class TestsController {
	constructor(private readonly testsService: TestsService) {}

	// Есть страница где можно удобно создавать тесты. Эта страница присылает на сервер объект с вопросами и ответами.
	// Сервер же создает из этого TEST и сохраняет его в базу данных. Это в этом методе
	@ApiOperation({
		summary: 'Создать тест',
		description:
			'Принимает объект с вопросами и ответами и создает тест в базе данных'
	})
	@UseMongooseInterceptor(TestEntity)
	@Post()
	create(
		@Body() createTestDto: CreateTestDto,
		@CurrentUser('id') userId: string
	): Promise<TestDocument> {
		return this.testsService.create(createTestDto, userId)
	}

	// В ту страницу где можно создавать тесты можно импортировать данные из ворд файла, тем самый автоматически заполнив форму создания теста.
	// Это метод, который принимает ворд файл и возвращает данные в виде хтмл.
	// Нужно будет написать притер и вставить его сюда. Чтобы не слать ужасно длинную хтмлку после libreOffice
	@ApiOperation({
		summary: 'Прочитать word файл',
		description: 'В form-data принимает word файл и возвращает html'
	})
	@HttpCode(HttpStatus.OK)
	@Post('read-word-file')
	@UseInterceptors(FileInterceptor('file'))
	uploadTest(
		@UploadedFile(new WordFileTypeValidationPipe())
		file: Express.Multer.File
	) {
		return this.testsService.readWordFile(file)
	}

	@ApiOperation({
		summary: 'Получить все публичные тесты. Но если свои то прям все все'
	})
	@UseMongooseInterceptor(TestsPaginateResultEntity)
	@Get()
	findAll(@Query() query: TestQueryDto, @CurrentUser('id') userId: string) {
		return this.testsService.findAll(query, userId)
	}

	@ApiOperation({ summary: 'Получить тест по id' })
	@UseMongooseInterceptor(TestEntity)
	@Get(':id')
	async findOne(@Param('id', ParseObjectIdPipe) id: string) {
		return await this.testsService.findOne(id)
	}

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
	// 	return this.testsService.update(+id, updateTestDto)
	// }
	//
	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.testsService.remove(+id)
	// }
}
