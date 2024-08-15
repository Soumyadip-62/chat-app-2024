import Image from "next/image";
import React from "react";
import Usericon from "../icons/Usericon";
import styles from "./avatarstyle.module.css";
import Editicon from "../icons/Editicon";

type AvatarProps = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  isEditable?: boolean;
};

const Avatar = ({ alt, size, src, className, isEditable }: AvatarProps) => {
  return (
    <figure
      className={`${size ? `min-w-[${size}px]` : "min-w-[48px]"} ${
        size ? `size-[${size}px]` : "size-[48px]"
      } overflow-hidden rounded-full border-[3px] relative  ${
        isEditable ? "cursor-pointer" : "cursor-auto"
      } ${styles.avatarWrap}` }
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size || 48}
          height={size || 48}
          className="size-full object-cover"
        />
      ) : (
        <i className="size-full flex items-center justify-center bg-slate-300">
          <Usericon />
        </i>
      )}
      {isEditable && (
        <input
          type="file"
          className="absolute top-0 right-0 w-full h-full  opacity-0 cursor-pointer"
        />
      )}

      {isEditable && (
        <i className={styles.avatarEdit}>
          <Editicon />
        </i>
      )}
    </figure>
  );
};

export default Avatar;
