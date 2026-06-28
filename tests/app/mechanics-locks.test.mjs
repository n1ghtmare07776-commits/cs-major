import test from "node:test";
import assert from "node:assert/strict";

import {
  continuityBonusForMatches,
  describeEconomyPath,
  summarizeReadPressure,
} from "../../src/app/browser.js";

test("economy path follows compressed CS recovery rules", () => {
  const afterOpeningLoss = describeEconomyPath({
    openingBuy: "full_buy",
    outcomes: ["loss", "loss", "win", "loss"],
  });

  assert.equal(afterOpeningLoss[0].tier, "full_buy");
  assert.notEqual(afterOpeningLoss[1].tier, "full_buy");
  assert.notEqual(afterOpeningLoss[1].tier, "bonus");
  assert.ok(["force_buy", "half_buy", "full_buy", "bonus"].includes(afterOpeningLoss[2].tier));

  const afterTwoWinsAndLoss = describeEconomyPath({
    openingBuy: "full_buy",
    outcomes: ["win", "win", "loss", "loss"],
  });

  assert.ok(["force_buy", "full_buy", "bonus"].includes(afterTwoWinsAndLoss[3].tier));
});

test("repeating the same opening 2-3 times creates medium read pressure", () => {
  const lightRead = summarizeReadPressure(["default"]);
  const mediumRead = summarizeReadPressure(["default", "default"]);
  const hardRead = summarizeReadPressure(["default", "default", "default"]);

  assert.equal(lightRead.label, "fresh");
  assert.equal(mediumRead.label, "warming");
  assert.equal(hardRead.label, "read");
  assert.ok(hardRead.penalty < mediumRead.penalty);
});

test("continuity bonus grows lightly and stays capped", () => {
  assert.equal(continuityBonusForMatches(0), 0);
  assert.equal(continuityBonusForMatches(2), 0);
  assert.equal(continuityBonusForMatches(3), 1);
  assert.equal(continuityBonusForMatches(6), 2);
  assert.equal(continuityBonusForMatches(12), 3);
  assert.equal(continuityBonusForMatches(30), 3);
});
