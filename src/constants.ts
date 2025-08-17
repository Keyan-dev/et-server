export const dailyTrackerSelect = {
    amount: true,
    date: true,
    notes: true,
    id: true,
    sub_category_id: true,
    category_id: true,
    payment_mode_id: true,
    category: { select: { name: true } },
    sub_category: { select: { name: true } },
    payment_mode: { select: { name: true } }
}