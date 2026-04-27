/**
 * Fixture to check that namespace imports (`import * as ns`)
 * are not flagged as type assertions.
 */
import * as path from "node:path";

console.log(path.join("a", "b"));
