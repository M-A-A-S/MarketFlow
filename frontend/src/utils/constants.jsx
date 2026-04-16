export const PPRDUCT_SORT_BY = {
  NEWEST: 1,
  OLDEST: 2,
  PRICE_ASC: 3,
  PRICE_DESC: 4,
  NAME_EN_ASC: 5,
  NAME_EN_DESC: 6,
  NAME_AR_ASC: 7,
  NAME_AR_DESC: 8,
  DESCRIPTION_EN_ASC: 9,
  DESCRIPTION_EN_DESC: 10,
  DESCRIPTION_AR_ASC: 11,
  DESCRIPTION_AR_DESC: 12,
};

export const PPRDUCT_SORT_BY_OPTIONS = [
  { value: PPRDUCT_SORT_BY.NEWEST, label: "newest" },
  { value: PPRDUCT_SORT_BY.OLDEST, label: "oldest" },
  { value: PPRDUCT_SORT_BY.PRICE_ASC, label: "price_asc" },
  { value: PPRDUCT_SORT_BY.PRICE_DESC, label: "price_desc" },
  { value: PPRDUCT_SORT_BY.NAME_EN_ASC, label: "name_en_asc" },
  { value: PPRDUCT_SORT_BY.NAME_EN_DESC, label: "name_en_desc" },
  { value: PPRDUCT_SORT_BY.NAME_AR_ASC, label: "name_ar_asc" },
  { value: PPRDUCT_SORT_BY.NAME_AR_DESC, label: "name_ar_desc" },
  { value: PPRDUCT_SORT_BY.DESCRIPTION_EN_ASC, label: "description_en_asc" },
  { value: PPRDUCT_SORT_BY.DESCRIPTION_EN_DESC, label: "description_en_desc" },
  { value: PPRDUCT_SORT_BY.DESCRIPTION_AR_ASC, label: "description_ar_asc" },
  { value: PPRDUCT_SORT_BY.DESCRIPTION_AR_DESC, label: "description_ar_desc" },
];

export const GENDERS = [
  { value: 1, label: "unknown" },
  { value: 2, label: "male" },
  { value: 3, label: "female" },
  { value: 4, label: "other" },
];

export const PAYMENT_METHODS = [
  { value: 1, label: "cash" },
  { value: 2, label: "bankak" },
  { value: 3, label: "fawry" },
];

export const PAYMENT_METHOD = {
  CASH: 1,
  BANKAK: 2,
  FAWRY: 3,
};

export const PURCHASE_INVOICE_STATUSES = [
  { value: 1, key: "draft" },
  { value: 2, key: "pending" },
  { value: 3, key: "approved" },
  { value: 4, key: "cancelled" },
];

export const PURCHASE_INVOICE_STATUS = {
  DRAFT: 1,
  PENDING: 2,
  APPROVED: 3,
  CANCELLED: 4,
};

export const PURCHASE_INVOICE_SORT_BY = {
  NEWEST: 0,
  OLDEST: 1,
  TOTAL_LOW_TO_HIGH: 2,
  TOTAL_HIGH_TO_LOW: 3,
  INVOICE_NUMBER: 4,
};

export const PURCHASE_INVOICE_SORT_OPTIONS = [
  { value: 0, key: "newest" },
  { value: 1, key: "oldest" },
  { value: 2, key: "total_low_to_high" },
  { value: 3, key: "total_high_to_low" },
  { value: 4, key: "invoice_number" },
];
