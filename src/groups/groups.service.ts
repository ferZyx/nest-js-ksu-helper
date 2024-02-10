import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Group, GroupDocument, GroupTypeEnum } from '../schemas/group.schema'
import mongoose, { Model } from 'mongoose'
import { UserDocument } from '../schemas/user.schema'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class GroupsService {
	constructor(
		@InjectModel(Group.name) private groupModel: Model<GroupDocument>,
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService
	) { }

	async create(
		createGroupDto: CreateGroupDto,
		req: Request
	): Promise<GroupDocument> {
		if (GroupTypeEnum[createGroupDto.type] === undefined) {
			throw new HttpException('Invalid group type', HttpStatus.BAD_REQUEST)
		}
		const userGroups = await this.getGroupsForUser(req['user'].id)
		if (userGroups.length) {
			throw new HttpException(
				'User already has a group',
				HttpStatus.BAD_REQUEST
			)
		}
		const user = req['user']
		createGroupDto.owner = user.id
		createGroupDto.members = [user.id]
		createGroupDto.admins = [user.id]
		createGroupDto.joinRequests = []

		return await this.groupModel.create(createGroupDto)
	}

	async getGroupsForUser(userId: string): Promise<GroupDocument[]> {
		return await this.groupModel.find({ members: userId }).exec()
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

	async remove(id: string, userId: string) {
		const group: GroupDocument = await this.groupModel.findById(id).exec()
		if (!group) {
			throw new HttpException('Group not found', HttpStatus.NOT_FOUND)
		}
		if (String(group.owner['_id']) !== userId) {
			throw new HttpException(
				'User is not the owner of the group',
				HttpStatus.FORBIDDEN
			)
		}
		return this.groupModel.findByIdAndDelete(id).exec()
	}

	async joinGroup(groupId: string, userId: string) {
		const group: GroupDocument = await this.findOne(groupId)
		if (group.type === GroupTypeEnum.private.toString()) {
			throw new HttpException('Group is private', HttpStatus.FORBIDDEN)
		}
		if (
			group.members.some(
				(member: UserDocument) => String(member._id) === userId
			)
		) {
			throw new HttpException(
				'User is already in the group',
				HttpStatus.BAD_REQUEST
			)
		}
		// const user: UserDocument = await this.userService.findUserById(userId)
		if (group.type === GroupTypeEnum.requests.toString()) {
			// group.joinRequests.push(user)
			await group.save()
			return {
				success: true,
				message:
					'Заявка на вступление успешно создана. Чи отправлена. Как лучше брат? или в жопу вообще тексты. Ты же тексты все на фронте хранишь да? Тогда логичнее просто какое то ключевое слово использовать для твоего этоого самого. ЧТобы он сам текст по этмоу ключу вытасиквал, ес?'
			}
		}
	}
}
