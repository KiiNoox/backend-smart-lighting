#downlink  with security

import requests
import hashlib
import datetime
import logging

import sys
sensorCode = sys.argv[1]
OnOf=sys.argv[2]
#adress=sys.argv[3]
#print(sensorCode)
#print(OnOf)
#print(adress)
DevEUI = sensorCode
FPort = "45"


if(OnOf=="activated"):
    Payload ="03221E0409010000"
    print(Payload)
    print("on")
elif(OnOf=="desactivated"):
    Payload ="03221E0409000000"
    print(Payload)
    print("off")

AS_ID = "IEEE"

LRCASKey = "22222222222222222222222222222222"
# I.1 - Calculate Timestamp
CurrentTime = datetime.datetime.now()
print("CurrentTime:", CurrentTime)
TimeStampSHA = CurrentTime.strftime("%Y-%m-%dT%H:%M:%S.000") + "+01:00"
TimeStampURL = TimeStampSHA.replace(":", "%3A")
TimeStampURL = TimeStampURL.replace("+", "%2B")
print("Time Stamp SHA:", TimeStampSHA)
print("Time Stamp URL:", TimeStampURL)

# I.2 - Calculate Token <QueryParameters><ASKey>
QueryStringSHA = "DevEUI=" + DevEUI + "&FPort=" + FPort + "&Payload=" + Payload + "&AS_ID=" + AS_ID + "&Time=" + TimeStampSHA
SHA2String = QueryStringSHA + LRCASKey
SHA2Token = hashlib.sha256(SHA2String.encode("utf-8")).hexdigest()
print(QueryStringSHA)
print(SHA2String)
print("Token = ", SHA2Token)

# II - Send Downlink
QueryStringURL = "DevEUI=" + DevEUI + "&FPort=" + FPort + "&Payload=" + Payload + "&AS_ID=" + AS_ID + "&Time=" + TimeStampURL
SendDownlinkURL = TPWAPIURL + "/thingpark/lrc/rest/downlink?" + QueryStringURL + "&Token=" + SHA2Token
SendDownlinkHeaders = {'Content-Type': 'application/x-www-form-urlencoded'}
SendDownlinkPayload = ""
SendDownlinkResponse = requests.request("POST",
                                           SendDownlinkURL,
                                           headers=SendDownlinkHeaders,
                                           data=SendDownlinkURL
                                           )
print("#1 - Send Downlink")
print("URL:", SendDownlinkURL)
print("Headers:", SendDownlinkHeaders)
print("Payload:", SendDownlinkPayload)
print("Response:", SendDownlinkResponse)
print("Response Text:", SendDownlinkResponse.text)
print("Cookies:", SendDownlinkResponse.cookies)
