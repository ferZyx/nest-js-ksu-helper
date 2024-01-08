import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CreateUserDto } from '../users/dtos/create-user.dto'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { UserDocument } from '../schemas/user.schema'
import { LoginUserDto } from '../users/dtos/login-user.dto'
import { Request } from 'express'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	async registration(dto: CreateUserDto) {
		const hashPassword = await bcrypt.hash(dto.password, 5)
		const user = await this.usersService.createUser({
			...dto,
			password: hashPassword
		})

		return this.generateToken(user)
	}

	async login(userDto: LoginUserDto) {
		const user = await this.validateUser(userDto)
		return this.generateToken(user)
	}

	private async generateToken(user: UserDocument) {
		const payload = { email: user.email, id: user._id, roles: user.roles }
		return this.jwtService.sign(payload)
	}

	private async validateUser(userDto: LoginUserDto) {
		const user = await this.usersService.findUserByEmail(userDto.email)
		const passwordEquals = await bcrypt.compare(
			userDto.password,
			user?.password ?? ''
		)
		if (user && passwordEquals) {
			return user
		}
		throw new UnauthorizedException({
			message: 'Некорректный емайл или пароль'
		})
	}

	isAuthenticated(request: any) {
		const token = this.extractTokenFromRequest(request)

		if (!token) {
			throw new UnauthorizedException('Не указан токен авторизации')
		}

		try {
			const decodedToken = this.jwtService.verify(token)
			request.user = decodedToken
			return !!decodedToken
		} catch (error) {
			throw new UnauthorizedException('Недействительный токен авторизации')
		}
	}

	private extractTokenFromRequest(request: Request): string {
		const token = request.cookies.token

		if (!token) {
			return null
		}

		// const [type, token] = authHeader.split(' ')

		// if (type !== 'Bearer' || !token) {
		// 	return null
		// }

		return token
	}
}
