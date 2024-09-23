// updateEntries.js
import { db } from "./firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

// Function to determine the phrase based on the ratio
const getPhrase = (ratio) => {
  switch (ratio) {
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

// Function to update existing entries
export const updateEntries = async () => {
  const entriesSnapshot = await getDocs(collection(db, "cat-lady-entries"));

  entriesSnapshot.forEach(async (docSnapshot) => {
    const data = docSnapshot.data();
    const currentRatio = data.ratio.trim();

    // Check if the ratio already has a phrase appended
    if (!currentRatio.includes(" - ")) {
      const phrase = getPhrase(currentRatio);
      if (phrase) {
        const updatedRatio = `${currentRatio} - ${phrase}`;

        // Update the document in Firestore
        await updateDoc(doc(db, "cat-lady-entries", docSnapshot.id), {
          ratio: updatedRatio,
        });

        console.log(
          `Updated document ${docSnapshot.id} with ratio: ${updatedRatio}`
        );
      }
    }
  });
};
