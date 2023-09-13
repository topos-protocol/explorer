import { InfoCircleOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Alert as AntdAlert, Space, Typography } from 'antd'
import ForceGraph from 'force-graph'
import { useContext, useEffect, useMemo, useRef } from 'react'

import { SubnetWithId } from '../types'
import { SubnetsContext } from '../contexts/subnets'
import useSubnetSubscribeToCertificates from '../hooks/useSubnetSubscribeToCertificates'
import { SourceStreamPosition } from '../__generated__/graphql'
import { CrossSubnetMessagesGraphContext } from '../contexts/crossSubnetMessagesGraph'

const { Text } = Typography

const Alert = styled(AntdAlert)`
  display: inline-block;
`

type Link = {
  certificateId: string
  curvature?: number
  nodePairId?: string
  source: string
  target: string
  weight: number
}

const CrossSubnetMessagesGraph = function () {
  const { data: subnets } = useContext(SubnetsContext)
  const { subnetsLatestBlockNumbers } = useContext(
    CrossSubnetMessagesGraphContext
  )
  const { certificates } = useSubnetSubscribeToCertificates(
    subnets && subnetsLatestBlockNumbers
      ? {
          limit: 2,
          sourceSubnetIds: subnets?.reduce(
            (acc: Array<SourceStreamPosition> | undefined, subnet) => {
              const latestBlockNumber = subnetsLatestBlockNumbers.get(subnet.id)

              if (latestBlockNumber !== undefined && acc === undefined) {
                acc = []
              }

              if (latestBlockNumber !== undefined) {
                acc!.push({
                  position: latestBlockNumber,
                  sourceSubnetId: { value: subnet.id },
                })
              }

              return acc
            },
            undefined
          ),
        }
      : {}
  )
  const graphElement = useRef<HTMLDivElement>(null)

  const certificatesWithTarget = useMemo(
    () => certificates.filter((c) => c.targetSubnets.length),
    [certificates]
  )

  useEffect(
    function renderCertificates() {
      if (subnets) {
        let sameNodesLinks: Record<string, Link[]> = {}
        const curvatureMinMax = 0.5

        const data = {
          nodes: subnets.map((subnet) => {
            const img = new Image()
            img.src = subnet.logoURL
            return { ...subnet, img }
          }),
          links: (certificatesWithTarget || []).reduce((acc: Link[], curr) => {
            curr.targetSubnets.forEach((t) => {
              acc.push({
                source: curr.sourceSubnetId,
                target: t.value.toString(),
                certificateId: curr.id,
                weight: 1,
              })
            })

            return acc
          }, []),
        }

        // 1. assign each link a nodePairId that combines their source and target independent of the links direction
        // 2. group links together that share the same two nodes or are self-loops
        data.links?.forEach((link) => {
          link.nodePairId =
            link.source <= link.target
              ? link.source + '_' + link.target
              : link.target + '_' + link.source
          if (!sameNodesLinks[link.nodePairId]) {
            sameNodesLinks[link.nodePairId] = []
          }
          sameNodesLinks[link.nodePairId].push(link)
        })

        // Compute the curvature for links sharing the same two nodes to avoid overlaps
        Object.keys(sameNodesLinks)
          .filter((nodePairId) => sameNodesLinks[nodePairId].length > 1)
          .forEach((nodePairId) => {
            let links = sameNodesLinks[nodePairId]
            let lastIndex = links.length - 1
            let lastLink = links[lastIndex]
            lastLink.curvature = curvatureMinMax
            let delta = (2 * curvatureMinMax) / lastIndex
            for (let i = 0; i < lastIndex; i++) {
              links[i].curvature = -curvatureMinMax + i * delta

              if (lastLink.source !== links[i].source) {
                links[i].curvature! *= -1 // flip it around, otherwise they overlap
              }
            }
          })

        function drawNode(
          node: { x?: number; y?: number; img: typeof Image } & SubnetWithId,
          ctx: any
        ) {
          const size = 12

          ctx.drawImage(
            node.img,
            node.x! - size / 2,
            node.y! - size / 2,
            size,
            size
          )
        }

        const myGraph = ForceGraph()
        myGraph(graphElement.current!)
          .graphData(data)
          .nodeCanvasObject((node, ctx) => drawNode(node as any, ctx))
          .nodePointerAreaPaint((node, color, ctx) => {
            const size = 12
            ctx.fillStyle = color
            ctx.fillRect(node.x! - size / 2, node.y! - size / 2, size, size) // draw square as pointer trap
          })
          .linkCurvature('curvature')
          .linkDirectionalParticles('weight')
          .linkDirectionalArrowLength(3.5)
          .linkDirectionalArrowRelPos(0.5)
          .linkAutoColorBy(
            (link) => data.nodes.find((n) => n.id === link.source)?.id || null
          )
          .linkLabel('certificateId')
          .nodeLabel('name')
          .cooldownTicks(100)
          .height(600)
          .width(800)

        myGraph.onEngineStop(() => myGraph.zoomToFit(400, 200))
      }
    },
    [JSON.stringify(certificatesWithTarget), subnets]
  )
  return (
    <>
      <Alert
        message={
          <Space>
            <InfoCircleOutlined style={{ color: 'white' }} />
            <Text>
              Listening for certificates with cross-subnet messages from these
              positions: (
              {subnets?.map((subnet, index, array) => {
                const position = subnetsLatestBlockNumbers?.get(subnet.id)
                return (
                  <span key={subnet.id}>
                    {subnet.name}: {position}
                    {index !== array.length - 1 ? ', ' : ')'}
                  </span>
                )
              })}
            </Text>
          </Space>
        }
        type="info"
      />
      <div ref={graphElement} />
    </>
  )
}

export default CrossSubnetMessagesGraph
