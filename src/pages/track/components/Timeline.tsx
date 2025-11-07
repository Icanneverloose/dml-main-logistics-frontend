import React from 'react';
import { CheckCircleIcon } from '../../../components/icons/CheckCircleIcon';
import { CircleDotIcon } from '../../../components/icons/CircleDotIcon';

interface TimelineEvent {
  status: string;
  location: string;
  date: string;
  time: string;
  completed: boolean;
  note?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No timeline data available.</p>
      </div>
    );
  }

  // Format date and time together to match image format: "Month Day, Year, HH:MM AM/PM"
  const formatDateTime = (date: string, time: string) => {
    try {
      // First, check if date is an ISO timestamp (contains 'T' or 'Z' or matches ISO pattern)
      if (date && (date.includes('T') || date.includes('Z') || date.match(/^\d{4}-\d{2}-\d{2}/))) {
        const isoDate = new Date(date);
        if (!isNaN(isoDate.getTime())) {
          // Use toLocaleString to get both date and time in one call
          // new Date() correctly parses UTC timestamps and toLocaleString converts to local time
          return isoDate.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
        }
      }
      
      // Fallback: try combining date and time strings (only if time is not empty)
      if (time && time.trim() !== '') {
        const dateObj = new Date(`${date} ${time}`);
        if (!isNaN(dateObj.getTime())) {
          const options: Intl.DateTimeFormatOptions = {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          };
          return dateObj.toLocaleDateString('en-US', options);
        }
      }
      
      // If only date is provided, format it
      if (date && date !== 'N/A') {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
        }
      }
      
      return time ? `${date} at ${time}` : date || 'N/A';
    } catch (error) {
      console.error('Error formatting date/time:', error, { date, time });
      return time ? `${date} at ${time}` : date || 'N/A';
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => {
          const isLast = eventIdx === events.length - 1;
          const nextEvent = !isLast ? events[eventIdx + 1] : null;
          
          // Determine connector line color:
          // - Green if current event is completed AND next event is also completed
          // - Grey if current event is pending OR next event is pending
          const connectorColor = (event.completed && nextEvent?.completed)
            ? 'bg-green-500'
            : 'bg-gray-300';

          return (
            <li key={eventIdx}>
              <div className="relative pb-8">
                {/* Vertical connector line - only show if not last item */}
                {!isLast && (
                  <span 
                    className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${connectorColor}`}
                    aria-hidden="true" 
                  />
                )}
                
                <div className="relative flex items-start space-x-3">
                  {/* Icon container */}
                  <div className="flex-shrink-0">
                    {event.completed ? (
                      <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      </span>
                    ) : (
                      <span className="h-8 w-8 rounded-full bg-white flex items-center justify-center ring-2 ring-gray-200">
                        <CircleDotIcon className="h-5 w-5 text-gray-500" />
                      </span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="min-w-0 flex-1 pt-1.5">
                    {/* Status title - dark text for both completed and pending */}
                    <p className="text-sm text-gray-900 font-medium">
                      {event.status}
                    </p>
                    
                    {/* Location - bold and dark */}
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {event.location}
                    </p>
                    
                    {/* Date/time - small and grey */}
                    <p className="mt-1 text-xs text-gray-500">
                      {formatDateTime(event.date, event.time)}
                    </p>
                    
                    {/* Optional note */}
                    {event.note && (
                      <p className="mt-1 text-xs text-gray-500 italic">
                        {event.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Timeline;


