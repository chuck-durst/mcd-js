// Add this code to your page's custom code section
document.addEventListener('DOMContentLoaded', function() {
    // Make sure Attributes library is loaded
    if (typeof $attributes !== 'undefined') {
      // Register a custom filter function
      $attributes.filters.addFilterFunction('eventTiming', function(item, filter) {
        // Get the event date from the item
        // Note: Update the selector to match your CMS date field
        const eventDateElement = item.querySelector('.event-date-field');
        if (!eventDateElement) return true; // If no date field found, show the item
        
        // Parse the date from your element (adjust format as needed)
        const eventDateString = eventDateElement.textContent.trim();
        const eventDate = new Date(eventDateString);
        const today = new Date();
        
        // Set time to 00:00:00 for both dates to compare just the dates
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        
        if (filter === 'upcoming') {
          // Show items with dates >= today
          return eventDate >= today;
        } else if (filter === 'past') {
          // Show items with dates < today
          return eventDate < today;
        } else {
          // If filter is 'all' or undefined, show everything
          return true;
        }
      });
      
      // Initialize when Attributes is ready
      document.addEventListener('attributes:ready', function() {
        // Now connect your UI controls to this filter
        
        // Option 1: If using toggle buttons
        const upcomingButton = document.querySelector('#upcoming-events-button');
        const pastButton = document.querySelector('#past-events-button');
        const allButton = document.querySelector('#all-events-button');
        
        if (upcomingButton) {
          upcomingButton.addEventListener('click', function() {
            $attributes.filters.addFilter('eventTiming', 'upcoming');
            $attributes.filters.apply();
          });
        }
        
        if (pastButton) {
          pastButton.addEventListener('click', function() {
            $attributes.filters.addFilter('eventTiming', 'past');
            $attributes.filters.apply();
          });
        }
        
        if (allButton) {
          allButton.addEventListener('click', function() {
            $attributes.filters.removeFilter('eventTiming');
            $attributes.filters.apply();
          });
        }
        
        // Option 2: If using a select element
        const timingSelect = document.querySelector('#event-timing-select');
        if (timingSelect) {
          timingSelect.addEventListener('change', function() {
            const value = this.value;
            if (value === 'all') {
              $attributes.filters.removeFilter('eventTiming');
            } else {
              $attributes.filters.addFilter('eventTiming', value);
            }
            $attributes.filters.apply();
          });
        }
      });
    }
  });