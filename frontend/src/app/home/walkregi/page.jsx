"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function WalkRegi() {
  const [formData, setFormData] = useState({
    description: "",
    time_start: null,
    time_end: null,
    location_id: "",
    dogs: [],
  });
  const [locations, setLocations] = useState([]);
  const [userDogs, setUserDogs] = useState(null); // 初期値をnullに設定
  const [userInfo, setUserInfo] = useState(null); // ユーザー情報を格納
  const router = useRouter();

  useEffect(() => {
    // ユーザー情報を取得
    fetch(`${process.env.API_ENDPOINT}/api/user-info`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUserInfo(data);
        if (data.dog_number === 0) {
          return; // 犬が0匹の場合、他のデータを取得しない
        }
        // ロケーションリストを取得
        fetch(`${process.env.API_ENDPOINT}/api/locations`)
          .then((response) => response.json())
          .then((data) => setLocations(data))
          .catch((error) => console.error("Error fetching locations:", error));

        // ユーザーの犬リストを取得
        fetch(`${process.env.API_ENDPOINT}/api/user-dogs`, {
          method: "GET",
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => setUserDogs(data))
          .catch((error) => console.error("Error fetching user dogs:", error));
      })
      .catch((error) => console.error("Error fetching user info:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleDurationChange = (e) => {
    const minutes = parseInt(e.target.value);
    if (!isNaN(minutes) && formData.time_start) {
      const endTime = new Date(formData.time_start);
      endTime.setMinutes(endTime.getMinutes() + minutes);
      setFormData({
        ...formData,
        time_end: endTime,
      });
    }
  };

  const handleDogSelect = (e) => {
    const dogId = e.target.value;
    const isChecked = e.target.checked;
    setFormData((prevState) => {
      const updatedDogs = isChecked
        ? [...prevState.dogs, dogId]
        : prevState.dogs.filter((id) => id !== dogId);
      return {
        ...prevState,
        dogs: updatedDogs,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.API_ENDPOINT}/api/register-walk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // セッションを含める
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          router.push("/home");
        } else {
          throw new Error("Failed to register walk.");
        }
      })
      .catch((error) => console.error("Error registering walk:", error));
  };

  if (userInfo === null) {
    // userInfoが取得されるまで待つ
    return <div>Loading...</div>;
  }

  if (userInfo.dog_number === 0) {
    // 犬の数が0の場合
    return <div>権限がありません</div>;
  }

  if (userDogs === null) {
    // userDogsが取得されるまで待つ
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg">
        <h1 className="text-lg font-semibold mb-6 text-gray-800 text-center">
          散歩の予定を追加
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              開始時間
            </label>
            <DatePicker
              selected={formData.time_start}
              onChange={(date) => handleDateChange("time_start", date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy/MM/dd HH:mm"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75A05A]"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              お触りタイム（分）
            </label>
            <input
              type="number"
              onChange={handleDurationChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75A05A]"
              placeholder="例: 15"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              待ち合わせ場所
            </label>
            <select
              name="location_id"
              value={formData.location_id}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75A05A]"
              required
            >
              <option value="">ロケーションを選択</option>
              {locations.map((location) => (
                <option key={location.location_id} value={location.location_id}>
                  {location.location_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              連れて行くワンちゃん
            </label>
            <div className="space-y-3">
              {userDogs.map((dog) => (
                <div key={dog.dog_id} className="flex items-center">
                  <input
                    type="checkbox"
                    name="dogs"
                    value={dog.dog_id}
                    onChange={handleDogSelect}
                    className="mr-3 w-5 h-5"
                  />
                  <label className="text-gray-700">{dog.dog_name}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              コメント
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75A05A]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#75A05A] text-white py-3 rounded-lg font-semibold hover:bg-[#5f8747] transition-colors"
          >
            登録
          </button>
        </form>
      </div>
    </div>
  );
}

