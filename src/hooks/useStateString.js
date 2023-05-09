import { useMemo } from 'react'

const useStateString = (clients) => {
  const stateString = useMemo(() => {
    if (!clients) {
      return
    }
    const states = {}
    for (const clientType in clients) {
      for (const clientUrl in clients[clientType]) {
        const state = clients[clientType][clientUrl].state
        if (state === 'stopped') {
          continue
        }
        if (!states[state]) {
          states[state] = []
        }
        states[state].push(clientUrl)
      }
    }

    let stateString = ''
    for (const state in states) {
      const clientUrls = states[state]
      const clientHosts = clientUrls.map(clientUrl => new URL(clientUrl).hostname)

      // separate 2 different states using ', '
      if (stateString) {
        stateString += ', '
      }

      // e.g. 'fetching IPFS from cloudflare-ipfs.com, ipfs.io'
      const formattedState = state.replaceAll('-', ' ').replace('ipfs', 'IPFS').replace('ipns', 'IPNS')
      stateString += `${formattedState} from ${clientHosts.join(', ')}`
    }

    // capitalize first letter
    stateString = stateString.charAt(0).toUpperCase() + stateString.slice(1)

    // if string is empty, return undefined instead
    return stateString || undefined
  }, [clients])

  return stateString
}

export default useStateString