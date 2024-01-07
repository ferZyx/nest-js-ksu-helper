import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	HttpStatus,
	Post,
	Req,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from './dtos/create-user.dto'
import { User } from '../schemas/user.schema'
import { UsersService } from './users.service'
import { RolesAuthGuard } from '../auth/roles-auth.guard'
import { Roles } from '../auth/roles-auth.decorator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UserDto } from './dtos/user.dto'

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: 'Создать пользователя. Доступно админам' })
	@ApiResponse({
		type: User,
		status: HttpStatus.CREATED,
		description: 'Пользователь успешно создан'
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Пользователь с таким email-ом уже создан'
	})
	@Roles('Admin')
	@UseGuards(RolesAuthGuard)
	@Post()
	create(@Body() userDto: CreateUserDto) {
		return this.usersService.createUser(userDto)
	}

	@ApiOperation({ summary: 'Получить всех пользователей. Доступно админам' })
	@ApiResponse({
		type: [User],
		status: HttpStatus.OK,
		description: 'Успешное получение всех пользователей'
	})
	@Roles('Admin')
	@UseGuards(RolesAuthGuard)
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
	@UseGuards(JwtAuthGuard)
	@Get('me')
	async getMe(@Req() request: Request) {
		const user = await this.usersService.getMe(request)
		return new UserDto(user.toObject())
	}
}
