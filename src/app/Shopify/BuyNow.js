import { useEffect, useRef } from 'react';
import ShopifyBuy from '@shopify/buy-button-js';

const shopifyClient = ShopifyBuy.buildClient({
    domain: 'accounts-3889.myshopify.com',
    storefrontAccessToken: process.env.NEXT_PUBLIC_STOREFRONT_API_KEY
});

const ui = ShopifyBuy.UI.init(shopifyClient);

export default function BuyNow({ shopItemId, uniqueElementId, label }) {
    const initialised = useRef(false)
    useEffect(() => {
        if (!initialised.current) {
            const buttonBackground = getComputedStyle(document.body).getPropertyValue('--foreground')
            const buttonColor = getComputedStyle(document.body).getPropertyValue('--background')
            ui.createComponent('product', {
                id: shopItemId,
                node: document.getElementById(`buy-now-${shopItemId}-${uniqueElementId}`),
                options: {
                    toggle: {
                        iframe: false
                    },
                    cart: {
                        styles: {
                            button: {
                                "background-color": buttonColor,
                                "color": buttonBackground,
                                ":hover": {
                                    "background-color": buttonBackground,
                                    "color": buttonColor,
                                    opacity: 0.8
                                }
                            }
                        },
                    },
                    product: {
                        iframe: false,
                        buttonDestination: 'checkout',
                        contents: {
                                img: false,
                                title: false,
                                variantTitle: false,
                                price: false,
                                options: false,
                                quantity: false, // determines whether to show any quantity inputs at all
                                quantityIncrement: false, // button to increase quantity
                                quantityDecrement: false, // button to decrease quantity
                                quantityInput: true, // input field to directly set quantity
                                button: true,
                                description: false
                        },
                        text: {
                          button: label
                        }
                    },
                }
            });
        }
        initialised.current = true
    });
    // @ts-ignore
    const content = `<style>

    .shopify-buy-frame--toggle {
        top: 95% !important;
    }

    .shopify-buy__cart-toggle {
        cursor: pointer;
        padding: 1rem 2rem 1rem 1rem;
        color: var(--background);
        border-radius: 1rem 0 0 1rem;
        background-color: var(--foreground);
        font-family: 'TT_NEORIS';
        top: 95% !important;
        transform: translateX(1rem);
        transition: transform 0.3s ease;
        &:hover {
            transform: translateX(0);
        }
    }

    .shopify-buy__icon-cart {
        height: 1.5rem;
    }

    .shopify-buy--visually-hidden {
        display: none;
    }

    .shopify-buy__cart-toggle__count {
        position: absolute;
        top: 0.25rem;
        left: 1.75rem;

        font-size: 0.7rem;
    
        width: 2em;
        height: 2em;
        box-sizing: initial;
    
        background: var(--background);
        // border: 0.1em solid black;
        color: var(--foreground);
        text-align: center;
        border-radius: 50%;    
    
        line-height: 2em;
        box-sizing: content-box;   
    }


    .shopify-buy-frame::after {
        content: '›';
        position: absolute;
        color: var(--background);
        padding: 0.6rem 0.8rem 0.7rem 0.9rem;
        align-content: center;
        line-height: 0.8rem;
        // border-radius: 999px;
        // background-color: var(--foreground);
        font-size: 1.75rem;
        top: 0;
        left: 0;
        width: 36px;
    }

    .shopify-buy-frame::before {
        content: '›';
        position: absolute;
        color: transparent;
        padding: 0.6rem 0.8rem 0.7rem 0.9rem;
        align-content: center;
        line-height: 0.8rem;
        border-radius: 999px;
        background-color: var(--foreground);
        font-size: 1.75rem;
        top: 0;
        left: 0;
        width: 36px;
        height: 36px;
        transition: width 0.3s cubic-bezier(0.25, 0, 0, 1);
    }

    .shopify-buy__product__price {
        font-family: 'TT_Neoris';
        font-size: 1.5rem;
        color: var(--foreground);
        text-align: center;
        margin-bottom: 1rem;
    }

    .shopify-buy__btn-wrapper {
        font-family: 'TT_Neoris';
        color: var(--background);
        padding: 0.5rem 1rem 0.5rem 1.25rem;
        font-weight: 480;
        overflow-wrap: break-word;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: opacity 0.3s cubic-bezier(0.25, 0, 0, 1);
        &:hover {
            opacity: 0.8;
        }
    }
    
    
    .shopify-buy__btn  {
        padding-left: 1.5rem;
        transition-properties: padding, color;
        transition-duration: 0.3s;
        transition-timing-function: cubic-bezier(0.25, 0, 0, 1);
        font-size: 20px;
        font-weight: 480;
        line-height: 100%;
        color: var(--foreground);
        z-index: 100;
    }

    .btn-wrapper:hover .shopify-buy__btn  {
        padding-left: 0.75rem;
        color: var(--background) !important;
        opacity: 1;
    }

    .btn-wrapper:hover .shopify-buy-frame::before {
        width: 100%;
    }

    .visuallyhidden {
        display: none;
    }


  @media (max-width: 500px) {
    .shopify-buy__btn-wrapper {
        padding: 0.4rem 0.9rem 0.4rem 1.15rem;
    }

    .shopify-buy__btn  {
        padding-left: 1.2rem;
        font-size: 16px;
    }

    .shopify-buy-frame::after, 
    .shopify-buy-frame::before {
        padding: 0.45rem 0.7rem 0.6rem 0.8rem;
    }

    .shopify-buy-frame::after {
        line-height: 0.8rem;
        font-size: 1.25rem;
        width: 30px;
    }

    .shopify-buy-frame::before {
        line-height: 0.8rem;
        font-size: 1.25rem;
        width: 30px;
        height: 30px;
        transition: width 0.3s cubic-bezier(0.25, 0, 0, 1);
    }
  }
    </style>`

    return (
        <div className="relative btn-wrapper">
            <div dangerouslySetInnerHTML={{__html: content}}></div>
            <div id={`buy-now-${shopItemId}-${uniqueElementId}`} />
        </div>
    );
}