import { useState, useCallback } from "react";
import { connectionRepository } from "../data/connectionRepository";

export function useAdminHome(uid: string | undefined) {
	const [connectionStatus, setConnectionStatus] = useState<string>("");
	const [isChecking, setIsChecking] = useState(false);

	const checkConnection = useCallback(async () => {
		if (!uid) {
			setConnectionStatus("No authenticated user");
			return;
		}

		setIsChecking(true);
		setConnectionStatus("Checking connection...");

		try {
			const result = await connectionRepository.checkConnection(uid);
			setConnectionStatus(result.message);
		} catch (error: any) {
			console.error("Firebase connection error:", error);
			setConnectionStatus(`Connection failed: ${error.message || error.code || "Unknown error"}`);
		} finally {
			setIsChecking(false);
		}
	}, [uid]);

	return {
		connectionStatus,
		isChecking,
		checkConnection,
	};
}
