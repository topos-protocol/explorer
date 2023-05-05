import * as grpc from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SubnetId } from '@topos-network/topos-grpc-client-stub/generated/topos/shared/v1/subnet_pb'
import {
  GetSourceHeadRequest,
  WatchCertificatesRequest,
} from '@topos-network/topos-grpc-client-stub/generated/topos/tce/v1/api_pb'
import { APIServiceClient } from '@topos-network/topos-grpc-client-stub/generated/topos/tce/v1/api_grpc_pb'
import { Observable } from 'rxjs'
import { UUID } from '@topos-network/topos-grpc-client-stub/generated/topos/shared/v1/uuid_pb'
import { Checkpoints } from '@topos-network/topos-grpc-client-stub/generated/topos/shared/v1/checkpoints_pb'
import { WatchCertificatesResponse } from '@topos-network/topos-grpc-client-stub/generated/topos/tce/v1/api_pb'

@Injectable()
export class GRPCService {
  _client: APIServiceClient

  constructor(private configService: ConfigService) {
    this._client = new APIServiceClient(
      `${this.configService.getOrThrow(
        `TOPOS_GRPC_SERVER_HOST`
      )}:${this.configService.getOrThrow(`TOPOS_GRPC_SERVER_PORT`)}`,
      grpc.credentials.createInsecure()
    )
  }

  getLatestCertificate(subnetId: string) {
    return new Promise((resolve, reject) => {
      try {
        const _subnetId = new SubnetId()
        _subnetId.setValue(Buffer.from(subnetId, 'hex'))

        const request = new GetSourceHeadRequest()

        request.setSubnetId(_subnetId)

        this._client.getSourceHead(request, (error, response) => {
          if (error) {
            console.error('error', error)
            reject(error)
          }

          const certificate = response.getCertificate().toObject()
          const position = response.getPosition().toObject()
          resolve({ ...certificate, position: position.position })
        })
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }

  watchCertificates(subnetIds: string[]) {
    return new Observable((subscriber) => {
      try {
        const _subnetIds = subnetIds.map((subnetId) => {
          const _subnetId = new SubnetId()
          _subnetId.setValue(Buffer.from(subnetId, 'hex'))
          return _subnetId
        })

        const request = new WatchCertificatesRequest()

        const uuid = new UUID()
        request.setRequestId(uuid)

        const targetCheckpoint = new Checkpoints.TargetCheckpoint()
        targetCheckpoint.setTargetSubnetIdsList(_subnetIds)

        const openStream = new WatchCertificatesRequest.OpenStream()
        openStream.setTargetCheckpoint(targetCheckpoint)

        request.setOpenStream(openStream)

        const stream = this._client.watchCertificates()

        stream.on('data', (data: WatchCertificatesResponse) => {
          const _data = data.toObject()

          this._decodeBase64FieldInPlace(
            _data.certificatePushed?.certificate?.sourceSubnetId
          )
          this._decodeBase64FieldInPlace(
            _data.certificatePushed?.certificate?.id
          )
          this._decodeBase64FieldInPlace(
            _data.certificatePushed?.certificate?.prevId
          )

          _data.certificatePushed?.certificate?.targetSubnetsList.forEach(
            (targetSubnetId) => {
              this._decodeBase64FieldInPlace(targetSubnetId)
            }
          )

          subscriber.next({ data: _data })
        })

        stream.on('end', () => {
          console.log('end')
          subscriber.complete()
        })

        stream.on('error', (error) => {
          console.log(error)
          subscriber.error(error)
        })

        stream.write(request)
      } catch (error) {
        console.error(error)
        subscriber.error(error)
      }
    })
  }

  private _decodeBase64FieldInPlace(field: { value: Uint8Array | string }) {
    if (field?.value && typeof field.value === 'string') {
      field.value = `0x${Buffer.from(field.value, 'base64').toString('hex')}`
    }
  }
}
