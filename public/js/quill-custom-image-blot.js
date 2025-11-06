const Module = Quill.import('core/module');
const BlockEmbed = Quill.import('blots/block/embed');

class FigureBlot extends BlockEmbed {
  static blotName = 'figure';
  static tagName = 'figure';
  static className = 'ql-card-figure';

  static create(value) {
    const node = super.create();
    node.setAttribute('contenteditable', false);
    node.classList.add('ql-card-editable');
    node.style.position = 'relative';

    const img = document.createElement('img');
    img.draggable = false;
    if (typeof value === 'string') {
      img.setAttribute('src', value);
    } else {
      if (value.src) img.setAttribute('src', value.src);
      if (value.alt) img.setAttribute('alt', value.alt);
      if (value.width) img.style.width = value.width;
    }
    img.style.display = 'block';
    img.style.maxWidth = '100%';
    node.appendChild(img);

    // resize handle
    const handle = document.createElement('div');
    handle.className = 'ql-img-resize-handle';
    node.appendChild(handle);

    // resizing logic
    let startX = 0;
    let startW = 0;
    let dragging = false;

    function onMove(e) {
      if (!dragging) return;
      const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
      const dx = clientX - startX;
      const newW = Math.max(32, startW + dx);
      img.style.width = `${newW}px`;
      img.setAttribute('data-width', `${newW}px`);
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      // keep width on the image; Quill will include it in innerHTML when serializing
      img.setAttribute('data-width', img.style.width || '');
    }

    handle.addEventListener('mousedown', (evt) => {
      evt.preventDefault();
      dragging = true;
      startX = evt.clientX;
      startW = img.getBoundingClientRect().width;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    handle.addEventListener('touchstart', (evt) => {
      evt.preventDefault();
      dragging = true;
      startX = evt.touches[0].clientX;
      startW = img.getBoundingClientRect().width;
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    });

    return node;
  }

  static value(node) {
    const img = node.querySelector('img');
    const figcaption = node.querySelector('figcaption');
    return {
      src: img ? img.getAttribute('src') : null,
      alt: img ? img.getAttribute('alt') : null,
      caption: figcaption ? figcaption.innerText : null,
      width: img ? (img.style.width || img.getAttribute('data-width') || null) : null
    };
  }
}

class CardEditableModule extends Module {
  constructor(quill, options) {
    super(quill, options);
    const listener = (e) => {
      // remove listener if editor gone
      if (!document.body.contains(quill.root)) {
        return document.body.removeEventListener('click', listener);
      }
      const elm = e.target.closest && e.target.closest('.ql-card-editable');
      if (!elm) return;

      if (elm.__onSelect) {
        // temporarily disable editor while editing card
        quill.disable();
        elm.__onSelect(quill);

        const handleFinish = () => {
          quill.enable(true);
          window.removeEventListener('keydown', onKey);
          window.removeEventListener('click', onClickOutside);
        };

        const onKey = (ev) => {
          if (ev.key === 'Escape' || ev.key === 'Enter') handleFinish();
        };
        const onClickOutside = (ev) => {
          if (!elm.contains(ev.target)) handleFinish();
        };

        window.addEventListener('keydown', onKey);
        window.addEventListener('click', onClickOutside);
      }
    };
    // listen on document body
    document.body.addEventListener('click', listener);
  }
}

// register blot and module
Quill.register({
  'formats/figure': FigureBlot,
  'modules/cardEditable': CardEditableModule
}, true);