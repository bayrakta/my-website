import { createElement } from '../../scripts/aem.js';

const FACEBOOK_URL = 'https://www.facebook.com';
const TWITTER_URL = 'https://www.twitter.com';
const INSTAGRAM_URL = 'https://www.instagram.com';
const WKND_USER_NAME = 'wkdn';

const createSocialMediaLink = (socialName, socialStyleName, socialLink) => {
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
  let facebookLink = null;
  let twitterLink = null;
  let instagramLink = null;

  [...socialLinksSection.children].forEach((child) => {
    if (child.textContent.includes('Facebook')) {
      facebookLink = `${FACEBOOK_URL}/${WKND_USER_NAME}`;
      child.remove();
    }
    if (child.textContent.includes('Twitter')) {
      twitterLink = `${TWITTER_URL}/${WKND_USER_NAME}`;
      child.remove();
    }
    if (child.textContent.includes('Instagram')) {
      instagramLink = `${INSTAGRAM_URL}/${WKND_USER_NAME}`;
      child.remove();
    }
  });
  if (facebookLink == null && twitterLink == null && instagramLink == null) {
    return;
  }
  socialLinksSection.classList.add(`${blockName}-container`);

  const socialLinks = createElement('div', { classes: [`${blockName}-container`] });
  if (facebookLink != null) {
    socialLinks.append(createSocialMediaLink('Facebook', 'facebook', facebookLink));
  }
  if (twitterLink != null) {
    socialLinks.append(createSocialMediaLink('Twitter', 'twitter', twitterLink));
  }
  if (twitterLink != null) {
    socialLinks.append(createSocialMediaLink('Instagram', 'instagram', instagramLink));
  }
  socialLinksSection.append(socialLinks);
};

export default function decorate(block) {
  const blockName = 'social-media';

  const cols = [...block.firstElementChild.children];
  block.classList.add(`${blockName}-${cols.length}-cols`);

  // setup image social-media
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add(`${blockName}-img-col`);
        }
      }
      wrapSocialLinks(blockName, col);
    });
  });
}
