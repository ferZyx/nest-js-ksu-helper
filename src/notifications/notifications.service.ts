import { Injectable } from '@nestjs/common'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
	Notification,
	NotificationDocument
} from '../schemas/notification.schema'

@Injectable()
export class NotificationsService {
	constructor(
		@InjectModel(Notification.name)
		private readonly notificationModel: Model<NotificationDocument>
	) {}

	create(createNotificationDto: CreateNotificationDto) {
		return this.notificationModel.create(createNotificationDto)
	}

	createRequestAcceptedNotification( userId: string, groupId: string): Promise<NotificationDocument> {
		return this.notificationModel.create({
			title: "Request Accepted",
			message: `Your request to join group ${groupId} has been accepted`,
			user: userId
		})
	}

	findAll() {
		return this.notificationModel.find().exec()
	}

	findOne(id: number) {
		return `This action returns a #${id} notification`
	}

	update(id: number, updateNotificationDto: UpdateNotificationDto) {
		return `This action updates a #${id} notification`
	}

	remove(id: number) {
		return this.notificationModel.findByIdAndDelete(id).exec()
	}

	findByUserId(userId: string): Promise<NotificationDocument[]> {
		return this.notificationModel.find({ user: userId }).exec()
	}
}
