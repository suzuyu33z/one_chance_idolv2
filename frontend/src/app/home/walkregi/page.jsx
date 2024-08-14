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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">新たな散歩を登録！</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
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
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            終了時間
          </label>
          <DatePicker
            selected={formData.time_end}
            onChange={(date) => handleDateChange("time_end", date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy/MM/dd HH:mm"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            ロケーション
          </label>
          <select
            name="location_id"
            value={formData.location_id}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none"
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
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            犬を選択
          </label>
          {userDogs.map((dog) => (
            <div key={dog.dog_id} className="mb-2">
              <input
                type="checkbox"
                name="dogs"
                value={dog.dog_id}
                onChange={handleDogSelect}
              />{" "}
              {dog.dog_name}
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            コメント
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          登録
        </button>
      </form>
    </div>
  );
}
