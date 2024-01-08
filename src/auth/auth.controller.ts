import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Res,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../users/dtos/create-user.dto'
import { LoginUserDto } from '../users/dtos/login-user.dto'
import { Response } from 'express'

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
	async registration(
		@Body() dto: CreateUserDto,
		@Res({ passthrough: true }) res: Response
	) {
		const token = await this.authService.registration(dto)
		res.cookie('token', token, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			secure: true
		})
		return token
	}

	@ApiOperation({ summary: 'Авторизация' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Успешная авторизация'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Указаны некорректные данные'
	})
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('/login')
	async login(
		@Body() dto: LoginUserDto,
		@Res({ passthrough: true }) res: Response
	) {
		const token = await this.authService.login(dto)

		res.cookie('token', token, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			secure: true
		})
		return { token }
	}

	@Post('/logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie('token')
		return
	}
}
