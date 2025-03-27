import Image from "next/image";
import React, { useState } from "react";
import Usericon from "../icons/Usericon";
import styles from "./avatarstyle.module.css";
import Editicon from "../icons/Editicon";
import CrossIcon from "../icons/CrossIcon";
import SaveIcon from "../icons/SaveIcon";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage, doc, auth } from "../../firebase";
import Cookies from "universal-cookie";
import { addUser, User } from "@/Redux/slices/UserSlice";
import { getDoc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";

type AvatarProps = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  isEditable?: boolean;
};

const Avatar = ({ alt, size, src, className, isEditable }: AvatarProps) => {
  const cookies = new Cookies();
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      // Create a URL for the selected file to show a preview
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
    }
  };

  const removePreview = () => {
    setPreview(null);
    setSelectedImage(null);
  };

  const handleImageSave = async () => {
    if (!selectedImage) return;
    try {
      const storageRef = ref(storage, `displayImages/${selectedImage.name}`);
      await uploadBytes(storageRef, selectedImage);
      const downloaUrl = await getDownloadURL(storageRef);
      console.log("file is available at : ", downloaUrl);
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", `${user.uid}`);
        console.log(userRef, "UserREF");
        await updateDoc(userRef, {
          avatar: downloaUrl,
        });
        setSelectedImage(null);
        setPreview(null);

        const usersnap = await getDoc(userRef);
        const userDoc = usersnap.data() as User;
        console.log(userDoc);

        if (usersnap.exists()) {
          dispatch(
            addUser({
              email: user.email!,
              uid: user.uid!,
              name: userDoc.name,
              token: user.refreshToken,
              avatar: userDoc.avatar,
            })
          );
          

          cookies.set("user-token", {
            token: user.refreshToken,
          });
          cookies.set("user", {
            email: user.email!,
            id: user.uid!,
            name: userDoc.name,
            avatar: userDoc.avatar,
          });
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  return (
    <div className="relative">
      <figure
        className={`${size ? `min-w-[${size}px]` : "min-w-[48px]"} ${
          size ? `size-[${size}px]` : "size-[48px]"
        } overflow-hidden rounded-full border-[3px] relative  ${
          isEditable ? "cursor-pointer" : "cursor-auto"
        } ${styles.avatarWrap}`}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={size || 48}
            height={size || 48}
            className="size-full object-cover"
          />
        ) : preview ? (
          <Image
            src={preview}
            alt={alt}
            width={size || 48}
            height={size || 48}
            className="size-full object-cover"
          />
        ) : (
          <i
            className={`size-full flex items-center justify-center bg-slate-300`}
          >
            <Usericon />
          </i>
        )}

        {isEditable && (
          <>
            <i className={styles.avatarEdit}>
              <Editicon />
              <input
                type="file"
                accept="image/*"
                className="absolute top-0 right-0 w-full h-full  opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </i>
          </>
        )}
      </figure>
      {preview && (
        <div className="flex items-center space-x-1 absolute bottom-0 z-[1000] w-full justify-between">
          <button onClick={removePreview}>
            <CrossIcon />
          </button>
          <button onClick={handleImageSave}>
            <SaveIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default Avatar;
