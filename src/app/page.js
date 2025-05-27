"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [dob, setDob] = useState("");
  const [data, setData] = useState([]);
  const [psychic, setPsychic] = useState(null);
  const [destiny, setDestiny] = useState(null);
  const [luckyNumbers, setLuckyNumbers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/Lucky_no.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  const reduce = (num) => {
    while (num >= 10) {
      num = num
        .toString()
        .split("")
        .reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  };

  const getFriends = (num) => {
    const entry = data.find((item) => item.Number === num);
    return entry ? entry.Friend.split(",") : [];
  };

  const handleClick = () => {
    if (!/^[0-9]{8}$/.test(dob)) {
      setError("Please enter a valid DOB in DDMMYYYY format.");
      setPsychic(null);
      setDestiny(null);
      setLuckyNumbers([]);
      return;
    }

    setError("");
    const day = parseInt(dob.slice(0, 2));
    const psychicNum = reduce(day);
    const digits = dob.split("").map((d) => parseInt(d));
    const destinyNum = reduce(digits.reduce((acc, d) => acc + d, 0));

    const moolankFriends = getFriends(psychicNum);
    const bhagyankFriends = getFriends(destinyNum);
    const common = moolankFriends.filter((n) => bhagyankFriends.includes(n));

    setPsychic(psychicNum);
    setDestiny(destinyNum);
    setLuckyNumbers(common);
  };

  return (
    <>
      <video autoPlay muted loop id="myVideo">
         <source src="video.mp4" type="video/mp4" />
      </video>
      <div className="container">
        <h2>Know Your Lucky Number</h2>
        <p>Enter your Date of Birth (DDMMYYYY)</p>
        <input
          type="text"
          placeholder="DOB (DDMMYYYY)"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <button onClick={handleClick}>Click</button>

        <div id="yourdetails">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {psychic !== null && destiny !== null && (
            <>
              <p>
                Your Psychic number is: <strong>{psychic}</strong>
              </p>
              <p>
                Your Destiny number is: <strong>{destiny}</strong>
              </p>
              <p>
                Your Lucky Number(s):{" "}
                <strong>{luckyNumbers.join(", ") || "None"}</strong>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
