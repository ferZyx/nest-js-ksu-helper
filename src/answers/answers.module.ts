import { Module } from '@nestjs/common'
import { AnswersService } from './answers.service'
import { AnswersController } from './answers.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Answer, AnswerSchema } from '../schemas/answer.schema'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }])
	],
	controllers: [AnswersController],
	providers: [AnswersService]
})
export class AnswersModule {}
