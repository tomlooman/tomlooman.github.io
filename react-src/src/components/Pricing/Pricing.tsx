import React from "react";
import { Prices, ProductId } from "./constants/Prices";
import { CppMultiplayerBundle, MultiplayerCourse, getBundleOffer, isBundlePlanReady } from "./constants/MultiplayerBundle";
import SignUpButton from "./components/SignUpButton";
import { Courses } from "../../constants/Courses";
import style from "./Pricing.module.scss";

enum PriceItemType {
    INDIE_BASIC = "indieBasic",
    INDIE_PAYMENT_PLAN = "indiePaymentPlan",
    PRO = "pro",
}

interface PricingProps {
    courseId: Courses;
    saleActive?: boolean;
    multiplayerUrl?: string;
}

const paymentBaseUrl = "https://courses.tomlooman.com/purchase";

interface PriceDetailsProps {
    price: number;
    originalPrice: number | null;
    monthly?: boolean;
    perUser?: boolean;
}

const PriceDetails = ({ price, originalPrice, monthly, perUser }: PriceDetailsProps) => {
    const payments = monthly ? 6 : 1;
    const discounted = originalPrice != null && originalPrice > price;

    return (
        <>
            <div className={style.priceAmount}>
                {monthly && <div className={style.priceAdditionalInfo}>{payments} payments of</div>}
                <h1>
                    <span>{`$${price}`}</span>
                    {discounted && (
                        <del><span className="visually-hidden">Regular price: </span>{`$${originalPrice}`}</del>
                    )}
                </h1>
                {monthly && <div className={style.priceAdditionalInfo}>/month</div>}
                {perUser && <div className={style.priceAdditionalInfo}>per user</div>}
            </div>
            <p className={style.paymentSummary}>
                {monthly ? `$${price * payments} total over ${payments} months` : "One-time payment"}
                {discounted && (
                    <strong className={style.savings}>
                        {`Save ${Math.round((originalPrice - price) / originalPrice * 100)}%`}
                    </strong>
                )}
            </p>
        </>
    );
};

const Pricing: React.FC<PricingProps> = ({
    courseId,
    saleActive = false,
    multiplayerUrl = MultiplayerCourse.url,
}) => {
    const [selectedIndieType, setSelectedIndieType] =
        React.useState<PriceItemType>(PriceItemType.INDIE_BASIC);
    const [includeMultiplayer, setIncludeMultiplayer] = React.useState(false);

    const isCpp = courseId === Courses.C_PLUS_PLUS;
    const bundleReady = isCpp && isBundlePlanReady(CppMultiplayerBundle.indieBasic)
        && isBundlePlanReady(CppMultiplayerBundle.pro);
    const bundleSelected = bundleReady && includeMultiplayer;
    const allowPaymentPlan = !bundleSelected || isBundlePlanReady(CppMultiplayerBundle.indiePaymentPlan);
    const indieType = allowPaymentPlan ? selectedIndieType : PriceItemType.INDIE_BASIC;

    const prices = Prices[courseId];

    const indieOriginalPrice =
        indieType === PriceItemType.INDIE_BASIC
            ? prices.INDIE_BASIC
            : prices.INDIE_PAYMENT_PLAN;

    const indieDiscountedPrice = saleActive
        ? (
            indieType === PriceItemType.INDIE_BASIC
                ? prices.INDIE_BASIC_DISCOUNTED
                : prices.INDIE_PAYMENT_PLAN_DISCOUNTED
        )
        : null;

    const proDiscountedPrice = saleActive
        ? prices.PRO_DISCOUNTED
        : null;

    const productIdForIndie = ProductId[courseId][indieType];
    let courseUrlForIndie =
        `${paymentBaseUrl}?product_id=${productIdForIndie}`;

    if (saleActive && prices.INDIE_COUPON_CODE) {
        courseUrlForIndie +=
            `&coupon_code=${encodeURIComponent(prices.INDIE_COUPON_CODE)}`;
    }

    let courseUrlForPro =
        `${paymentBaseUrl}?product_id=${ProductId[courseId].pro}`;

    if (saleActive && prices.PRO_COUPON_CODE) {
        courseUrlForPro +=
            `&coupon_code=${encodeURIComponent(prices.PRO_COUPON_CODE)}`;
    }

    const indieBundlePlan = indieType === PriceItemType.INDIE_PAYMENT_PLAN
        ? CppMultiplayerBundle.indiePaymentPlan : CppMultiplayerBundle.indieBasic;
    const indieBundle = bundleSelected && isBundlePlanReady(indieBundlePlan)
        ? getBundleOffer(indieBundlePlan, saleActive) : null;
    const proBundle = bundleSelected ? getBundleOffer(CppMultiplayerBundle.pro, saleActive) : null;
    const indiePrice = indieBundle ? indieBundle.price : (indieDiscountedPrice ?? indieOriginalPrice);
    const indieComparePrice = indieBundle ? indieBundle.originalPrice
        : (indieDiscountedPrice != null ? indieOriginalPrice : null);
    const proPrice = proBundle ? proBundle.price : (proDiscountedPrice ?? prices.PRO);
    const proComparePrice = proBundle ? proBundle.originalPrice
        : (proDiscountedPrice != null ? prices.PRO : null);

    return (
        <div className={style.wrapper}>
            {bundleReady && (
                <fieldset className={style.packageChoice}>
                    <legend>Choose Your Learning Path</legend>
                    <div className={style.packageOptions}>
                        <div className={style.packageOption}>
                            <input id="cpp-package-course" type="radio" name="cpp-package" checked={!bundleSelected}
                                aria-describedby="cpp-package-course-description cpp-package-course-list"
                                onChange={() => setIncludeMultiplayer(false)} />
                            <div className={style.packageDetails}>
                                <label htmlFor="cpp-package-course"><strong>C++ course</strong></label>
                                <p id="cpp-package-course-description" className={style.packageDescription}>For developers who want to build single-player games.</p>
                                <p className={style.packageContains}>Contains:</p>
                                <ul id="cpp-package-course-list" className={style.packageCourses}>
                                    <li>Professional Game Development in C++ and Unreal Engine 5</li>
                                </ul>
                            </div>
                        </div>
                        <div className={style.packageOption}>
                            <input id="cpp-package-bundle" type="radio" name="cpp-package" checked={bundleSelected}
                                aria-describedby="cpp-package-bundle-description cpp-package-bundle-list"
                                onChange={() => setIncludeMultiplayer(true)} />
                            <div className={style.packageDetails}>
                                <label htmlFor="cpp-package-bundle"><strong>C++ &amp; Multiplayer Bundle{!saleActive && ` (+$${CppMultiplayerBundle.indieBasic.price - prices.INDIE_BASIC} one-time)`}</strong></label>
                                <p id="cpp-package-bundle-description" className={style.packageDescription}>For developers who want to build single-player and multiplayer games.</p>
                                <p className={style.packageContains}>Contains:</p>
                                <ul id="cpp-package-bundle-list" className={style.packageCourses}>
                                    <li>Professional Game Development in C++ and Unreal Engine 5</li>
                                    <li>{MultiplayerCourse.title}</li>
                                </ul>
                                <a className={style.packageLink} href="#multiplayer-addon">Explore the multiplayer add-on</a>
                            </div>
                        </div>
                    </div>
                </fieldset>
            )}
            <div className={style.content}>
                <div className={style.priceItem}>
                    <div className={style.priceTitle}>
                        <h3>{bundleSelected ? "INDIE BUNDLE" : "INDIE"}</h3>
                        {allowPaymentPlan && (
                            <div className={style.paymentToggle} role="group" aria-label="Indie payment option">
                                <button
                                    type="button"
                                    aria-pressed={indieType === PriceItemType.INDIE_BASIC}
                                    onClick={() => setSelectedIndieType(PriceItemType.INDIE_BASIC)}
                                >
                                    Single payment
                                </button>
                                <button
                                    type="button"
                                    aria-pressed={indieType === PriceItemType.INDIE_PAYMENT_PLAN}
                                    onClick={() => setSelectedIndieType(PriceItemType.INDIE_PAYMENT_PLAN)}
                                >
                                    Payment plan
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={style.priceDescription}>
                        <p>For individuals and studios with less than $1M in annual revenue or funding.<br/><br/>Single User License.</p>
                        {isCpp && <p className={style.includes}>{bundleSelected
                            ? "Includes the C++ course and Multiplayer Programming add-on."
                            : "Includes the C++ course. Multiplayer is an optional add-on."}</p>}
                        <PriceDetails price={indiePrice} originalPrice={indieComparePrice}
                            monthly={indieType === PriceItemType.INDIE_PAYMENT_PLAN} />
                    </div>
                    <SignUpButton url={indieBundle?.url ?? courseUrlForIndie} />
                </div>
                <div className={style.priceItem}>
                    <div className={style.priceTitle}>
                        <h3>{bundleSelected ? "PRO BUNDLE" : "PRO"}</h3>
                    </div>
                    <div className={style.priceDescription}>
                        <p>For employees working at studios with $1M+ in annual revenue or funding.<br/><br/>Single User License.</p>
                        {isCpp && <p className={style.includes}>{bundleSelected
                            ? "Includes the C++ course and Multiplayer Programming add-on."
                            : "Includes the C++ course. Multiplayer is an optional add-on."}</p>}
                        <PriceDetails price={proPrice} originalPrice={proComparePrice} perUser />
                    </div>
                    <SignUpButton url={proBundle?.url ?? courseUrlForPro} />
                </div>
            </div>
            {isCpp && !bundleReady && (
                <aside className={style.addOnNotice} aria-label="Optional multiplayer add-on">
                    <strong>Want to learn multiplayer too?</strong>
                    <p>Add {MultiplayerCourse.title} to your learning path. Available separately for ${MultiplayerCourse.standalonePrice}.</p>
                    <a href={multiplayerUrl}>View multiplayer course &rarr;</a>
                </aside>
            )}
        </div>
    );
}

export default Pricing;
