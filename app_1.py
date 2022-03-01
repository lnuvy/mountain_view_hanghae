from flask import Flask
from bs4 import BeautifulSoup
import requests
import xmltodict

app = Flask(__name__)
# 크롤링 한글 정상 작동
app.config['JSON_AS_ASCII'] = False

# Json 파일 경로 // 주소 + /mountaininfo
@app.route("/mountainInfo", methods=["GET"])
def get_mountainInfo():
    url = 'http://apis.data.go.kr/1400000/service/cultureInfoService/mntInfoOpenAPI'
    params = {'serviceKey': 'C1EvS3mDIvVFBeCI85YBjCPyaBYo54kb2xyrzOTz/WpWmx1kEc/7m6L5U9pWb7rJ2vb6VhWL5oQFWytEkHen4Q==', 'searchWrd': '', 'numOfRows': '5'}

    response = requests.get(url, params=params)
    obj = xmltodict.parse(response.text)
    print(obj['response'])
    return obj['response']

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)