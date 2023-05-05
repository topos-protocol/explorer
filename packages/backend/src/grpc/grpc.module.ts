import { Module } from '@nestjs/common'

import { GRPCController } from './grpc.controller'
import { GRPCService } from './grpc.service'

@Module({
  controllers: [GRPCController],
  providers: [GRPCService],
})
export class GRPCModule {}
