import { createElement, getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const blockName = 'footer';

  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footerContent = createElement('div', { classes: [`${blockName}-content`, 'section'] });
  while (fragment.firstElementChild) {
    const sectionChild = fragment.firstElementChild;
    footerContent.append(sectionChild);
    // section class added to the content wrapper above
    sectionChild.classList.remove('section');
  }

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = footerContent.children[i];
    if (section) {
      section.classList.add(`${blockName}-content-nav-item`);
      section.classList.add(`${blockName}-content-nav-item-${c}`);
      if (c === 'sections') {
        section.setAttribute('aria-expanded', 'true');
      }
    }
  });

  const sectionWrapper = createElement('div', { classes: [`${blockName}-content-nav`] });
  classes.forEach((c) => {
    const section = footerContent.querySelector(`.${blockName}-content-nav-item-${c}`);
    if (section) {
      section.remove();
      sectionWrapper.append(section);
    }
  });
  [...footerContent.children].forEach((div) => {
    div.className = `${blockName}-content-section`;
  });
  footerContent.prepend(sectionWrapper);

  const navBrand = footerContent.querySelector(`.${blockName}-content-nav-item-brand`);
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  block.append(footerContent);
}
