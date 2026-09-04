import type { OrderStatus } from '@prisma/client';
import { z } from 'zod';

const optionalTrimmedString = (maxLength: number, message: string) =>
  z
    .string()
    .trim()
    .max(maxLength, message)
    .transform((value) => value || undefined)
    .optional();

const orderItemSchema = z.object({
  dishId: z.string().uuid('菜品 ID 无效'),
  quantity: z
    .number()
    .int('菜品数量必须是整数')
    .min(1, '菜品数量不能小于 1')
    .max(10, '单个菜品最多选择 10 份'),
  remark: optionalTrimmedString(200, '单项备注最多 200 个字符'),
  weightGrams: z.number().min(0.01, '食用重量不能小于 0.01g').max(10000, '食用重量不能超过 10000g')
    .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-7, '食用重量最多支持两位小数')
    .optional(),
  volumeMl: z.number().min(0.01, '饮用量不能小于 0.01ml').max(10000, '饮用量不能超过 10000ml')
    .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-7, '饮用量最多支持两位小数')
    .optional(),
});

export const createOrderInputSchema = z
  .object({
    items: z
      .array(orderItemSchema)
      .min(1, '购物车为空')
      .max(50, '单次最多选择 50 个菜品'),
    gatheringId: z.string().uuid('聚会 ID 无效').optional(),
    remark: optionalTrimmedString(500, '订单备注最多 500 个字符'),
    customerName: optionalTrimmedString(50, '顾客名称最多 50 个字符'),
  })
  .superRefine(({ items }, context) => {
    const dishIds = new Set<string>();

    items.forEach((item, index) => {
      if (dishIds.has(item.dishId)) {
        context.addIssue({
          code: 'custom',
          message: '同一菜品不能重复提交',
          path: ['items', index, 'dishId'],
        });
      }
      dishIds.add(item.dishId);
    });
  });

export const orderIdSchema = z.string().uuid('订单 ID 无效');
export const orderStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'COMPLEED',
  'CANCELLED',
]);
export const orderViewSchema = z.enum(['customer', 'host', 'accessible']);

export const updateOrderStatusInputSchema = z.object({
  orderId: orderIdSchema,
  status: z.enum(['CONFIRMED', 'COMPLEED', 'CANCELLED']),
});

export type CreateOrderInput = z.input<typeof createOrderInputSchema>;
export type UpdateOrderStatus = z.infer<
  typeof updateOrderStatusInputSchema
>['status'];
export type OrderView = z.infer<typeof orderViewSchema>;

const previousStatusByTarget: Record<UpdateOrderStatus, OrderStatus> = {
  CONFIRMED: 'PENDING',
  COMPLEED: 'CONFIRMED',
  CANCELLED: 'PENDING',
};

export function getRequiredPreviousStatus(
  targetStatus: UpdateOrderStatus
): OrderStatus {
  return previousStatusByTarget[targetStatus];
}

export function canTransitionOrder(
  currentStatus: OrderStatus,
  targetStatus: UpdateOrderStatus
): boolean {
  return getRequiredPreviousStatus(targetStatus) === currentStatus;
}
