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
		// Если есть декоратор @Public, то пропускаем запрос
		if (isPublic) {
			return true
		}

		// Проверяем авторизован ли и вытаскиваем роли пользователя
		const request = context.switchToHttp().getRequest()
		this.authCheck(request)

		// Получаем требуемые роли для доступа к ресурсу указанные в @Roles декораторе
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		)

		// Если роли не указаны, то пропускаем запрос
		if (!requiredRoles) {
			return true
		}

		// Проверяем есть ли у пользователя требуемые роли
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
