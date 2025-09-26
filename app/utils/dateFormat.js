export function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const hasAnyValue = (data) => {
  return Object.entries(data).some(([key, value]) => {
    if (key === "pet_id" || key === "date") return false;
    if (typeof value === "boolean") return value === true;
    if (typeof value === "number") return value > 0;
    if (typeof value === "string") return value.trim() !== "";
    return false;
  });
};
