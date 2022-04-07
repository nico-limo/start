import { useState } from "react";

const useLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const loadOn = () => setIsLoading(true);
  const loadOff = () => setIsLoading(false);
  return { isLoading, loadOn, loadOff };
};

export default useLoader;
