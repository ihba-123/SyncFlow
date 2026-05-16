import { useEffect, useRef, useState } from "react";

const HEALTHCHECK_URL = import.meta.env.VITE_BACKEND_HEALTHCHECK_URL || "http://localhost:8000/api/schema/";

export const useBackendAvailability = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const check = async () => {
      try {
        const response = await fetch(HEALTHCHECK_URL, {
          method: "GET",
          cache: "no-store",
        });

        if (mountedRef.current) {
          setIsAvailable(response.ok);
        }
      } catch {
        if (mountedRef.current) {
          setIsAvailable(false);
        }
      } finally {
        if (mountedRef.current) {
          setIsChecking(false);
        }
      }
    };

    check();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { isAvailable, isChecking };
};

export default useBackendAvailability;
