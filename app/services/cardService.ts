import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../utils/firebase/firebaseConfig"; // Adjust the import path as necessary
import { collection, addDoc } from "firebase/firestore";

export const uploadImageAndGetURL = async (imageFile: File) => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    // Handle the error appropriately
    throw error;
  }
};

export const saveCardData = async (cardData: any) => {
  try {
    const docRef = await addDoc(collection(db, "card"), cardData);
    return docRef.id;
  } catch (error) {
    console.error("Error saving card data:", error);
    // Handle the error appropriately
    throw error;
  }
};
