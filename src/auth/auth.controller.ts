import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { LoginUserDto } from '../users/dto/login-user.dto'
import { Public } from './public-route.decorator'

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
	@Public()
	@Post('/registration')
	async registration(@Body() dto: CreateUserDto): Promise<{ token: string }> {
		return await this.authService.registration(dto)
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
	@Public()
	@Post('/login')
	async login(@Body() dto: LoginUserDto) {
		return this.authService.login(dto)
	}
}
