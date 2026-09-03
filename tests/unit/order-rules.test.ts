import { describe, expect, it } from 'vitest';

import {
  canTransitionOrder,
  createOrderInputSchema,
  getRequiredPreviousStatus,
  orderIdSchema,
  orderStatusSchema,
  updateOrderStatusInputSchema,
} from '@/features/order/order-rules';

const DISH_ID = '123e4567-e89b-42d3-a456-426614174000';
const OTHER_DISH_ID = '123e4567-e89b-42d3-a456-426614174001';
const ORDER_ID = '123e4567-e89b-42d3-a456-426614174002';

describe('createOrderInputSchema', () => {
  it('accepts valid items and trims optional text', () => {
    const result = createOrderInputSchema.parse({
      items: [{ dishId: DISH_ID, quantity: 2, remark: '  少辣  ' }],
      gatheringId: ORDER_ID,
      remark: '  尽快上菜  ',
      customerName: '  小明  ',
    });

    expect(result).toEqual({
      items: [{ dishId: DISH_ID, quantity: 2, remark: '少辣' }],
      gatheringId: ORDER_ID,
      remark: '尽快上菜',
      customerName: '小明',
    });
  });

  it.each([0, -1, 1.5, 11])('rejects invalid quantity %s', (quantity) => {
    const result = createOrderInputSchema.safeParse({
      items: [{ dishId: DISH_ID, quantity }],
    });

    expect(result.success).toBe(false);
  });

  it('rejects duplicate dishes', () => {
    const result = createOrderInputSchema.safeParse({
      items: [
        { dishId: DISH_ID, quantity: 1 },
        { dishId: DISH_ID, quantity: 2 },
      ],
    });

    expect(result.success).toBe(false);
  });

  it('accepts distinct dishes', () => {
    const result = createOrderInputSchema.safeParse({
      items: [
        { dishId: DISH_ID, quantity: 1 },
        { dishId: OTHER_DISH_ID, quantity: 2 },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('accepts gram weights with up to two decimal places', () => {
    expect(createOrderInputSchema.safeParse({
      items: [{ dishId: DISH_ID, quantity: 1, weightGrams: 125.5 }],
    }).success).toBe(true);
  });

  it.each([0, -1, 10000.01, 1.234])('rejects invalid gram weight %s', (weightGrams) => {
    expect(createOrderInputSchema.safeParse({
      items: [{ dishId: DISH_ID, quantity: 1, weightGrams }],
    }).success).toBe(false);
  });
});

describe('order status transitions', () => {
  it.each([
    ['PENDING', 'CONFIRMED'],
    ['PENDING', 'CANCELLED'],
    ['CONFIRMED', 'COMPLEED'],
  ] as const)('allows %s -> %s', (currentStatus, targetStatus) => {
    expect(canTransitionOrder(currentStatus, targetStatus)).toBe(true);
    expect(getRequiredPreviousStatus(targetStatus)).toBe(currentStatus);
  });

  it.each([
    ['PENDING', 'COMPLEED'],
    ['CONFIRMED', 'CANCELLED'],
    ['CANCELLED', 'CONFIRMED'],
    ['COMPLEED', 'CANCELLED'],
  ] as const)('rejects %s -> %s', (currentStatus, targetStatus) => {
    expect(canTransitionOrder(currentStatus, targetStatus)).toBe(false);
  });

  it('rejects unknown runtime status values', () => {
    expect(
      updateOrderStatusInputSchema.safeParse({
        orderId: ORDER_ID,
        status: 'PENDING',
      }).success
    ).toBe(false);
  });

  it('validates order identifiers and list status filters', () => {
    expect(orderIdSchema.safeParse(ORDER_ID).success).toBe(true);
    expect(orderIdSchema.safeParse('not-an-id').success).toBe(false);
    expect(orderStatusSchema.safeParse('PENDING').success).toBe(true);
    expect(orderStatusSchema.safeParse('UNKNOWN').success).toBe(false);
  });
});
