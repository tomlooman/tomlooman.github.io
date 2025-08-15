import React from "react";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import style from "./Pricing.module.scss";
import { Prices } from "./constants/Prices";
import SignUpButton from "./components/SignUpButton";

enum PriceItemType {
    INDIE_BASIC = "indieBasic",
    INDIE_PAYMENT_PLAN = "indiePaymentPlan",
    PRO = "pro",
}

const Pricing = () => {
    const [selectedIndieType, setSelectedIndieType] = React.useState<PriceItemType>(PriceItemType.INDIE_BASIC);

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
                            <h1>{`$${selectedIndieType === PriceItemType.INDIE_BASIC ? Prices.INDIE_BASIC : Prices.INDIE_PAYMENT_PLAN}`}</h1>
                            <div className={style.priceAdditionalInfo}>{selectedIndieType === PriceItemType.INDIE_PAYMENT_PLAN && `(5 payments of $${Prices.INDIE_PAYMENT_PLAN / 5}/month)`}</div>
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
                            <h1>{`$${Prices.PRO}`}</h1>
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