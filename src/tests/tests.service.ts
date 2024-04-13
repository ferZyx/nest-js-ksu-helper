import { Injectable } from '@nestjs/common'
import { CreateTestDto } from './dto/create-test.dto'
import { UpdateTestDto } from './dto/update-test.dto'
import { HttpService } from '@nestjs/axios'
import { Blob } from 'buffer'

@Injectable()
export class TestsService {
	constructor(private readonly httpService: HttpService) {}

	create(createTestDto: CreateTestDto) {
		return 'This action adds a new test'
	}

	findAll() {
		return `This action returns all tests`
	}

	findOne(id: number) {
		return `This action returns a #${id} test`
	}

	update(id: number, updateTestDto: UpdateTestDto) {
		return `This action updates a #${id} test`
	}

	remove(id: number) {
		return `This action removes a #${id} test`
	}

	async readWordFile(file: Express.Multer.File) {
		const formData = new FormData()
		formData.append('file', new Blob([file.buffer]), file.originalname)
		return this.httpService.axiosRef.post(
			'https://api.tolyan.me/express/api/converter/word-to-html',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		)
	}
}
