import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Req,
	UseInterceptors
} from '@nestjs/common'
import { GroupsService } from './groups.service'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import { Group, GroupDocument } from '../schemas/group.schema'
import { UsersService } from '../users/users.service'
import { ParseObjectIdPipe } from '../utils/pipes/parse-object-id.pipe'
import MongooseClassSerializerInterceptor, {
	UseMongooseInterceptor
} from '../utils/interceptros/mongoose-class-serializer.interceptor'
import { GroupEntity } from './entities/group.entity'
import { Roles } from '../auth/roles-auth.decorator'
import { CreateGroupDto } from './dto/create-group.dto'

@ApiTags('[NOT READY] Группы')
@ApiBearerAuth()
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
	@UseMongooseInterceptor(GroupEntity)
	@Post()
	async create(
		@Body() createGroupDto: CreateGroupDto,
		@Req() req: Request
	): Promise<GroupDocument> {
		const userId = req['user'].id
		return await this.groupsService.create(createGroupDto, userId)
	}

	@ApiOperation({
		summary: 'Получить все группы. Доступно админам'
	})
	@ApiResponse({ type: [Group], status: HttpStatus.OK })
	@ApiBearerAuth()
	@UseInterceptors(MongooseClassSerializerInterceptor(GroupEntity))
	@Roles('Admin')
	@Get()
	async findAll() {
		const groups = await this.groupsService.findAll()
		return groups
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
	@UseMongooseInterceptor(GroupEntity)
	@Get(':id')
	async findOne(
		@Param('id', ParseObjectIdPipe) id: string
	): Promise<GroupDocument> {
		const group: GroupDocument = await this.groupsService.findOne(id)
		return group
	}

	// // Доделать по уму
	// @ApiBearerAuth()
	// @Patch(':id')
	// update(
	// 	@Param('id', ParseObjectIdPipe) id: string,
	// 	@Body() updateGroupDto: UpdateGroupDto
	// ) {
	// 	return this.groupsService.update(+id, updateGroupDto)
	// }

	@ApiOperation({
		summary:
			'Удалить группу. Может только владелец группы, только если в группе нет участников'
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
	remove(
		@Param('id', ParseObjectIdPipe) groupId: string,
		@Req() req: Request
	): Promise<GroupDocument> {
		return this.groupsService.remove(groupId, req['user'].id)
	}

	// по уму статус коды надо сделать или шото такое. на разные случаи
	@ApiOperation({ summary: 'Вступить в группу' })
	@ApiResponse({
		status: HttpStatus.OK,
		description:
			'Успешное вступление/отправлена заявка. Тоже надо как то продумать ответ на случай разных итогов. Вступили или подали заявку'
	})
	@HttpCode(HttpStatus.OK)
	@Post(':id/join')
	joinGroup(@Param('id') groupId: string, @Req() req: Request) {
		return this.groupsService.joinGroup(groupId, req['user'].id)
	}

	@ApiOperation({ summary: 'Принять заявку в группу или отклонить' })
	@ApiResponse({
		status: HttpStatus.OK,
		description:
			'Заявка принята или отклонена. Там кароче в ответе будет статус. Мб передлаем. я хз как нормально сделать'
	})
	@HttpCode(HttpStatus.OK)
	@Post(':id/join/accept/:userId')
	acceptRequest(
		@Param('id', ParseObjectIdPipe) groupId: string,
		@Param('userId') userId: string,
		@Req() req: Request
	) {
		return this.groupsService.acceptRequest(groupId, userId, req['user'].id)
	}
}
