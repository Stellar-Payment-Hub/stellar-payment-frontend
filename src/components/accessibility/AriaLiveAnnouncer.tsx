import React from 'react';

export const AriaLiveAnnouncer: React.FC<{ announcement: string }> = ({ announcement }) => {
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only" data-testid="aria-live-announcer">
      {announcement}
    </div>
  );
};
