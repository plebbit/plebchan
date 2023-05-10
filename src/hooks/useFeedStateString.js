import { useMemo } from "react"

const useFeedStateString = (subplebbits) => {
  return useMemo(() => {
    const getClientUrls = (regex) => {
      const clientUrls = new Set()
      for (const clientType in subplebbits.clients) {
        for (const clientUrl in subplebbits.clients[clientType]) {
          const client = subplebbits.clients[clientType][clientUrl]
          if (client.state.match(regex)) {
            clientUrls.add(clientUrl)
          }
        }
      }
      return [...clientUrls]
    }

    if (!subplebbits) {
      return undefined;
    }
    
    const states = {}
    for (const subplebbit of subplebbits) {
      states[subplebbit?.updatingState] = (states[subplebbit?.updatingState] || 0) + 1
    }

    // e.g. Resolving 2 addresses from infura.io, fetching 2 IPNS, 1 IPFS from cloudflare-ipfs.com, ipfs.io
    let stateString = ''
    if (states['resolving-address']) {
      stateString += `resolving ${states['resolving-address']} addresses`
      const clientUrls = getClientUrls(/address/)
      if (clientUrls.length) {
        stateString += ` from ${clientUrls.join(', ')}`
      }
    }
    if (states['fetching-ipns'] || states['fetching-ipfs']) {
      if (stateString) {
        stateString += ', '
      }
      stateString += `fetching `
      if (states['fetching-ipns']) {
        stateString += `${states['fetching-ipns']} IPNS`
      }
      if (states['fetching-ipfs']) {
        if (states['fetching-ipns']) {
          stateString += ', '
        }
        stateString += `${states['fetching-ipfs']} IPNS`
      }
      const clientUrls = getClientUrls(/ipfs|ipns/)
      if (clientUrls.length) {
        stateString += ` from ${clientUrls.join(', ')}`
      }
    }

    // capitalize first letter
    stateString = stateString.charAt(0).toUpperCase() + stateString.slice(1)

    // if string is empty, return undefined instead
    return stateString || undefined
  }, [subplebbits])
}

export default useFeedStateString