window.addEventListener('load', () => {
    function setItemsPastAttribute() {
      Array.from(document.querySelector('.collection_list_agenda').children).forEach(child => {
        const dateEl = child.querySelector('.event-date-field');
  
        if (dateEl) {
          child.querySelector('.item-is-past')?.remove();
  
          const date = new Date(dateEl.textContent);
          const isPast = date < new Date();
  
          const pastEl = document.createElement('div');
  
          pastEl.classList.add('item-is-past');
          pastEl.setAttribute('fs-cmsfilter-field', 'isPast');
          pastEl.textContent = isPast ? 'archive' : 'à venir';
  
          child.appendChild(pastEl);
        }
      });
    }
  
  
    setItemsPastAttribute();
  
    const observer = new MutationObserver(setItemsPastAttribute);
  
    observer.observe(document.querySelector('.collection_list_agenda'), {
      childList: true,
      subtree: true,
    });
  });