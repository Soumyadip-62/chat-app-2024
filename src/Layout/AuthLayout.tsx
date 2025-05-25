import { auth, db } from '@/firebase';
import { addUser } from '@/Redux/slices/UserSlice';
import GoogleIcon from '@/UI/icons/GoogleIcon'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import Cookies from 'universal-cookie';
import { useDispatch } from 'react-redux';

const AuthLayout = ({children}:{children:React.ReactNode}) => {

    const cookies = new Cookies();
  const [issignUp, setissignUp] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter()
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);

      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      console.log("Users list - - - - -", userDoc);

      dispatch(
        addUser({
          avatar: result.user.photoURL!,
          email: result.user.email!,
          uid: result.user.uid!,
          name: result.user.displayName!,
          token: result.user.refreshToken,
        })
      );
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
          createdAt: new Date(),
        });

        
        router.push('/')
        cookies.set("user-token", {
          token: result.user.refreshToken,
        });
      } else {
        cookies.set("user-token", {
          token: result.user.refreshToken,
        });
        cookies.set("user", {
          avatar: result.user.photoURL!,
          email: result.user.email!,
          id: result.user.uid!,
          name: result.user.displayName!,
        });
        router.push('/')

      }
    } catch (error) {
      console.error(error);
    }
  };

  
  return (
    <div className="size-full flex justify-center items-center py-10">
      <div className="login_card max-w-[650px] w-full">
{children}

<button
          className="custom-button !bg-white !text-black"
          onClick={signInWithGoogle}
        >
          <i className="mr-2">
            <GoogleIcon />
          </i>{" "}
          Login with Google
        </button>
        </div>
        </div>
  )
}

export default AuthLayout
