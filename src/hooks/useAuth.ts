import { useEffect } from "react";
import { auth } from "../backend/firebase";

const useAuth = (setUserId: (id: string) => void) => {
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser != null) setUserId(currentUser.uid);
  }, [setUserId]);
};

export default useAuth;
