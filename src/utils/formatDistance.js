export default function formatDistance(value) {
  if (!value) return value;
  if (value < 1000) return `${value}m`;
  return `${value / 1000}km`;
}
