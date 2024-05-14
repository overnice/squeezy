import { useEffect, useRef } from 'react';
import ShopifyBuy from '@shopify/buy-button-js';
import styles from './shopify.module.css'

const shopifyClient = ShopifyBuy.buildClient({
    domain: 'accounts-3889.myshopify.com',
    storefrontAccessToken: process.env.NEXT_PUBLIC_STOREFRONT_API_KEY
});

const ui = ShopifyBuy.UI.init(shopifyClient);

export default function BuyNow({ id }) {
    const initialised = useRef(false)
    useEffect(() => {
        if (!initialised.current) {
            const buttonBackground = getComputedStyle(document.body).getPropertyValue('--foreground')
            const buttonColor = getComputedStyle(document.body).getPropertyValue('--background')
            ui.createComponent('product', {
                id,
                node: document.getElementById(`buy-now-${id}`),
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
                                price: true,
                                options: false,
                                quantity: false, // determines whether to show any quantity inputs at all
                                quantityIncrement: false, // button to increase quantity
                                quantityDecrement: false, // button to decrease quantity
                                quantityInput: true, // input field to directly set quantity
                                button: true,
                                description: false
                        },
                        styles: {
                            button: {
                                "background-color": buttonBackground,
                                "color": buttonColor,
                                ":hover": {
                                    "background-color": buttonBackground,
                                    "color": buttonColor,
                                    opacity: 0.8
                                }
                            }
                        },
                        text: {
                          button: "Buy now"
                        }
                    },
                }
            });
        }
        initialised.current = true
    });
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





    .shopify-buy__product__price {
        font-family: 'TT_Neoris';
        font-size: 1.5rem;
        color: var(--foreground);
        text-align: center;
        margin-bottom: 1rem;
    }

    .shopify-buy__btn-wrapper {
        font-family: 'TT_Neoris';
        background-color: var(--foreground);
        color: var(--background);
        padding: 0.75rem 1.5rem;
        border-radius: 2rem
        font-weight: 480;
        border-radius: 100px;
        padding: 8px 20px;
        overflow-wrap: break-word;
        padding: 0.5rem 1.25rem;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 1.5rem;
        transition: opacity 0.5s ease;
        &:hover {
            opacity: 0.8;
        }
    }

    .visuallyhidden {
        display: none;
    }
    </style>`

    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: content}}></div>
            <div className={styles.shopify} id={`buy-now-${id}`} />
        </div>
    );
}