import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './roles-auth.decorator'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { IS_PUBLIC_KEY } from './public-route.decorator'

@Injectable()
export class RolesAuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private jwtService: JwtService
	) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		])
		if (isPublic) {
			return true
		}

		const requiredRoles = this.reflector.getAllAndOverride<string[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		)

		const request = context.switchToHttp().getRequest()
		this.authCheck(request)

		if (!requiredRoles) {
			return true
		}
		const userRoles = request.user?.roles
		return userRoles.some((role: { name: string }) => {
			return requiredRoles.includes(role.name)
		})
	}
	private extractTokenFromRequest(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? []
		return type === 'Bearer' ? token : undefined
	}

	private authCheck(request: Request): boolean {
		const token = this.extractTokenFromRequest(request)
		if (!token) {
			throw new UnauthorizedException('Не указан токен авторизации')
		}

		try {
			const decodedToken = this.jwtService.verify(token)
			request['user'] = decodedToken
			return !!decodedToken
		} catch (error) {
			throw new UnauthorizedException('Недействительный токен авторизации')
		}
	}
}
