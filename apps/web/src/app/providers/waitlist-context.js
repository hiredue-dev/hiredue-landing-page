import { createContext, useContext } from "react";

const WaitlistContext = createContext(null);

export const useWaitlist = () => {
  const context = useContext(WaitlistContext);

  if (!context) {
    throw new Error("useWaitlist must be used within WaitlistProvider");
  }

  return context;
};

export default WaitlistContext;
