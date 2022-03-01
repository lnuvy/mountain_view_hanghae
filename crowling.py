import requests
from bs4 import BeautifulSoup as bs

url = "https://100mountain.tistory.com/431"
res = requests.get(url)
soup = bs(res.content, 'html.parser')

bodys = soup.find_all("td")

cnt = 0

infoList = []
tempList = []
stopPoint = True

i=0;
for a in bodys:
    if stopPoint == False:
        break;

    if cnt < 10:
        cnt = cnt+1
        continue
    else:
        if i < 4:
            tempList.insert(i, a.text)
            print(a.text)
            i = i+1
        else:
            i = i+1
            if i < 5:
                i = 0
                continue

    if "서귀포시" in a.text:
        stopPoint = False




        # if a.text == "149":
        #     for i in range(4):
        #         print(a.text)
        #         b = a.find("span")
        #     # print(b.text)

