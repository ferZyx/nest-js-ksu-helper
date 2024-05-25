import { Module } from '@nestjs/common'
import { TestsService } from './tests.service'
import { TestsController } from './tests.controller'
import { HttpModule } from '@nestjs/axios'
import { Test, TestSchema } from '../schemas/test.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { Question, QuestionSchema } from '../schemas/question.schema'
import { Answer, AnswerSchema } from '../schemas/answer.schema'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Test.name, schema: TestSchema },
			{ name: Question.name, schema: QuestionSchema },
			{ name: Answer.name, schema: AnswerSchema }
		]),
		HttpModule
	],
	controllers: [TestsController],
	providers: [TestsService]
})
export class TestsModule {}
