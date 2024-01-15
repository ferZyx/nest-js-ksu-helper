import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Req,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { GroupsService } from './groups.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Roles } from '../auth/roles-auth.decorator'
import { Group, GroupDocument } from '../schemas/group.schema'
import { GroupEntity } from './entities/group.entity'

@Controller('groups')
export class GroupsController {
	constructor(private readonly groupsService: GroupsService) {}

	@ApiOperation({ summary: 'Создать группу' })
	@ApiResponse({
		type: Group,
		status: HttpStatus.CREATED,
		description: 'Успешное создание группы'
	})
	@UseInterceptors(ClassSerializerInterceptor)
	@UsePipes(new ValidationPipe())
	@Post()
	async create(
		@Body() createGroupDto: CreateGroupDto,
		@Req() req: Request
	): Promise<GroupEntity> {
		const group: GroupDocument = await this.groupsService.create(
			createGroupDto,
			req
		)
		return new GroupEntity(group.toObject())
	}

	@ApiOperation({ summary: 'Получить все группы. Доступно админам' })
	@ApiResponse({ type: [Group], status: HttpStatus.OK })
	@UseInterceptors(ClassSerializerInterceptor)
	@Roles('Admin')
	@Get()
	async findAll(): Promise<GroupEntity[]> {
		const groups: GroupDocument[] = await this.groupsService.findAll()
		return groups.map(
			(group: GroupDocument) => new GroupEntity(group.toObject())
		)
	}

	@ApiOperation({ summary: 'Найти группу по айди' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Группа найдена',
		type: Group
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Группа не найдена'
	})
	@UseInterceptors(ClassSerializerInterceptor)
	@Get(':id')
	async findOne(@Param('id') id: string): Promise<GroupEntity> {
		const group: GroupDocument = await this.groupsService.findOne(id)
		return new GroupEntity(group.toObject())
	}

	// Доделать по уму
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
		return this.groupsService.update(+id, updateGroupDto)
	}

	@ApiOperation({ summary: 'Удалить группу. Может только владелец группы' })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'Группа успешно удалена'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Группа не найдена'
	})
	@HttpCode(204)
	@Delete(':id')
	remove(@Param('id') id: string, @Req() req: Request) {
		return this.groupsService.remove(id, req['user'].id)
	}
}
