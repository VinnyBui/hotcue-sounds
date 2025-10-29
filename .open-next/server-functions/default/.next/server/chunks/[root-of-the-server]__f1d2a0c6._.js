module.exports=[18622,(e,r,t)=>{r.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24725,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,r,t)=>{r.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,r,t)=>{r.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},22024,e=>{"use strict";async function r(e,t={}){try{let r=await fetch("https://hotcue-sounds.myshopify.com/api/2023-10/graphql.json",{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":"bf63f1f6fae30388d8dbd56dffff3ca2"},body:JSON.stringify({query:e,variables:t}),next:{revalidate:3600}});if(!r.ok)throw Error(`Shopify API error: ${r.status} ${r.statusText}`);let n=await r.json();if(n.errors)throw console.error("Shopify GraphQL errors:",n.errors),Error(`Shopify GraphQL errors: ${JSON.stringify(n.errors)}`);return n.data}catch(e){throw console.error("Shopify fetch failed:",e),e}}async function t(e=10){let n=`
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
  `;return(await r(n,{limit:e})).products.edges.map(e=>({...e.node,audioPreviewUrl:e.node.previewAudio?.reference?.url}))}async function n(e,t=10){let i=`
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
  `,a=await r(i,{handle:e,limit:t});return a.collectionByHandle?a.collectionByHandle.products.edges.map(e=>({...e.node,audioPreviewUrl:e.node.previewAudio?.reference?.url})):[]}e.s(["getProducts",()=>t,"getProductsByCollection",()=>n])},29262,(e,r,t)=>{}];

//# sourceMappingURL=%5Broot-of-the-server%5D__f1d2a0c6._.js.map