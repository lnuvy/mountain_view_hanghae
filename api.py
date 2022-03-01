import requests
from bs4 import BeautifulSoup

# # 크롤링 한글 정상 작동
# app.config['JSON_AS_ASCII'] = False

#
# #requests 패키지 사용
# url = 'http://220.88.54.39:5000/mountainInfo'
# r = requests.get(url)
# rjson = r.json()
#
# infos = rjson['body']['items']['item']
#
# for info in infos:
#     address = info['mntiadd']
#     name = info['mntiname']
#     high = info['mntihigh']
#     comment = info['mntidetails']
#     print("address :", address)
#     print("name :", name)
#     print("high :", high)
#     print("comment :", comment)
#     print('')



# bs4 크롤링
# 브라우저에서 콜을 날려주는 역활 // data = URL 저장
headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
res = requests.get('http://220.88.54.39:5000/mountainInfo', headers=headers)

# soup = BeautifulSoup(data.text, 'html.parser')
# print(soup)

soup = BeautifulSoup(res.text, 'lxml')
print(soup)


# titles = soup.select('body > div > ul') #부모 > 자식
# print(titles)

# mountains = soup.find_all("li", attrs={"class":"string"})
# for mountain in mountains:
#     print(mountain.get_text())




# # Beautifulsoup 사용방법
# highs = soup.select_one('html')
#                         #json > ul > li:nth-child(1) > ul > li:nth-child(1) > ul > li > ul > li:nth-child(1) > ul > li:nth-child(6) > span.string
#                        #json > ul > li:nth-child(1) > ul > li:nth-child(1) > ul > li > ul > li:nth-child(1) > ul > li:
#
# print(highs)


# # 예시
# url = 'https://kin.naver.com/search/list.nhn?query=%ED%8C%8C%EC%9D%B4%EC%8D%AC'
#
# response = requests.get(url)
#
# if response.status_code == 200:
#     html = response.text
#     soup = BeautifulSoup(html, 'html.parser')
#     ul = soup.select_one('ul.basic1')
#     titles = ul.select('li > dl > dt > a')
#     for title in titles:
#         print(title.get_text())
# else :
#     print(response.status_code)

# Test01
# url = 'http://220.88.54.39:5000/mountainInfo'
#
# response = requests.get(url)
#
# if response.status_code == 200:
#     html = response.text
#     soup = BeautifulSoup(html, 'html.parser')
#     ul = soup.select_one('ul.obj')
#     print(ul)
# else :
#     print(response.status_code)



# # Test02
# url = 'http://220.88.54.39:5000/mountainInfo'
#
# response = requests.get(url)
#
# if response.status_code == 200:
#     html = response.text
#     soup = BeautifulSoup(html, 'html.parser')
#     ul = soup.select_one('ul.body')
#     titles = ul.select('li > ul > li > ul > li > ul > li > ul > li > string')
#     for title in titles:
#         print(title.get_text())
# else:
#     print(response.status_code)








