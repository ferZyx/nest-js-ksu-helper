import { Controller, Get, HttpStatus, Req } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import { User, UserDocument } from '../schemas/user.schema'
import { UsersService } from './users.service'
import { UserEntity } from './entities/user.entity'
import { Roles } from '../auth/roles-auth.decorator'
import { TransformResponse } from '../interceptros/custom-class-serializer.interceptor'

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: 'Получить всех пользователей. Доступно админам' })
	@ApiResponse({
		type: User,
		status: HttpStatus.OK,
		description: 'Успешное получение всех пользователей'
	})
	@ApiBearerAuth()
	@TransformResponse(UserEntity)
	@Roles('Admin')
	@Get()
	async getAll(): Promise<UserDocument[]> {
		return await this.usersService.getAll()
	}

	@ApiOperation({ summary: 'Получить инфу о себе.' })
	@ApiResponse({
		type: User,
		status: HttpStatus.OK,
		description: 'Успешное получение о себе'
	})
	@ApiBearerAuth()
	@TransformResponse(UserEntity)
	@Get('me')
	async getMe(@Req() request: Request): Promise<User> {
		return await this.usersService.getMe(request)
	}
	// @ApiOperation({ summary: 'Удалить пользователя. Доступно админам' })
	// @ApiResponse({
	// 	type: User,
	// 	status: HttpStatus.OK,
	// 	description: 'Успешное удаление пользователя'
	// })
	// @ApiBearerAuth()
	// @Roles('Admin')
	// @Delete(':id')
	// async remove(@Param('id') id: string): Promise<UserEntity> {
	// 	const user = await this.usersService.remove(id)
	// 	return new UserEntity(user.toObject())
	// }
}
