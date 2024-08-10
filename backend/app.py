from flask import Flask, request
from flask import jsonify, session
import json
from flask_cors import CORS
import datetime  # datetimeをインポート
from db_control import crud, mymodels
from datetime import datetime, timedelta
import requests

from werkzeug.security import check_password_hash
from sqlalchemy.orm import Session
from db_control.connect import engine
# Azure Database for MySQL
# REST APIでありCRUDを持っている
app = Flask(__name__)
app.secret_key = 'your_secret_key'
# セッションに関する設定

app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=False,  # HTTPSを使用しない場合はFalse
    SESSION_COOKIE_SAMESITE="None",  # クロスサイトでのクッキー送信を許可
    SESSION_COOKIE_DOMAIN=None,  # 自動設定
    PERMANENT_SESSION_LIFETIME=timedelta(minutes=30),  # ここでは datetime.timedelta ではなく timedelta を使用
    SESSION_TYPE='filesystem'
)
CORS(app, supports_credentials=True, origins=["*"])


@app.route("/")
def index():
    return "<p>Flask top page!</p>"

#新規登録時のコード（visitor）
@app.route("/api/register", methods=["POST"])
def register_user():
    data = request.get_json()
    print("Received form data:", data)

    values = {
        "name": data.get("name"),
        "email": data.get("email"),
        "password": data.get("password"),
        "image": data.get("image"),
        "bio": data.get("bio"),
        "dog_number": data.get("dog_number", 0),
        "points": data.get("points", 0)
    }

    result = crud.register_user(mymodels.User, values)  # CRUD関数を呼び出す

    if "User registered successfully" in result:
        return jsonify({"message": result}), 200
    else:
        return jsonify({"error": result}), 500

#ログイン時のコード
@app.route("/api/login", methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    with Session(engine) as db_session:
        user = db_session.query(mymodels.User).filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.user_id  # セッションに user_id を保存
            print("Session after login:", session)  # セッションデータをログに出力
            return jsonify({'message': 'Logged in successfully'}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401


# 認証状態をチェックするエンドポイント
@app.route("/api/check-auth", methods=['GET'])
def check_auth():
    print("Session data:", session)  # セッションデータをログに出力
    if 'user_id' in session:
        return jsonify({'message': 'Authenticated', 'user_id': session['user_id']}), 200
    else:
        return jsonify({'error': 'Unauthorized'}), 401


#ログアウトするためのエンドポイント
@app.route("/api/logout", methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'}), 200


#散歩情報取得のコード
@app.route("/api/walks", methods=["GET"])
def get_walks():
    walk_data = crud.get_all_walks()  # crud.pyの関数を呼び出し
    return jsonify(walk_data)

#散歩詳細の取得
@app.route("/api/walks/<int:walk_id>", methods=["GET"])
def get_walk_detail(walk_id):
    walk = crud.get_walk_by_id(walk_id)
    if walk:
        return jsonify(walk)
    else:
        return jsonify({"error": "Walk not found"}), 404

#home画面で自分の予定を取得するためのもの
@app.route("/api/all_user_walks", methods=["GET"])
def get_all_user_walks():
    walk_data = crud.get_all_walks_by_requests()
    return jsonify(walk_data)

#walkのmessageを表示する
@app.route("/api/walks/<int:walk_id>/messages", methods=["GET"])
def get_walk_messages(walk_id):
    messages = crud.get_messages_by_walk_id(walk_id)
    if messages:
        return jsonify(messages), 200
    else:
        return jsonify({"error": "No messages found for this walk"}), 404

# メッセージの投稿（新しいエンドポイント）
@app.route("/api/walks/<int:walk_id>/messages", methods=["POST"])
def post_walk_message(walk_id):
    data = request.get_json()
    if not data or "message" not in data or "sender_user_id" not in data:
        return jsonify({"error": "Invalid data"}), 400

    result = crud.add_message_to_walk(walk_id, data["sender_user_id"], data["message"])
    if result:
        return jsonify(result), 201
    else:
        return jsonify({"error": "Failed to add message"}), 500

#walkに対してrequestを行うコード
@app.route("/api/request_walk", methods=["POST"])
def request_walk():
    data = request.get_json()
    requesting_user_id = session.get('user_id')
    
    if not requesting_user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    walk_id = data.get("walk_id")
    requested_time_str = data.get("requested_time")  # クライアントからの文字列を取得

    try:
        # requested_time_str のフォーマットを調整して datetime オブジェクトに変換
        if len(requested_time_str) == 5:  # フォーマットが 'HH:MM' の場合
            today = datetime.now().date()  # 今日の日付を取得
            requested_time = datetime.combine(today, datetime.strptime(requested_time_str, '%H:%M').time())
        else:
            requested_time = datetime.strptime(requested_time_str, '%Y-%m-%d %H:%M:%S')
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    result = crud.create_walk_request(
        walk_id=walk_id,
        requesting_user_id=requesting_user_id,
        requested_time=requested_time
    )

    if result:
        return jsonify({"message": "Request created successfully"}), 201
    else:
        return jsonify({"error": "Failed to create request"}), 500


@app.route("/customers", methods=['POST'])
def create_customer():
    values = request.get_json()
    # values = {
    #     "customer_id": "C005",
    #     "customer_name": "佐藤Aこ",
    #     "age": 64,
    #     "gender": "女"
    # }
    tmp = crud.myinsert(mymodels.Customers, values)
    result = crud.myselect(mymodels.Customers, values.get("customer_id"))
    return result, 200

@app.route("/customers", methods=['GET'])
def read_one_customer():
    model = mymodels.Customers
    target_id = request.args.get('customer_id') #クエリパラメータ
    result = crud.myselect(mymodels.Customers, target_id)
    return result, 200

@app.route("/allcustomers", methods=['GET'])
def read_all_customer():
    model = mymodels.Customers
    result = crud.myselectAll(mymodels.Customers)
    return result, 200

@app.route("/customers", methods=['PUT'])
def update_customer():
    print("I'm in")
    values = request.get_json()
    values_original = values.copy()
    model = mymodels.Customers
    # values = {  "customer_id": "C004",
    #             "customer_name": "鈴木C子",
    #             "age": 44,
    #             "gender": "男"}
    tmp = crud.myupdate(model, values)
    result = crud.myselect(mymodels.Customers, values_original.get("customer_id"))
    return result, 200

@app.route("/customers", methods=['DELETE'])
def delete_customer():
    model = mymodels.Customers
    target_id = request.args.get('customer_id') #クエリパラメータ
    result = crud.mydelete(model, target_id)
    return result, 200

@app.route("/fetchtest")
def fetchtest():
    response = requests.get('https://jsonplaceholder.typicode.com/users')
    return response.json(), 200


@app.route("/messages", methods=['POST'])
def create_message():
    values = request.get_json()
    tmp = crud.myinsert(mymodels.Messages, values)
    return jsonify({'status': 'Message created'}), 201

@app.route("/messages", methods=['GET'])
def read_messages_by_customer_id():
    customer_id = request.args.get('customer_id')
    results = crud.myselectMessagesByCustomerId(mymodels.Messages, customer_id)
    return results, 200