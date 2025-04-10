// Initialize the Attributes array if it doesn't exist
window.fsAttributes = window.fsAttributes || [];

// Push the cmsfilter callback
window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    console.log('🔍 cmsfilter Successfully loaded!');
    console.log('📊 Number of filter instances found:', filterInstances.length);
    
    // Get the first filter instance
    const [filterInstance] = filterInstances;
    console.log('🔧 Working with filter instance:', filterInstance);
    console.log('📝 Items in list:', filterInstance.listInstance.items.length);
    
    // Log available methods on filterInstance for debugging
    console.log('Available methods on filterInstance:', Object.getOwnPropertyNames(Object.getPrototypeOf(filterInstance)));
    
    // Function to add the custom date filter
    const addDateFilter = (type) => {
      console.log(`🗓️ Applying ${type} date filter`);
      
      // Remove previous event timing filter if any
      console.log('🧹 Removing previous eventTiming filters');
      filterInstance.resetFilters(['eventTiming']);
      
      // If we're showing all events, we just reset and don't add a new filter
      if (type === 'all') {
        console.log('👀 Showing all events (no date filtering)');
        return;
      }
      
      // Add the custom filter for date comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      console.log('📅 Today date (normalized):', today);
      
      // Process all items and apply custom properties
      console.log('🔄 Processing items for date comparison...');
      let processedCount = 0;
      let matchingItems = 0;
      
      filterInstance.listInstance.items.forEach((item, index) => {
        // Get the date element from the item's element
        const eventDateElement = item.element.querySelector('.event-date-field');
        if (!eventDateElement) {
          console.warn(`⚠️ Item #${index} is missing .event-date-field element!`);
          return;
        }
        
        // Parse the date
        const eventDateString = eventDateElement.textContent.trim();
        const eventDate = new Date(eventDateString);
        eventDate.setHours(0, 0, 0, 0);
        
        console.log(`📌 Item #${index}: Date string "${eventDateString}" parsed as:`, eventDate);
        
        // Check if date parsing was successful
        if (isNaN(eventDate.getTime())) {
          console.error(`❌ Failed to parse date for item #${index}. Text content was: "${eventDateString}"`);
          return;
        }
        
        // Set the property we'll filter on
        let isMatching = false;
        if (type === 'upcoming') {
          // For upcoming events: dates >= today
          isMatching = eventDate >= today;
          console.log(`   Item #${index}: ${isMatching ? '✅ UPCOMING' : '❌ NOT UPCOMING'}`);
        } else if (type === 'past') {
          // For past events: dates < today
          isMatching = eventDate < today;
          console.log(`   Item #${index}: ${isMatching ? '✅ PAST' : '❌ NOT PAST'}`);
        }
        
        // This is the key difference: manually change the item's display state
        if (!isMatching) {
          item.hide();
        } else {
          item.show();
          matchingItems++;
        }
        
        processedCount++;
      });
      
      console.log(`✅ Processed ${processedCount} items, ${matchingItems} match the "${type}" filter`);
      console.log('🔄 Filter applied manually by showing/hiding items');
    };
    
    // Add event listeners to the filter buttons
    const upcomingButton = document.querySelector('#upcoming-events-button');
    const pastButton = document.querySelector('#past-events-button');
    const allButton = document.querySelector('#all-events-button');
    
    if (upcomingButton) {
      console.log('🔘 Found upcoming button, adding event listener');
      upcomingButton.addEventListener('click', () => {
        console.log('👆 Upcoming button clicked');
        addDateFilter('upcoming');
      });
    } else {
      console.warn('⚠️ Upcoming button not found (#upcoming-events-button)');
    }
    
    if (pastButton) {
      console.log('🔘 Found past button, adding event listener');
      pastButton.addEventListener('click', () => {
        console.log('👆 Past button clicked');
        addDateFilter('past');
      });
    } else {
      console.warn('⚠️ Past button not found (#past-events-button)');
    }
    
    if (allButton) {
      console.log('🔘 Found all button, adding event listener');
      allButton.addEventListener('click', () => {
        console.log('👆 All button clicked');
        // For "all" we need to show all items
        filterInstance.listInstance.items.forEach(item => {
          item.show();
        });
        // Make sure to reset any existing filters
        filterInstance.resetFilters();
      });
    } else {
      console.warn('⚠️ All button not found (#all-events-button)');
    }
    
    // Alternative: For select dropdown
    const timingSelect = document.querySelector('#event-timing-select');
    if (timingSelect) {
      console.log('🔘 Found timing select, adding event listener');
      timingSelect.addEventListener('change', function() {
        console.log(`👆 Select changed to: ${this.value}`);
        addDateFilter(this.value);
      });
    } else {
      console.log('ℹ️ Timing select not found (#event-timing-select) - assuming you are using buttons');
    }
    
    console.log('🚀 Date filter setup complete!');
  },
]);