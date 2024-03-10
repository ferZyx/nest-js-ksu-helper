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
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import { Roles } from '../auth/roles-auth.decorator'
import { Group, GroupDocument } from '../schemas/group.schema'
import { GroupEntity } from './entities/group.entity'
import { UsersService } from '../users/users.service'
import { UserDocument } from '../schemas/user.schema'

@ApiTags('Группы')
@Controller('groups')
export class GroupsController {
	constructor(
		private readonly groupsService: GroupsService,
		private readonly usersService: UsersService
	) {}

	@ApiOperation({ summary: 'Создать группу' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Успешное создание группы',
		type: Group
	})
	@ApiBearerAuth()
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

	// переделать
	@ApiOperation({
		summary: '[!need fix!] Получить все группы. Доступно админам'
	})
	@ApiResponse({ type: [Group], status: HttpStatus.OK })
	@ApiBearerAuth()
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
	@ApiBearerAuth()
	@UseInterceptors(ClassSerializerInterceptor)
	@Get(':id')
	async findOne(@Param('id') id: string): Promise<GroupEntity> {
		const group: GroupDocument = await this.groupsService.findOne(id)
		const groupMembers: UserDocument[] =
			await this.usersService.getGroupMembers(id)
		return new GroupEntity({
			...group.toObject(),
			members: groupMembers.map((user: UserDocument) => user.toObject())
		})
	}

	// Доделать по уму
	@ApiBearerAuth()
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
		return this.groupsService.update(+id, updateGroupDto)
	}

	@ApiOperation({
		summary:
			'[need fix (При удалении удалять инфу о группу у каждого юзера)] Удалить группу. Может только владелец группы'
	})
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'Группа успешно удалена'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Группа не найдена'
	})
	@ApiBearerAuth()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	remove(@Param('id') groupId: string, @Req() req: Request) {
		return this.groupsService.remove(groupId, req['user'].id)
	}

	// по уму статус коды надо сделать
	// @ApiOperation({ summary: 'Вступить в группу' })
	// @ApiResponse({
	// 	status: HttpStatus.OK,
	// 	description: 'Успешное вступление/отправлена заявка'
	// })
	// @HttpCode(HttpStatus.OK)
	// @Post(':id/join')
	// joinGroup(@Param('id') groupId: string, @Req() req: Request) {
	// 	return this.groupsService.joinGroup(groupId, req['user'].id)
	// }

	// @ApiOperation({ summary: 'Вступить в группу' })
	// @ApiResponse({
	// 	status: HttpStatus.OK,
	// 	description: 'Успешное вступление/отправлена заявка'
	// })
	// @HttpCode(HttpStatus.OK)
	// @Post(':id/join/accept/:userId')
	// acceptRequest(
	// 	@Param('id') groupId: string,
	// 	@Param('userId') userId: string,
	// 	@Req() req: Request
	// ) {
	// 	return this.groupsService.acceptRequest(groupId, userId, req['user'].id)
	// }
}
