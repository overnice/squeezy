import { useEffect, useRef } from 'react';
import ShopifyBuy from '@shopify/buy-button-js';

const shopifyClient = ShopifyBuy.buildClient({
    domain: 'accounts-3889.myshopify.com',
    storefrontAccessToken: process.env.NEXT_PUBLIC_STOREFRONT_API_KEY
});

const ui = ShopifyBuy.UI.init(shopifyClient);

export default function BuyNow({ shopItemId, uniqueElementId, label, compact = false }) {
    const initialised = useRef(false)

    const widthClasses = compact ? 'w-7 h-7' : 'w-10 h-10'
    const textClasses = compact ? 'text-lg' : 'text-xl'
    const transformClasses = compact ? 'group-hover:-translate-x-2' : 'group-hover:-translate-x-4'
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
                        templates: {
                            button: `
                                <div class="group cursor-pointer flex items-center gap-2.5 ${textClasses} text-[var(--foreground)] hocus:text-[var(--foreground)] mt-2xs">
                                    <div class="transition-all rounded-full group-hover:w-full absolute top-0 left-0 ${widthClasses} bg-[var(--foreground)]"></div>
                                    <div class="relative ${widthClasses} rounded-full inline-block transition-transform group-hover:[transform:rotateX(180deg)] content-center">
                                        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg"  class="pl-[2px] mx-auto text-[var(--background)] stroke-current h-[14px] ${compact ? 'stroke-[2.9px]' : 'stroke-[3px]'}">
                                            <path d="M2 2L9 9L2 16"/>
                                        </svg>
                                    </div>
                                    <div class="transition-all group-hover:!text-[var(--background)] w-fit ${transformClasses}">${label}</div>
                                </div>


                                `
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
  }
    </style>`

    return (
        <>
            <div dangerouslySetInnerHTML={{__html: content}}></div>
            <div id={`buy-now-${shopItemId}-${uniqueElementId}`} />
        </>
    );
}