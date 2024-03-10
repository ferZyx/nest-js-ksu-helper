import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	HttpStatus,
	Req,
	UseInterceptors
} from '@nestjs/common'
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
	@ApiBearerAuth()
	@UseInterceptors(ClassSerializerInterceptor)
	@Roles('Admin')
	@Get()
	async getAll(): Promise<UserEntity[]> {
		const users: UserDocument[] = await this.usersService.getAll()
		return users.map((user: UserDocument) => new UserEntity(user.toObject()))
	}

	@ApiOperation({ summary: 'Получить инфу о себе.' })
	@ApiResponse({
		type: User,
		status: HttpStatus.OK,
		description: 'Успешное получение о себе'
	})
	@ApiBearerAuth()
	@UseInterceptors(ClassSerializerInterceptor)
	@Get('me')
	async getMe(@Req() request: Request): Promise<UserEntity> {
		const userData = await this.usersService.getMe(request)
		return new UserEntity(userData)
	}
}
