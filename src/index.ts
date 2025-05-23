import semver from "semver";

export interface VersionComparison {
  version1: string;
  version2: string;
  result: VersionComparisonResult;
}

export enum VersionComparisonResult {
  Greater = "greater",
  Less = "less",
  Equal = "equal",
  Invalid = "invalid",
}

export const VersionComparer = {
  /**
   * Compare two version numbers
   * @param version1 First version number
   * @param version2 Second version number
   * @returns Comparison result
   */
  compare(version1: string, version2: string): VersionComparison {
    if (!this.isValid(version1) || !this.isValid(version2)) {
      return {
        version1,
        version2,
        result: VersionComparisonResult.Invalid,
      };
    }

    const comparison = semver.compare(version1, version2);
    const result =
      comparison > 0
        ? VersionComparisonResult.Greater
        : comparison < 0
          ? VersionComparisonResult.Less
          : VersionComparisonResult.Equal;

    return { version1, version2, result };
  },

  /**
   * Check if a version number is valid
   * @param version Version number to validate
   * @returns Whether the version is valid
   */
  isValid(version: string): boolean {
    return semver.valid(version) !== null;
  },

  /**
   * Get the major version number
   * @param version Version number
   * @returns Major version number or null if invalid
   */
  getMajor(version: string): number | null {
    return this.isValid(version) ? semver.major(version) : null;
  },

  /**
   * Get the minor version number
   * @param version Version number
   * @returns Minor version number or null if invalid
   */
  getMinor(version: string): number | null {
    return this.isValid(version) ? semver.minor(version) : null;
  },

  /**
   * Get the patch version number
   * @param version Version number
   * @returns Patch version number or null if invalid
   */
  getPatch(version: string): number | null {
    return this.isValid(version) ? semver.patch(version) : null;
  },
};

export default VersionComparer;
