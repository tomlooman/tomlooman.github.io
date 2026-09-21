export const Prices = {
    // C++ Course
    1: {
        INDIE_BASIC: 349,
        INDIE_BASIC_DISCOUNTED: 249, // Change to null to remove discount
        INDIE_PAYMENT_PLAN: 65, // Price per month
        INDIE_PAYMENT_PLAN_DISCOUNTED: 49,
        INDIE_COUPON_CODE: "FIVEYEARS", // e.g. "COMMUNITY15"
        PRO: 695,
        PRO_DISCOUNTED: 595,
        PRO_COUPON_CODE: "FIVEYEARS",
    },
    // Optimization Course
    2: {
        INDIE_BASIC: 395,
        INDIE_BASIC_DISCOUNTED: null,
        INDIE_PAYMENT_PLAN: 85,
        INDIE_PAYMENT_PLAN_DISCOUNTED: null,
        INDIE_COUPON_CODE: null,
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
        indiePaymentPlan: "5931155",
        pro: "5738004",
    }
};