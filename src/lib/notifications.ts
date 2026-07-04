import { messaging, db } from "@/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { doc, updateDoc } from "firebase/firestore";

// The VAPID key generated from Firebase Console
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "BHn5Fk221Kk-4w7qH012aF8V5p1B_mZ1tD4L18q5K8Z2oD_eJ8w7H-8m6tD1aP7y3c8T4y1K4q5N8X7c4z2t1o"; // Fallback placeholder or user key

export async function requestNotificationPermission(userId: string) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.log("This browser does not support notifications.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const msgInstance = await messaging();
      if (!msgInstance) {
        console.warn("Firebase Messaging is not supported on this browser.");
        return;
      }

      // Fetch the registration token
      const token = await getToken(msgInstance, { vapidKey: VAPID_KEY });
      if (token) {
        console.log("FCM Token retrieved successfully:", token);
        
        // Save token to Firestore user document
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          fcmToken: token,
          updatedAt: new Date()
        });
      } else {
        console.warn("No registration token available. Request permission to generate one.");
      }
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("An error occurred while requesting permission or fetching token:", error);
  }
}

export async function setupForegroundListener() {
  if (typeof window === "undefined") return;

  try {
    const msgInstance = await messaging();
    if (!msgInstance) return;

    // Listen for incoming messages in the foreground
    onMessage(msgInstance, (payload) => {
      console.log("Foreground message received:", payload);
      
      // Display a native notification if permission is granted
      if (Notification.permission === "granted") {
        new Notification(payload.notification?.title || "New Message", {
          body: payload.notification?.body || "You have a new message.",
          icon: "/logo.png"
        });
      }
    });
  } catch (error) {
    console.error("Error setting up foreground message listener:", error);
  }
}
