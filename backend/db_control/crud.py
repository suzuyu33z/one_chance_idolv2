# uname() error回避
import platform
print("platform", platform.uname())

from sqlalchemy import create_engine, insert, delete, update, select
import sqlalchemy
from sqlalchemy.orm import sessionmaker
import json
import pandas as pd

from db_control.connect import engine
#from db_control.mymodels import Customers
from db_control.mymodels import User, Dog, Breed, Walk, Location, Request, Message, Feedback, RequestedFeedback, RequestingFeedback, WalkDogList
from datetime import datetime

#user登録するためのもの
def register_user(mymodel, values):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()

    # Userモデルかどうかを確認し、パスワードをハッシュ化
    if mymodel == User:
        user = User(
            name=values["name"],
            email=values["email"],
            image=values["image"],
            bio=values["bio"],
            dog_number=values["dog_number"],
            points=values["points"]
        )
        user.set_password(values["password"])  # パスワードをハッシュ化
        try:
            # トランザクションを開始
            with session.begin():
                session.add(user)
        except sqlalchemy.exc.IntegrityError:
            print("エラー: ユーザー登録に失敗しました")
            session.rollback()
            return "Failed to register user: IntegrityError"
        finally:
            # セッションを閉じる
            session.close()
        return "User registered successfully"
    else:
        # 他のモデルの場合、通常のインサートを実行
        query = insert(mymodel).values(values)
        try:
            # トランザクションを開始
            with session.begin():
                result = session.execute(query)
        except sqlalchemy.exc.IntegrityError:
            print("エラー: 登録に失敗しました")
            session.rollback()
            return "Failed to register: IntegrityError"
        finally:
            # セッションを閉じる
            session.close()

        return "Registered successfully"

#Walkを表示するためのコード
def get_all_walks():
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        walks = session.query(Walk).all()
        
        walk_data = []
        for walk in walks:
            dogs = []
            for walk_dog in walk.dogs:
                dog = walk_dog.dog
                breed = dog.breed
                dogs.append({
                    "name": dog.dog_name,
                    "breed": breed.breed_name,
                    "age": dog.dog_age,
                    "gender": dog.dog_sex
                })
            
            location = walk.location

            walk_data.append({
                "walk_id": walk.walk_id,
                "date": walk.time_start.strftime("%Y/%m/%d"),
                "time_start": walk.time_start.strftime("%H:%M"),
                "time_end": walk.time_end.strftime("%H:%M"),
                "location": location.location_name,
                "dogs": dogs
            })
        
        return walk_data
    
    except Exception as e:
        print(f"Error fetching walks: {e}")
        return []
    
    finally:
        session.close()

#散歩詳細の取得
def get_walk_by_id(walk_id):
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        walk = session.query(Walk).filter(Walk.walk_id == walk_id).first()
        if walk:
            # 必要なデータを取得して辞書にまとめる
            dogs = []
            for walk_dog in walk.dogs:
                dog = walk_dog.dog
                breed = dog.breed
                dogs.append({
                    "name": dog.dog_name,
                    "breed": breed.breed_name,
                    "age": dog.dog_age,
                    "gender": dog.dog_sex,
                    "image": dog.image,
                    "description": dog.description,
                })
            
            location = walk.location

            walk_data = {
                "walk_id": walk.walk_id,
                "date": walk.time_start.strftime("%Y/%m/%d"),
                "time_start": walk.time_start.strftime("%H:%M"),
                "time_end": walk.time_end.strftime("%H:%M"),
                "location": location.location_name,
                "description": walk.description,
                "owner_name": walk.owner.name,
                "owner_bio": walk.owner.bio,
                "dogs": dogs
            }
            
            return walk_data
        else:
            return None
    
    except Exception as e:
        print(f"Error fetching walk by ID: {e}")
        return None
    
    finally:
        session.close()

#home画面で自分の予定を表示するためのもの
def get_all_walks_by_requests():
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # 現在の日時を取得
        current_time = datetime.now()

        # Requestテーブルからconfirmedが1かつ未来の日時のwalk_idを取得
        requests = session.query(Request).filter(Request.confirmed == True).all()
        
        walk_data = []
        for request in requests:
            # Walkテーブルのtime_startが現在よりも未来のものを取得
            walk = session.query(Walk).filter(Walk.walk_id == request.walk_id, Walk.time_start > current_time).first()

            if walk:
                dogs = []
                for walk_dog in walk.dogs:
                    dog = walk_dog.dog
                    breed = dog.breed
                    dogs.append({
                        "name": dog.dog_name,
                        "breed": breed.breed_name,
                        "age": dog.dog_age,
                        "gender": dog.dog_sex
                    })
                
                location = walk.location

                walk_data.append({
                    "walk_id": walk.walk_id,
                    "date": walk.time_start.strftime("%Y/%m/%d"),
                    "time_start": walk.time_start.strftime("%H:%M"),
                    "time_end": walk.time_end.strftime("%H:%M"),
                    "location": location.location_name,
                    "dogs": dogs
                })
        
        return walk_data

    except Exception as e:
        print(f"Error fetching walks by requests: {e}")
        return []
    
    finally:
        session.close()

#walkにmessageを表示する
def get_messages_by_walk_id(walk_id):
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        messages = session.query(Message).filter(Message.walk_id == walk_id).order_by(Message.timestamp).all()
        message_data = []
        for message in messages:
            user = session.query(User).filter(User.user_id == message.sender_user_id).first()
            message_data.append({
                "message_id": message.message_id,
                "sender_user_id": message.sender_user_id,
                "sender_name": user.name,  # ユーザー名を追加
                "message": message.message,
                "timestamp": message.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            })
        return message_data
    
    except Exception as e:
        print(f"Error fetching messages for walk ID {walk_id}: {e}")
        return []
    
    finally:
        session.close()

#walkにメッセージを追加するコード
def add_message_to_walk(walk_id, sender_user_id, message_text):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        new_message = Message(
            walk_id=walk_id,
            sender_user_id=sender_user_id,
            message=message_text
        )
        session.add(new_message)
        session.commit()

        # メッセージとユーザー情報を返す
        result = {
            "message_id": new_message.message_id,
            "walk_id": walk_id,
            "message": message_text,
            "sender_user_id": sender_user_id,
            "sender_name": session.query(User).filter(User.user_id == sender_user_id).first().name,
            "timestamp": new_message.timestamp
        }
        return result

    except Exception as e:
        session.rollback()
        print(f"Error adding message: {e}")
        return None
    
    finally:
        session.close()

#walkに対してrequestを送信するコード
def create_walk_request(walk_id, requesting_user_id, requested_time):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        walk = session.query(Walk).filter(Walk.walk_id == walk_id).first()
        if not walk:
            return False

        # requestテーブルに挿入
        new_request = Request(
            walk_id=walk_id,
            requested_user_id=walk.owner_user_id,
            requesting_user_id=requesting_user_id,
            requested_time=requested_time,  # ここで正しくdatetimeを使用
            confirmed=False,  # 初期値はFalse
            timestamp=datetime.now(),  # 現在時刻
            points_paid=0  # 必要ならば適切に設定
        )
        session.add(new_request)
        session.commit()  # 新しいリクエストをコミット

        # requested_feedbackテーブルに挿入
        new_requested_feedback = RequestedFeedback(
            content="",
            rating=0,
            timestamp=datetime.now()  # フィードバックの作成日時
        )
        session.add(new_requested_feedback)
        session.commit()  # フィードバックをコミットしてIDを取得

        # requesting_feedbackテーブルに挿入
        new_requesting_feedback = RequestingFeedback(
            content="",
            rating=0,
            timestamp=datetime.now()  # フィードバックの作成日時
        )
        session.add(new_requesting_feedback)
        session.commit()  # フィードバックをコミットしてIDを取得

        # Feedbackテーブルに挿入
        new_feedback = Feedback(
            walk_id=walk_id,
            requested_user_id=walk.owner_user_id,
            requesting_user_id=requesting_user_id,
            requested_feedback_id=new_requested_feedback.requested_feedback_id,
            requesting_feedback_id=new_requesting_feedback.requesting_feedback_id
        )
        session.add(new_feedback)

        session.commit()
        return True

    except Exception as e:
        session.rollback()
        print(f"Error creating request: {e}")
        return False

    finally:
        session.close()



#これより下は、サンプルコードのもの
def myinsert(mymodel, values):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()

    query = insert(mymodel).values(values)
    try:
        # トランザクションを開始
        with session.begin():
            # データの挿入
            result = session.execute(query)
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
        session.rollback()
 
    # セッションを閉じる
    session.close()
    return "inserted"
 
def myselect(mymodel, customer_id):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()
    query = session.query(mymodel).filter(mymodel.customer_id == customer_id)
    try:
        # トランザクションを開始
        with session.begin():
            result = query.all()
        # 結果をオブジェクトから辞書に変換し、リストに追加
        result_dict_list = []
        for customer_info in result:
            result_dict_list.append({
                "customer_id": customer_info.customer_id,
                "customer_name": customer_info.customer_name,
                "age": customer_info.age,
                "gender": customer_info.gender
            })
        # リストをJSONに変換
        result_json = json.dumps(result_dict_list, ensure_ascii=False)
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")

    # セッションを閉じる
    session.close()
    return result_json


def myselectAll(mymodel):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()
    query = select(mymodel)
    try:
        # トランザクションを開始
        with session.begin():
            df = pd.read_sql_query(query, con=engine)
            result_json = df.to_json(orient='records', force_ascii=False)

    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
        result_json = None

    # セッションを閉じる
    session.close()
    return result_json

def myupdate(mymodel, values):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()

    customer_id = values.pop("customer_id")

    query = (
    update(mymodel)
    .where(mymodel.customer_id == customer_id)
    .values(**values)
    )


    try:
        # トランザクションを開始
        with session.begin():
            result = session.execute(query)
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
        session.rollback()
    # セッションを閉じる
    session.close()
    return "put"

def mydelete(mymodel, customer_id):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()
    query = delete(mymodel).where(mymodel.customer_id==customer_id)
    try:
        # トランザクションを開始
        with session.begin():
            result = session.execute(query)
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
        session.rollback()

def myinsertMessage(values):
    Session = sessionmaker(bind=engine)
    session = Session()

    query = insert(Messages).values(values)
    try:
        with session.begin():
            result = session.execute(query)
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
        session.rollback()

    session.close()
    return "message inserted"

def myselectMessagesByCustomerId(mymodel, customer_id):
    Session = sessionmaker(bind=engine)
    session = Session()
    query = session.query(mymodel).filter(mymodel.customer_id == customer_id)
    try:
        with session.begin():
            result = query.all()
        result_dict_list = []
        for message_info in result:
            result_dict_list.append({
                "id": message_info.id,
                "customer_id": message_info.customer_id,
                "message": message_info.message,
                "timestamp": message_info.timestamp.isoformat()  # datetimeオブジェクトを文字列に変換
            })
        result_json = json.dumps(result_dict_list, ensure_ascii=False)
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、選択に失敗しました")

    # セッションを閉じる
    session.close()
    return result_json