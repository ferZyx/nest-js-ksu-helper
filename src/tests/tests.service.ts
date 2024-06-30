import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { CreateTestDto } from './dto/create-test.dto'
import { HttpService } from '@nestjs/axios'
import { Blob } from 'buffer'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { Test, TestDocument, TestPrivacyEnum } from '../schemas/test.schema'
import { Answer, AnswerDocument } from '../schemas/answer.schema'
import { Question, QuestionDocument } from '../schemas/question.schema'
import { TestQueryDto } from './dto/test-query.dto'

@Injectable()
export class TestsService {
	constructor(
		@InjectModel(Test.name)
		private readonly testModel: Model<TestDocument>,
		@InjectModel(Question.name)
		private readonly questionModel: Model<QuestionDocument>,
		@InjectModel(Answer.name)
		private readonly answerModel: Model<AnswerDocument>,
		private readonly httpService: HttpService
	) {}

	async create(createTestDto: CreateTestDto, userId: string) {
		const questionsData = createTestDto.questions

		const answers = questionsData.flatMap(
			(questionData) => questionData.answers
		)
		const createdAnswers = await this.answerModel.insertMany(answers)

		let i = 0
		questionsData.forEach((questionData, _) => {
			questionData.answers = questionData.answers.map((answer) => {
				answer = createdAnswers[i]
				i++
				return answer
			})
		})

		const createdQuestions = await this.questionModel.insertMany(questionsData)

		const test = new this.testModel({
			...createTestDto,
			questions: createdQuestions,
			authorId: userId
		})
		await test.save()
		return test
	}

	async findAll({ page, limit, authorId }: TestQueryDto, userId: string) {
		const query = {}

		if (authorId) {
			if (!mongoose.Types.ObjectId.isValid(authorId)) {
				throw new BadRequestException('Invalid authorId')
			}
			query['authorId'] = authorId
		}

		if (authorId !== userId) {
			query['privacy'] = TestPrivacyEnum.public
		}

		const tests = this.testModel
			.find(query)
			.skip((page - 1) * limit)
			.limit(limit)
			.exec()

		const docs = await tests
		const totalDocs = await this.testModel.countDocuments(query).exec()
		return {
			docs,
			totalDocs,
			page,
			limit,
			totalPages: Math.ceil(totalDocs / limit)
		}
	}

	async findOne(id: string) {
		const test = await this.testModel
			.findById(id)
			.populate({
				path: 'questions',
				populate: {
					path: 'answers',
					select: '-isCorrect'
				}
			})
			.exec()
		if (!test) {
			throw new NotFoundException('Test not found')
		}
		return test
	}

	//
	// update(id: number, updateTestDto: UpdateTestDto) {
	// 	return `This action updates a #${id} test`
	// }
	//
	// remove(id: number) {
	// 	return `This action removes a #${id} test`
	// }

	async readWordFile(file: Express.Multer.File) {
		const formData = new FormData()
		formData.append('file', new Blob([file.buffer]), file.originalname)
		const res = await this.httpService.axiosRef.post(
			'https://api.tolyan.me/express/api/converter/word-to-html',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		)
		const html = this.extractTagContent(res.data, 'body')

		// Это нужно на случай если в ворде текст с отступами. Ну и на будущее мб тоже какой-то тег такой появится противный
		const tagsToRemove = ['blockquote']
		return this.removeTags(html, tagsToRemove)
	}

	private extractTagContent(html: string, tagName: string): string {
		const regex = new RegExp(
			`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`,
			'i'
		)
		const match = regex.exec(html)

		if (match && match[1]) {
			return match[1]
		}

		return ''
	}

	private removeTags(html: string, tags: string[]): string {
		tags.forEach((tag) => {
			const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi')
			html = html.replace(regex, (_, p1) => p1)
		})
		return html
	}

	async remove(testId: string, userId: string) {
		const test = await this.testModel.findById(testId).exec()
		if (!test) {
			throw new BadRequestException('Test not found')
		}
		if (String(test.authorId) !== String(userId)) {
			throw new ForbiddenException('You are not the author of this test')
		}

		const questions = await this.questionModel.find({
			_id: { $in: test.questions }
		})
		const questionIds = questions.map((question) => question._id)
		const answers = []
		questions.forEach((question) => {
			answers.push(...question.answers)
		})
		const answerIds = answers.map((answer) => answer._id)

		await this.testModel.deleteOne({ _id: test._id })
		await this.questionModel.deleteMany({ _id: { $in: questionIds } })
		await this.answerModel.deleteMany({ _id: { $in: answerIds } })

		return
	}
}
