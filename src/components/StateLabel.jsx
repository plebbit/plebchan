import React, { useEffect, useState } from "react";
import { useComment } from "@plebbit/plebbit-react-hooks";


const StateLabel = ({ commentCid, className }) => {
  const comment = useComment({commentCid});
  const [stateString, setStateString] = useState(null);

  useEffect(() => {
    if (comment.clients) {
      for (const ipfsGatewayUrl in comment.clients?.ipfsGateways) {
        const ipfsGateway = comment.clients?.ipfsGateways[ipfsGatewayUrl]
        if (ipfsGateway.state === 'fetching-ipfs') {
          setStateString(`Fetching IPFS from ${ipfsGatewayUrl}`)
        }
        if (ipfsGateway.state === 'fetching-ipns-update') {
          setStateString(`Fetching IPNS from ${ipfsGatewayUrl}`)
        }
        if (ipfsGateway.state === 'succeeded') {
          setStateString(`Fetched comment from ${ipfsGatewayUrl}`)
        }
      }
      
      for (const ipfsClientUrl in comment.clients?.ipfsClients) {
        const ipfsClient = comment.clients?.ipfsClients[ipfsClientUrl]
        if (ipfsClient.state === 'fetching-ipfs') {
          setStateString(`Fetching IPFS from ${ipfsClient.peers.length} peers`)
        }
        if (ipfsClient.state === 'fetching-ipns-update') {
          setStateString(`Fetching IPNS from ${ipfsClient.peers.length} peers`)
        }
        if (ipfsClient.state === 'succeeded') {
          setStateString(`Fetched comment from ${ipfsClient.peers.length} peers`)
        }
      }
    }
  }, [comment.clients])


  return (
    comment.state === "succeeded" ? null : (
    <span className={className}>
        <>
          <br />
          {stateString || comment.state}
        </>
    </span>
    )
  )
};

export default StateLabel;