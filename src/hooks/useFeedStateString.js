import { useMemo } from "react"

const useFeedStateString = (subplebbits) => {
    return useMemo(() => {
        const getClientHost = (clientUrl) => {
            try {
                clientUrl = new URL(clientUrl).hostname || clientUrl
            }
            catch (e) {}
            return clientUrl
        }
        const getClientUrls = (regex) => {
            const clientUrls = new Set()
            const addClientUrl = (client, clientUrl) => client?.state?.match?.(regex) && clientUrls.add(getClientHost(clientUrl))
            for (const subplebbit of subplebbits) {
                for (const clientUrl in subplebbit?.clients?.ipfsGateways) {
                    addClientUrl(subplebbit.clients.ipfsGateways[clientUrl], clientUrl)
                }
                for (const clientUrl in subplebbit?.clients?.ipfsClients) {
                    addClientUrl(subplebbit.clients.ipfsClients[clientUrl], clientUrl)
                }
                for (const chainTicker in subplebbit?.clients?.chainProviders) {
                    for (const clientUrl in subplebbit.clients.chainProviders[chainTicker]) {
                        addClientUrl(subplebbit.clients.chainProviders[chainTicker][clientUrl], clientUrl)
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