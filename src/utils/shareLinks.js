export const facebook = url =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

export const twitter = url =>
  `https://twitter.com/home?status=${encodeURIComponent(url)}`;
