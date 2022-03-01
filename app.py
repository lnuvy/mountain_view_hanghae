from flask import Flask, render_template, request, jsonify, redirect, url_for, session, make_response
from pymongo import MongoClient
# 비밀번호 hash 암호화
import hashlib

import jwt
import datetime

app = Flask(__name__)
# 테스트용 시크릿 키
app.config['SECRET_KEY'] = 'lnuvy'

client = MongoClient("mongodb+srv://lnuvy:1234@cluster-lnuvy.cnhmb.mongodb.net/")
db = client.dbsparta

app.config['JWT_SECRET_KEY'] = "lnuvy"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 600
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 100000


@app.route('/test/logout')
def testLogout():
    session['logged_in'] = False;
    return redirect("/test")

@app.route('/test')
def test():
    if not session.get('logged_in'):
        return render_template('testLogin.html')
    else:
        return "Logged in success!"

@app.route('/testLogin', methods=['POST'])
def testLogin():
    if request.form['username'] and request.form['password'] == '123456':
        session['logged_in'] = True

        token = jwt.encode({
            'user': request.form['username'],
            'expiration': str(datetime.datetime.utcnow() + datetime.timedelta(seconds=60))
            },
            app.config['SECRET_KEY'])
        return jsonify({'token': token.decode('utf-8')})
    else:
        return make_response('Unable to verify', 403, {'WWW-Authenticate': 'asdfasdf Failed!'})



# ---------- 페이지 라우팅 ---------- #
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


# ---------- Ajax 요청 ---------- #
# 아이디 중복체크
@app.route('/register/checkDup', methods=["POST"])
def checkDup():
    id_receive = request.form['id_give']
    userList = list(db.users.find({}, {'_id': False}))
    for user in userList:
        if user['id'] == id_receive:
            return jsonify({'msg': '이미 존재하는 아이디 입니다!!'})

    return jsonify({'msg': '사용 가능한 아이디 입니다.'})


# 회원가입
@app.route('/register/insertDB', methods=["POST"])
def userRegister():
    id_receive = request.form['id_give']
    password_receive = request.form['password_give']
    birth_receive = request.form['birth_give']
    nickname_receive = request.form['nickname_give']

    if (id_receive == "" or password_receive == "" or birth_receive == "" or nickname_receive == ""):
        return jsonify({'msg': '정상적이지 않은 접근입니다.'})

    # 암호화
    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

    doc = {
        "id": id_receive,
        "password": pw_hash,
        "birth": birth_receive,
        "nickname": nickname_receive
    }
    db.users.insert_one(doc)
    return jsonify({'msg': '회원가입 완료'})


# 로그인 확인
@app.route('/login/validCheck', methods=["POST"])
def userLogin():
    userId = request.form['id_give']
    userPassword = request.form['password_give']

    pw_hash = hashlib.sha256(userPassword.encode('utf-8')).hexdigest()

    result = db.users.find_one({'id': userId, 'password': pw_hash})

    if result is not None:
        payload = {
            'id': userId,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=5)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode('utf-8')
        print(token)
        # return redirect(url_for('/'))
        return jsonify({'result': 'success', 'token': token})
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


# @app.route("/getMountain", methods=["POST"])
# def movie_get():
#     mountain_name = request.form['name']
#     mountain_list = list(db.tests.find({'name': mountain_name }))
#     for m in mountain_list:
#         m['_id'] = str(m['_id'])
#         print(m)
#     return jsonify({'mountains': mountain_list})

# 산 정보 요청(임시-권영민)
@app.route("/getMountain", methods=["POST"])
def movie_get():
    mountain_name = request.form['name']
    mountain_address = request.form['address']
    mountain_list = list(db.tests.find({'address': {'$regex': mountain_address }, 'name': mountain_name}, {'_id': False}))
    # for m in mountain_list:
    #     m['_id'] = str(m['_id'])
    return jsonify({'mountains': mountain_list})




if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
