import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Req,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { GroupsService } from './groups.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'

@Controller('groups')
export class GroupsController {
	constructor(private readonly groupsService: GroupsService) {}

	@UsePipes(new ValidationPipe())
	@Post()
	create(@Body() createGroupDto: CreateGroupDto, @Req() req: Request) {
		return this.groupsService.create(createGroupDto, req)
	}

	@Get()
	findAll() {
		return this.groupsService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.groupsService.findOne(+id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
		return this.groupsService.update(+id, updateGroupDto)
	}

	@HttpCode(204)
	@Delete(':id')
	remove(@Param('id') id: string, @Req() req: Request) {
		return this.groupsService.remove(id, req['user'].id)
	}
}
