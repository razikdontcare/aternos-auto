/**
 * Formats the given number of seconds into a string representation of minutes and seconds.
 *
 * @param {number} seconds - The number of seconds to format.
 * @returns {string} The formatted string in the format "MM:SS".
 */
export default function formatSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}
