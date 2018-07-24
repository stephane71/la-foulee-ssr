export const facebook = url =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

export const twitter = url =>
  `https://twitter.com/home?status=${encodeURIComponent(url)}`;

export const whatsapp = url =>
  `whatsapp://send?text=${encodeURIComponent(url)}`;

export const mailto = url => `mailto:?body=${encodeURIComponent(url)}`;
