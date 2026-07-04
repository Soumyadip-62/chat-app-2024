import Image from "next/image";
import React, { useState } from "react";
import styles from "./avatarstyle.module.css";
import { User as UserIcon, Pencil, X, Save } from "lucide-react";
import { db, doc, auth } from "../../firebase";
import Cookies from "universal-cookie";
import { addUser, User } from "@/Redux/slices/UserSlice";
import { getDoc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import axios from "axios";

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
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        console.error("Cloudinary credentials are not configured.");
        alert("Cloudinary credentials are not configured. Please add them to your env file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("upload_preset", uploadPreset);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      const downloaUrl = res.data.secure_url;
      console.log("file is available at Cloudinary: ", downloaUrl);
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
            className={`size-full flex items-center justify-center bg-slate-300 text-slate-600`}
          >
            <UserIcon size={24} />
          </i>
        )}

        {isEditable && (
          <>
            <i className={styles.avatarEdit}>
              <Pencil size={14} className="text-white" />
              <input
                type="file"
                accept="image/*"
                className="absolute top-0 right-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </i>
          </>
        )}
      </figure>
      {preview && (
        <div className="flex items-center space-x-1 absolute bottom-0 z-[1000] w-full justify-between">
          <button onClick={removePreview} className="bg-black/60 hover:bg-black/80 p-1 rounded-full text-red-400">
            <X size={16} />
          </button>
          <button onClick={handleImageSave} className="bg-black/60 hover:bg-black/80 p-1 rounded-full text-green-400">
            <Save size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Avatar;
