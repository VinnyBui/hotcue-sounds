module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},22024,e=>{"use strict";async function t(e,r={}){try{let t=await fetch("https://hotcue-sounds.myshopify.com/api/2023-10/graphql.json",{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":"bf63f1f6fae30388d8dbd56dffff3ca2"},body:JSON.stringify({query:e,variables:r}),next:{revalidate:3600}});if(!t.ok)throw Error(`Shopify API error: ${t.status} ${t.statusText}`);let a=await t.json();if(a.errors)throw console.error("Shopify GraphQL errors:",a.errors),Error(`Shopify GraphQL errors: ${JSON.stringify(a.errors)}`);return a.data}catch(e){throw console.error("Shopify fetch failed:",e),e}}async function r(e=10){let a=`
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
  `;return(await t(a,{limit:e})).products.edges.map(e=>({...e.node,audioPreviewUrl:e.node.previewAudio?.reference?.url}))}async function a(e,r=10){let n=`
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
  `,o=await t(n,{handle:e,limit:r});return o.collectionByHandle?o.collectionByHandle.products.edges.map(e=>({...e.node,audioPreviewUrl:e.node.previewAudio?.reference?.url})):[]}e.s(["getProducts",()=>r,"getProductsByCollection",()=>a])},91614,(e,t,r)=>{},47974,e=>{"use strict";e.s(["handler",()=>b,"patchFetch",()=>P,"routeModule",()=>w,"serverHooks",()=>A,"workAsyncStorage",()=>E,"workUnitAsyncStorage",()=>C],47974);var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),o=e.i(61916),i=e.i(69741),s=e.i(16795),l=e.i(87718),d=e.i(95169),u=e.i(47587),c=e.i(66012),p=e.i(70101),h=e.i(26937),f=e.i(10372),x=e.i(93695);e.i(52474);var v=e.i(220);e.s(["GET",()=>g],17861);var m=e.i(89171),y=e.i(22024);async function g(e){try{let t,r=e.nextUrl.searchParams.get("collection");return t=r?await (0,y.getProductsByCollection)(r,10):await (0,y.getProducts)(10),m.NextResponse.json({products:t})}catch(e){return console.error("API Error:",e),m.NextResponse.json({error:"Failed to fetch products",products:[]},{status:500})}}var R=e.i(17861);let w=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/products/route",pathname:"/api/products",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/products/route.ts",nextConfigOutput:"standalone",userland:R}),{workAsyncStorage:E,workUnitAsyncStorage:C,serverHooks:A}=w;function P(){return(0,a.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:C})}async function b(e,t,a){var m;let y="/api/products/route";y=y.replace(/\/index$/,"")||"/";let g=await w.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!g)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,params:E,nextConfig:C,isDraftMode:A,prerenderManifest:P,routerServerContext:b,isOnDemandRevalidate:S,revalidateOnlyGenerated:T,resolvedPathname:N}=g,q=(0,i.normalizeAppPath)(y),k=!!(P.dynamicRoutes[q]||P.routes[N]);if(k&&!A){let e=!!P.routes[N],t=P.dynamicRoutes[q];if(t&&!1===t.fallback&&!e)throw new x.NoFallbackError}let j=null;!k||w.isDev||A||(j="/index"===(j=N)?"/":j);let O=!0===w.isDev||!k,_=k&&!O,H=e.method||"GET",U=(0,o.getTracer)(),I=U.getActiveScopeSpan(),$={params:E,prerenderManifest:P,renderOpts:{experimental:{cacheComponents:!!C.experimental.cacheComponents,authInterrupts:!!C.experimental.authInterrupts},supportsDynamicResponse:O,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:null==(m=C.experimental)?void 0:m.cacheLife,isRevalidate:_,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>w.onRequestError(e,t,a,b)},sharedContext:{buildId:R}},M=new s.NodeNextRequest(e),F=new s.NodeNextResponse(t),D=l.NextRequestAdapter.fromNodeNextRequest(M,(0,l.signalFromNodeResponse)(t));try{let i=async r=>w.handle(D,$).finally(()=>{if(!r)return;r.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=U.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let e=`${H} ${n}`;r.setAttributes({"next.route":n,"http.route":n,"next.span_name":e}),r.updateName(e)}else r.updateName(`${H} ${e.url}`)}),s=async o=>{var s,l;let d=async({previousCacheEntry:r})=>{try{if(!(0,n.getRequestMeta)(e,"minimalMode")&&S&&T&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await i(o);e.fetchMetrics=$.renderOpts.fetchMetrics;let l=$.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let d=$.renderOpts.collectedTags;if(!k)return await (0,c.sendResponse)(M,F,s,$.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(s.headers);d&&(t[f.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==$.renderOpts.collectedRevalidate&&!($.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&$.renderOpts.collectedRevalidate,a=void 0===$.renderOpts.collectedExpire||$.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:$.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await w.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isRevalidate:_,isOnDemandRevalidate:S})},b),t}},x=await w.handleResponse({req:e,nextConfig:C,cacheKey:j,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:P,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:T,responseGenerator:d,waitUntil:a.waitUntil});if(!k)return null;if((null==x||null==(s=x.value)?void 0:s.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==x||null==(l=x.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,n.getRequestMeta)(e,"minimalMode")||t.setHeader("x-nextjs-cache",S?"REVALIDATED":x.isMiss?"MISS":x.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(x.value.headers);return(0,n.getRequestMeta)(e,"minimalMode")&&k||m.delete(f.NEXT_CACHE_TAGS_HEADER),!x.cacheControl||t.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,h.getCacheControlHeader)(x.cacheControl)),await (0,c.sendResponse)(M,F,new Response(x.value.body,{headers:m,status:x.value.status||200})),null};I?await s(I):await U.withPropagatedContext(e.headers,()=>U.trace(d.BaseServerSpan.handleRequest,{spanName:`${H} ${e.url}`,kind:o.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},s))}catch(t){if(t instanceof x.NoFallbackError||await w.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isRevalidate:_,isOnDemandRevalidate:S})}),k)throw t;return await (0,c.sendResponse)(M,F,new Response(null,{status:500})),null}}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__d2350c92._.js.map