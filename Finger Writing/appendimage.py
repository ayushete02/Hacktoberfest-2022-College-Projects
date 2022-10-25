# from PIL import Image


# for item in range(100):
    
  
#     img1 = Image.open("Background.jpg")
#     img2 = Image.open("Dot.png")
    
#     # No transparency mask specified, 
#     # simulating an raster overlay
#     img1.paste(img2, (item,item), mask = img2)
#     img1.save("Background.jpg")

    
    
# img1.show()

import cv2
 
image = cv2.imread('Background.jpg')
 
height = image.shape[0]
width = image.shape[1]
 
cv2.line(image, (20,10), (100,10), (255,0,0), 2)
cv2.line(image, (0,0), (width, height), (0,0,255), 12)
 
cv2.imshow("Image", image)
    
cv2.waitKey(0)
cv2.destroyAllWindows()