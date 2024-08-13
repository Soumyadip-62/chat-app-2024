import Image from "next/image";
import React from "react";

type AvatarProps = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
};

const Avatar = ({ alt, size, src, className }: AvatarProps) => {
  return (
    <figure className={`${size ?  `min-w-[${size}px]` : 'min-w-[48px]'} ${size ?  `size-[${size}px]` : 'size-[48px]'} overflow-hidden rounded-full border-[3px]`}>
      <Image src={src} alt={alt} width={size || 48} height={size || 48} className="size-full object-cover"/>
    </figure>
  );
};

export default Avatar;
