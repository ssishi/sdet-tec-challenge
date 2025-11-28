# Test Issues Summary

## Overview

This document outlines the current test failures and how to resolve them.

---

## Backend Tests

### Cart Calculation Test

**File**: `CartServiceTest.php`  
**Status**: Failing

**What's Wrong**:
The tax calculation test is failing because we're checking for the wrong number. The test expects tax to be $112.05, but the system correctly calculates it as $9.52 (which is 8.5% of $111.97).

**How to Resolve**:
Update line 96 to expect the correct tax amount of $9.52 instead of $112.05.

---

### Product API Tests

**File**: `ProductCest.php`  
**Status**: Blocked

**What's Wrong**:
Tests won't run at all because a required helper file is missing from the project.

**How to Resolve**:
Create the missing `Api.php` helper file in the `backend/tests/Support/Helper/` folder. This is out of scope of me to implement.

---

## Frontend Tests

### Product Card Component

**File**: `ProductCard.spec.js`  
**Status**: 6 tests failing

#### Problem 1: Price Display

The test expects prices to show 4 decimal places ($19.9900) but our system shows 2 decimal places ($19.99). We should update the test to match what users actually see.

#### Problem 2: Button Click Tests

Some tests are timing out because they're not properly waiting for button clicks to finish processing. We need to add proper wait statements.

#### Problem 3: Quantity Input Check

The test is trying to check a property in the wrong way, causing an error. We need to check the component's internal data instead.

#### Problem 4: Missing Test Data

Some tests try to run without providing the product information the component needs. We need to add this data to the tests.

#### Problem 5: Navigation Tests

Tests that check navigation are failing because we didn't set up a fake router. We need to add a mock router to these tests.

#### Problem 6: Error Handling

One test doesn't properly handle errors when adding items to the cart fails. We need to add error handling code.

---

## E2E Tests

**Status**: ⏳ Not yet reviewed

---

## Summary

- **Backend**: 1 test needs a simple number correction, 1 test suite is blocked by a missing file
- **Frontend**: 6 tests need updates to match actual behaviour or add missing test setup
- **E2E**: Still need to review

Most issues are quick fixes - either updating expected values or adding proper test setup.
