import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Group, GroupDocument, GroupTypeEnum } from '../schemas/groups.schema'
import { Model } from 'mongoose'

@Injectable()
export class GroupsService {
	constructor(
		@InjectModel(Group.name) private groupModel: Model<GroupDocument>
	) {}

	async create(createGroupDto: CreateGroupDto, req: Request): Promise<Group> {
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
		return this.groupModel.create(createGroupDto)
	}

	async getGroupsForUser(userId: string): Promise<Group[]> {
		return await this.groupModel.find({ members: userId }).exec()
	}

	findAll() {
		return `This action returns all groups`
	}

	findOne(id: number) {
		return `This action returns a #${id} group`
	}

	update(id: number, updateGroupDto: UpdateGroupDto) {
		return `This action updates a #${id} group`
	}

	async remove(id: string, userId: string) {
		const group = await this.groupModel.findById(id).exec()
		if (!group) {
			throw new HttpException('Group not found', HttpStatus.NOT_FOUND)
		}
		if (group.owner.toString() !== userId) {
			throw new HttpException(
				'User is not the owner of the group',
				HttpStatus.FORBIDDEN
			)
		}
		return this.groupModel.findByIdAndDelete(id).exec()
	}
}
