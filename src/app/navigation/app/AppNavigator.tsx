import { useAuthSession } from "../../../features/auth/state/authSession";
import AdminStack from "../AdminStack";
import UserStack from "../UserStack";

export default function AppNavigator() {
  const { user } = useAuthSession();
  if (!user) return null;

  return user.role === "admin" ? <AdminStack /> : <UserStack />;
}