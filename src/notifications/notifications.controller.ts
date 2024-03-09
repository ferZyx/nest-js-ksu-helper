import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { Roles } from '../auth/roles-auth.decorator'
import { RolesAuthGuard } from '../auth/roles-auth.guard'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Уведомления')
@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@ApiOperation({ summary: 'Создать уведомление. Доступно админам' })
	@Roles('Admin')
	@UseGuards(RolesAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post()
	create(@Body() createNotificationDto: CreateNotificationDto) {
		console.log(createNotificationDto)
		return this.notificationsService.create(createNotificationDto)
	}

	@ApiOperation({ summary: 'Получить все уведомления. Доступно админам' })
	@Roles('Admin')
	@UseGuards(RolesAuthGuard)
	@Get()
	findAll() {
		return this.notificationsService.findAll()
	}

	@ApiOperation({ summary: 'Получить уведомление по id. Доступно админам' })
	@Roles('Admin')
	@UseGuards(RolesAuthGuard)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.notificationsService.findOne(+id)
	}

	@ApiOperation({ summary: 'Обновить уведомление по id' })
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateNotificationDto: UpdateNotificationDto
	) {
		return this.notificationsService.update(+id, updateNotificationDto)
	}

	@ApiOperation({ summary: 'Удалить уведомление по id. Доступно админам' })
	@Roles('Admin')
	@UseGuards(RolesAuthGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.notificationsService.remove(+id)
	}
}
