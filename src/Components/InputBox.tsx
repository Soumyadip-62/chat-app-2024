import { auth, db, storage } from "@/firebase";
import { useAppSelector } from "@/Redux/hooks";
import { ChatRoom } from "@/Redux/slices/ChatroomSlice";
import ClipIcon from "@/UI/icons/ClipIcon";
import CrossIcon from "@/UI/icons/CrossIcon";
import Sendicon from "@/UI/icons/Sendicon";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import React, {
  ChangeEvent,
  LegacyRef,
  useEffect,
  useRef,
  useState,
} from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface InputBoxProps {
  chatRoomid: string;
}
const InputBox = ({ chatRoomid }: InputBoxProps) => {
  const userdata = useAppSelector((state) => state.rootstate.userdata.user);
  const [inputValue, setinputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<File[] | null>(null);
  const [previews, setPreviews] = useState<string[] | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const handleEmojiSelect = (emoji: any) => {
    setinputValue((prev) => prev + emoji.native);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false); // Close picker if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    if (files) {
      files.forEach((file) => {
        setSelectedImage((prev) => [...(prev || []), file]);
        const fileUrl = URL.createObjectURL(file);
        setPreviews((prev) => [...(prev || []), fileUrl]);
      });
    }
  };
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setinputValue(event.target.value);
  };

  const currentuser = auth.currentUser;

  const handleMessageSubmit = async () => {
    if (!inputValue.trim() && !selectedImage?.length) return; // Prevent empty messages

    const messageRef = collection(db, "messages");

    try {
      let downloadUrls: string[] = [];

      // Upload images if available
      if (selectedImage?.length) {
        const uploadPromises = selectedImage.map(async (file) => {
          const storageRef = ref(storage, `chat_images/${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        });

        downloadUrls = await Promise.all(uploadPromises);
        console.log("Files uploaded:", downloadUrls);
      }

      // Prepare message data
      const messageData: any = {
        text: inputValue,
        senderId: doc(db, "users", userdata?.id),
        timeStamp: Timestamp.now(),
        ...(downloadUrls.length > 0 && { image: downloadUrls }), // Add images only if available
      };

      // Add message to Firestore
      const newMessage = await addDoc(messageRef, messageData);
      console.log("Message sent:", newMessage);

      // Update chatroom with last message
      if (chatRoomid && newMessage.id) {
        const chatroomRef = doc(db, "chatroom", chatRoomid);
        await updateDoc(chatroomRef, {
          messages: arrayUnion(newMessage),
          lastMessage: inputValue.trim() || "📷 Image",
          lastMessageTimeStamp: Timestamp.now(),
        });
      }

      // Reset input fields
      setinputValue("");
      setSelectedImage(null);
      setPreviews(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const handlekeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey) {
      // Add a new line when Shift + Enter is pressed
      event.preventDefault(); // Prevent default Enter behavior
      setinputValue((prevValue) => prevValue + "\n");
    } else if (event.key === "Enter") {
      console.log("Enter key pressed!");

      handleMessageSubmit();
    }
  };

  const handleRemovePreview = (index: number) => {
    const selectedPreview = previews?.filter((_, idx) => idx !== index);
    const selectedImagefiltered = selectedImage?.filter(
      (_, idx) => idx !== index
    );
    setPreviews(selectedPreview!);
    setSelectedImage(selectedImagefiltered!);
  };

  return (
    <div className="relative">
      <div className="flex space-x-2 items-center absolute -top-[100%] left-0">
        {previews &&
          previews.map((preview, index) => (
            <i
              key={index}
              className="w-[60px] h-[60px] overflow-hidden leading-[0] relative"
            >
              <Image
                src={preview}
                alt="preview"
                width={60}
                height={60}
                className="object-cover object-center"
              />

              <button
                className="absolute top-1 right-1"
                onClick={() => handleRemovePreview(index)}
              >
                <CrossIcon />
              </button>
            </i>
          ))}
      </div>
      <div className="w-full flex relative border-2 border-black/30 items-end px-4 py-2.5 rounded-xl h-16">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="self-center text-lg"
        >
          😊 
        </button>

        {/* Emoji Picker Popup */}
        {showEmojiPicker && (
          <div
            className="absolute bottom-12 left-0 z-50"
            ref={emojiPickerRef as React.RefObject<HTMLDivElement>}
          >
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>
        )}
        <div className="relative !cursor-pointer size-11 p-3">
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
            className="absolute size-full opacity-0 top-0 left-0 !cursor-pointer z-50"
            onChange={handleFileChange}
          />
          <ClipIcon />
        </div>
        <textarea
          name="chat_input"
          className="w-full outline-none rounded-xl h-full p-1 resize-none bg-transparent font-medium"
          placeholder="Type a message"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handlekeyDown}
        />
        <button
          className="size-11 min-w-14 flex items-center justify-center bg-[#6E00FF] rounded-lg"
          onClick={handleMessageSubmit}
        >
          <Sendicon />
        </button>
      </div>
    </div>
  );
};

export default InputBox;
