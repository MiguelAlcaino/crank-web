var A=Object.defineProperty;var v=(s,t,a)=>t in s?A(s,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[t]=a;var o=(s,t,a)=>(v(s,typeof t!="symbol"?t+"":t,a),a);import{d as R,r as u,o as r,c as l,a as e,u as i,b as c,e as _,w as E,f as k,g as p,z as S,F as V,h as b,i as g,j as H,G as L,k as P,p as C,A as T,n as w,l as G,m as I}from"./graphqlClient.bc2b8bf4.js";const f=e("nav",{class:"navbar is-black mb-5"},[e("div",{class:"container"},[e("div",{class:"navbar-brand"},[e("div",{class:"navbar-burger burger","data-target":"navMenu"},[e("span"),e("span"),e("span")])])])],-1),y={class:"container"},Q={class:"columns"},N={class:"column is-3"},x={class:"menu is-hidden-mobile"},B=e("p",{class:"menu-label"},"General",-1),q={class:"menu-list"},z={key:0},F={key:1},U={class:"column is-9"},j=R({__name:"App",setup(s){return(t,a)=>{const m=u("RouterLink"),h=u("RouterView");return r(),l(V,null,[f,e("div",y,[e("div",Q,[e("div",N,[e("aside",x,[B,e("ul",q,[i(c).isLoggedId()?p("",!0):(r(),l("li",z,[_(m,{to:{name:"login"}},{default:E(()=>[k("Login")]),_:1})])),i(c).isLoggedId()?(r(),l("li",F,[e("a",{href:"#",onClick:a[0]||(a[0]=O=>i(c).logout())},"logout")])):p("",!0)])])]),e("div",U,[_(h)])])]),_(i(S))],64)}}}),d=class{};let n=d;o(n,"AUTH_SERVICE_HOST","https://payments2.crank-fit.com"),o(n,"GRAPHQL_SERVICE_PATH","/api/graphql/"),o(n,"GRAPHQL_SERVICE_URL","https://payments2.crank-fit.com"+d.GRAPHQL_SERVICE_PATH);M();async function M(){const s=b({setup(){C("gqlApiService",new T(w(n.GRAPHQL_SERVICE_PATH),G(n.GRAPHQL_SERVICE_PATH)))},render:()=>I(j)});s.use(g()).use(H).use(L());try{await c.startRefreshTokenTimer()}catch{P().deleteSession()}s.mount("#app")}
