import {
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './roles-auth.decorator'
import { AuthService } from './auth.service'

@Injectable()
export class RolesAuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private authService: AuthService
	) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		try {
			const requiredRoles = this.reflector.getAllAndOverride<string[]>(
				ROLES_KEY,
				[context.getHandler(), context.getClass()]
			)
			if (!requiredRoles) {
				return true
			}

			const request = context.switchToHttp().getRequest()
			const isAuthenticated = this.authService.isAuthenticated(request)
			if (!isAuthenticated) {
				return false
			}
			const user = request.user
			return user.roles.some((role: { name: string }) => {
				return requiredRoles.includes(role.name)
			})
		} catch (e) {
			throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
		}
	}
}
