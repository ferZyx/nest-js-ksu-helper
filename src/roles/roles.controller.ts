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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Role } from '../schemas/role.schema'
import { Roles } from '../auth/roles-auth.decorator'

@ApiTags('Роли пользователей')
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
	@Roles('Admin')
	@Post()
	async createRole(@Body() dto: CreateRoleDto) {
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
