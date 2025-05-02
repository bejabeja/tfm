export function formatDate(date) {
    const options = { year: "numeric", month: "long" };
    return new Date(date).toLocaleDateString("en-US", options);
}
export function formatDateRange(startDate, endDate) {
    const options = { day: "numeric", month: "short" };
    const start = new Date(startDate);
    const end = new Date(endDate);

    const sameMonth = start.getMonth() === end.getMonth();
    const sameYear = start.getFullYear() === end.getFullYear();

    if (sameMonth && sameYear) {
        return `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
    } else {
        return `${start.toLocaleDateString("en-US", options)} – ${end.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })}`;
    }
}