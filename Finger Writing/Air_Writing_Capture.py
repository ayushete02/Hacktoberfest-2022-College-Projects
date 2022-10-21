wCam, hCam = 640, 480
frameR = 100 # Frame Reduction
smoothening = 7

pTime = 0
plocX, plocY = 0, 0
clocX, clocY = 0, 0

import numpy as np
import cv2
import os
from PIL import Image, ImageDraw
import time
import handTrackingModule as htm
     
 
wcam,hcam=640,480
cap=cv2.VideoCapture(0)
cap.set(3,wcam)
cap.set(4,hcam)
pTime=0
detector = htm.handDetector(detectionCon=0.75)

LastPx = 800
LastPy = 0

while True:
    Background = Image.open('Background.jpg')
    success,img=cap.read()
    img = detector.findHands(img, draw=True )
    lmList=detector.findPosition(img,draw=False)
    #print(lmList)
    tipId=[4,8,12,16,20]
    if(len(lmList)!=0):
        fingers=[]
        #thumb
        if(lmList[tipId[0]][1]>lmList[tipId[0]-1][1]):
                fingers.append(1)
        else :
                fingers.append(0)
        #4 fingers
        for id in range(1,len(tipId)):
            
            if(lmList[tipId[id]][2]<lmList[tipId[id]-2][2]):
                fingers.append(1)
            
            else :
                fingers.append(0)
        if len(lmList) != 0:
            x1, y1 = lmList[8][1:]
            x2, y2 = lmList[12][1:]

        if fingers[1] == 1 and fingers[2] == 0:
            x3 = np.interp(x1, (frameR, wCam - frameR), (0, 1080))
            y3 = np.interp(y1, (frameR, hCam - frameR), (0, 720))

            clocX = plocX + (x3 - plocX) / smoothening
            clocY = plocY + (y3 - plocY) / smoothening
        
            cv2.circle(img, (x1, y1), 15, (255, 0, 255), cv2.FILLED)
            plocX, plocY = clocX, clocY 

            Draw = ImageDraw.Draw(Background)
            Draw.line([(LastPx,LastPy),(int(x1),int(y1))], fill=(0, 0, 255), width=2)
            Background.save("Background.jpg")

            LastPx = int(x1)
            LastPy = int(y1)
        
     
    
    cTime=time.time()
    print(cTime)
    print(pTime)
    fps=1.0/float(cTime-pTime)
    pTime=cTime
    img = cv2.flip(img, 1)
    cv2.imshow("image",img)

    Background = cv2.imread('Background.jpg')
    Background = cv2.flip(Background, 1)
    cv2.imshow('img',Background)


    if(cv2.waitKey(1) & 0xFF== ord('q')):
        break


cap.release()

cv2.destroyAllWindows()
