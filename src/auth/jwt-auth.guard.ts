import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private authService: AuthService) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest()
		return this.authService.isAuthenticated(request)
	}
}
