# Twilio Serverless Function to Terminate a Legacy Studio/Flex SMS Interaction

This Twilio Serverless Function code will end a **legacy** Flex SMS interaction in Studio (Programmable Chat/Proxy). 

Two major actions are completed:
1. [Deactive the Chat Channel](https://www.twilio.com/docs/chat/rest/channel-resource#update-a-channel-resource) resource
2. [Delete the associated Proxy Session](https://www.twilio.com/docs/proxy/api/session#delete-a-session-resource) resource

## environment variables
| Variable | Resource |
| ---- | ---- | 
| PROXY_SERVICE_SID | `Flex Proxy Service` SID


## studio configuration
In the `Run Function` Widget from the Studio Flow, pass the following key/value pairs to the Serverless Function:

| Variable | Studio Reference |
| ----- | ---- |
| channelSid | {{trigger.message.ChannelSid}}
| instanceSid | {{trigger.message.InstanceSid}}
| proxySessionSid | {{trigger.message.ChannelAttributes.proxySession}}


## disclaimer
This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.

