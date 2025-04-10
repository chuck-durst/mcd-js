window.addEventListener('load', () => {
    Array.from(document.querySelector('.collection_list_agenda').children).forEach(child => {
        const dateEl = child.querySelector('.event-date-field');
    
        if (dateEl) {
            const date = new Date(dateEl.textContent);
            const isPast  = date < new Date();
    
            const pastEl = document.createElement('div');

            pastEl.classList.add('item-is-past');
            pastEl.setAttribute('fs-cmsfilter-field', "isPast");
            pastEl.textContent = isPast ? 'archive' : 'à venir';

            child.appendChild(pastEl);
        }
    })
});