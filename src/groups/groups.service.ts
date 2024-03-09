import {
	forwardRef,
	HttpException,
	HttpStatus,
	Inject,
	Injectable
} from '@nestjs/common'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { InjectModel } from '@nestjs/mongoose'
import {
	Group,
	GroupDocument,
	GroupRolesEnum,
	GroupTypeEnum
} from '../schemas/group.schema'
import mongoose, { Model } from 'mongoose'
import { UsersService } from 'src/users/users.service'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class GroupsService {
	constructor(
		@InjectModel(Group.name) private groupModel: Model<GroupDocument>,
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		private readonly notificationsService: NotificationsService
	) {}

	async create(createGroupDto: CreateGroupDto, req: Request) {
		if (GroupTypeEnum[createGroupDto.type] === undefined) {
			throw new HttpException('Invalid group type', HttpStatus.BAD_REQUEST)
		}
		const user = req['user']
		if (user.group) {
			throw new HttpException(
				'User already has a group',
				HttpStatus.BAD_REQUEST
			)
		}
		const createdGroup = await this.groupModel.create(createGroupDto)
		const userDocument = await this.usersService.findUserById(user.id)
		userDocument.group = createdGroup
		userDocument.groupRole = GroupRolesEnum.owner
		await userDocument.save()

		return createdGroup
	}

	async findAll(): Promise<GroupDocument[]> {
		return this.groupModel.find().exec()
	}

	async findOne(id: string) {
		const isIdValid = mongoose.Types.ObjectId.isValid(id)
		if (!isIdValid) {
			throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST)
		}
		const group = await this.groupModel.findById(id).exec()
		if (!group) {
			throw new HttpException('Group not found', HttpStatus.NOT_FOUND)
		}
		return group
	}

	update(id: number, updateGroupDto: UpdateGroupDto) {
		return `This action updates a #${id} group`
	}

	// async remove(id: string, userId: string) {
	// 	const group: GroupDocument = await this.groupModel.findById(id).exec()
	// 	if (!group) {
	// 		throw new HttpException('Group not found', HttpStatus.NOT_FOUND)
	// 	}
	// 	if (String(group.owner['_id']) !== userId) {
	// 		throw new HttpException(
	// 			'User is not the owner of the group',
	// 			HttpStatus.FORBIDDEN
	// 		)
	// 	}
	// 	return this.groupModel.findByIdAndDelete(id).exec()
	// }

	// async joinGroup(groupId: string, userId: string) {
	// 	const group: GroupDocument = await this.groupModel.findById(groupId)
	// 	if (!group) {
	// 		throw new HttpException('Group not found', HttpStatus.NOT_FOUND)
	// 	}
	// 	if (
	// 		group.members.some(
	// 			(member: UserDocument) => String(member._id) === userId
	// 		)
	// 	) {
	// 		throw new HttpException(
	// 			'User is already in the group',
	// 			HttpStatus.BAD_REQUEST
	// 		)
	// 	}
	// 	if (GroupTypeEnum[group.type] === GroupTypeEnum.private) {
	// 		throw new HttpException('Group is private', HttpStatus.FORBIDDEN)
	// 	}
	//
	// 	const user: UserDocument = await this.usersService.findUserById(userId)
	// 	if (GroupTypeEnum[group.type] === GroupTypeEnum.requests) {
	// 		group.joinRequests.push(user)
	// 		await group.save()
	// 		return {
	// 			success: true,
	// 			message:
	// 				'Заявка на вступление успешно создана. Или отправлена?. Как лучше брат? или в жопу вообще тексты. Ты же тексты все на фронте хранишь да? Тогда логичнее просто какое то ключевое слово использовать для твоего этоого самого. ЧТобы он сам текст по этмоу ключу вытасиквал, ес?'
	// 		}
	// 	}
	// 	if (GroupTypeEnum[group.type] === GroupTypeEnum.public) {
	// 		group.members.push(user)
	// 		await group.save()
	// 		return {
	// 			success: true,
	// 			message: 'Вы вступили в группу'
	// 		}
	// 	}
	// 	return {
	// 		success: false,
	// 		message: 'Что-то пошло не так'
	// 	}
	// }

	// async acceptRequest(groupId: string, userId: string, adminId: string) {
	// 	const group: GroupDocument = await this.groupModel.findById(groupId)
	// 	if (!group) {
	// 		throw new HttpException('Group not found', HttpStatus.NOT_FOUND)
	// 	}
	// 	if (
	// 		!group.admins.some((admin: UserDocument) => String(admin._id) === adminId)
	// 	) {
	// 		throw new HttpException(
	// 			'You are not an admin of the group',
	// 			HttpStatus.FORBIDDEN
	// 		)
	// 	}
	// 	const user: UserDocument = await this.usersService.findUserById(userId)
	// 	if (!user) {
	// 		throw new HttpException('User not found', HttpStatus.NOT_FOUND)
	// 	}
	// 	if (
	// 		!group.joinRequests.some(
	// 			(request: UserDocument) => String(request._id) === userId
	// 		)
	// 	) {
	// 		throw new HttpException('Request not found', HttpStatus.NOT_FOUND)
	// 	}
	// 	// мб тут проблема будет
	// 	group.joinRequests = group.joinRequests.filter(
	// 		(request: UserDocument) => String(request.id) !== userId
	// 	)
	// 	group.members.push(user)
	// 	await group.save()
	//
	// 	await this.notificationsService.createRequestAcceptedNotification(
	// 		user.id,
	// 		group.id
	// 	)
	//
	// 	return {
	// 		success: true,
	// 		message: 'Пользователь принят в группу'
	// 	}
	// }
}
