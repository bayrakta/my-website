import {
  createElement,
  createOptimizedPicture,
} from '../../scripts/aem.js';

export default async function decorate(block) {
  const blockName = 'cards';

  // fetch placeholders from the 'en' folder
  // const placeholders = await fetchPlaceholders('default');
  // const { clickHereForMore } = placeholders;

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = `${blockName}-card-image`;
      else div.className = `${blockName}-card-body`;
    });

    ul.append(li);
  });

  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
