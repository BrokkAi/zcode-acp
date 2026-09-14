/**
 * resolveZcodeCommand argv tests.
 *
 * Regression cover for the Happy Eyeballs flag: #182 disabled Node's
 * `autoSelectFamily` to stop the 250ms connect budget from killing slow IPv4
 * edges, but that also drops the dual-stack fallback. A provider configured as
 * `http://localhost:PORT` where localhost resolves `::1` first and the server
 * listens on IPv4 only then fails hard instead of falling through — every
 * prompt hung. The fix pairs the disable with `--dns-result-order=ipv4first`.
 *
 * These lock the flag pair (and the escape hatch) without spawning the real
 * zcode app-server: ZCODE_BIN points at a nonexistent .cjs (the resolver only
 * needs the extension) and ZCODE_NODE at the running test runner, which is
 * sqlite-capable.
 */

import { afterEach, describe, expect, it } from "vitest";

import { resolveZcodeCommand } from "../src/backend/resolve.js";

const SAVED = {
  ZCODE_BIN: process.env.ZCODE_BIN,
  ZCODE_NODE: process.env.ZCODE_NODE,
  ZCODE_KEEP_HAPPY_EYEBALLS: process.env.ZCODE_KEEP_HAPPY_EYEBALLS,
};

afterEach(() => {
  for (const [k, v] of Object.entries(SAVED)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
});

function jsLaunchArgs(): string[] {
  process.env.ZCODE_BIN = "/nonexistent/zcode.cjs";
  process.env.ZCODE_NODE = process.execPath;
  return resolveZcodeCommand();
}

describe("resolveZcodeCommand Happy Eyeballs args", () => {
  it("disables autoSelectFamily AND pins dns order to ipv4first by default", () => {
    delete process.env.ZCODE_KEEP_HAPPY_EYEBALLS;
    const argv = jsLaunchArgs();
    expect(argv).toContain("--no-network-family-autoselection");
    // Without this the single-address lookup picks ::1 first and a
    // localhost-IPv4-only provider is unreachable.
    expect(argv).toContain("--dns-result-order=ipv4first");
    // Flags must precede the script path or node treats them as script args.
    expect(argv.indexOf("--no-network-family-autoselection")).toBeLessThan(
      argv.indexOf("/nonexistent/zcode.cjs"),
    );
    expect(argv.indexOf("--dns-result-order=ipv4first")).toBeLessThan(
      argv.indexOf("/nonexistent/zcode.cjs"),
    );
    expect(argv.slice(-2)).toEqual(["app-server", "--stdio"]);
  });

  it("drops both flags when ZCODE_KEEP_HAPPY_EYEBALLS is set", () => {
    process.env.ZCODE_KEEP_HAPPY_EYEBALLS = "1";
    const argv = jsLaunchArgs();
    expect(argv).not.toContain("--no-network-family-autoselection");
    expect(argv).not.toContain("--dns-result-order=ipv4first");
  });
});
