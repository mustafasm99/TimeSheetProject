import { useEffect, useState, forwardRef } from "react";
import { differenceInDays, parseISO } from "date-fns";

interface MultiDayEventProps {
  startDate: string;
  endDate: string;
  title: string;
}

const MultiDayEvent = forwardRef<HTMLDivElement, MultiDayEventProps>(
  ({ startDate, endDate, title }, ref) => {
    const [left, setLeft] = useState(0);
    const [width, setWidth] = useState(0);
    console.log(ref);
    useEffect(() => {
      if (ref && "current" in ref && ref.current) {
        const rect = ref.current.getBoundingClientRect();
     //    setLeft(rect.left);
        const daysSpan = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
        setWidth(daysSpan * rect.width);
      }
    }, [ref, startDate, endDate]);

    return (
      <div
        className="absolute bg-blue-200 text-sm p-1 rounded text-center"
        style={{
          left: `${left}px`,
          width: `${width}px`,
        }}
      >
        {title}
      </div>
    );
  }
);

export default MultiDayEvent;
