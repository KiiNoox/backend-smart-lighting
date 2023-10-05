#downlink  with security

import requests
import hashlib
import datetime
import logging

import sys
sensorCode = sys.argv[1]
OnOf=sys.argv[2]

DevEUI = sensorCode
FPort = "45"

print(OnOf)
if(OnOf=="100"):
    Payload ="03221E040A640000"
    print(Payload)
    print("on")
elif(OnOf=="90"):
    Payload ="03221E040A5A0000"
    print(Payload)
    print("on")
elif(OnOf=="80"):
    Payload ="03221E040A500000"
    print(Payload)
    print("on")
elif(OnOf=="70"):
    Payload ="03221E040A460000"
    print(Payload)
    print("on")
elif(OnOf=="60"):
    Payload ="03221E040A3C0000"
    print(Payload)
    print("on")
elif(OnOf=="50"):
    Payload ="03221E040A320000"
    print(Payload)
    print("off")
elif(OnOf=="40"):
    Payload ="03221E040A280000"
    print(Payload)
    print("off")
elif(OnOf=="30"):
    Payload ="03221E040A1E0000"
    print(Payload)
    print("off")
elif(OnOf=="20"):
    Payload ="03221E040A140000"
    print(Payload)
    print("off")
elif(OnOf=="10"):
    Payload ="03221E040A0A0000"
    print(Payload)
    print("off")
elif(OnOf=="0"):
    Payload ="03221E040A000000"
    print(Payload)
    print("off")

elif(OnOf=="95"):
    Payload ="03221E040A5F0000"
    print(Payload)
    print("on")
elif(OnOf=="85"):
    Payload ="03221E040A550000"
    print(Payload)
    print("on")
elif(OnOf=="75"):
    Payload ="03221E040A4B0000"
    print(Payload)
    print("on")
elif(OnOf=="65"):
    Payload ="03221E040A410000"
    print(Payload)
    print("on")
elif(OnOf=="55"):
    Payload ="03221E040A370000"
    print(Payload)
    print("on")
elif(OnOf=="45"):
    Payload ="03221E040A2D0000"
    print(Payload)
    print("off")
elif(OnOf=="35"):
    Payload ="03221E040A230000"
    print(Payload)
    print("off")
elif(OnOf=="25"):
    Payload ="03221E040A190000"
    print(Payload)
    print("off")
elif(OnOf=="15"):
    Payload ="03221E040A0F0000"
    print(Payload)
    print("off")
elif(OnOf=="5"):
    Payload ="03221E040A050000"
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
