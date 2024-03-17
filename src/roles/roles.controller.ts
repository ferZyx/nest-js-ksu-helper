import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post
} from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import { Role, RoleDocument } from '../schemas/role.schema'
import { Roles } from '../auth/roles-auth.decorator'
import { UseMongooseInterceptor } from '../utils/interceptros/mongoose-class-serializer.interceptor'
import { RoleEntity } from './entities/role.entity'

@ApiTags('Роли пользователей')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@ApiOperation({ summary: 'Создать роль. Доступно админам' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Роль успешно создана',
		type: Role
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Роль уже существует'
	})
	@UseMongooseInterceptor(RoleEntity)
	@Roles('Admin')
	@Post()
	async createRole(@Body() dto: CreateRoleDto): Promise<RoleDocument> {
		return this.rolesService.createRole(dto)
	}

	@ApiOperation({ summary: 'Удалить роль. Доступно админам' })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'Роль успешно удалена'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Роль не найдена'
	})
	@UseMongooseInterceptor(RoleEntity)
	@Roles('Admin')
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete()
	async deleteRole(@Body() dto: CreateRoleDto) {
		return this.rolesService.deleteRole(dto)
	}

	@ApiOperation({ summary: 'Найти роль по названию. Доступно админам' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Роль найдена',
		type: Role
	})
	@UseMongooseInterceptor(RoleEntity)
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Роль не найдена'
	})
	@Roles('Admin')
	@Get('/:name')
	async getRoleByName(@Param('name') name: string) {
		return this.rolesService.getRoleByName(name)
	}
}
