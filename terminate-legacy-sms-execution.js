exports.handler = async function(context, event, callback) {
    // get twilio client
    const client = context.getTwilioClient()

    // get SIDs from Studio widget
    const { channelSid, instanceSid, proxySessionSid } = event

    // get Proxy Service SID (KSxxxxx) from environment variable
    const proxyServiceSid = context.PROXY_SERVICE_SID

    // set up success response
    const response = new Twilio.Response()

    try {
        // deactivate chat channel
        await deactivateChatChannel(client, channelSid, instanceSid)
    
        // delete the associated proxy session
        await deleteProxySession(client, proxySessionSid, proxyServiceSid)
    } 
    catch(e) {
        console.error(e)
        response.setBody(JSON.stringify(e))
        response.setStatusCode(500)
    }

    return callback(null, response)
};

const deactivateChatChannel = async (client, channelSid, instanceSid) => {
    try {
        // get current channel
        let channel = await client.chat.v2.services(instanceSid)
            .channels(channelSid)
            .fetch();
        let newAttr = JSON.parse(channel.attributes)

        // set the "status" to INACTIVE
        newAttr.status = "INACTIVE";

        // update chat channel with new attributes
        await client.chat.v2.services(instanceSid)
            .channels(channel.sid)
            .update({ attributes: JSON.stringify(newAttr) })

        console.log(`chat channel ${channelSid} deactivated`)
    }
    catch(e) {
        console.error(`Chat channel ${channelSid} failed to update to INACTIVE`)
        throw new Error(JSON.stringify(e))
    }
}

const deleteProxySession = async (client, proxySessionSid, proxyServiceSid) => {
    try {
        await client.proxy.v1.services(proxyServiceSid)
            .sessions(proxySessionSid)
            .remove()

        console.log(`proxy session ${proxySessionSid} deleted`)
    }
    catch(e) {
        console.error(`Proxy ${proxySessionSid} failed to delete`)
        throw new Error(JSON.stringify(e))
    }
}
