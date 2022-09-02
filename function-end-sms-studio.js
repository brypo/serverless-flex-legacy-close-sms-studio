exports.handler = async function(context, event, callback) {

    // get twilio client
    const client = context.getTwilioClient();

    // get SIDs from Studio widget
    const { channelSid, instanceSid, proxySessionSid } = event;
    console.log(event);

    // get Proxy Service SID (KSxxxxx) from environment variable
    const proxyServiceSid = context.PROXY_SERVICE_SID;

    // set up success response
    const response = new Twilio.Response();
    response.setStatusCode(200);

    // deactivate chat channel
    try {
        // get current channel
        let channel = await client.chat.v2.services(instanceSid)
            .channels(channelSid)
            .fetch();
        let newAttr = JSON.parse(channel.attributes);

        // set the "status" to INACTIVE
        newAttr.status = "INACTIVE";

        // update chat channel with new attributes
        await client.chat.v2.services(instanceSid)
            .channels(channel.sid)
            .update({ attributes: JSON.stringify(newAttr) });

        console.log(`chat channel ${channelSid} deactivated`);
    }
    catch(e) {
        console.log(`Chat channel ${channelSid} failed to update to INACTIVE`);
        console.error(e);
        response.setStatusCode(500);
        return callback(null, response);
    }

    // delete the associated proxy session
    try {
        await client.proxy.v1.services(proxyServiceSid)
            .sessions(proxySessionSid)
            .remove();

        console.log(`proxy session ${proxySessionSid} deleted`);

        return callback(null, response);
    }
    catch(e) {
        console.log(`Proxy ${proxySessionSid} failed to delete`);
        console.error(e);
        response.setStatusCode(500);
        return callback(null, response);
    }
};
