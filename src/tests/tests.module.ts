import { Module } from '@nestjs/common'
import { TestsService } from './tests.service'
import { TestsController } from './tests.controller'
import { HttpModule } from '@nestjs/axios'

@Module({
	imports: [HttpModule],
	controllers: [TestsController],
	providers: [TestsService]
})
export class TestsModule {}
