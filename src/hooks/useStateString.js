import { useMemo } from 'react'

const useStateString = (commentOrSubplebbit) => {
  // dont show state string if the data is already fetched
  if (commentOrSubplebbit?.updatedAt || commentOrSubplebbit?.state === 'succeeded') {
    return
  }

  return useMemo(() => {
    if (!commentOrSubplebbit?.clients) {
      return
    }
    const clients = commentOrSubplebbit?.clients

    const states = {}
    const addState = (state, clientUrl) => {
      if (!state || state === 'stopped') {
        return
      }
      if (!states[state]) {
        states[state] = []
      }
      states[state].push(clientUrl)
    }
    for (const clientUrl in clients?.ipfsGateways) {
      addState(clients.ipfsGateways[clientUrl]?.state, clientUrl)
    }
    for (const clientUrl in clients?.ipfsClients) {
      addState(clients.ipfsClients[clientUrl]?.state, clientUrl)
    }
    for (const clientUrl in clients?.pubsubClients) {
      addState(clients.pubsubClients[clientUrl]?.state, clientUrl)
    }
    for (const chainTicker in clients?.chainProviders) {
      for (const clientUrl in clients.chainProviders[chainTicker]) {
        addState(clients.chainProviders[chainTicker][clientUrl]?.state, clientUrl)
      }
    }

    // find subplebbit pages states
    if (commentOrSubplebbit?.posts?.clients) {
      for (const clientType in commentOrSubplebbit.posts.clients) {
        for (const sortType in commentOrSubplebbit.posts.clients[clientType]) {
          for (const clientUrl in commentOrSubplebbit.posts.clients[clientType][sortType]) {
            let state = commentOrSubplebbit.posts.clients[clientType][sortType][clientUrl].state
            if (state === 'stopped') {
              continue
            }
            state += `-page-${sortType}`
            if (!states[state]) {
              states[state] = []
            }
            states[state].push(clientUrl)
          }
        }
      }
    }

    const getClientHost = (clientUrl) => {
      try {
        clientUrl = new URL(clientUrl).hostname || clientUrl
      }
      catch (e) {}
      return clientUrl
    }

    let stateString = ''
    for (const state in states) {
      const clientUrls = states[state]
      const clientHosts = clientUrls.map(clientUrl => getClientHost(clientUrl))

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

    // fallback to comment or subplebbit state when possible
    if (!stateString) {
      if (commentOrSubplebbit?.publishingState !== 'stopped') {
        stateString = commentOrSubplebbit.publishingState
      }
      else if (commentOrSubplebbit?.updatingState !== 'stopped') {
        stateString = commentOrSubplebbit.updatingState
      }
      if (stateString) {
        stateString = stateString.replaceAll('-', ' ').replace('ipfs', 'IPFS').replace('ipns', 'IPNS')
      }
    }

    // capitalize first letter
    if (stateString) {
      stateString = stateString.charAt(0).toUpperCase() + stateString.slice(1)
    }

    // if string is empty, return undefined instead
    return stateString === '' ? undefined : stateString
  }, [commentOrSubplebbit])
}

export default useStateString