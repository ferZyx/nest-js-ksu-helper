import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post
} from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { Roles } from '../auth/roles-auth.decorator'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import { NotificationEntity } from './entities/notification.entity'
import { NotificationDocument } from '../schemas/notification.schema'
import { ParseObjectIdPipe } from '../utils/pipes/parse-object-id.pipe'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { UseMongooseInterceptor } from '../utils/interceptros/mongoose-class-serializer.interceptor'

@ApiTags('Уведомления')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@ApiOperation({ summary: 'Создать уведомление. Доступно админам' })
	@Roles('Admin')
	@UseMongooseInterceptor(NotificationEntity)
	@Post()
	async create(
		@Body() createNotificationDto: CreateNotificationDto
	): Promise<NotificationDocument> {
		return this.notificationsService.create(createNotificationDto)
	}

	@ApiOperation({ summary: 'Получить все уведомления. Доступно админам' })
	@Roles('Admin')
	@UseMongooseInterceptor(NotificationEntity)
	@Get()
	async findAll(): Promise<NotificationDocument[]> {
		return await this.notificationsService.findAll()
	}
	@ApiOperation({ summary: 'Получить уведомление по id. Доступно админам' })
	@UseMongooseInterceptor(NotificationEntity)
	@Roles('Admin')
	@Get(':id')
	async findOne(@Param('id', ParseObjectIdPipe) id: string) {
		return this.notificationsService.findOne(id)
	}

	@ApiOperation({ summary: 'Обновить уведомление по id' })
	@UseMongooseInterceptor(NotificationEntity)
	@Patch(':id')
	update(
		@Param('id', ParseObjectIdPipe) id: string,
		@Body() updateNotificationDto: UpdateNotificationDto
	): Promise<NotificationDocument> {
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
	remove(
		@Param('id', ParseObjectIdPipe) id: string
	): Promise<NotificationDocument> {
		return this.notificationsService.remove(id)
	}
}
