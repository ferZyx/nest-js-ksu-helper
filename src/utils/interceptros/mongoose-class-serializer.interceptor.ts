import {
	applyDecorators,
	ClassSerializerInterceptor,
	PlainLiteralObject,
	Type,
	UseInterceptors
} from '@nestjs/common'
import { ClassTransformOptions } from 'class-transformer'
import { Document } from 'mongoose'

function MongooseClassSerializerInterceptor(
	classToIntercept: Type
): typeof ClassSerializerInterceptor {
	return class MongooseInterceptor extends ClassSerializerInterceptor {
		private changePlainObjectToClass(document: PlainLiteralObject) {
			if (document instanceof Document) {
				document = document.toJSON()
			}
			return new classToIntercept(document)
		}

		private prepareResponse(
			response: PlainLiteralObject | PlainLiteralObject[]
		) {
			if (Array.isArray(response)) {
				return response.map(this.changePlainObjectToClass)
			}
			if (response.docs) {
				response.docs = response.docs.map((doc) => doc?.toJSON())
			}

			return this.changePlainObjectToClass(response)
		}

		serialize(
			response: PlainLiteralObject | PlainLiteralObject[],
			options: ClassTransformOptions
		): PlainLiteralObject | PlainLiteralObject[] {
			const preparedResponse = this.prepareResponse(response)
			return super.serialize(preparedResponse, options)
		}
	}
}

export default MongooseClassSerializerInterceptor

export function UseMongooseInterceptor(entityClass: any) {
	return applyDecorators(
		UseInterceptors(MongooseClassSerializerInterceptor(entityClass))
	)
}
