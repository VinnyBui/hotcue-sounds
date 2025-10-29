module.exports=[96605,a=>{"use strict";async function b(a,c={}){try{let b=await fetch("https://hotcue-sounds.myshopify.com/api/2023-10/graphql.json",{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":"bf63f1f6fae30388d8dbd56dffff3ca2"},body:JSON.stringify({query:a,variables:c}),next:{revalidate:3600}});if(!b.ok)throw Error(`Shopify API error: ${b.status} ${b.statusText}`);let d=await b.json();if(d.errors)throw console.error("Shopify GraphQL errors:",d.errors),Error(`Shopify GraphQL errors: ${JSON.stringify(d.errors)}`);return d.data}catch(a){throw console.error("Shopify fetch failed:",a),a}}async function c(a=10){let d=`
    query GetProducts($limit: Int!) {
      products(first: $limit) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
                }
              }
            }
            previewAudio: metafield(namespace: "custom", key: "preview_audio_url") {
              reference {
                ... on GenericFile {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;return(await b(d,{limit:a})).products.edges.map(a=>({...a.node,audioPreviewUrl:a.node.previewAudio?.reference?.url}))}async function d(a,c=10){let e=`
    query GetCollectionProducts($handle: String!, $limit: Int!) {
      collectionByHandle(handle: $handle) {
        products(first: $limit) {
          edges {
            node {
              id
              title
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 2) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                    quantityAvailable
                  }
                }
              }
              previewAudio: metafield(namespace: "custom", key: "preview_audio_url") {
                reference {
                  ... on GenericFile {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  `,f=await b(e,{handle:a,limit:c});return f.collectionByHandle?f.collectionByHandle.products.edges.map(a=>({...a.node,audioPreviewUrl:a.node.previewAudio?.reference?.url})):[]}async function e(a){let c=`
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 2) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              quantityAvailable
            }
          }
        }
        previewAudio: metafield(namespace: "custom", key: "preview_audio_url") {
          reference {
            ... on GenericFile {
              url
            }
          }
        }
      }
    }
  `,d=await b(c,{handle:a});return d.productByHandle?{...d.productByHandle,audioPreviewUrl:d.productByHandle.previewAudio?.reference?.url}:null}async function f(a){let c=`
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                      images(first: 2) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,d=await b(c,{input:a?{lines:a}:{}});if(d.cartCreate.userErrors?.length>0)throw Error(d.cartCreate.userErrors[0].message);return d.cartCreate.cart}async function g(a){let c=`
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 2) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `,d=await b(c,{cartId:a});return d.cart?d.cart:null}async function h(a,c,d){let e=`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!){
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                      images(first: 2) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,f=await b(e,{cartId:a,lines:[{merchandiseId:c,quantity:d}]});if(f.cartLinesAdd.userErrors?.length>0)throw Error(f.cartLinesAdd.userErrors[0].message);return f.cartLinesAdd.cart}async function i(a,c,d){let e=`
    mutation updateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                      images(first: 2) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,f=await b(e,{cartId:a,lines:[{id:c,quantity:d}]});if(f.cartLinesUpdate.userErrors?.length>0)throw Error(f.cartLinesUpdate.userErrors[0].message);return f.cartLinesUpdate.cart}async function j(a,c){let d=`
    mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                      images(first: 2) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,e=await b(d,{cartId:a,lineIds:c});if(e.cartLinesRemove.userErrors?.length>0)throw Error(e.cartLinesRemove.userErrors[0].message);return e.cartLinesRemove.cart}async function k(a,c=10){let d=`
    query getCustomerOrders($customerAccessToken: String!, $first: Int!) {
      customer(customerAccessToken: $customerAccessToken) {
        orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 50) {
                edges {
                  node {
                    title
                    quantity
                    originalTotalPrice {
                      amount
                      currencyCode
                    }
                    variant {
                      id
                      title
                      image {
                        url
                        altText
                      }
                      product {
                        id
                        handle
                        title
                        previewAudio: metafield(namespace: "custom", key: "preview_audio_url") {
                          reference {
                            ... on GenericFile {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,e=await b(d,{customerAccessToken:a,first:c});return e.customer?e.customer.orders.edges.map(a=>({...a.node,lineItems:{edges:a.node.lineItems.edges.map(a=>({node:{...a.node,variant:a.node.variant?{...a.node.variant,product:{...a.node.variant.product,audioPreviewUrl:a.node.variant.product.previewAudio?.reference?.url}}:void 0}}))}})):[]}a.s(["addToCart",()=>h,"createCart",()=>f,"getCart",()=>g,"getCustomerOrders",()=>k,"getProducts",()=>c,"getProductsByCollection",()=>d,"getProductsByHandle",()=>e,"removeFromCart",()=>j,"shopifyFetch",()=>b,"updateCartLine",()=>i])},9270,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.AppRouterContext},38783,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored["react-ssr"].ReactServerDOMTurbopackClient},36313,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.HooksClientContext},18341,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.ServerInsertedHtml},18622,(a,b,c)=>{b.exports=a.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},20635,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},32319,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},42602,(a,b,c)=>{"use strict";b.exports=a.r(18622)},87924,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored["react-ssr"].ReactJsxRuntime},72131,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored["react-ssr"].React},35112,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored["react-ssr"].ReactDOM},51234,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"HandleISRError",{enumerable:!0,get:function(){return e}});let d=a.r(56704).workAsyncStorage;function e(a){let{error:b}=a;if(d){let a=d.getStore();if((null==a?void 0:a.isRevalidate)||(null==a?void 0:a.isStaticGeneration))throw console.error(b),b}return null}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},40622,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"default",{enumerable:!0,get:function(){return g}});let d=a.r(87924),e=a.r(51234),f={error:{fontFamily:'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',height:"100vh",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},text:{fontSize:"14px",fontWeight:400,lineHeight:"28px",margin:"0 8px"}},g=function(a){let{error:b}=a,c=null==b?void 0:b.digest;return(0,d.jsxs)("html",{id:"__next_error__",children:[(0,d.jsx)("head",{}),(0,d.jsxs)("body",{children:[(0,d.jsx)(e.HandleISRError,{error:b}),(0,d.jsx)("div",{style:f.error,children:(0,d.jsxs)("div",{children:[(0,d.jsxs)("h2",{style:f.text,children:["Application error: a ",c?"server":"client","-side exception has occurred while loading ",window.location.hostname," (see the"," ",c?"server logs":"browser console"," for more information)."]}),c?(0,d.jsx)("p",{style:f.text,children:"Digest: "+c}):null]})})]})]})};("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},99570,187,a=>{"use strict";a.s(["Button",()=>j],99570);var b=a.i(87924),c=a.i(11011);a.s(["cva",()=>g],187);var d=a.i(98621);let e=a=>"boolean"==typeof a?`${a}`:0===a?"0":a,f=d.clsx,g=(a,b)=>c=>{var d;if((null==b?void 0:b.variants)==null)return f(a,null==c?void 0:c.class,null==c?void 0:c.className);let{variants:g,defaultVariants:h}=b,i=Object.keys(g).map(a=>{let b=null==c?void 0:c[a],d=null==h?void 0:h[a];if(null===b)return null;let f=e(b)||e(d);return g[a][f]}),j=c&&Object.entries(c).reduce((a,b)=>{let[c,d]=b;return void 0===d||(a[c]=d),a},{});return f(a,i,null==b||null==(d=b.compoundVariants)?void 0:d.reduce((a,b)=>{let{class:c,className:d,...e}=b;return Object.entries(e).every(a=>{let[b,c]=a;return Array.isArray(c)?c.includes({...h,...j}[b]):({...h,...j})[b]===c})?[...a,c,d]:a},[]),null==c?void 0:c.class,null==c?void 0:c.className)};var h=a.i(68114);let i=g("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2 has-[>svg]:px-3",sm:"h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",lg:"h-10 rounded-md px-6 has-[>svg]:px-4",icon:"size-9"}},defaultVariants:{variant:"default",size:"default"}});function j({className:a,variant:d,size:e,asChild:f=!1,...g}){let j=f?c.Slot:"button";return(0,b.jsx)(j,{"data-slot":"button",className:(0,h.cn)(i({variant:d,size:e,className:a})),...g})}},30553,a=>{"use strict";a.s(["Primitive",()=>f,"dispatchDiscreteCustomEvent",()=>g]);var b=a.i(72131),c=a.i(35112),d=a.i(11011),e=a.i(87924),f=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"].reduce((a,c)=>{let f=(0,d.createSlot)(`Primitive.${c}`),g=b.forwardRef((a,b)=>{let{asChild:d,...g}=a;return(0,e.jsx)(d?f:c,{...g,ref:b})});return g.displayName=`Primitive.${c}`,{...a,[c]:g}},{});function g(a,b){a&&c.flushSync(()=>a.dispatchEvent(b))}},7554,a=>{"use strict";function b(a,c,{checkForDefaultPrevented:d=!0}={}){return function(b){if(a?.(b),!1===d||!b.defaultPrevented)return c?.(b)}}a.s(["composeEventHandlers",()=>b])},50104,a=>{"use strict";a.s(["createContext",()=>d,"createContextScope",()=>e]);var b=a.i(72131),c=a.i(87924);function d(a,d){let e=b.createContext(d),f=a=>{let{children:d,...f}=a,g=b.useMemo(()=>f,Object.values(f));return(0,c.jsx)(e.Provider,{value:g,children:d})};return f.displayName=a+"Provider",[f,function(c){let f=b.useContext(e);if(f)return f;if(void 0!==d)return d;throw Error(`\`${c}\` must be used within \`${a}\``)}]}function e(a,d=[]){let f=[],g=()=>{let c=f.map(a=>b.createContext(a));return function(d){let e=d?.[a]||c;return b.useMemo(()=>({[`__scope${a}`]:{...d,[a]:e}}),[d,e])}};return g.scopeName=a,[function(d,e){let g=b.createContext(e),h=f.length;f=[...f,e];let i=d=>{let{scope:e,children:f,...i}=d,j=e?.[a]?.[h]||g,k=b.useMemo(()=>i,Object.values(i));return(0,c.jsx)(j.Provider,{value:k,children:f})};return i.displayName=d+"Provider",[i,function(c,f){let i=f?.[a]?.[h]||g,j=b.useContext(i);if(j)return j;if(void 0!==e)return e;throw Error(`\`${c}\` must be used within \`${d}\``)}]},function(...a){let c=a[0];if(1===a.length)return c;let d=()=>{let d=a.map(a=>({useScope:a(),scopeName:a.scopeName}));return function(a){let e=d.reduce((b,{useScope:c,scopeName:d})=>{let e=c(a)[`__scope${d}`];return{...b,...e}},{});return b.useMemo(()=>({[`__scope${c.scopeName}`]:e}),[e])}};return d.scopeName=c.scopeName,d}(g,...d)]}},72752,a=>{"use strict";a.s(["useLayoutEffect",()=>c]);var b=a.i(72131),c=globalThis?.document?b.useLayoutEffect:()=>{}},92843,a=>{"use strict";a.s(["useId",()=>f]);var b=a.i(72131),c=a.i(72752),d=b[" useId ".trim().toString()]||(()=>void 0),e=0;function f(a){let[f,g]=b.useState(d());return(0,c.useLayoutEffect)(()=>{a||g(a=>a??String(e++))},[a]),a||(f?`radix-${f}`:"")}},25152,77192,a=>{"use strict";a.s(["useControllableState",()=>e],25152);var b=a.i(72131),c=a.i(72752);b[" useEffectEvent ".trim().toString()],b[" useInsertionEffect ".trim().toString()];var d=b[" useInsertionEffect ".trim().toString()]||c.useLayoutEffect;function e({prop:a,defaultProp:c,onChange:e=()=>{},caller:f}){let[g,h,i]=function({defaultProp:a,onChange:c}){let[e,f]=b.useState(a),g=b.useRef(e),h=b.useRef(c);return d(()=>{h.current=c},[c]),b.useEffect(()=>{g.current!==e&&(h.current?.(e),g.current=e)},[e,g]),[e,f,h]}({defaultProp:c,onChange:e}),j=void 0!==a,k=j?a:g;{let c=b.useRef(void 0!==a);b.useEffect(()=>{let a=c.current;if(a!==j){let b=j?"controlled":"uncontrolled";console.warn(`${f} is changing from ${a?"controlled":"uncontrolled"} to ${b}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`)}c.current=j},[j,f])}return[k,b.useCallback(b=>{if(j){let c="function"==typeof b?b(a):b;c!==a&&i.current?.(c)}else h(b)},[j,a,h,i])]}Symbol("RADIX:SYNC_STATE"),a.s(["Presence",()=>g],77192);var f=a.i(70121),g=a=>{let{present:d,children:e}=a,g=function(a){var d,e;let[f,g]=b.useState(),i=b.useRef(null),j=b.useRef(a),k=b.useRef("none"),[l,m]=(d=a?"mounted":"unmounted",e={mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}},b.useReducer((a,b)=>e[a][b]??a,d));return b.useEffect(()=>{let a=h(i.current);k.current="mounted"===l?a:"none"},[l]),(0,c.useLayoutEffect)(()=>{let b=i.current,c=j.current;if(c!==a){let d=k.current,e=h(b);a?m("MOUNT"):"none"===e||b?.display==="none"?m("UNMOUNT"):c&&d!==e?m("ANIMATION_OUT"):m("UNMOUNT"),j.current=a}},[a,m]),(0,c.useLayoutEffect)(()=>{if(f){let a,b=f.ownerDocument.defaultView??window,c=c=>{let d=h(i.current).includes(CSS.escape(c.animationName));if(c.target===f&&d&&(m("ANIMATION_END"),!j.current)){let c=f.style.animationFillMode;f.style.animationFillMode="forwards",a=b.setTimeout(()=>{"forwards"===f.style.animationFillMode&&(f.style.animationFillMode=c)})}},d=a=>{a.target===f&&(k.current=h(i.current))};return f.addEventListener("animationstart",d),f.addEventListener("animationcancel",c),f.addEventListener("animationend",c),()=>{b.clearTimeout(a),f.removeEventListener("animationstart",d),f.removeEventListener("animationcancel",c),f.removeEventListener("animationend",c)}}m("ANIMATION_END")},[f,m]),{isPresent:["mounted","unmountSuspended"].includes(l),ref:b.useCallback(a=>{i.current=a?getComputedStyle(a):null,g(a)},[])}}(d),i="function"==typeof e?e({present:g.isPresent}):b.Children.only(e),j=(0,f.useComposedRefs)(g.ref,function(a){let b=Object.getOwnPropertyDescriptor(a.props,"ref")?.get,c=b&&"isReactWarning"in b&&b.isReactWarning;return c?a.ref:(c=(b=Object.getOwnPropertyDescriptor(a,"ref")?.get)&&"isReactWarning"in b&&b.isReactWarning)?a.props.ref:a.props.ref||a.ref}(i));return"function"==typeof e||g.isPresent?b.cloneElement(i,{ref:j}):null};function h(a){return a?.animationName||"none"}g.displayName="Presence"},70106,a=>{"use strict";a.s(["default",()=>g],70106);var b=a.i(72131);let c=a=>{let b=a.replace(/^([A-Z])|[\s-_]+(\w)/g,(a,b,c)=>c?c.toUpperCase():b.toLowerCase());return b.charAt(0).toUpperCase()+b.slice(1)},d=(...a)=>a.filter((a,b,c)=>!!a&&""!==a.trim()&&c.indexOf(a)===b).join(" ").trim();var e={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let f=(0,b.forwardRef)(({color:a="currentColor",size:c=24,strokeWidth:f=2,absoluteStrokeWidth:g,className:h="",children:i,iconNode:j,...k},l)=>(0,b.createElement)("svg",{ref:l,...e,width:c,height:c,stroke:a,strokeWidth:g?24*Number(f)/Number(c):f,className:d("lucide",h),...!i&&!(a=>{for(let b in a)if(b.startsWith("aria-")||"role"===b||"title"===b)return!0})(k)&&{"aria-hidden":"true"},...k},[...j.map(([a,c])=>(0,b.createElement)(a,c)),...Array.isArray(i)?i:[i]])),g=(a,e)=>{let g=(0,b.forwardRef)(({className:g,...h},i)=>(0,b.createElement)(f,{ref:i,iconNode:e,className:d(`lucide-${c(a).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${a}`,g),...h}));return g.displayName=c(a),g}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__a0824dae._.js.map