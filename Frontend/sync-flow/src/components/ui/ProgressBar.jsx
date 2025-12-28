import { LinearProgress } from "@mui/material";
import Box from '@mui/material/Box';
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function ProgressBar({ apiLoading = false }) {
  const location = useLocation();
  const [routeLoading, setRouteLoading] = useState(false);
  const [buffer, setBuffer] = useState(10);
  const progressRef = useRef(() => {});
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    progressRef.current = () => {
      if (progress === 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        setProgress(progress + 1);
        if (buffer < 100 && progress % 5 === 0) {
          const newBuffer = buffer + 1 + Math.random() * 10;
          setBuffer(newBuffer > 100 ? 100 : newBuffer);
        }
      }
    };
  });

   useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setRouteLoading(true);
    const timer = setTimeout(() => setRouteLoading(false), 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const loading = apiLoading || routeLoading;
  if (!loading) return null;

 
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <Box sx={{ width: '100%' }}>

    <LinearProgress
    variant="buffer" 
    value={progress}
     valueBuffer={buffer}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 3,
        zIndex: 9999,
        "& .MuiLinearProgress-bar": {
          background: isDark
          ? "linear-gradient(90deg, #0f2a4d, #1c3b6f, #3456a1)"
          : "linear-gradient(90deg, #3456a1CC, #1c3b6fCC, #0f2a4dCC)", 
},
backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)", // subtle track color
}}
/>
</Box>
  );
}
