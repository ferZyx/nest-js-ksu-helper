import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CreateUserDto } from '../users/dtos/create-user.dto'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { UserDocument } from '../schemas/user.schema'
import { LoginUserDto } from '../users/dtos/login-user.dto'

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
		return {
			token: this.jwtService.sign(payload)
		}
	}

	private async validateUser(userDto: LoginUserDto): Promise<UserDocument> {
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
}
