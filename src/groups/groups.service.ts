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
import { Model } from 'mongoose'
import { UsersService } from 'src/users/users.service'
import { NotificationsService } from '../notifications/notifications.service'
import { UserDocument } from '../schemas/user.schema'

@Injectable()
export class GroupsService {
	constructor(
		@InjectModel(Group.name) private groupModel: Model<GroupDocument>,
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		private readonly notificationsService: NotificationsService
	) {}

	async create(
		createGroupDto: CreateGroupDto,
		userId: string
	): Promise<GroupDocument> {
		if (!(createGroupDto.type in GroupTypeEnum)) {
			throw new HttpException('Invalid group type', HttpStatus.BAD_REQUEST)
		}

		const user: UserDocument = await this.usersService.findUserById(userId)
		if (user.group) {
			throw new HttpException(
				'User already has a group',
				HttpStatus.BAD_REQUEST
			)
		}

		const createdGroup: GroupDocument =
			await this.groupModel.create(createGroupDto)

		user.group = createdGroup._id
		user.groupRole = GroupRolesEnum.owner
		await user.save()

		return createdGroup
	}

	async findAll(): Promise<Group[]> {
		const groups: GroupDocument[] = await this.groupModel
			.find()
			.populate({ path: 'members', select: ['email', '-group', 'groupRole'] })
			.populate({
				path: 'joinRequests',
				select: ['email', '-group', 'groupRole']
			})
			.exec()
		return groups
	}

	async findOne(id: string): Promise<GroupDocument> {
		const group: GroupDocument = await this.groupModel
			.findById(id)
			.populate({ path: 'members', select: ['email', '-group', 'groupRole'] })
			.populate({
				path: 'joinRequests',
				select: ['email', '-group', 'groupRole']
			})
			.exec()
		if (!group) {
			throw new HttpException('Group not found', HttpStatus.NOT_FOUND)
		}
		return group
	}

	update(id: number, updateGroupDto: UpdateGroupDto) {
		return `This action updates a #${id} group`
	}

	async remove(groupId: string, userId: string) {
		const group: GroupDocument = await this.groupModel
			.findById(groupId)
			.populate('members')
		if (!group) {
			throw new HttpException('Group not found', HttpStatus.NOT_FOUND)
		}
		if (group.members.length > 1) {
			throw new HttpException(
				'Group has members. Remove them first',
				HttpStatus.BAD_REQUEST
			)
		}
		const user: UserDocument = await this.usersService.findUserById(userId)
		if (
			user.group.toString() !== groupId ||
			user.groupRole !== GroupRolesEnum.owner
		) {
			throw new HttpException(
				'User is not the owner of the group',
				HttpStatus.FORBIDDEN
			)
		}
		user.group = null
		user.groupRole = null
		await user.save()
		return this.groupModel.findByIdAndDelete(groupId).exec()
	}

	async joinGroup(groupId: string, userId: string) {
		const group: GroupDocument = await this.groupModel
			.findById(groupId)
			.populate('members')
		if (!group) {
			throw new HttpException('Group not found', HttpStatus.NOT_FOUND)
		}

		if (GroupTypeEnum[group.type] === GroupTypeEnum.private) {
			throw new HttpException('Group is private', HttpStatus.FORBIDDEN)
		}

		const user: UserDocument = await this.usersService.findUserById(userId)
		if (user.group) {
			throw new HttpException(
				'User already has a group',
				HttpStatus.BAD_REQUEST
			)
		}
		if (GroupTypeEnum[group.type] === GroupTypeEnum.requests) {
			group.joinRequests.push(user)
			await group.save()
			return {
				success: true,
				message:
					'Заявка на вступление успешно создана. Или отправлена?. Как лучше брат? или в жопу вообще тексты. Ты же тексты все на фронте хранишь да? Тогда логичнее просто какое то ключевое слово использовать для твоего этоого самого. ЧТобы он сам текст по этмоу ключу вытасиквал, ес?'
			}
		}
		if (GroupTypeEnum[group.type] === GroupTypeEnum.public) {
			user.group = group._id
			user.groupRole = GroupRolesEnum.member
			await user.save()

			return {
				success: true,
				message: 'Вы вступили в группу'
			}
		}
		return {
			success: false,
			message: 'Что-то пошло не так'
		}
	}

	async acceptRequest(groupId: string, candidateId: string, adminId: string) {
		const group: GroupDocument = await this.groupModel.findById(groupId)
		if (!group) {
			throw new HttpException('Group not found', HttpStatus.NOT_FOUND)
		}
		const admin: UserDocument = await this.usersService.findUserById(adminId)
		if (
			admin.group.toString() !== groupId.toString() ||
			(admin.groupRole !== GroupRolesEnum.owner &&
				admin.groupRole !== GroupRolesEnum.admin)
		) {
			throw new HttpException(
				'You are not the owner or admin of the group',
				HttpStatus.FORBIDDEN
			)
		}
		const candidate: UserDocument =
			await this.usersService.findUserById(candidateId)
		if (!candidate) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		}
		if (candidate.group) {
			group.joinRequests = group.joinRequests.filter(
				(request: UserDocument) => String(request.id) !== candidateId
			)
			await group.save()
			return {
				success: false,
				message: 'User already has a group'
			}
		}
		if (
			!group.joinRequests.some(
				(request: UserDocument) => String(request._id) === candidateId
			)
		) {
			throw new HttpException('Request not found', HttpStatus.NOT_FOUND)
		}
		// мб тут проблема будет
		group.joinRequests = group.joinRequests.filter(
			(request: UserDocument) => String(request.id) !== candidateId
		)
		group.members.push(candidate)
		await group.save()

		// await this.notificationsService.createRequestAcceptedNotification(
		// 	candidate.id,
		// 	group.id
		// )

		return {
			success: true,
			message: 'Пользователь принят в группу'
		}
	}
}
