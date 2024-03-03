import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { Roles } from '../auth/roles-auth.decorator'
import { RolesAuthGuard } from '../auth/roles-auth.guard'

@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@Roles('Admin')
	@UseGuards(RolesAuthGuard)
	@Post()
	create(@Body() createNotificationDto: CreateNotificationDto) {
		return this.notificationsService.create(createNotificationDto)
	}

	@Get()
	findAll() {
		return this.notificationsService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.notificationsService.findOne(+id)
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateNotificationDto: UpdateNotificationDto
	) {
		return this.notificationsService.update(+id, updateNotificationDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.notificationsService.remove(+id)
	}
}
