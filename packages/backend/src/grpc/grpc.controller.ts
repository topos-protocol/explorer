import { Controller, Get, Param, Query, Sse } from '@nestjs/common'
import { GRPCService } from './grpc.service'

@Controller('grpc')
export class GRPCController {
  constructor(private grpcService: GRPCService) {}

  @Get('latest/:subnetId')
  async getLatestCertificate(@Param('subnetId') subnetId: string) {
    console.log('called')
    return this.grpcService.getLatestCertificate(subnetId)
  }

  @Sse('watch')
  async watchCertificates(@Query('subnetIds') subnetIds: string[]) {
    return this.grpcService.watchCertificates(subnetIds)
  }
}
