export default function GetDateString(dateString:string){
     const todayDate = new Date()
     
     const date = new Date(dateString)
     const day = date.getDate()
     const month = date.getMonth()
     const year = date.getFullYear()

     if(todayDate.getDate() === day && todayDate.getMonth() === month && todayDate.getFullYear() === year){
          return "Today"
     }
     if(todayDate.getDate() === day + 1 && todayDate.getMonth() === month && todayDate.getFullYear() === year){
          return "Tomorrow"
     }
     if(todayDate.getDate() === day - 1 && todayDate.getMonth() === month && todayDate.getFullYear() === year){
          return "Yesterday"
     }
     return `${day}/${month}/${year}`
}