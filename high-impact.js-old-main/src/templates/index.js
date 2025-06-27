import topscroll from './topscroll.js';
import takeover from './takeover.js';
import midscroll from './midscroll.js';
import sitebar from './sitebar.js';
import doubleFullscreen from './double-fullscreen.js';
import skins from './skins.js';

export const getTemplate = (name) => {
  switch (name) {
    case 'midscroll':
      return midscroll;
    case 'topscroll':
      return topscroll;
    case 'sitebar':
      return sitebar;
    case 'double-fullscreen':
      return doubleFullscreen;
    case 'skins':
      return skins;
    case 'takeover':
      return takeover;
  }
};
