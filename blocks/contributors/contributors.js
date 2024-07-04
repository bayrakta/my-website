import {
  createElement,
  createOptimizedPicture,
} from '../../scripts/aem.js';

const FACEBOOK_URL = 'https://www.facebook.com';
const TWITTER_URL = 'https://www.twitter.com';
const INSTAGRAM_URL = 'https://www.instagram.com';

const CONTRIBUTORS_FOLDER = '/contributors';
const PN_CONTRIBUTOR_USERNAME = 'Username';
const PN_CONTRIBUTOR_DISPLAY_NAME = 'Display Name';
const PN_CONTRIBUTOR_ROLES = 'Roles';
const PN_CONTRIBUTOR_FACEBOOK = 'Facebook';
const PN_CONTRIBUTOR_TWITTER = 'Twitter';
const PN_CONTRIBUTOR_INSTAGRAM = 'Instagram';
const PN_CONTRIBUTOR_PICTURE = 'Picture';

const createElementFromHTML = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  const { firstChild } = div;
  firstChild.remove();

  // Change this to div.childNodes to support multiple top-level nodes.
  return firstChild;
};

const resolveContributor = (contributors, username) => {
  if (!contributors || !contributors.data || !username) {
    return null;
  }
  for (let i = 0; i < contributors.data.length; i += 1) {
    const contributor = contributors.data[i];
    if (contributor && contributor[PN_CONTRIBUTOR_USERNAME] === username) {
      return contributor;
    }
  }
  return null;
};

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
  let displayName = null;
  let roleText = null;
  let userId = null;
  let facebookLink = null;
  let twitterLink = null;
  let instagramLink = null;

  [...socialLinksSection.children].forEach((child, i) => {
    if (i === 0) {
      displayName = child.innerHTML;
      userId = displayName.toLowerCase().replace(/\s/g, '');
      child.replaceWith(createElementFromHTML(`<span class="${blockName}-social-contributor-title">${displayName}</span>`));
    } else if (i === 1) {
      roleText = child.innerHTML;
      child.replaceWith(createElementFromHTML(`<span class="${blockName}-social-contributor-roles">${roleText}</span>`));
    } else {
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

  const resp = await fetch(`${CONTRIBUTORS_FOLDER}/contributors.json`);
  const contributors = await resp.json();

  // eslint-disable-next-line no-console
  console.log(`contributors ${contributors}`);

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = createElement('li');
    while (row.firstElementChild) {
      const rowFirstChild = row.firstElementChild;
      let contributor = null;
      if (rowFirstChild.children.length === 1) {
        contributor = resolveContributor(contributors, rowFirstChild.innerText.trim());
      }

      if (contributor !== null) {
        // Remove the current child so that the while loop proceeds
        rowFirstChild.remove();

        if (PN_CONTRIBUTOR_PICTURE in contributor && contributor[PN_CONTRIBUTOR_PICTURE]) {
          const pictureFileName = contributor[PN_CONTRIBUTOR_PICTURE];
          const pictureContainer = createElementFromHTML(`<div class="contributors-contributor-image">
            <picture>
              <source type="image/webp" srcset="${CONTRIBUTORS_FOLDER}/${pictureFileName}?width=750&amp;format=webply&amp;optimize=medium">
              <img loading="lazy" alt="" src="${CONTRIBUTORS_FOLDER}/${pictureFileName}?width=750&amp;format=jpeg&amp;optimize=medium">
            </picture>
          </div>`);

          li.append(pictureContainer);
        }

        const username = contributor[PN_CONTRIBUTOR_USERNAME].trim();
        const displayName = contributor[PN_CONTRIBUTOR_DISPLAY_NAME].trim();
        const rolesStr = contributor[PN_CONTRIBUTOR_ROLES].trim();
        const facebookUserName = contributor[PN_CONTRIBUTOR_FACEBOOK].trim();
        const twitterUserName = contributor[PN_CONTRIBUTOR_TWITTER].trim();
        const instagramUserName = contributor[PN_CONTRIBUTOR_INSTAGRAM].trim();
        let roleText = '';
        if (rolesStr) {
          const roleArray = rolesStr.split(',');
          for (let i = 0; i < roleArray.length; i += 1) {
            const role = roleArray[i].trim();
            if (i > 0) {
              roleText += ' | ';
            }
            roleText += role;
          }
        }

        const facebookAlias = facebookUserName.length > 0 ? facebookUserName : username;
        const twitterAlias = twitterUserName.length > 0 ? twitterUserName : username;
        const instagramAlias = instagramUserName.length > 0 ? instagramUserName : username;

        const contributorBody = createElementFromHTML(`<div class="contributors-contributor-body">
                  <span class="${blockName}-social-contributor-title">${displayName}</span>
                  <span class="${blockName}-social-contributor-roles">${roleText}</span>
                  <div class="contributors-social-container">
                    <div class="cmp-button-secondary cmp-button-icononly"><a class="cmp-button" aria-label="Facebook Social Media"
                        href="${FACEBOOK_URL}/${facebookAlias}"><span class="cmp-button-icon cmp-button-icon-facebook" aria-hidden="true"></span>
                        <span class="cmp-button-text">Facebook</span></a></div>
                    <div class="cmp-button-secondary cmp-button-icononly"><a class="cmp-button" aria-label="Twitter Social Media"
                        href="${TWITTER_URL}/${twitterAlias}"><span class="cmp-button-icon cmp-button-icon-twitter" aria-hidden="true"></span>
                        <span class="cmp-button-text">Twitter</span></a></div>
                    <div class="cmp-button-secondary cmp-button-icononly"><a class="cmp-button" aria-label="Instagram Social Media"
                        href="${INSTAGRAM_URL}/${instagramAlias}"><span class="cmp-button-icon cmp-button-icon-instagram" aria-hidden="true"></span>
                        <span class="cmp-button-text">Instagram</span></a></div>
                  </div>
                </div>`);

        li.append(contributorBody);
      } else {
        li.append(rowFirstChild);

        if (rowFirstChild.children.length === 1 && rowFirstChild.querySelector('picture')) {
          rowFirstChild.className = `${blockName}-contributor-image`;
        } else {
          rowFirstChild.className = `${blockName}-contributor-body`;
          wrapSocialLinks(blockName, rowFirstChild);
        }
      }
    }

    ul.append(li);
  });

  ul.querySelectorAll('img')
    .forEach((img) => img.closest('picture')
      .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
