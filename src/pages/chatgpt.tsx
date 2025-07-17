import { assets } from '@/assets'
import ChatBody from '@/Components/ChatBody'
import ChatHeader from '@/Components/ChatHeader'
import InputBox from '@/Components/InputBox'
import Layout from '@/Layout/Index'
import ClipIcon from '@/UI/icons/ClipIcon'
import Sendicon from '@/UI/icons/Sendicon'
import React from 'react'

const chatgpt = () => {
    return (
        <Layout>
            <div className={`px-10 py-5 h-[calc(100vh-62px)] lg:p-0`}>
                <ChatHeader id='34' avatar={assets.chatgpt} name='ChatGPT' email='How can I help you today?' />
                <ChatBody messageList={[]} />

                <div className="relative">
                    <div className="w-full flex relative border-2 border-black/30 items-end px-4 py-2.5 rounded-xl h-16">


                        {/* Emoji Picker Popup */}

                        {/* <div className="relative !cursor-pointer size-11 p-3">
                            <input
                                type="file"
                                multiple
                                accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                                className="absolute size-full opacity-0 top-0 left-0 !cursor-pointer z-50"
                            // onChange={handleFileChange}
                            />
                            <ClipIcon />
                        </div> */}
                        <textarea
                            name="chat_input"
                            className="w-full outline-none rounded-xl h-full p-1 resize-none bg-transparent font-medium"
                            placeholder="Type a message"
                        //   value={inputValue}
                        //   onChange={handleChange}
                        //   onKeyDown={handlekeyDown}
                        />
                        <button
                            className="size-11 min-w-14 flex items-center justify-center bg-[#6E00FF] rounded-lg"
                        //   onClick={handleMessageSubmit}
                        >
                            <Sendicon />
                        </button>
                    </div>
                </div>

                {/* <InputBox chatRoomid='34' /> */}
            </div>
        </Layout>
    )
}

export default chatgpt
