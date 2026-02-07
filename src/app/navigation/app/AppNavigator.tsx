import { useAuthSession } from "../../../features/auth/state/authSession";
import AdminStack from "../AdminStack";
import UserStack from "../UserStack";

export default function AppNavigator() {
  const { user, deviceMode } = useAuthSession();
  if (!user) return null;

  if (!deviceMode) return null;

  return deviceMode === "caregiver" ? <AdminStack /> : <UserStack />;
}
