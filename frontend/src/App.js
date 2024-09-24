import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import "./App.css";
// import { updateEntries } from "./updateEntries";

function App() {
    useEffect(() => {
      // updateEntries();
    }, []);
  const [name, setName] = useState("");
  const [ratio, setRatio] = useState("");
  const [percentage, setPercentage] = useState("");
  const [entries, setEntries] = useState([]);

  const getPhrase = (ratio) => {
    switch (ratio) {
      case "0/5":
        return "Are you sure you're a woman?";
      case "1/5":
        return "Easy to please";
      case "2/5":
        return "Down to earth";
      case "3/5":
        return "Aspiring cat lady";
      case "4/5":
        return "Cat enthusiast";
      case "5/5":
        return "You don't belong on this planet";
      default:
        return "";
    }
  };

  const addEntry = async () => {
    if (name.trim() && ratio.trim() && percentage.trim()) {
      try {
        const phrase = getPhrase(ratio.trim()); 
        if (phrase) {
          await addDoc(collection(db, "cat-lady-entries"), {
            name: name.trim(),
            ratio: `${ratio.trim()} - ${phrase}`, 
            percentage: parseFloat(percentage),
          });
        } else {
          await addDoc(collection(db, "cat-lady-entries"), {
            name: name.trim(),
            ratio: ratio.trim(),
            percentage: parseFloat(percentage),
          });
        }

        setName("");
        setRatio("");
        setPercentage("");
        document.getElementById("nameInput").value = "";
        document.getElementById("ratioInput").value = "";
        document.getElementById("percentageInput").value = "";
      } catch (error) {
        console.error("Error adding entry: ", error);
      }
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, "cat-lady-entries"),
      orderBy("percentage", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(items);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <h1 className="banner">ThrottleFury</h1>
      <h2>Crazy Cat Lady Test</h2>
      <div className="input-form">
        <input
          id="nameInput"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          id="ratioInput"
          type="text"
          placeholder="Cat Lady Ratio (e.g., 2/5)"
          value={ratio}
          onChange={(e) => setRatio(e.target.value)}
        />
        <input
          id="percentageInput"
          type="number"
          placeholder="Percentage %"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
        />
        <button onClick={addEntry}>Submit</button>
      </div>

      <div className="entries-list">
        <h3>Leaderboard</h3>
        <ol>
          {entries.map((entry, index) => (
            <li
              key={entry.id}
              className={`entry-item ${
                index === 0
                  ? "gold"
                  : index === 1
                  ? "silver"
                  : index === 2
                  ? "bronze"
                  : ""
              }`}
            >
              <span className="entry-rank">{index + 1}.</span>
              <span className="entry-name">{entry.name}</span>
              <span className="entry-ratio">{entry.ratio}</span>
              <span className="entry-percentage">{entry.percentage}%</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default App;
