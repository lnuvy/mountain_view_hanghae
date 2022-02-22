from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient("mongodb+srv://lnuvy:1234@cluster-lnuvy.cnhmb.mongodb.net/")
db = client.dbsparta


@app.route('/test')
def test():
    return render_template('testLogin.html')

# 페이지 라우팅 #
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/mountainInfo')
def mountainInfo():
    return render_template('mountainInfo.html')

# # Ajax 요청 #
# @app.route('/ajax', methods=["GET"])
# def dbList():
#     mountainList = list(db.test_mountain.find({}, {'_id': False}))
#     print(mountainList)
#     return jsonify({'mountains': mountainList})


@app.route('/registerAction', methods=["POST"])
def checkDup():
    id_receive = request.form['id_give']
    userList = list(db.users.find({}, {'_id': False}))
    for user in userList:
        if user['id'] == id_receive:
            print("일치")
            return jsonify({'msg': '이미 존재하는 아이디 입니다!!'})
    print("없음")
    return jsonify({'msg': '사용 가능한 아이디 입니다.'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)