import { forwardRef, Module } from '@nestjs/common'
import { GroupsService } from './groups.service'
import { GroupsController } from './groups.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Group, GroupSchema } from '../schemas/group.schema'
import { UsersModule } from 'src/users/users.module'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
		forwardRef(() => UsersModule),
		forwardRef(() => NotificationsModule)
	],
	controllers: [GroupsController],
	providers: [GroupsService],
	exports: [GroupsService]
})
export class GroupsModule {}
