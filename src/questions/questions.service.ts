import { Injectable } from '@nestjs/common'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { Question, QuestionDocument } from '../schemas/question.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class QuestionsService {
	constructor(
		@InjectModel(Question.name) private questionModel: Model<QuestionDocument>
	) {}

	create(createQuestionDto: CreateQuestionDto) {
		return this.questionModel.create(createQuestionDto)
	}

	findAll() {
		return `This action returns all questions`
	}

	findOne(id: number) {
		return `This action returns a #${id} question`
	}

	update(id: number, updateQuestionDto: UpdateQuestionDto) {
		return `This action updates a #${id} question`
	}

	remove(id: number) {
		return `This action removes a #${id} question`
	}
}
