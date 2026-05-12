/**
 * Fixture to check that multi-specifier named imports with `as`
 * are not flagged as type assertions.
 */
import { Roboto as FontMono, Inter as FontSans } from "next/font/google";

console.log(FontSans, FontMono);
