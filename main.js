window.addEventListener('load', () => {
    Array.from(document.querySelector('.collection_list_agenda').children).forEach(child => {
        const dateEl = child.querySelector('.event-date-field');
    
        if (dateEl) {
            console.log('?', dateEl);
            const date = new Date(dateEl.textContent);
            const isPast  = date < new Date();
    
            const pastEl = document.createElement('div');

            pastEl.classList.add('item-is-past');
            pastEl.textContent = isPast ? 'past' : 'future';

            child.appendChild(pastEl);
        }
    })
});