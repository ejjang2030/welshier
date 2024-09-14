import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "firebaseApp";
import {toast} from "react-toastify";

const uploadImage = async (imageFile: Blob | undefined, url: string) => {
  if (imageFile === null) return;
  let imageUrl = "";
  let imageByte = "";

  const fileReader = new FileReader();
  fileReader?.readAsDataURL(imageFile!);
  fileReader.onloadend = (e: any) => {
    const result = e?.currentTarget?.result;
    imageByte = result;
  };
  //   const imageRef = ref(storage, url);
  //   uploadBytes(imageRef, imageFile).then(snapshot => {
  //     getDownloadURL(snapshot.ref)
  //       .then(url => {
  //         imageUrl = url;
  //         toast.success("이미지 업로드에 성공하였습니다.");
  //       })
  //       .catch(error => toast.error(error));
  //     //
  //   });
  return {imageUrl, imageByte};
};
