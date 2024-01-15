import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	HttpStatus,
	Req,
	UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { User } from '../schemas/user.schema'
import { UsersService } from './users.service'
import { UserEntity } from './entities/user.entity'
import { Roles } from '../auth/roles-auth.decorator'

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: 'Получить всех пользователей. Доступно админам' })
	@ApiResponse({
		type: [User],
		status: HttpStatus.OK,
		description: 'Успешное получение всех пользователей'
	})
	@Roles('Admin')
	@Get()
	getAll(): Promise<User[]> {
		return this.usersService.getAll()
	}

	@ApiOperation({ summary: 'Получить инфу о себе.' })
	@ApiResponse({
		type: User,
		status: HttpStatus.OK,
		description: 'Успешное получение о себе'
	})
	@UseInterceptors(ClassSerializerInterceptor)
	@Get('me')
	async getMe(@Req() request: Request) {
		const user = await this.usersService.getMe(request)
		return new UserEntity(user.toObject())
	}
}
