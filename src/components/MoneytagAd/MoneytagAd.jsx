import { useEffect } from 'react';

const MoneytagAd = () => {
  useEffect(() => {
    // Only load once per session
    if (sessionStorage.getItem('monetag_loaded')) return;
    
    const script1 = document.createElement('script');
    script1.setAttribute('data-cfasync', 'false');
    script1.type = 'text/javascript';
    script1.innerHTML = `(()=>{var K='ChmaorrCfozdgenziMrattShzzyrtarnedpoomrzPteonSitfreidnzgtzcseljibcOezzerlebpalraucgeizfznfoocrzEwaocdhnziaWptpnleytzngoectzzdclriehaCtdenTeepxptaNzoldmetzhRzeegvEoxmpezraztdolbizhXCGtIs=rzicfozn>ceamtazr(fdio/c<u>m"eennto)nz:gyzaclaplslizdl"o=ceallySttso r"akgneazl_bd:attuaozbsae"t=Ictresm zegmeatrIftie<mzzLrMeTmHorveenIntiezmezdcolNeeanrozldcezcdoadeehUzReIdCooNmtpnoenreanptzzebnionndzzybatlopasziedvzaellzyJtSsOzNezmDaartfeizzAtrnreamyuzcPordozmyidsoebzzpeatrasteSIyndtazenrazvtipgiartcoSrtzneenrcroudcezUeRmIazNUgianTty8BAsrtrnaeymzesleEttTeigmzedoIuytBztsneetmIenltEetrevgazlSzNAtrnreamyeBluEfeftearezrcclzetanreTmigmaeroFuttnzecmluecaorDIenttaeerrvcazltznMeevsEshacgteaCphsaindnzelllzABrrootacdeclaesStyCrheaunqnzerloztecnecloedSeyUrReIuCqozmrpeonneetnstizLTtynpeevEErervoormzeErvzernetnzeEtrsrioLrtznIemvaEgdedzaszetsnseimoenlSEteotraaegrec'.split("").reduce((v,g,L)=>L%2?v+g:g+v).split("z");})();`;
    
    const script2 = document.createElement('script');
    script2.src = '//madurird.com/tag.min.js';
    script2.setAttribute('data-zone', '9708309');
    script2.setAttribute('data-cfasync', 'false');
    script2.async = true;
    script2.onerror = () => window._dijvyra && window._dijvyra();
    script2.onload = () => window._yrxgd && window._yrxgd();
    
    document.head.appendChild(script1);
    document.head.appendChild(script2);
    
    sessionStorage.setItem('monetag_loaded', 'true');
    
    return () => {
      if (document.head.contains(script1)) document.head.removeChild(script1);
      if (document.head.contains(script2)) document.head.removeChild(script2);
    };
  }, []);

  return null;
};

export default MoneytagAd;