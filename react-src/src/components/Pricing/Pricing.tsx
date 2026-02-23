import React from "react";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Prices, ProductId } from "./constants/Prices";
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
}

const paymentBaseUrl = "https://courses.tomlooman.com/purchase";

const Pricing: React.FC<PricingProps> = ({ courseId }) => {
    const [selectedIndieType, setSelectedIndieType] = React.useState<PriceItemType>(PriceItemType.INDIE_BASIC);

    const indieOriginalPrice = selectedIndieType === PriceItemType.INDIE_BASIC
        ? Prices[courseId].INDIE_BASIC : Prices[courseId].INDIE_PAYMENT_PLAN;

    const indieDiscountedPrice = selectedIndieType === PriceItemType.INDIE_BASIC
        ? Prices[courseId].INDIE_BASIC_DISCOUNTED
        : Prices[courseId].INDIE_PAYMENT_PLAN_DISCOUNTED;

    const indiePaymentPlanPrice = Prices[courseId].INDIE_PAYMENT_PLAN_DISCOUNTED ? Prices[courseId].INDIE_PAYMENT_PLAN_DISCOUNTED : Prices[courseId].INDIE_PAYMENT_PLAN;

    const productIdForIndie = ProductId[courseId][selectedIndieType];
    let courseUrlForIndie = `${paymentBaseUrl}?product_id=${productIdForIndie}`;

    if (Prices[courseId].INDIE_COUPON_CODE) {
        courseUrlForIndie += `&coupon_code=${Prices[courseId].INDIE_COUPON_CODE}`;
    }

    let courseUrlForPro = `${paymentBaseUrl}?product_id=${ProductId[courseId].pro}`;

    if (Prices[courseId].PRO_COUPON_CODE) {
        courseUrlForPro += `&coupon_code=${Prices[courseId].PRO_COUPON_CODE}`;
    }

    return (
        <div className={style.wrapper}>
            <div className={style.content}>
                <div className={style.priceItem}>
                    <div className={style.priceTitle}>
                        <h3>INDIE</h3>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small" classes={{ root: style.indieTypeSelect }}>
                            <Select
                                id="indie-type"
                                value={selectedIndieType}
                                onChange={(event: SelectChangeEvent) => setSelectedIndieType(event.target.value as PriceItemType)}
                                MenuProps={{ disableScrollLock: true}}
                            >
                                <MenuItem value={PriceItemType.INDIE_BASIC} sx={{ fontSize: '0.9rem' }}>Single payment</MenuItem>
                                <MenuItem value={PriceItemType.INDIE_PAYMENT_PLAN} sx={{ fontSize: '0.9rem' }}>Payment plan</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={style.priceDescription}>
                        <p>For individuals, educators and studios with less than $1M in yearly revenue/funding.<br/><br/>Single User License.</p>
                        <div className={style.priceAmount}>
                            {selectedIndieType === PriceItemType.INDIE_PAYMENT_PLAN && <div className={style.priceAdditionalInfo}>5 payments of</div>}
                            <h1>{`$${indieDiscountedPrice || indieOriginalPrice}`} {!!indieDiscountedPrice && <span>{`$${indieOriginalPrice}`}</span>}</h1>
                            {selectedIndieType === PriceItemType.INDIE_PAYMENT_PLAN && <div className={style.priceAdditionalInfo}>/month</div>}
                        </div>
                    </div>
                    <SignUpButton url={courseUrlForIndie} />
                </div>
                <div className={style.priceItem}>
                    <div className={style.priceTitle}>
                        <h3>PRO</h3>
                    </div>
                    <div className={style.priceDescription}>
                        <p>For students from studios with over $1M in yearly revenue/funding.<br/><br/>Single User License.</p>
                        <div className={style.priceAmount}>
                            <h1>{`$${Prices[courseId].PRO_DISCOUNTED || Prices[courseId].PRO}`} {!!Prices[courseId].PRO_DISCOUNTED && <span>{`$${Prices[courseId].PRO}`}</span>}</h1>
                            <div className={style.priceAdditionalInfo}> per user</div>
                        </div>
                    </div>
                    <SignUpButton url={courseUrlForPro} />
                </div>
            </div>
        </div>
    );
}

export default Pricing;