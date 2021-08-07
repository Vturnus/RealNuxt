import {getHeaders} from "../../helpers";
import {getError, unWrap} from "../../../utils/fetchUtils";
import fetch from 'node-fetch'

export default (algoliaConfig) => {
    const headers = getHeaders(algoliaConfig)
    return {
        removeHome: async function(identity, homeId){
            const payload = (await this.getById(identity)).json
            payload.homeId = payload.homeId.filter(id => id !== homeId)
           await this.create(identity, payload)
        },
        assignHome: async function(identity, homeId){
            const payload = (await this.getById(identity)).json
            payload.homeId.push(homeId)
           await this.create(identity, payload)
        },
        bookHome: async (identityId, homeId, start, end) => {
            try {
                return unWrap(await fetch(`https://${algoliaConfig.appId}-dsn.algolia.net/1/indexes/bookings/`, {
                    headers,
                    method: 'POST',
                    body: JSON.stringify({
                        identityId,
                        homeId,
                        start,
                        end
                    })
                }))
            }
            catch (error){
                return getError(error)
            }
        },
         create: async (identity, payload) => {
             try {
                 return unWrap(await fetch(`https://${algoliaConfig.appId}-dsn.algolia.net/1/indexes/users/${identity.id}`, {
                     headers,
                     method: 'PUT',
                     body: JSON.stringify(payload)
                 }))
             }
             catch (error){
                 return getError(error)
             }
         },

         getById: async (identity) => {
             try {
                 return unWrap(await fetch(`https://${algoliaConfig.appId}-dsn.algolia.net/1/indexes/users/${identity.id}`, {
                     headers,
                 }))
             }
             catch (error){
                 return getError(error)
             }
         }


    }
}