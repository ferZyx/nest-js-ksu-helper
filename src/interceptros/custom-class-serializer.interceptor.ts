import {
	applyDecorators,
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
	UseInterceptors
} from '@nestjs/common'
import { ClassTransformOptions, plainToInstance } from 'class-transformer'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ApiResponse } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
	constructor(
		private entityClass: any,
		private classTransformOptions: any
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => {
				let obj: HydratedDocument<any> = data
				if (data?.length) {
					return plainToInstance(
						this.entityClass,
						obj.map((item) => item.toJSON()),
						this.classTransformOptions
					)
					// obj.map((item) => {
					// 	if (item?.toJSON) {
					// 		console.log('toJSON')
					// 		return item
					// 	}
					// 	if (item?.lean) {
					// 		console.log('lean')
					// 		return item.lean()
					// 	}
					// })
				} else {
					if (data?.toJSON) {
						console.log('toJSON single')
						obj = data?.toJSON()
					}
					if (data?.lean) {
						console.log('lean')
						obj = data?.lean()
					}
				}
				return plainToInstance(
					this.entityClass,
					obj,
					this.classTransformOptions
				)
			})
		)
	}
}

export function TransformResponse(
	entityClass: any,
	classTransformOptions: ClassTransformOptions = {}
) {
	return applyDecorators(
		UseInterceptors(
			new TransformInterceptor(entityClass, classTransformOptions)
		),
		ApiResponse({ status: 200, type: entityClass })
	)
}
