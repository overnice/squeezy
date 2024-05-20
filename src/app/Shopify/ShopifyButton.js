import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const DynamicBuyNow = dynamic(() => import('/src/app/Shopify/BuyNow.js'), {
    ssr: false
});

export default function Products(props) {
    useEffect(() => {
        setTimeout(() => {
            const style = getComputedStyle(document.body)
            const foregroundColor = style.getPropertyValue('--foreground');
            document.querySelector('[name=frame-product-8815969796426]')?.style.setProperty('--foreground', foregroundColor);

        }, 1000)
    })
    return (
        <>
            {/* {props.ids?.map((id) => ( */}
                <div key={props.id} className="relative btn-wrapper">
                    <DynamicBuyNow  id={props.id} />
                </div>
            {/* ))} */}
        </>
    );
};