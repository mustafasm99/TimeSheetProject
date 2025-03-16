export function formatTime(seconds: number) {
     const hours = Math.floor(seconds / 3600);
     const minutes = Math.floor((seconds % 3600) / 60);
     const sec = seconds % 60;
     return `${hours.toString().padStart(2, "0")}:${minutes
       .toString()
       .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
   }