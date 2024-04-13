import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform
} from '@nestjs/common'

@Injectable()
export class WordFileTypeValidationPipe implements PipeTransform {
	readonly allowedMimeTypes = [
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	]

	transform(value: any, metadata: ArgumentMetadata) {
		if (!value) {
			throw new BadRequestException('Word file is required')
		}

		const { mimetype } = value

		if (!this.allowedMimeTypes.includes(mimetype)) {
			throw new BadRequestException(
				'Invalid file type. Only .doc and .docx files are allowed.'
			)
		}

		return value
	}
}
