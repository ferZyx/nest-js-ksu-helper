import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	HttpStatus,
	Req,
	UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
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
	@UseInterceptors(ClassSerializerInterceptor)
	@Get('me')
	async getMe(@Req() request: Request): Promise<UserEntity> {
		const { userData, userGroups } = await this.usersService.getMe(request)
		const groups = userGroups.map((group: any) => group.toObject())
		return new UserEntity({ ...userData.toObject(), groups })
	}
}
