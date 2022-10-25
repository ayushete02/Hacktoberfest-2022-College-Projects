import cv2
import datetime
from PIL import Image, ImageDraw

scr = cv2.VideoCapture(0)
# scr.set(4,800)
# scr.set(4,800)

PenCascade = cv2.CascadeClassifier('haarcascade_frontalface_alt2.xml')
LastPx = 0
LastPy = 0


while True:
    Dot = Image.open('Dot.png')
    Background = Image.open('Background.jpg')
    # Background = cv2.imread('Background.jpg')
    
    ret, frame = scr.read()
    frame = cv2.flip(frame, 1)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    Pen = PenCascade.detectMultiScale(gray, 1.1, 4)

    print("Found {0}!".format(len(Pen)))

    for (x, y, w, h) in Pen:

        
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 255), 2)
        # cv2.putText(image, 'OpenCV', org, font, fontScale, color, thickness, cv2.LINE_AA)
        cv2.putText(frame, f'{len(Pen)}', (int(x)+int(int(w)/2), int(y)+int(int(h)/2)), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

        Draw = ImageDraw.Draw(Background)
        Draw.line([(LastPx,LastPy),(int(x),int(y))], fill=(0, 0, 255), width=2)
        # Background.paste(Dot, (int(x),int(y)), mask = Dot)
        Background.save("Background.jpg")

        LastPx = int(x)
        LastPy = int(y)


    # cv2.imshow("Image", Background)

    cv2.imshow('frame', frame)
    # Background = Image.open('Background.jpg')
    Background = cv2.imread('Background.jpg')
    cv2.imshow('img',Background)
    cv2.resize(frame,(500,500))

    if cv2.waitKey(1) & 0xff == ord('q'):
        break


scr.release()

cv2.destroyAllWindows()
