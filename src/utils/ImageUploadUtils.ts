import {v4 as uuidv4} from "uuid";
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {storage} from "firebaseApp";

const uploadFile = async (file: Blob, folderName: string) => {
  const fileReader = new FileReader();

  const fileString: string = await new Promise((resolve, reject) => {
    fileReader.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const result = e?.currentTarget?.result;
      result ? resolve(result) : reject("File reading failed");
    };
  });

  const fileName = uuidv4();
  const storageRef = ref(storage, `${folderName}/${fileName}`);

  const data = await uploadString(storageRef, fileString, "data_url");
  const imageUrl = await getDownloadURL(data.ref);

  return {imageUrl, fileString};
};

const downloadFile = async (filePath: string): Promise<void> => {
  try {
    const storageRef = ref(storage, filePath);
    const downloadUrl = await getDownloadURL(storageRef);

    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = filePath.split("/").pop() || "file";
    anchor.click();
  } catch (error) {
    console.error("File download failed: ", error);
  }
};

const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("File deletion failed: ", error);
    throw error;
  }
};
