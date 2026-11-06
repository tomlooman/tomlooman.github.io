export const MultiplayerCourse = {
    title: "Multiplayer Programming in Unreal Engine 5",
    url: "https://courses.tomlooman.com/l/pdp/multiplayer-programming-unreal-engine",
    standalonePrice: 149,
};

export interface BundlePlan {
    price: number;
    // Paste the full URL from Teachable > Bundle > Pricing > Copy URL.
    // A course pricing-plan ID does not enroll buyers in both courses.
    checkoutUrl: string | null;
    // Set both fields only after creating a matching coupon for this bundle plan.
    salePrice?: number;
    couponCode?: string;
}

export interface BundlePlans {
    indieBasic: BundlePlan;
    indiePaymentPlan: BundlePlan | null;
    pro: BundlePlan;
}

// One Teachable Product Bundle containing UE5 C++ (2815268) and Multiplayer
// (3002970), with separate Indie / Pro pricing plans. Do not use the UE4 course.
// The selector goes live only when both one-time checkout URLs are configured.
// The $95 add-on applies to one-time licenses. The Indie bundle plan is 6 monthly payments of $79.
export const CppMultiplayerBundle: BundlePlans = {
    indieBasic: { price: 444, checkoutUrl: "https://courses.tomlooman.com/purchase?product_id=6907161" },
    indiePaymentPlan: { price: 79, checkoutUrl: "https://courses.tomlooman.com/purchase?product_id=6907166" },
    pro: { price: 790, checkoutUrl: "https://courses.tomlooman.com/purchase?product_id=6907162" },
};

export function isBundlePlanReady(plan: BundlePlan | null): plan is BundlePlan & { checkoutUrl: string } {
    if (!plan || !Number.isFinite(plan.price) || plan.price <= 0 || !plan.checkoutUrl) return false;
    try {
        const url = new URL(plan.checkoutUrl);
        return url.protocol === "https:" && url.hostname === "courses.tomlooman.com"
            && url.pathname !== "/";
    } catch {
        return false;
    }
}

export function getBundleOffer(plan: BundlePlan, saleActive: boolean) {
    const onSale = saleActive && !!plan.couponCode && plan.salePrice != null
        && plan.salePrice > 0 && plan.salePrice < plan.price;
    const url = new URL(plan.checkoutUrl!);
    if (onSale) url.searchParams.set("coupon_code", plan.couponCode!);
    return {
        price: onSale ? plan.salePrice! : plan.price,
        originalPrice: onSale ? plan.price : null,
        url: url.toString(),
    };
}
