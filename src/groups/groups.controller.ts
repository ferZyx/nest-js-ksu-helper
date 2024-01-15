import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Req,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { GroupsService } from './groups.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Roles } from '../auth/roles-auth.decorator'
import { Group, GroupDocument } from '../schemas/group.schema'

@Controller('groups')
export class GroupsController {
	constructor(private readonly groupsService: GroupsService) {}

	@ApiOperation({ summary: 'Создать группу' })
	@ApiResponse({
		type: Group,
		status: HttpStatus.CREATED,
		description: 'Успешное создание группы'
	})
	@UsePipes(new ValidationPipe())
	@Post()
	create(@Body() createGroupDto: CreateGroupDto, @Req() req: Request) {
		return this.groupsService.create(createGroupDto, req)
	}

	@ApiOperation({ summary: 'Получить все группы. Доступно админам' })
	@ApiResponse({ type: [Group], status: HttpStatus.OK })
	@Roles('Admin')
	@Get()
	findAll(): Promise<GroupDocument[]> {
		return this.groupsService.findAll()
	}

	// Сделать нормальную валидацию
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
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.groupsService.findOne(id)
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
