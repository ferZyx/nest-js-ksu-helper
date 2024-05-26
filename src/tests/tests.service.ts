import { Injectable } from '@nestjs/common'
import { CreateTestDto } from './dto/create-test.dto'
import { HttpService } from '@nestjs/axios'
import { Blob } from 'buffer'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { TestDocument } from '../schemas/test.schema'
import { AnswerDocument } from '../schemas/answer.schema'
import { QuestionDocument } from '../schemas/question.schema'

@Injectable()
export class TestsService {
	constructor(
		@InjectModel('Test')
		private readonly testModel: Model<TestDocument>,
		@InjectModel('Question')
		private readonly questionModel: Model<QuestionDocument>,
		@InjectModel('Answer')
		private readonly answerModel: Model<AnswerDocument>,
		@InjectConnection() private readonly connection: mongoose.Connection,
		private readonly httpService: HttpService
	) {}

	async create(createTestDto: CreateTestDto) {
		// Начать транзакцию
		const session = await this.connection.startSession()
		session.startTransaction()

		try {
			const questionsData = createTestDto.questions

			const answers = questionsData.flatMap(
				(questionData) => questionData.answers
			)
			const createdAnswers = await this.answerModel.insertMany(answers, {
				session
			})

			let i = 0
			questionsData.forEach((questionData, _) => {
				questionData.answers = questionData.answers.map((answer) => {
					answer = createdAnswers[i]
					i++
					return answer
				})
			})

			const createdQuestions = await this.questionModel.insertMany(
				questionsData,
				{ session }
			)

			// for (const questionData of questionsData) {
			// 	const createdAnswers = await this.answerModel.insertMany(
			// 		questionData.answers,
			// 		{ session }
			// 	)
			// 	console.log(1)
			// 	const question = new this.questionModel({
			// 		...questionData,
			// 		answers: createdAnswers
			// 	})
			// 	await question.save({ session })
			// 	console.log(2)
			// 	createdQuestions.push(question)
			// }

			const test = new this.testModel({
				...createTestDto,
				questions: createdQuestions
			})
			await test.save({ session })
			await session.commitTransaction()
			return test
		} catch (error) {
			await session.abortTransaction()
			throw error
		} finally {
			await session.endSession()
		}
	}

	// findAll() {
	// 	return `This action returns all tests`
	// }
	//
	// findOne(id: number) {
	// 	return `This action returns a #${id} test`
	// }
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
}
