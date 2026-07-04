import { auth, db } from "@/firebase";
import { useAppSelector } from "@/Redux/hooks";
import { ChatRoom } from "@/Redux/slices/ChatroomSlice";
import { Paperclip, X, Send } from "lucide-react";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  Timestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import axios from "axios";
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
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
          console.error("Cloudinary credentials are not configured.");
          alert("Cloudinary credentials are not configured. Please add them to your env file.");
          return;
        }

        const uploadPromises = selectedImage.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData
          );
          return res.data.secure_url;
        });

        downloadUrls = await Promise.all(uploadPromises);
        console.log("Files uploaded to Cloudinary:", downloadUrls);
      }

      // Prepare message data
      const messageData: any = {
        text: inputValue,
        senderId: doc(db, "users", userdata?.id || userdata?.uid),
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

        // Trigger push notification to recipient
        try {
          const chatRoomSnap = await getDoc(chatroomRef);
          if (chatRoomSnap.exists()) {
            const chatRoomData = chatRoomSnap.data();
            const recipientRef = chatRoomData?.users?.find(
              (u: any) => u.id !== (userdata?.id || userdata?.uid),
            );
            if (recipientRef) {
              const recipientSnap = await getDoc(recipientRef);
              if (recipientSnap.exists()) {
                const recipientData = recipientSnap.data() as any;
                const fcmToken = recipientData?.fcmToken;
                if (fcmToken) {
                  await axios.post("/api/send-notification", {
                    token: fcmToken,
                    title: userdata?.name || "New Message",
                    body: inputValue.trim() || "Sent an image",
                    data: {
                      chatRoomId: chatRoomid,
                      senderId: userdata?.id || userdata?.uid,
                    },
                  });
                  console.log("Push notification sent successfully.");
                }
              }
            }
          }
        } catch (notifError) {
          console.warn("Failed to send push notification:", notifError);
        }
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
      (_, idx) => idx !== index,
    );
    setPreviews(selectedPreview!);
    setSelectedImage(selectedImagefiltered!);
  };

  return (
    <div className="relative mt-4">
      <div className="flex space-x-2 items-center absolute -top-[68px] left-0 bg-slate-950/80  rounded-xl border border-white/5 backdrop-blur-md z-30">
        {previews &&
          previews.map((preview, index) => (
            <i
              key={index}
              className="w-[50px] h-[50px] rounded-lg overflow-hidden leading-[0] relative border border-white/10"
            >
              <Image
                src={preview}
                alt="preview"
                width={50}
                height={50}
                className="object-cover object-center w-full h-full"
              />

              <button
                className="absolute top-0.5 right-0.5 bg-black/60 text-white hover:text-red-400 rounded-full p-0.5 transition-colors duration-200"
                onClick={() => handleRemovePreview(index)}
              >
                <X size={14} />
              </button>
            </i>
          ))}
      </div>
      <div className="w-full flex relative border border-white/10 bg-white/5 items-center px-4 py-2 rounded-2xl h-14 backdrop-blur-md shadow-inner transition-all duration-300 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="self-center text-lg hover:scale-110 active:scale-95 transition-transform duration-200 p-1 mr-1 text-gray-400 hover:text-white"
        >
          😊
        </button>

        {/* Emoji Picker Popup */}
        {showEmojiPicker && (
          <div
            className="absolute bottom-16 left-0 z-50 shadow-2xl border border-white/10 rounded-2xl overflow-hidden"
            ref={emojiPickerRef as React.RefObject<HTMLDivElement>}
          >
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="dark"
            />
          </div>
        )}
        <div className="relative size-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer mr-2 shrink-0">
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
            className="absolute size-full opacity-0 top-0 left-0 cursor-pointer z-50"
            onChange={handleFileChange}
          />
          <Paperclip size={20} />
        </div>
        <textarea
          name="chat_input"
          className="w-full outline-none text-white text-sm bg-transparent placeholder:text-gray-500 py-1.5 resize-none h-8 font-medium overflow-y-auto align-middle flex items-center pr-2"
          placeholder="Type a message"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handlekeyDown}
        />
        <button
          className="size-9 min-w-9 flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-violet-950/20 shrink-0"
          onClick={handleMessageSubmit}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default InputBox;
