import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../users/dtos/create-user.dto'
import { LoginUserDto } from '../users/dtos/login-user.dto'

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'Регистрация' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Успешная регистрация'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Ошибка валидации данных'
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Пользователь с таким email-ом уже зарегестрирован'
	})
	@UsePipes(new ValidationPipe())
	@Post('/registration')
	registration(@Body() dto: CreateUserDto) {
		return this.authService.registration(dto)
	}

	@ApiOperation({ summary: 'Авторизация' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Успешная авторизация'
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: 'Указаны некорректные данные'
	})
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('/login')
	login(@Body() dto: LoginUserDto) {
		return this.authService.login(dto)
	}
}
