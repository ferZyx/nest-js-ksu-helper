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
	UseInterceptors
} from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { Roles } from '../auth/roles-auth.decorator'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { NotificationEntity } from './entities/notification.entity'
import { NotificationDocument } from '../schemas/notification.schema'
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe'

@ApiTags('Уведомления')
@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@ApiOperation({ summary: 'Создать уведомление. Доступно админам' })
	@Roles('Admin')
	@UseInterceptors(ClassSerializerInterceptor)
	@Post()
	async create(
		@Body() createNotificationDto: CreateNotificationDto
	): Promise<NotificationEntity> {
		const notification: NotificationDocument =
			await this.notificationsService.create(createNotificationDto)
		return new NotificationEntity(notification.toObject())
	}

	@ApiOperation({ summary: 'Получить все уведомления. Доступно админам' })
	@Roles('Admin')
	@UseInterceptors(ClassSerializerInterceptor)
	@Get()
	async findAll(): Promise<NotificationEntity[]> {
		const notifications = await this.notificationsService.findAll()
		return notifications.map(
			(notification) => new NotificationEntity(notification.toObject())
		)
	}

	@ApiOperation({ summary: 'Получить уведомление по id. Доступно админам' })
	@UseInterceptors(ClassSerializerInterceptor)
	@Roles('Admin')
	@Get(':id')
	async findOne(
		@Param('id', ParseObjectIdPipe) id: string
	): Promise<NotificationEntity> {
		const notification: NotificationDocument =
			await this.notificationsService.findOne(id)
		return new NotificationEntity(notification.toObject())
	}

	@ApiOperation({ summary: 'Обновить уведомление по id' })
	@Patch(':id')
	update(
		@Param('id', ParseObjectIdPipe) id: string,
		@Body() updateNotificationDto: UpdateNotificationDto
	) {
		return this.notificationsService.update(id, updateNotificationDto)
	}

	@ApiOperation({ summary: 'Удалить уведомление по id. Доступно админам' })
	@Roles('Admin')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'Успешно удалено'
	})
	@Delete(':id')
	remove(@Param('id', ParseObjectIdPipe) id: string) {
		return this.notificationsService.remove(id)
	}
}
