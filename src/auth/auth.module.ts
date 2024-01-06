import { forwardRef, Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import * as process from 'process'

@Module({
	controllers: [AuthController],
	exports: [AuthService, JwtModule],
	imports: [
		forwardRef(() => UsersModule),
		JwtModule.register({
			secret: process.env.SECRET_KEY || 'SECRET_KEY_BY_VLADIK_HEHE',
			signOptions: {
				expiresIn: '7d'
			}
		})
	],
	providers: [AuthService]
})
export class AuthModule {}
