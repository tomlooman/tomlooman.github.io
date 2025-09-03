import React from "react";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Prices } from "./constants/Prices";
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

const Pricing: React.FC<PricingProps> = ({ courseId }) => {
    const [selectedIndieType, setSelectedIndieType] = React.useState<PriceItemType>(PriceItemType.INDIE_BASIC);

    const indieOriginalPrice = selectedIndieType === PriceItemType.INDIE_BASIC
        ? Prices[courseId].INDIE_BASIC : Prices[courseId].INDIE_PAYMENT_PLAN;

    const indieDiscountedPrice = selectedIndieType === PriceItemType.INDIE_BASIC
        ? Prices[courseId].INDIE_BASIC_DISCOUNTED
        : Prices[courseId].INDIE_PAYMENT_PLAN_DISCOUNTED;

    const indiePaymentPlanPrice = Prices[courseId].INDIE_PAYMENT_PLAN_DISCOUNTED ? Prices[courseId].INDIE_PAYMENT_PLAN_DISCOUNTED : Prices[courseId].INDIE_PAYMENT_PLAN;

    return (
        <div className={style.wrapper}>
            <h2>Get Started Today!</h2>
            <div className={style.content}>
                <div className={style.priceItem}>
                    <div className={style.priceTitle}>
                        <h5>Indie</h5>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small" classes={{ root: style.indieTypeSelect }}>
                            <Select
                                id="indie-type"
                                value={selectedIndieType}
                                onChange={(event: SelectChangeEvent) => setSelectedIndieType(event.target.value as PriceItemType)}
                            >
                                <MenuItem value={PriceItemType.INDIE_BASIC} sx={{ fontSize: '0.9rem' }}>Single payment</MenuItem>
                                <MenuItem value={PriceItemType.INDIE_PAYMENT_PLAN} sx={{ fontSize: '0.9rem' }}>Payment plan</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={style.priceDescription}>
                        <p>Single User License. For individuals, educators and studios with less than $1M in yearly revenue/funding.</p>
                        <div>
                            <h1>{`$${indieDiscountedPrice || indieOriginalPrice}`} {!!indieDiscountedPrice && <span>{`$${indieOriginalPrice}`}</span>}</h1>
                            <div className={style.priceAdditionalInfo}>{selectedIndieType === PriceItemType.INDIE_PAYMENT_PLAN && `(5 payments of $${indiePaymentPlanPrice / 5}/month)`}</div>
                        </div>
                    </div>
                    <SignUpButton />
                </div>
                <div className={style.priceItem}>
                    <div className={style.priceTitle}>
                        <h5>Pro (Studio)</h5>
                    </div>
                    <div className={style.priceDescription}>
                        <p>Single User License. For users within studios with over $1M in yearly revenue/funding.</p>
                        <div>
                            <h1>{`$${Prices[courseId].PRO_DISCOUNTED || Prices[courseId].PRO}`} {!!Prices[courseId].PRO_DISCOUNTED && <span>{`$${Prices[courseId].PRO}`}</span>}</h1>
                            <div className={style.priceAdditionalInfo} />
                        </div>
                    </div>
                    <SignUpButton />
                </div>
            </div>
        </div>
    );
}

export default Pricing;