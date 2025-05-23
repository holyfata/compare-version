import { describe, it, expect } from "bun:test";
import { VersionComparer, VersionComparisonResult } from "../index";

describe("VersionComparer", () => {
  describe("compare", () => {
    it("should correctly compare two version numbers", () => {
      expect(VersionComparer.compare("1.0.0", "2.0.0").result).toBe(
        VersionComparisonResult.Less,
      );
      expect(VersionComparer.compare("2.0.0", "1.0.0").result).toBe(
        VersionComparisonResult.Greater,
      );
      expect(VersionComparer.compare("1.0.0", "1.0.0").result).toBe(
        VersionComparisonResult.Equal,
      );
    });

    it("should handle complex version comparisons", () => {
      expect(VersionComparer.compare("1.2.3", "1.2.4").result).toBe(
        VersionComparisonResult.Less,
      );
      expect(VersionComparer.compare("1.2.3", "1.3.0").result).toBe(
        VersionComparisonResult.Less,
      );
      expect(VersionComparer.compare("2.0.0", "1.9.9").result).toBe(
        VersionComparisonResult.Greater,
      );
      expect(VersionComparer.compare("1.0.0-alpha", "1.0.0").result).toBe(
        VersionComparisonResult.Less,
      );
      expect(
        VersionComparer.compare("1.0.0+20130313144700", "1.0.0").result,
      ).toBe(VersionComparisonResult.Equal);
    });

    it("should handle invalid version numbers", () => {
      expect(VersionComparer.compare("invalid", "1.0.0").result).toBe(
        VersionComparisonResult.Invalid,
      );
      expect(VersionComparer.compare("1.0.0", "invalid").result).toBe(
        VersionComparisonResult.Invalid,
      );
      expect(VersionComparer.compare("1.0", "1.0.0").result).toBe(
        VersionComparisonResult.Invalid,
      );
      expect(VersionComparer.compare("1.0.0.0", "1.0.0").result).toBe(
        VersionComparisonResult.Invalid,
      );
    });

    it("should handle pre-release versions correctly", () => {
      // 预发布版本比较
      expect(
        VersionComparer.compare("1.0.0-alpha", "1.0.0-alpha.1").result,
      ).toBe(VersionComparisonResult.Less);
      expect(
        VersionComparer.compare("1.0.0-alpha.1", "1.0.0-alpha.beta").result,
      ).toBe(VersionComparisonResult.Less);
      expect(
        VersionComparer.compare("1.0.0-alpha.beta", "1.0.0-beta").result,
      ).toBe(VersionComparisonResult.Less);
      expect(VersionComparer.compare("1.0.0-beta", "1.0.0-beta.2").result).toBe(
        VersionComparisonResult.Less,
      );
      expect(
        VersionComparer.compare("1.0.0-beta.2", "1.0.0-beta.11").result,
      ).toBe(VersionComparisonResult.Less);
      expect(
        VersionComparer.compare("1.0.0-beta.11", "1.0.0-rc.1").result,
      ).toBe(VersionComparisonResult.Less);
      expect(VersionComparer.compare("1.0.0-rc.1", "1.0.0").result).toBe(
        VersionComparisonResult.Less,
      );
    });

    it("should handle build metadata correctly", () => {
      // 构建元数据比较
      expect(
        VersionComparer.compare("1.0.0+20130313144700", "1.0.0+20130313144701")
          .result,
      ).toBe(VersionComparisonResult.Equal);
      expect(
        VersionComparer.compare(
          "1.0.0-alpha+20130313144700",
          "1.0.0-alpha+20130313144701",
        ).result,
      ).toBe(VersionComparisonResult.Equal);
      expect(
        VersionComparer.compare(
          "1.0.0+exp.sha.5114f85",
          "1.0.0+exp.sha.5114f86",
        ).result,
      ).toBe(VersionComparisonResult.Equal);
    });

    it("should handle special version formats", () => {
      // 特殊版本格式
      expect(
        VersionComparer.compare("1.0.0-0A.is.legal", "1.0.0-0A.is.legal.2")
          .result,
      ).toBe(VersionComparisonResult.Less);
      expect(
        VersionComparer.compare("1.0.0-0A.is.legal.2", "1.0.0-0A.is.legal.10")
          .result,
      ).toBe(VersionComparisonResult.Less);
      expect(
        VersionComparer.compare("1.0.0-0A.is.legal.10", "1.0.0-0A.is.legal.100")
          .result,
      ).toBe(VersionComparisonResult.Less);
    });

    it("should handle version with leading zeros", () => {
      // 带前导零的版本号
      expect(VersionComparer.compare("01.0.0", "1.0.0").result).toBe(
        VersionComparisonResult.Invalid,
      );
      expect(VersionComparer.compare("1.01.0", "1.1.0").result).toBe(
        VersionComparisonResult.Invalid,
      );
      expect(VersionComparer.compare("1.0.01", "1.0.1").result).toBe(
        VersionComparisonResult.Invalid,
      );
    });
  });

  describe("isValid", () => {
    it("should correctly validate version numbers", () => {
      expect(VersionComparer.isValid("1.0.0")).toBe(true);
      expect(VersionComparer.isValid("1.0.0-alpha")).toBe(true);
      expect(VersionComparer.isValid("1.0.0+20130313144700")).toBe(true);
      expect(VersionComparer.isValid("1.0.0-alpha+20130313144700")).toBe(true);
      expect(VersionComparer.isValid("invalid")).toBe(false);
      expect(VersionComparer.isValid("1.0")).toBe(false);
      expect(VersionComparer.isValid("1.0.0.0")).toBe(false);
    });

    it("should handle special version formats in validation", () => {
      // 特殊版本格式验证
      expect(VersionComparer.isValid("1.0.0-0A.is.legal")).toBe(true);
      expect(VersionComparer.isValid("1.0.0-0A.is.legal.2")).toBe(true);
      expect(VersionComparer.isValid("1.0.0-0A.is.legal.10")).toBe(true);
      expect(VersionComparer.isValid("1.0.0-0A.is.legal.100")).toBe(true);
      expect(VersionComparer.isValid("1.0.0-0A.is.legal+20130313144700")).toBe(
        true,
      );
    });

    it("should handle version with leading zeros in validation", () => {
      // 带前导零的版本号验证
      expect(VersionComparer.isValid("01.0.0")).toBe(false);
      expect(VersionComparer.isValid("1.01.0")).toBe(false);
      expect(VersionComparer.isValid("1.0.01")).toBe(false);
    });
  });

  describe("getMajor", () => {
    it("should correctly get major version number", () => {
      expect(VersionComparer.getMajor("1.0.0")).toBe(1);
      expect(VersionComparer.getMajor("2.1.0")).toBe(2);
      expect(VersionComparer.getMajor("10.0.0")).toBe(10);
      expect(VersionComparer.getMajor("1.0.0-alpha")).toBe(1);
      expect(VersionComparer.getMajor("invalid")).toBe(null);
    });

    it("should handle special version formats in major version", () => {
      expect(VersionComparer.getMajor("1.0.0-0A.is.legal")).toBe(1);
      expect(VersionComparer.getMajor("1.0.0-0A.is.legal.2")).toBe(1);
      expect(VersionComparer.getMajor("1.0.0-0A.is.legal+20130313144700")).toBe(
        1,
      );
    });
  });

  describe("getMinor", () => {
    it("should correctly get minor version number", () => {
      expect(VersionComparer.getMinor("1.0.0")).toBe(0);
      expect(VersionComparer.getMinor("1.2.0")).toBe(2);
      expect(VersionComparer.getMinor("1.10.0")).toBe(10);
      expect(VersionComparer.getMinor("1.0.0-alpha")).toBe(0);
      expect(VersionComparer.getMinor("invalid")).toBe(null);
    });

    it("should handle special version formats in minor version", () => {
      expect(VersionComparer.getMinor("1.0.0-0A.is.legal")).toBe(0);
      expect(VersionComparer.getMinor("1.2.0-0A.is.legal.2")).toBe(2);
      expect(
        VersionComparer.getMinor("1.10.0-0A.is.legal+20130313144700"),
      ).toBe(10);
    });
  });

  describe("getPatch", () => {
    it("should correctly get patch version number", () => {
      expect(VersionComparer.getPatch("1.0.0")).toBe(0);
      expect(VersionComparer.getPatch("1.0.3")).toBe(3);
      expect(VersionComparer.getPatch("1.0.10")).toBe(10);
      expect(VersionComparer.getPatch("1.0.0-alpha")).toBe(0);
      expect(VersionComparer.getPatch("invalid")).toBe(null);
    });

    it("should handle special version formats in patch version", () => {
      expect(VersionComparer.getPatch("1.0.0-0A.is.legal")).toBe(0);
      expect(VersionComparer.getPatch("1.0.3-0A.is.legal.2")).toBe(3);
      expect(
        VersionComparer.getPatch("1.0.10-0A.is.legal+20130313144700"),
      ).toBe(10);
    });
  });
});
