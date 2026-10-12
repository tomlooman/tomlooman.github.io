export const Prices = {
    // C++ Course
    1: {
        INDIE_BASIC: 349,
        INDIE_BASIC_DISCOUNTED: 259, // Change to null to remove discount
        INDIE_PAYMENT_PLAN: 65, // Price per month
        INDIE_PAYMENT_PLAN_DISCOUNTED: 49,
        INDIE_COUPON_CODE: "INDIESALE", // e.g. "COMMUNITY15"
        PRO: 695,
        PRO_DISCOUNTED: null,
        PRO_COUPON_CODE: "",
    },
    // Optimization Course
    2: {
        INDIE_BASIC: 395,
        INDIE_BASIC_DISCOUNTED: 295,
        INDIE_PAYMENT_PLAN: 69,
        INDIE_PAYMENT_PLAN_DISCOUNTED: 49,
        INDIE_COUPON_CODE: "INDIESALE",
        PRO: 795,
        PRO_DISCOUNTED: null,
        PRO_COUPON_CODE: "",
    }
};

// product ids for the checkout page
export const ProductId = {
    1: { // CPP Course UE5
        indieBasic: "6797897",
        indiePaymentPlan: "6797898",
        pro: "6797896",
    },
    2: { // Optim Course
        indieBasic: "5738003",
        indiePaymentPlan: "6863698",
        pro: "5738004",
    }
};