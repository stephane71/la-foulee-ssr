import slug from "slug";

export default function(event = {}) {
  const { department, city } = event;
  if (!department || !department.name || !city) return null;

  return `${slug(event.department.name, { lower: true })}_${slug(event.city, {
    lower: true
  })}`;
}
