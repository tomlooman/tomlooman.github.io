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
const indiePaymentCount = 6;

interface PriceDetailsProps {
    price: number;
    originalPrice: number | null;
    monthly?: boolean;
    perUser?: boolean;
}

const PriceDetails = ({ price, originalPrice, monthly, perUser }: PriceDetailsProps) => {
    const payments = monthly ? indiePaymentCount : 1;
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
    const singleBundle = bundleReady ? getBundleOffer(CppMultiplayerBundle.indieBasic, saleActive) : null;
    const monthlyBundle = bundleReady && isBundlePlanReady(CppMultiplayerBundle.indiePaymentPlan)
        ? getBundleOffer(CppMultiplayerBundle.indiePaymentPlan, saleActive) : null;
    const proBundle = bundleReady ? getBundleOffer(CppMultiplayerBundle.pro, saleActive) : null;
    const bundleSelected = bundleReady && includeMultiplayer;
    const allowPaymentPlan = !bundleSelected || monthlyBundle != null;
    const indieType = allowPaymentPlan ? selectedIndieType : PriceItemType.INDIE_BASIC;

    const prices = Prices[courseId];

    const singlePrice = (saleActive ? prices.INDIE_BASIC_DISCOUNTED : null) ?? prices.INDIE_BASIC;
    const monthlyPrice = (saleActive ? prices.INDIE_PAYMENT_PLAN_DISCOUNTED : null) ?? prices.INDIE_PAYMENT_PLAN;
    const proCoursePrice = (saleActive ? prices.PRO_DISCOUNTED : null) ?? prices.PRO;
    const singleExtra = singleBundle && singleBundle.price - singlePrice;

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

    const monthly = indieType === PriceItemType.INDIE_PAYMENT_PLAN;
    const indieBundle = bundleSelected ? (monthly ? monthlyBundle : singleBundle) : null;
    const selectedProBundle = bundleSelected ? proBundle : null;
    const indiePrice = indieBundle?.price ?? (monthly ? monthlyPrice : singlePrice);
    const indieComparePrice = indieBundle ? indieBundle.originalPrice : (monthly ? prices.INDIE_PAYMENT_PLAN : prices.INDIE_BASIC);
    const proPrice = selectedProBundle?.price ?? proCoursePrice;
    const proComparePrice = selectedProBundle ? selectedProBundle.originalPrice : prices.PRO;

    return (
        <div className={style.wrapper}>
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
                        <PriceDetails price={indiePrice} originalPrice={indieComparePrice}
                            monthly={monthly} />
                    </div>
                    <SignUpButton url={indieBundle?.url ?? courseUrlForIndie} />
                </div>
                <div className={style.priceItem}>
                    <div className={style.priceTitle}>
                        <h3>{bundleSelected ? "PRO BUNDLE" : "PRO"}</h3>
                    </div>
                    <div className={style.priceDescription}>
                        <p>For employees working at studios with $1M+ in annual revenue or funding.<br/><br/>Single User License.</p>
                        <PriceDetails price={proPrice} originalPrice={proComparePrice} perUser />
                    </div>
                    <SignUpButton url={selectedProBundle?.url ?? courseUrlForPro} />
                </div>
            </div>
            {bundleReady && (
                <div className={style.addOnOption}>
                    <label>
                        <input type="checkbox" checked={bundleSelected} aria-describedby="multiplayer-description"
                            onChange={event => setIncludeMultiplayer(event.currentTarget.checked)} />
                        <strong>Include the Multiplayer Programming add-on (+${singleExtra})</strong>
                    </label>
                    <div id="multiplayer-description" className={style.addOnDescription}>
                        <p>The core C++ course curriculum focuses on <strong>single-player gameplay programming</strong>.</p>
                        <p>The additional lessons guide you through adding <strong>multiplayer co-op support</strong> to that same project.</p>
                        <p>Available with Indie and Pro. <a href="#multiplayer-addon">Explore the multiplayer add-on</a></p>
                    </div>
                    <img className={style.addOnThumbnail} src="/assets/images/multiplayer-programming-ue5.jpg"
                        alt="Multiplayer Programming, UE 5.8+" width={900} height={506} loading="lazy" />
                </div>
            )}
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
