import {
  createElement,
  createOptimizedPicture,
} from '../../scripts/aem.js';

const FACEBOOK_URL = 'https://www.facebook.com';
const TWITTER_URL = 'https://www.twitter.com';
const INSTAGRAM_URL = 'https://www.instagram.com';

const createSocialLink = (socialName, socialStyleName, socialLink) => {
  const socialLinkWrapper = createElement('div', { classes: ['cmp-button-secondary', 'cmp-button-icononly'] });
  const socialLinkElement = createElement('a', {
    classes: ['cmp-button'],
    attributes: {
      'aria-label': `${socialName} Social Media`,
    },
    props: {
      href: socialLink,
    },
  });
  socialLinkElement.innerHTML = `<span class="cmp-button-icon cmp-button-icon-${socialStyleName}" aria-hidden="true"></span>
    <span class="cmp-button-text">${socialName}</span>`;

  socialLinkWrapper.append(socialLinkElement);

  return socialLinkWrapper;
};

const wrapSocialLinks = (blockName, socialLinksSection) => {
  let userId = null;
  let facebookLink = null;
  let twitterLink = null;
  let instagramLink = null;

  [...socialLinksSection.children].forEach((child) => {
    if (userId == null && (child.tagName === 'H3' || child.tagName === 'H2')) {
      userId = child.id;
    }
    if (child.textContent.includes('Facebook')) {
      facebookLink = `${FACEBOOK_URL}/${userId}`;
      child.remove();
    }
    if (child.textContent.includes('Twitter')) {
      twitterLink = `${TWITTER_URL}/${userId}`;
      child.remove();
    }
    if (child.textContent.includes('Instagram')) {
      instagramLink = `${INSTAGRAM_URL}/${userId}`;
      child.remove();
    }
  });
  if (userId == null || (facebookLink == null && twitterLink == null && instagramLink == null)) {
    return;
  }

  const socialLinks = createElement('div', { classes: [`${blockName}-social-container`] });
  if (facebookLink != null) {
    socialLinks.append(createSocialLink('Facebook', 'facebook', facebookLink));
  }
  if (twitterLink != null) {
    socialLinks.append(createSocialLink('Twitter', 'twitter', twitterLink));
  }
  if (twitterLink != null) {
    socialLinks.append(createSocialLink('Instagram', 'instagram', instagramLink));
  }
  socialLinksSection.append(socialLinks);
};

export default async function decorate(block) {
  const blockName = 'contributors';

  // fetch placeholders from the 'en' folder
  // const placeholders = await fetchPlaceholders('default');
  // const { clickHereForMore } = placeholders;

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = `${blockName}-contributor-image`;
      else {
        div.className = `${blockName}-contributor-body`;
        wrapSocialLinks(blockName, div);
      }
    });

    ul.append(li);
  });

  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
