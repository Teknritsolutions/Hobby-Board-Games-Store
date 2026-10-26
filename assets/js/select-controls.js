(() => {
    let closeOpen = () => {};
    document.querySelectorAll('select').forEach((select, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'select-control';
        select.before(wrapper);
        wrapper.append(select);
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'select-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        const label = select.labels?.[0];
        const text = document.createElement('span');
        text.id = (select.id || 'select-' + index) + '-value';
        trigger.append(text);
        if (label) {
            label.id ||= 'select-label-' + index;
            trigger.setAttribute('aria-labelledby', label.id + ' ' + text.id);
        }
        const list = document.createElement('div');
        list.className = 'select-menu';
        list.id = (select.id || 'select-' + index) + '-options';
        list.setAttribute('role', 'listbox');
        if (label) list.setAttribute('aria-label', label.textContent.trim());
        list.hidden = true;
        trigger.setAttribute('aria-controls', list.id);
        select.tabIndex = -1;
        select.setAttribute('aria-hidden', 'true');
        wrapper.append(trigger, list);
        let active = -1;
        function close() {
            list.hidden = true;
            trigger.setAttribute('aria-expanded', 'false');
            trigger.removeAttribute('aria-activedescendant');
            list.querySelectorAll('.keyboard-active').forEach(o => o.classList.remove('keyboard-active'));
        }
        function sync() {
            text.textContent = select.selectedOptions[0]?.textContent || 'Choose an option';
            trigger.classList.toggle("is-placeholder", select.value === "");
            trigger.disabled = select.disabled;
            trigger.setAttribute('aria-invalid', select.getAttribute('aria-invalid') || 'false');
            if (select.hasAttribute('aria-describedby')) trigger.setAttribute('aria-describedby', select.getAttribute('aria-describedby'));
            list.replaceChildren();
            [...select.options].forEach((option, optionIndex) => {
                const item = document.createElement('div');
                item.className = 'select-option';
                item.id = list.id + '-' + optionIndex;
                item.setAttribute('role', 'option');
                item.setAttribute('aria-selected', String(option.selected));
                item.setAttribute('aria-disabled', String(option.disabled));
                item.textContent = option.textContent;
                item.addEventListener('click', () => choose(optionIndex));
                list.append(item);
            });
        }
        function open() {
            closeOpen();
            sync();
            list.hidden = false;
            trigger.setAttribute('aria-expanded', 'true');
            closeOpen = close;
            active = select.selectedIndex;
        }
        function choose(i) {
            if (!select.options[i] || select.options[i].disabled) return;
            select.selectedIndex = i;
            select.dispatchEvent(new Event('input', { bubbles: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
            sync();
            close();
            trigger.focus();
        }
        function highlight(i) {
            active = i;
            [...list.children].forEach((item, n) => item.classList.toggle('keyboard-active', n === i));
            if (list.children[i]) {
                trigger.setAttribute('aria-activedescendant', list.children[i].id);
                list.children[i].scrollIntoView({block:'nearest'});
            }
        }
        trigger.addEventListener('click', () => list.hidden ? open() : close());
        trigger.addEventListener('keydown', event => {
            const key = event.key;
            if (key === 'Escape' || key === 'Tab') { close(); return; }
            if (key === 'Enter' || key === ' ') {
                event.preventDefault();
                if (list.hidden) open(); else choose(active);
                return;
            }
            if (['ArrowDown','ArrowUp','Home','End'].includes(key)) {
                event.preventDefault();
                if (list.hidden) open();
                const enabled = [...select.options].map((o,i)=>o.disabled ? -1 : i).filter(i=>i>=0);
                const position = enabled.indexOf(active);
                const next = key === 'Home' ? enabled[0] : key === 'End' ? enabled.at(-1) : enabled[Math.max(0,Math.min(enabled.length-1,position+(key==='ArrowDown'?1:-1)))];
                if (next !== undefined) highlight(next);
            }
        });
        document.addEventListener('click', event => { if (!wrapper.contains(event.target)) close(); });
        select.addEventListener('change', sync);
        select.addEventListener('focus', () => trigger.focus());
        select.form?.addEventListener('reset', () => setTimeout(() => { sync(); close(); }, 0));
        new MutationObserver(sync).observe(select, {childList:true,subtree:true,attributes:true,attributeFilter:['disabled','aria-invalid','aria-describedby']});
        sync();
    });
})();
