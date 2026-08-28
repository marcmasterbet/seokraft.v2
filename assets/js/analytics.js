(()=>{
  const MEASUREMENT_ID='G-T84TCFNZWS';
  const CONSENT_KEY='seokraft_analytics_consent_v1';

  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};

  // Consentement par défaut : aucune mesure Analytics ni publicité avant le choix.
  window.gtag('consent','default',{
    analytics_storage:'denied',
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied',
    functionality_storage:'granted',
    security_storage:'granted'
  });

  let loaded=false;

  function loadAnalytics(){
    if(loaded)return;
    loaded=true;
    window.gtag('consent','update',{
      analytics_storage:'granted',
      ad_storage:'denied',
      ad_user_data:'denied',
      ad_personalization:'denied'
    });
    const script=document.createElement('script');
    script.async=true;
    script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(script);
    window.gtag('js',new Date());
    window.gtag('config',MEASUREMENT_ID,{send_page_view:true});
  }

  function deleteAnalyticsCookies(){
    const names=document.cookie.split(';').map(v=>v.trim().split('=')[0]).filter(Boolean);
    const domains=[location.hostname,'.seokraft.fr','seokraft.fr','www.seokraft.fr'];
    names.filter(name=>name==='_ga'||name.startsWith('_ga_')).forEach(name=>{
      document.cookie=`${name}=; Max-Age=0; path=/; SameSite=Lax`;
      domains.forEach(domain=>{
        document.cookie=`${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
      });
    });
  }

  function saveConsent(value){
    try{localStorage.setItem(CONSENT_KEY,value)}catch(e){}
  }

  function getConsent(){
    try{return localStorage.getItem(CONSENT_KEY)}catch(e){return null}
  }

  function removeBanner(){
    const banner=document.querySelector('.cookie-banner');
    if(banner)banner.remove();
  }

  function accept(){
    saveConsent('accepted');
    removeBanner();
    loadAnalytics();
  }

  function refuse(){
    saveConsent('refused');
    window.gtag('consent','update',{
      analytics_storage:'denied',
      ad_storage:'denied',
      ad_user_data:'denied',
      ad_personalization:'denied'
    });
    deleteAnalyticsCookies();
    removeBanner();
  }

  function showBanner(){
    if(document.querySelector('.cookie-banner'))return;
    const banner=document.createElement('aside');
    banner.className='cookie-banner';
    banner.setAttribute('role','dialog');
    banner.setAttribute('aria-label','Choix des cookies et de la mesure d’audience');
    banner.innerHTML=`<div class="cookie-banner__content"><strong>Mesure d’audience</strong><p>SEOKRAFT utilise Google Analytics uniquement avec votre accord afin de comprendre la fréquentation du site. Vous pouvez accepter ou refuser sans limiter l’accès au site. <a href="/confidentialite/">En savoir plus</a>.</p></div><div class="cookie-banner__actions"><button class="cookie-btn cookie-btn--ghost" type="button" data-cookie-refuse>Refuser</button><button class="cookie-btn cookie-btn--primary" type="button" data-cookie-accept>Accepter</button></div>`;
    document.body.appendChild(banner);
    banner.querySelector('[data-cookie-accept]').addEventListener('click',accept);
    banner.querySelector('[data-cookie-refuse]').addEventListener('click',refuse);
  }

  function addManageButton(){
    if(document.querySelector('.cookie-manage'))return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='cookie-manage';
    btn.textContent='Gérer les cookies';
    btn.setAttribute('aria-label','Modifier mon choix de cookies');
    btn.addEventListener('click',()=>{
      saveConsent('');
      showBanner();
    });
    document.body.appendChild(btn);
  }

  document.addEventListener('DOMContentLoaded',()=>{
    const choice=getConsent();
    if(choice==='accepted')loadAnalytics();
    else if(choice!=='refused')showBanner();
    addManageButton();
  });
})();
