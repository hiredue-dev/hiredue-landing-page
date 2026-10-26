/*
 * The brand splash on a visit's first page load. Server-rendered and pure
 * CSS (see .site-splash in globals.css), so it shows before any JS and can't
 * get stuck. SPLASH_SCRIPT runs inline in <head>, ahead of first paint:
 *   - seen already this tab session → "skip", the splash never paints;
 *   - otherwise done once the page has loaded, kept up at least MIN ms so it
 *     doesn't flash, and never more than MAX ms however slow the load.
 */
const MIN = 700;
const MAX = 2500;

export const SPLASH_SCRIPT = `(function(){var d=document.documentElement,k="hd-splash";function done(){d.setAttribute("data-splash","done")}try{if(sessionStorage.getItem(k)){d.setAttribute("data-splash","skip");return}sessionStorage.setItem(k,"1")}catch(e){}var t=Date.now();function end(){setTimeout(done,Math.max(0,${MIN}-(Date.now()-t)))}if(document.readyState==="complete")end();else addEventListener("load",end,{once:true});setTimeout(done,${MAX})})();`;

export function SiteSplash() {
  return (
    <div className="site-splash" aria-hidden>
      <div className="site-splash__inner">
        {/* eslint-disable-next-line @next/next/no-img-element -- must paint with the HTML, no loader */}
        <img src="/assets/Brand_logos/full_logo_dark.svg" alt="" width={174} height={43} />
        <span className="site-splash__bar" />
      </div>
    </div>
  );
}
