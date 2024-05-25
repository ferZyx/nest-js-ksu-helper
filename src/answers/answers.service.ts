import { Injectable } from '@nestjs/common'
import { CreateAnswerDto } from './dto/create-answer.dto'
import { UpdateAnswerDto } from './dto/update-answer.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Answer, AnswerDocument } from '../schemas/answer.schema'
import { Model } from 'mongoose'

@Injectable()
export class AnswersService {
	constructor(
		@InjectModel(Answer.name)
		private readonly answerModel: Model<AnswerDocument>
	) {}

	create(createAnswerDto: CreateAnswerDto) {
		return this.answerModel.create(createAnswerDto)
	}

	findAll() {
		return `This action returns all answers`
	}

	findOne(id: number) {
		return `This action returns a #${id} answer`
	}

	update(id: number, updateAnswerDto: UpdateAnswerDto) {
		return `This action updates a #${id} answer`
	}

	remove(id: number) {
		return `This action removes a #${id} answer`
	}
}
