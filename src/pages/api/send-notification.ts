import type { NextApiRequest, NextApiResponse } from "next";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

// Initialize firebase-admin if not already initialized
if (getApps().length === 0) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID || "chat-2024-6897a";

  if (serviceAccountKey && serviceAccountKey.trim().startsWith("{")) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log("Firebase Admin initialized successfully via service account key.");
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY environment variable:", e);
    }
  } else if (privateKey && clientEmail) {
    try {
      const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: formattedPrivateKey,
        })
      });
      console.log("Firebase Admin initialized successfully via individual environment variables.");
    } catch (e) {
      console.error("Failed to initialize Firebase Admin via individual variables:", e);
    }
  } else {
    // Attempt default initialization (e.g. if GCP environment credentials are set)
    try {
      initializeApp();
      console.log("Firebase Admin initialized via default credentials.");
    } catch (e) {
      console.warn(
        "Firebase Admin could not be initialized automatically. " +
        "Please configure the FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL environment variables."
      );
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { token, title, body, data } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Missing recipient device registration token." });
  }

  // Ensure Admin SDK is ready
  if (getApps().length === 0) {
    return res.status(503).json({
      error: "Firebase Admin is uninitialized. Configure FIREBASE_SERVICE_ACCOUNT_KEY."
    });
  }

  try {
    const payload = {
      notification: {
        title: title || "New Message",
        body: body || "You received a new message."
      },
      token: token,
      data: data ? Object.entries(data).reduce((acc, [key, val]) => {
        acc[key] = String(val);
        return acc;
      }, {} as Record<string, string>) : {}
    };

    const messaging = getMessaging();
    const response = await messaging.send(payload);
    return res.status(200).json({ success: true, messageId: response });
  } catch (error: any) {
    console.error("FCM Send Error:", error);
    return res.status(500).json({ error: "Failed to send notification", details: error.message });
  }
}
