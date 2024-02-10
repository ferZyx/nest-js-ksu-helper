import { Module, forwardRef } from '@nestjs/common'
import { GroupsService } from './groups.service'
import { GroupsController } from './groups.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Group, GroupSchema } from '../schemas/group.schema'
import { UsersModule } from 'src/users/users.module'


@Module({
	imports: [
		MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
		forwardRef(() => UsersModule)
	],
	controllers: [GroupsController],
	providers: [GroupsService],
	exports: [GroupsService]
})
export class GroupsModule { }
