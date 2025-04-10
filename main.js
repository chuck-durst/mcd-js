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
      
      // Filter the items
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
        
        // Parse the date (adjust the format according to your CMS date display)
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
        if (type === 'upcoming') {
          // For upcoming events: dates >= today
          const isUpcoming = eventDate >= today;
          item.props.eventTiming = isUpcoming ? 'upcoming' : '';
          if (isUpcoming) matchingItems++;
          console.log(`   Item #${index}: ${isUpcoming ? '✅ UPCOMING' : '❌ NOT UPCOMING'}`);
        } else if (type === 'past') {
          // For past events: dates < today
          const isPast = eventDate < today;
          item.props.eventTiming = isPast ? 'past' : '';
          if (isPast) matchingItems++;
          console.log(`   Item #${index}: ${isPast ? '✅ PAST' : '❌ NOT PAST'}`);
        }
        
        processedCount++;
      });
      
      console.log(`✅ Processed ${processedCount} items, ${matchingItems} match the "${type}" filter`);
      
      // Apply the filter
      console.log(`🔍 Adding filter: eventTiming = ${type}`);
      filterInstance.addFilters({
        filterKeys: ['eventTiming'],
        values: [type]
      });
      
      console.log('🔄 Filter applied, rendering results...');
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
        addDateFilter('all');
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
    
    // Listen for render events to confirm filtering worked
    filterInstance.listInstance.on('renderitems', (renderedItems) => {
      console.log(`🎯 Rendered ${renderedItems.length} items after filtering`);
    });
    
    console.log('🚀 Date filter setup complete!');
  },
]);