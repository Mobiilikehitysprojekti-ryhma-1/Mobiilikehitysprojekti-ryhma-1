import { getApps } from "firebase/app";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../shared/firebase/firebaseClient";

export const connectionRepository = {
	async checkConnection(uid: string): Promise<{ success: boolean; message: string }> {
		// 1. Check if Firebase app is initialized
		const apps = getApps();
		if (apps.length === 0) {
			return {
				success: false,
				message: "Firebase app not initialized",
			};
		}

		// 2. Test Firestore connection by reading from user's own path
		const userTestDocRef = doc(db, `users/${uid}/schedules/meals`);

		try {
			// Read test (this should work if rules allow reading own data)
			await getDoc(userTestDocRef);
			return {
				success: true,
				message: "Firebase connection successful! (Read test passed)",
			};
		} catch (readError: any) {
			// If read fails due to permissions, try a write test to user's own path
			if (readError.code === "permission-denied") {
				try {
					// Try writing to user's own path (should be allowed by security rules)
					const testData = {
						items: {
							breakfast: { label: "Test", time: "00:00" },
							lunch: { label: "Test", time: "00:00" },
							dinner: { label: "Test", time: "00:00" },
							supper: { label: "Test", time: "00:00" },
						},
						updatedAt: new Date().toISOString(),
						_connectionTest: true,
					};

					await setDoc(userTestDocRef, testData, { merge: true });
					return {
						success: true,
						message: "Firebase connection successful! (Write test passed)",
					};
				} catch (writeError: any) {
					if (writeError.code === "permission-denied") {
						return {
							success: false,
							message: `Permission denied. Check Firestore security rules allow authenticated users to access their own data at: users/{userId}/schedules/meals`,
						};
					}
					throw writeError;
				}
			}
			throw readError;
		}
	},
};
