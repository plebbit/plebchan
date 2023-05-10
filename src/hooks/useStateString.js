import { useMemo } from 'react'
import isValidUrl from '../utils/isValidUrl'

const useStateString = (clients) => {
  return useMemo(() => {
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
      const clientHosts = clientUrls.filter(isValidUrl).map(clientUrl => new URL(clientUrl).hostname)

      // if there are no valid hosts, skip this state
      if (clientHosts.length === 0) {
        continue
      }

      // separate 2 different states using ', '
      if (stateString) {
        stateString += ', '
      }

      // e.g. 'fetching IPFS from cloudflare-ipfs.com, ipfs.io'
      const formattedState = state.replaceAll('-', ' ').replace('ipfs', 'IPFS').replace('ipns', 'IPNS')
      stateString += `${formattedState} from ${clientHosts.join(', ')}`
    }

    // capitalize first letter
    if (stateString) {
      stateString = stateString.charAt(0).toUpperCase() + stateString.slice(1)
    }

    // if string is empty, return undefined instead
    return stateString === '' ? undefined : stateString
  }, [clients])
}

export default useStateString