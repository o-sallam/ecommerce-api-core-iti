// Utility string helpers for normalization and casing

/**
 * Convert any string to PascalCase with spaces between words.
 * Examples:
 *   "bed room" => "Bed Room"
 *   "bedroom" => "Bedroom"
 *   "bed_room" => "Bed Room"
 *   "BedRoom" => "Bed Room"
 */
function toPascalCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
    .replace(/[_-]+/g, ' ') // Replace _ and - with space
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
    .toLowerCase()
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Normalize category name: PascalCase, remove all spaces for comparison.
 * Used for case/space-insensitive matching.
 */
function normalizeCategoryName(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s/g, '') // Remove all spaces
    .replace(/(^|\s)\S/g, (t) => t.toUpperCase());
}

module.exports = {
  toPascalCase,
  normalizeCategoryName
};
