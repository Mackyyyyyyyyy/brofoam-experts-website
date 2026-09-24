const fs = require("fs");
const path = require("path");
const services = require("./data/services.js");
const locations = require("./data/locations.js");

const PHONE_DISPLAY = "(313) 546-4441";
const PHONE_TEL = "tel:+13135464441";
const PHONE_SMS = "sms:+13135464441";
const EMAIL = "info@brofoamexperts.com";
const ADDRESS = "2050 15th St, Detroit, MI 48216";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ADDRESS);
const GOOGLE_REVIEW_URL = "https://share.google/vyMzleq3lo5dnf0ye";
// TODO: swap in the real profile URLs once the business supplies them.
const FACEBOOK_URL = "#";
const INSTAGRAM_URL = "#";

function head(title, description) {
  return `<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="icon" href="/images/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>`;
}

function header() {
  return `<header class="site-header">
  <div class="container header-inner">
    <a href="/" class="logo">
      <img src="/images/logo.png" alt="BroFoam Experts">
      <span>BroFoam Experts</span>
    </a>
    <nav class="nav-desktop">
      <a href="/services/">Services</a>
      <a href="/locations/">Locations</a>
      <a href="/#about">About</a>
      <a href="/#reviews">Reviews</a>
      <a href="/#faq">FAQ</a>
    </nav>
    <a href="${PHONE_TEL}" class="btn btn-pill btn-light nav-cta">
      <span class="dot"></span> ${PHONE_DISPLAY}
    </a>
    <button class="nav-toggle" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <nav class="nav-mobile">
    <a href="/services/">Services</a>
    <a href="/locations/">Locations</a>
    <a href="/#about">About</a>
    <a href="/#reviews">Reviews</a>
    <a href="/#faq">FAQ</a>
    <a href="${PHONE_TEL}" class="btn btn-pill btn-light">Call ${PHONE_DISPLAY}</a>
  </nav>
</header>`;
}

function socialIcon(path) {
  return `<svg viewBox="0 0 24 24">${path}</svg>`;
}
const ICONS = {
  facebook: `<path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/>`,
  google: `<path d="M21.35 11.1h-9.17v2.98h6.46c-.28 2.8-2.67 4.8-6.46 4.8-3.93 0-7.13-3.2-7.13-7.13s3.2-7.13 7.13-7.13c1.82 0 3.44.63 4.7 1.86l2.26-2.26C17.51 1.7 15.06.6 12.18.6 6.9.6 2.6 4.9 2.6 10.18s4.3 9.58 9.58 9.58c5.53 0 9.2-3.89 9.2-9.37 0-.63-.06-1.12-.15-1.29z"/>`,
  instagram: `<path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.22.41.56.21.96.47 1.38.9.42.42.68.82.9 1.38.17.42.36 1.05.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.8-.41 2.22-.21.56-.47.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.05.36-2.22.41-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.24-2.22-.41-.56-.21-.96-.47-1.38-.9-.42-.42-.68-.82-.9-1.38-.17-.42-.36-1.05-.41-2.22C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.24-1.8.41-2.22.21-.56.47-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.05-.36 2.22-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.5.01-4.73.07-.96.04-1.48.2-1.83.34-.46.18-.79.39-1.13.74-.35.34-.56.67-.74 1.13-.14.35-.3.87-.34 1.83-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.04.96.2 1.48.34 1.83.18.46.39.79.74 1.13.34.35.67.56 1.13.74.35.14.87.3 1.83.34 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.39 1.13-.74.35-.34.56-.67.74-1.13.14-.35.3-.87.34-1.83.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.96-.2-1.48-.34-1.83-.18-.46-.39-.79-.74-1.13a3.06 3.06 0 0 0-1.13-.74c-.35-.14-.87-.3-1.83-.34-1.23-.06-1.58-.07-4.73-.07zm0 4.13a3.87 3.87 0 1 1 0 7.74 3.87 3.87 0 0 1 0-7.74zm0 1.8a2.07 2.07 0 1 0 0 4.14 2.07 2.07 0 0 0 0-4.14zm4.92-1.99a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0z"/>`
};

function footer(locationName) {
  const areaLabel = locationName || "Metro Detroit";
  return `<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <div class="footer-brand-logo"><img src="/images/logo.png" alt="BroFoam Experts"></div>
      <p class="footer-tagline">Professional spray foam insulation for homes and businesses across ${areaLabel}.</p>
      <div class="footer-social">
        <a href="${FACEBOOK_URL}" aria-label="BroFoam Experts on Facebook">${socialIcon(ICONS.facebook)}</a>
        <a href="${GOOGLE_REVIEW_URL}" aria-label="BroFoam Experts on Google">${socialIcon(ICONS.google)}</a>
        <a href="${INSTAGRAM_URL}" aria-label="BroFoam Experts on Instagram">${socialIcon(ICONS.instagram)}</a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Top Links</h4>
      <ul>
        <li><a href="/#about">About Us</a></li>
        <li><a href="${PHONE_SMS}">Contact Us</a></li>
        <li><a href="/locations/">Locations</a></li>
        <li><a href="/services/">Services</a></li>
        ${services.map(s => `<li><a href="/services/${s.slug}/">${s.name}</a></li>`).join("\n        ")}
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contact Us</h4>
      <ul>
        <li><a href="mailto:${EMAIL}">Email: ${EMAIL}</a></li>
        <li><a href="${PHONE_TEL}">Phone: ${PHONE_DISPLAY}</a></li>
        <li><a href="${MAPS_URL}" target="_blank" rel="noopener">Address: ${ADDRESS}</a></li>
      </ul>
    </div>
    <div class="footer-col footer-hours">
      <h4>Business Hours</h4>
      <p>Monday&ndash;Friday - 8AM - 6PM<br>Saturday&ndash;Sunday - 10AM - 2PM</p>
      <a href="${GOOGLE_REVIEW_URL}" target="_blank" rel="noopener" class="btn btn-pill btn-light" style="background:var(--footer-accent);border-color:var(--footer-accent);">Leave a Review</a>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <span>Copyright &copy; 2026 BroFoam Experts. All rights reserved.</span>
      <div class="footer-bottom-links">
        <a href="/privacy-policy/">Privacy Policy</a>
        <a href="/terms-and-conditions/">Terms and Conditions</a>
      </div>
    </div>
  </div>
</footer>
<script src="/script.js"></script>`;
}

function breadcrumb(crumbs) {
  const parts = crumbs.map((c, i) => {
    if (i === crumbs.length - 1) return `<span class="current">${c.label}</span>`;
    return `<a href="${c.href}">${c.label}</a><span>/</span>`;
  });
  return `<div class="breadcrumb-bar"><div class="container"><div class="breadcrumb">${parts.join("\n    ")}</div></div></div>`;
}

function miniTrust() {
  return `<div class="mini-trust">
        <span>5.0 Star Rated on customer reviews</span>
        <span>Licensed &amp; Insured</span>
        <span>Family owned and operated</span>
      </div>`;
}

function trustBar() {
  return `<div class="trust-bar">
        <div class="trust-item">
          <img src="/images/5-ratings.png" alt="5.0 star rated">
          <span>5.0 Rated on Google</span>
        </div>
        <div class="trust-item">
          <img src="/images/badge-licensed-insured.png" alt="Licensed and insured">
          <span>Licensed &amp; Insured</span>
        </div>
        <div class="trust-item">
          <img src="/images/badge-family-owned.png" alt="Family owned and operated">
          <span>Family Owned &amp; Operated</span>
        </div>
        <div class="trust-item trust-text-only">
          <span class="trust-strong">SPFA-Trained Crew</span>
          <span>Full coverage on every job</span>
        </div>
      </div>`;
}

function chooseUs(areaLabel) {
  const heading = areaLabel ? `Why ${areaLabel} Chooses Us` : "Why Choose Us?";
  return `<section class="choose-section">
    <div class="container">
      <p class="eyebrow">We listen, we deliver, we excel</p>
      <h2>${heading}</h2>
      <div class="choose-grid">
        <div class="choose-card">
          <h3>A family owned and operated business</h3>
          <p>We are a family run company serving Metro Detroit. Every call goes to someone who works here, and we stay involved in each project from the first walkthrough to the final check.</p>
        </div>
        <div class="choose-card">
          <h3>Honest and straightforward service</h3>
          <p>We give you a real recommendation based on what the building actually needs, not the biggest job we could sell. If a smaller scope solves it, that is what we will quote.</p>
        </div>
        <div class="choose-card">
          <h3>Detail focused installation</h3>
          <p>Coverage gaps are what make insulation underperform. We work to the spec, seal the penetrations, and leave the site clean enough that you can use the space the same day.</p>
        </div>
      </div>
      <div class="cta-wrap"><a href="${PHONE_SMS}" class="btn btn-pill btn-dark">Get a FREE Quote</a></div>
    </div>
  </section>`;
}

function testimonials() {
  return `<section class="reviews" id="reviews">
    <div class="container">
      <p class="eyebrow">Testimonials</p>
      <h2>What Our Clients Say About Us</h2>
      <div class="review-cards">
        <div class="review-card">
          <div class="stars">★★★★★</div>
          <p>"BroFoam Experts did an amazing job on my home! From start to finish, the communication was clear, the crew was professional, and the quality of their work was outstanding."</p>
          <span class="review-name">Hussein Amen <em>via Google</em></span>
        </div>
        <div class="review-card">
          <div class="stars">★★★★★</div>
          <p>"I've been meaning to do this since I moved into my house in 2021. BroFoam had fair pricing, was quick to come and check out my attic space, and got the job done quick."</p>
          <span class="review-name">Hussein Dabajeh <em>via Google</em></span>
        </div>
        <div class="review-card">
          <div class="stars">★★★★★</div>
          <p>"Did the ceiling for my store with open-cell spray foam. Works amazing and can't hear a thing."</p>
          <span class="review-name">Ali Ghamlouch <em>via Google</em></span>
        </div>
      </div>
    </div>
  </section>`;
}

function faqSection(faqs) {
  const items = faqs.map((f, i) => {
    const n = String(i + 1).padStart(2, "0");
    const open = i === 0 ? " open" : "";
    return `<div class="faq-item${open}">
          <button class="faq-q"><span class="faq-num">${n}</span><span class="faq-text">${f.q}</span><span class="faq-icon">&#8599;</span></button>
          <div class="faq-a"><p>${f.a}</p></div>
        </div>`;
  }).join("\n        ");
  return `<section class="faq" id="faq">
    <div class="container faq-inner">
      <p class="eyebrow">Still not sure?</p>
      <h2>Frequently Asked Questions</h2>
      <div class="faq-list">
        ${items}
      </div>
    </div>
  </section>`;
}

function ctaBanner(heading, sub) {
  return `<section class="cta-banner">
    <div class="container">
      <h2>${heading}</h2>
      <p>${sub}</p>
      <a href="${PHONE_TEL}" class="btn btn-pill btn-white">Call Us Today</a>
    </div>
  </section>`;
}

function page(title, description, bodyHtml, locationName) {
  return `<!DOCTYPE html>
<html lang="en">
${head(title, description)}
<body>
${header()}
<main id="top">
${bodyHtml}
</main>
${footer(locationName)}
</body>
</html>
`;
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("wrote", filePath);
}

// ===================== LEAD FORM EMBED =====================
function leadFormEmbed() {
  return `<iframe
    src="https://link.webleadsystems.net/widget/form/ZAeDaQn37up94XxrCCZD"
    style="width:100%;height:100%;border:none;border-radius:0px;overflow:hidden"
    scrolling="no"
    id="inline-ZAeDaQn37up94XxrCCZD"
    data-layout="{'id':'INLINE'}"
    data-trigger-type="alwaysShow"
    data-trigger-value=""
    data-activation-type="alwaysActivated"
    data-activation-value=""
    data-deactivation-type="neverDeactivate"
    data-deactivation-value=""
    data-form-name="Website Form"
    data-height="564"
    data-layout-iframe-id="inline-ZAeDaQn37up94XxrCCZD"
    data-form-id="ZAeDaQn37up94XxrCCZD"
    data-cookie-consent="true"
    data-cookie-consent-provider="auto"
    title="Website Form"

        >
</iframe>
<script src="https://link.webleadsystems.net/js/form_embed.js"></script>
<script>
(function(){
  var el = document.getElementById('inline-ZAeDaQn37up94XxrCCZD');
  if(!el) return;
  function noScroll(){
    if(el.getAttribute('scrolling') !== 'no') el.setAttribute('scrolling','no');
    if(el.style.getPropertyValue('overflow') !== 'hidden') el.style.setProperty('overflow','hidden','important');
  }
  noScroll();
  new MutationObserver(noScroll).observe(el, {attributes:true, attributeFilter:['style','scrolling']});
})();
</script>`;
}

// ===================== SERVICE PAGE =====================
function serviceHero(svc) {
  return `<section class="breadcrumb-bar">${""}</section>
  ${breadcrumb([{ href: "/", label: "Home" }, { href: "/services/", label: "Services" }, { label: svc.name }])}
  <section class="page-hero">
    <div class="container page-hero-panel with-form">
      <div class="page-hero-text">
        ${miniTrust()}
        <h1>${svc.name} Contractor in Metro Detroit</h1>
        <p class="tagline">${svc.tagline.toUpperCase()}</p>
        <div class="hero-actions">
          <a href="${PHONE_SMS}" class="btn btn-pill btn-white">Request a Quote</a>
          <a href="${PHONE_TEL}" class="btn btn-pill btn-outline-light">${PHONE_DISPLAY}</a>
        </div>
      </div>
      ${leadFormEmbed()}
    </div>
  </section>`;
}

function buildServicePage(svc) {
  const body = `
  ${serviceHero(svc)}

  <section class="split-section">
    <div class="container split-grid">
      <div class="split-img"><img src="${svc.image}" alt="${svc.name}"></div>
      <div class="split-content">
        <p class="eyebrow">Our approach</p>
        <h2>${svc.name} for Homes and Buildings</h2>
        <p>${svc.approachBody}</p>
      </div>
    </div>
  </section>

  <section class="why-section">
    <div class="container">
      <div class="why-grid">
        ${svc.why.map(w => `<div class="why-block">
          <p class="eyebrow">${w.eyebrow}</p>
          <h3>${w.heading}</h3>
          <p>${w.body}</p>
        </div>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="banner-wrap" style="padding-top:0;">
    <div class="container">${trustBar()}</div>
  </section>

  <section class="benefits-section">
    <div class="container">
      <p class="eyebrow">Benefits</p>
      <h2>Benefits of ${svc.name}</h2>
      <div class="benefit-cards">
        ${svc.benefits.map(b => `<div class="benefit-card">
          <div class="check"><svg viewBox="0 0 20 20"><path d="M4 10.5l3.5 3.5L16 6"/></svg></div>
          <h3>${b.title}</h3>
          <p>${b.body}</p>
        </div>`).join("\n        ")}
      </div>
    </div>
  </section>

  ${chooseUs(null).replace("Why Choose Us?", `Why Choose Us for Your ${svc.name} Needs?`)}

  <section class="area-section">
    <div class="container">
      <p class="eyebrow">Service area</p>
      <h2>${svc.name} Near You</h2>
      <div class="area-grid">
        ${locations.map(l => `<div class="area-chip"><span>${svc.name} in ${l.name}</span><a href="/locations/${l.slug}/${svc.slug}/">Learn More &#8594;</a></div>`).join("\n        ")}
      </div>
    </div>
  </section>

  ${testimonials()}
  ${faqSection(svc.faqs)}
  ${ctaBanner(`Get a Free ${svc.name} Estimate`, "We serve homeowners and commercial property owners across Metro Detroit. Send over a few details and we will get back to you to schedule a visit.")}
  `;
  return page(
    `${svc.name} | BroFoam Experts`,
    `${svc.name} contractor in Metro Detroit. ${svc.shortDesc}`,
    body
  );
}

// ===================== SERVICES HUB =====================
function buildServicesHub() {
  const body = `
  ${breadcrumb([{ href: "/", label: "Home" }, { label: "Services" }])}
  <section class="page-hero">
    <div class="container page-hero-panel with-form">
      <div class="page-hero-text">
        ${miniTrust()}
        <h1>Insulation Services</h1>
        <p class="tagline">EVERYTHING WE INSTALL, REMOVE AND REPAIR ACROSS RESIDENTIAL AND COMMERCIAL PROPERTY.</p>
      </div>
      ${leadFormEmbed()}
    </div>
  </section>

  <section class="split-section" style="padding-bottom:0;">
    <div class="container split-grid split-grid-reverse">
      <div class="split-content">
        <p class="eyebrow">What we do</p>
        <h2>Insulation Services for Every Space and Property Type</h2>
        <p>Every building is different, so the right material depends on the assembly, the climate and how the space is used. Below is what we install. If you are not sure which applies, we will tell you after looking at the property.</p>
      </div>
      <div class="split-img"><img src="/images/commercial-ceiling.jpg" alt="Completed spray foam insulation sealing a commercial building"></div>
    </div>
  </section>

  <section class="banner-wrap" style="padding-top:40px;">
    <div class="container">${trustBar()}</div>
  </section>

  <section class="services-hub-section">
    <div class="container">
      <div class="services-hub-list">
        ${services.map(s => `<div class="services-hub-item">
          <div class="thumb"><img src="${s.image}" alt="${s.name}"></div>
          <div>
            <h3>${s.name}</h3>
            <p>${s.shortDesc}</p>
          </div>
          <a href="/services/${s.slug}/" class="btn btn-pill btn-dark">Learn More</a>
        </div>`).join("\n        ")}
      </div>
    </div>
  </section>

  ${testimonials()}
  ${faqSection([
    { q: "What insulation services do you provide?", a: "We install closed-cell and open-cell spray foam, fiberglass, Rockwool (mineral wool) and blown-in insulation, and we remove old or damaged material. Both residential and commercial properties are in scope." },
    { q: "Which insulation type is best for my home?", a: "It depends on the assembly and the problem you are trying to solve. Attics, wall cavities and crawl spaces each behave differently, so we survey the space before recommending a material." },
    { q: "Do you offer free estimates before starting any work?", a: "Yes. We visit the property, measure the areas involved, and give you a written quote. Nothing starts until you have approved it." }
  ])}
  ${ctaBanner("Get a Free Estimate from a Trusted Insulation Contractor", "We serve homeowners and commercial property owners across Metro Detroit. Send over a few details and we will get back to you to schedule a visit.")}
  `;
  return page(
    "Insulation Services | BroFoam Experts",
    "Closed-cell and open-cell spray foam, fiberglass, Rockwool and blown-in insulation for homes and businesses across Metro Detroit.",
    body
  );
}

// ===================== LOCATION PAGE =====================
function buildLocationPage(loc) {
  const body = `
  ${breadcrumb([{ href: "/", label: "Home" }, { href: "/locations/", label: "Locations" }, { label: loc.name }])}
  <section class="page-hero">
    <div class="container page-hero-panel with-form">
      <div class="page-hero-text">
        ${miniTrust()}
        <h1>Insulation Contractor in ${loc.name}</h1>
        <p class="tagline">RESIDENTIAL AND COMMERCIAL INSULATION ACROSS ${loc.name.toUpperCase()} AND THE SURROUNDING AREA.</p>
        <div class="hero-actions">
          <a href="${PHONE_SMS}" class="btn btn-pill btn-white">Request a Quote</a>
          <a href="${PHONE_TEL}" class="btn btn-pill btn-outline-light">${PHONE_DISPLAY}</a>
        </div>
      </div>
      ${leadFormEmbed()}
    </div>
  </section>

  <section class="split-section">
    <div class="container split-grid">
      <div class="split-img"><img src="${loc.image}" alt="Insulation work in ${loc.name}"></div>
      <div class="split-content">
        <span class="county-tag">${loc.county}</span>
        <h2>Insulation Services in ${loc.name}</h2>
        <p>${loc.intro}</p>
        <p class="areas-line">Areas covered include ${loc.areas.join(", ")}.</p>
      </div>
    </div>
  </section>

  <section class="banner-wrap" style="padding-top:0;">
    <div class="container">${trustBar()}</div>
  </section>

  <section class="crosslink-section">
    <div class="container">
      <p class="eyebrow">Services in this area</p>
      <h2>What We Install in ${loc.name}</h2>
      <div class="crosslink-grid">
        ${services.map(s => `<div class="crosslink-card">
          <h3>${s.name}</h3>
          <p>${s.shortDesc}</p>
          <a href="/locations/${loc.slug}/${s.slug}/">Learn More &#8594;</a>
        </div>`).join("\n        ")}
      </div>
    </div>
  </section>

  ${chooseUs(loc.name)}
  ${testimonials()}
  ${faqSection([
    { q: "What insulation services do you provide?", a: "We install closed-cell and open-cell spray foam, fiberglass, Rockwool (mineral wool) and blown-in insulation, and we remove old or damaged material. Both residential and commercial properties are in scope." },
    { q: "Do you offer free estimates before starting any work?", a: "Yes. We visit the property, measure the areas involved, and give you a written quote. Nothing starts until you have approved it." },
    { q: `Which areas of ${loc.name} do you cover?`, a: `We regularly work throughout ${loc.name}, including ${loc.areas.join(", ")}. If you are just outside these areas, get in touch and we will tell you honestly whether we can help.` }
  ])}
  ${ctaBanner(`Get a Free Estimate in ${loc.name}`, "We serve homeowners and commercial property owners across Metro Detroit. Send over a few details and we will get back to you to schedule a visit.")}
  `;
  return page(
    `Insulation Contractor in ${loc.name} | BroFoam Experts`,
    `Residential and commercial insulation contractor serving ${loc.name}, MI. Spray foam, fiberglass, Rockwool and blown-in insulation with free written estimates.`,
    body,
    loc.name
  );
}

// ===================== LOCATIONS HUB =====================
function buildLocationsHub() {
  const body = `
  ${breadcrumb([{ href: "/", label: "Home" }, { label: "Locations" }])}
  <section class="page-hero">
    <div class="container page-hero-panel with-form">
      <div class="page-hero-text">
        ${miniTrust()}
        <h1>Where We Work</h1>
        <p class="tagline">SPRAY FOAM AND INSULATION INSTALLED ACROSS METRO DETROIT.</p>
      </div>
      ${leadFormEmbed()}
    </div>
  </section>

  <section class="banner-wrap" style="padding-top:24px;">
    <div class="container">${trustBar()}</div>
  </section>

  <section class="locations-section">
    <div class="container">
      <p class="eyebrow">Service area</p>
      <h2>Metro Detroit Locations</h2>
      <div class="locations-grid">
        ${locations.map(l => `<div class="location-card">
          <span class="county-tag">${l.county}</span>
          <h3>${l.name}</h3>
          <p>${l.intro}</p>
          <a href="/locations/${l.slug}/">Learn More &#8594;</a>
        </div>`).join("\n        ")}
      </div>
    </div>
  </section>

  ${testimonials()}
  ${ctaBanner("Get a Free Estimate from a Trusted Insulation Contractor", "We serve homeowners and commercial property owners across Metro Detroit. Send over a few details and we will get back to you to schedule a visit.")}
  `;
  return page(
    "Service Area | BroFoam Experts",
    "BroFoam Experts serves Detroit, Dearborn, Birmingham, West Bloomfield, Bloomfield Hills and St. Clair Shores with spray foam and insulation installation.",
    body
  );
}

// ===================== LOCATION x SERVICE COMBO PAGE =====================
function buildComboPage(loc, svc) {
  const otherServices = services.filter(s => s.slug !== svc.slug);
  const body = `
  ${breadcrumb([{ href: "/", label: "Home" }, { href: "/locations/", label: "Locations" }, { href: `/locations/${loc.slug}/`, label: loc.name }, { label: svc.name }])}
  <section class="page-hero">
    <div class="container page-hero-panel with-form">
      <div class="page-hero-text">
        ${miniTrust()}
        <h1>${svc.name} in ${loc.name}</h1>
        <p class="tagline">${svc.tagline.toUpperCase()} SERVING ${loc.name.toUpperCase()} AND THE SURROUNDING AREA.</p>
        <div class="hero-actions">
          <a href="${PHONE_SMS}" class="btn btn-pill btn-white">Request a Quote</a>
          <a href="${PHONE_TEL}" class="btn btn-pill btn-outline-light">${PHONE_DISPLAY}</a>
        </div>
      </div>
      ${leadFormEmbed()}
    </div>
  </section>

  <section class="split-section">
    <div class="container split-grid">
      <div class="split-img"><img src="${svc.image}" alt="${svc.name} in ${loc.name}"></div>
      <div class="split-content">
        <span class="county-tag">${loc.county}</span>
        <h2>${svc.name} for ${loc.name} Properties</h2>
        <p>${loc.intro}</p>
        <p>${svc.shortDesc} We cover ${loc.name} as part of our regular route across Metro Detroit.</p>
      </div>
    </div>
  </section>

  <section class="banner-wrap" style="padding-top:0;">
    <div class="container">${trustBar()}</div>
  </section>

  <section class="why-section">
    <div class="container">
      <div class="why-grid">
        ${svc.why.map(w => `<div class="why-block">
          <p class="eyebrow">${w.eyebrow}</p>
          <h3>${w.heading}</h3>
          <p>${w.body}</p>
        </div>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="benefits-section">
    <div class="container">
      <p class="eyebrow">Benefits</p>
      <h2>Benefits of ${svc.name}</h2>
      <div class="benefit-cards">
        ${svc.benefits.map(b => `<div class="benefit-card">
          <div class="check"><svg viewBox="0 0 20 20"><path d="M4 10.5l3.5 3.5L16 6"/></svg></div>
          <h3>${b.title}</h3>
          <p>${b.body}</p>
        </div>`).join("\n        ")}
      </div>
    </div>
  </section>

  ${chooseUs(loc.name)}
  ${testimonials()}
  ${faqSection(svc.faqs)}

  <section class="crosslink-section">
    <div class="container">
      <p class="eyebrow">Also available in ${loc.name}</p>
      <h2>Other Services in ${loc.name}</h2>
      <div class="crosslink-grid">
        ${otherServices.map(s => `<div class="crosslink-card">
          <h3>${s.name} in ${loc.name}</h3>
          <p>${s.shortDesc}</p>
          <a href="/locations/${loc.slug}/${s.slug}/">Learn More &#8594;</a>
        </div>`).join("\n        ")}
      </div>
    </div>
  </section>

  ${ctaBanner(`Get a Free ${svc.name} Quote in ${loc.name}`, "We serve homeowners and commercial property owners across Metro Detroit. Send over a few details and we will get back to you to schedule a visit.")}
  `;
  return page(
    `${svc.name} in ${loc.name} | BroFoam Experts`,
    `${svc.name} contractor serving ${loc.name}, MI. ${svc.shortDesc}`,
    body,
    loc.name
  );
}

// ===================== HOMEPAGE =====================
function buildHomePage() {
  const body = `
  <section class="hero">
    <div class="container hero-panel">
      <div class="hero-left">
        <p class="eyebrow eyebrow-light">Your Insulation Team</p>
        <h1>Spray Foam &amp; Insulation<br>Contractors in<br>Metro Detroit</h1>
      </div>
      <div class="hero-right">
        <p>We air-seal and insulate attics, crawl spaces, walls and whole building envelopes across Metro Detroit &mdash; closed-cell &amp; open-cell spray foam, fiberglass, Rockwool and blown-in. Delivered with a free written estimate before anything starts.</p>
        <div class="hero-actions">
          <a href="${PHONE_SMS}" class="btn btn-pill btn-white">Request a Quote</a>
          <a href="${PHONE_TEL}" class="btn btn-pill btn-outline-light">${PHONE_DISPLAY}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="banner-wrap">
    <div class="container">
      <div class="banner-grid">
        <div class="banner-img"><img src="/images/hero-attic.jpg" alt="Attic insulation project in Metro Detroit"></div>
        <div class="banner-img"><img src="/images/before-insulation.png" alt="Attic framing before insulation"></div>
        <div class="banner-img"><img src="/images/after-insulation.png" alt="Attic after spray foam insulation"></div>
      </div>
      ${trustBar()}
    </div>
  </section>

  <section class="story" id="about">
    <div class="container story-inner">
      <p class="eyebrow">BroFoam Experts Story</p>
      <h2>Expertise Meets Dedication</h2>
      <p class="story-copy">BroFoam Experts is a family-owned and operated insulation contractor serving Metro Detroit. We install insulation that closes the gaps driving your energy bill up, so rooms hold their temperature through the Michigan winter and equipment stops working overtime to keep up. We handle residential and commercial work for both existing structures and <span class="underline">new construction</span>, from a single room to a full building envelope.</p>
    </div>
  </section>

  <section class="services-detail" id="services">
    <div class="container services-grid">
      <div class="services-img">
        <img src="/images/svc-closed-cell.jpg" alt="Closed-cell spray foam applied to a wall cavity">
      </div>
      <div class="services-content">
        <p class="eyebrow">Engineered Insulation<br>Systems</p>
        <h2>PROFESSIONAL<br>INSULATION<br>SERVICES</h2>
        <p>Every property has different insulation needs. That is why we look at the whole building, from the attic and walls to the crawl space and rim joists, before recommending anything, then install the material that actually suits each area rather than the one that is quickest to spray.</p>
        <ul class="checklist">
          ${services.map(s => `<li><svg viewBox="0 0 20 20"><path d="M4 10.5l3.5 3.5L16 6"/></svg> ${s.name}</li>`).join("\n          ")}
          <li><svg viewBox="0 0 20 20"><path d="M4 10.5l3.5 3.5L16 6"/></svg> Removal &amp; Replacement</li>
        </ul>
      </div>
    </div>
    <div class="container">
      <p class="services-tagline">Your Comfort, Our Expertise, Lower Bills.</p>
    </div>
  </section>

  <section class="gallery-strip" id="process">
    <div class="container">
      <div class="gallery-grid">
        <a class="gallery-card" href="/services/open-cell-spray-foam/">
          <img src="/images/residential-framing.jpg" alt="Spray foam insulation being applied in an attic">
          <div class="gallery-overlay">
            <h3>Residential Attics</h3>
            <div class="tags"><span>Spray Foam</span><span>Air Sealing</span></div>
          </div>
        </a>
        <a class="gallery-card" href="/services/rockwool-insulation/">
          <img src="/images/commercial-ceiling.jpg" alt="Completed spray foam insulation sealing a building">
          <div class="gallery-overlay">
            <h3>Commercial Buildings</h3>
            <div class="tags"><span>Warehouses</span><span>Retail</span></div>
          </div>
        </a>
        <a class="gallery-card" href="/services/blown-in-insulation/">
          <img src="/images/svc-blown-in.jpg" alt="Blown-in insulation being installed in an attic">
          <div class="gallery-overlay">
            <h3>Blown-In Upgrades</h3>
            <div class="tags"><span>Attics</span><span>Wall Cavities</span></div>
          </div>
        </a>
      </div>
      <div class="gallery-footer">
        <div class="gallery-arrows">
          <button aria-label="Previous">&#8592;</button>
          <button aria-label="Next">&#8594;</button>
        </div>
        <a href="/services/" class="btn btn-pill btn-dark">Explore All</a>
      </div>
    </div>
  </section>

  <section class="project-grid-section">
    <div class="container">
      <div class="filter-tabs" role="tablist">
        <button class="filter-tab active" data-filter="all">All</button>
        <button class="filter-tab" data-filter="residential">Residential</button>
        <button class="filter-tab" data-filter="commercial">Commercial</button>
        <button class="filter-tab" data-filter="attic">Attics &amp; Crawl Spaces</button>
      </div>

      <div class="project-cards">
        <article class="project-card" data-cat="residential attic">
          <img src="/images/svc-closed-cell.jpg" alt="Closed-cell spray foam">
          <div class="project-card-body">
            <h3>Closed-Cell Spray Foam</h3>
            <p>The highest R-value per inch, resists moisture, adds structural strength. Built for crawl spaces, rim joists and basement walls.</p>
            <div class="card-foot"><span class="chip">Residential &amp; Commercial</span><a href="/services/closed-cell-spray-foam/">Learn More &#8594;</a></div>
          </div>
        </article>
        <article class="project-card" data-cat="residential">
          <img src="/images/svc-open-cell.jpg" alt="Open-cell spray foam">
          <div class="project-card-body">
            <h3>Open-Cell Spray Foam</h3>
            <p>Expands to fill large cavities fast, air-seals effectively and absorbs sound &mdash; a strong fit for interior walls and bonus rooms.</p>
            <div class="card-foot"><span class="chip">Residential</span><a href="/services/open-cell-spray-foam/">Learn More &#8594;</a></div>
          </div>
        </article>
        <article class="project-card" data-cat="residential commercial">
          <img src="/images/svc-fiberglass.jpg" alt="Fiberglass batt insulation">
          <div class="project-card-body">
            <h3>Fiberglass Insulation</h3>
            <p>Hard to beat on cost wherever framing is open &mdash; new construction, renovations and garage conversions.</p>
            <div class="card-foot"><span class="chip">New Construction</span><a href="/services/fiberglass-insulation/">Learn More &#8594;</a></div>
          </div>
        </article>
        <article class="project-card" data-cat="commercial">
          <img src="/images/svc-rockwool.jpg" alt="Rockwool mineral wool batts">
          <div class="project-card-body">
            <h3>Rockwool Insulation</h3>
            <p>Denser and tougher than fiberglass, with excellent fire resistance and sound control for mechanical rooms and sound walls.</p>
            <div class="card-foot"><span class="chip">Commercial</span><a href="/services/rockwool-insulation/">Learn More &#8594;</a></div>
          </div>
        </article>
        <article class="project-card" data-cat="attic residential">
          <img src="/images/svc-blown-in.jpg" alt="Blown-in insulation">
          <div class="project-card-body">
            <h3>Blown-In Insulation</h3>
            <p>The most common upgrade for existing Metro Detroit homes &mdash; settles around wiring and bracing without opening up walls.</p>
            <div class="card-foot"><span class="chip">Attics</span><a href="/services/blown-in-insulation/">Learn More &#8594;</a></div>
          </div>
        </article>
        <article class="project-card" data-cat="attic commercial residential">
          <img src="/images/hero-attic.jpg" alt="Attic insulation removal and replacement">
          <div class="project-card-body">
            <h3>Removal &amp; Replacement</h3>
            <p>Often the right first step when material has been contaminated, compressed or water damaged.</p>
            <div class="card-foot"><span class="chip">Attics &amp; Crawl Spaces</span><a href="/services/">Learn More &#8594;</a></div>
          </div>
        </article>
      </div>

      <div class="project-footer">
        <div class="gallery-arrows light">
          <button aria-label="Previous">&#8592;</button>
          <button aria-label="Next">&#8594;</button>
        </div>
        <a href="${PHONE_SMS}" class="btn btn-pill btn-white">Get a Free Quote</a>
      </div>
    </div>
  </section>

  ${testimonials()}
  ${faqSection([
    { q: "What insulation services do you provide?", a: "We install closed-cell and open-cell spray foam, fiberglass, Rockwool (mineral wool) and blown-in insulation, and we remove old or damaged material. Both residential and commercial properties are in scope." },
    { q: "Which insulation type is best for my home?", a: "It depends on the assembly and the problem you are trying to solve. Attics, wall cavities and crawl spaces each behave differently, so we survey the space before recommending a material." },
    { q: "Do you offer free estimates before starting any work?", a: "Yes. We visit the property, measure the areas involved, and give you a written quote. Nothing starts until you have approved it." },
    { q: "Do you work on commercial properties?", a: "We do. Offices, warehouses, retail units and light industrial buildings are all regular work for us, and we schedule around your operating hours where needed." },
    { q: "Can you remove old or damaged insulation before installing new material?", a: "Yes. Removal is a service on its own and is often the right first step when material has been contaminated, compressed or water damaged." },
    { q: "Why is spray foam a strong choice for Michigan winters?", a: "It seals and insulates in one step, which stops the air leaks that drive heat loss and ice dams in a cold climate. Closed-cell foam in particular adds rigidity and blocks moisture, making it well suited to Michigan attics, rim joists and crawl spaces." },
    { q: "Which areas do you serve?", a: "We cover Metro Detroit, including Detroit, Dearborn, Birmingham, West Bloomfield, Bloomfield Hills and St. Clair Shores. If you are just outside that area, get in touch and we will tell you honestly whether we can help." }
  ])}
  `;
  return page(
    "Spray Foam & Insulation Contractors in Metro Detroit | BroFoam Experts",
    "Family-owned spray foam and insulation contractor serving Metro Detroit. Closed-cell, open-cell, fiberglass, Rockwool and blown-in insulation for homes and commercial buildings. Free written estimates.",
    body
  );
}

// ===================== LEGAL PAGES =====================
function buildLegalPage(title, slug, paragraphs) {
  const body = `
  ${breadcrumb([{ href: "/", label: "Home" }, { label: title }])}
  <section class="page-hero">
    <div class="container page-hero-panel">
      <h1>${title}</h1>
    </div>
  </section>
  <section class="split-section">
    <div class="container" style="max-width:820px;">
      ${paragraphs.map(p => `<p style="font-size:15px;line-height:1.75;color:#3a3d44;margin-bottom:18px;">${p}</p>`).join("\n      ")}
    </div>
  </section>
  `;
  return page(`${title} | BroFoam Experts`, `${title} for BroFoam Experts.`, body);
}

function buildPrivacyPolicy() {
  return buildLegalPage("Privacy Policy", "privacy-policy", [
    "BroFoam Experts (\"we\", \"us\") respects your privacy. This page explains what information we collect when you contact us or use this website, and how we use it.",
    `We collect information you give us directly &mdash; your name, phone number, email address, service address, and project details &mdash; when you request a quote by phone, text, or through this site. We use this information only to respond to your request, schedule estimates, and provide the service you asked for.`,
    "We do not sell your personal information to third parties. We may share information with subcontractors or suppliers only as needed to complete a job you have approved.",
    `This site may use basic analytics to understand how visitors use it. No sensitive personal data is collected through analytics.`,
    `If you have questions about this policy or want your information removed from our records, contact us at ${EMAIL} or ${PHONE_DISPLAY}.`
  ]);
}

function buildTerms() {
  return buildLegalPage("Terms and Conditions", "terms-and-conditions", [
    "These terms govern your use of this website and any estimate or service request submitted through it. By using this site, you agree to these terms.",
    "All estimates provided by BroFoam Experts are free and non-binding until a written quote is issued and approved by the customer. Nothing on this site constitutes a binding offer to perform work at a specific price.",
    "Content on this site &mdash; including text, photos, and the BroFoam Experts name and logo &mdash; belongs to BroFoam Experts and may not be reproduced without permission.",
    "We make reasonable efforts to keep information on this site accurate, but service availability, pricing, and scheduling are subject to change and confirmed at the time of your written quote.",
    `Questions about these terms can be directed to ${EMAIL} or ${PHONE_DISPLAY}.`
  ]);
}

// ===================== RUN =====================
const root = __dirname;

writeFile(path.join(root, "index.html"), buildHomePage());
writeFile(path.join(root, "privacy-policy", "index.html"), buildPrivacyPolicy());
writeFile(path.join(root, "terms-and-conditions", "index.html"), buildTerms());

writeFile(path.join(root, "services", "index.html"), buildServicesHub());
services.forEach(svc => {
  writeFile(path.join(root, "services", svc.slug, "index.html"), buildServicePage(svc));
});

writeFile(path.join(root, "locations", "index.html"), buildLocationsHub());
locations.forEach(loc => {
  writeFile(path.join(root, "locations", loc.slug, "index.html"), buildLocationPage(loc));
  services.forEach(svc => {
    writeFile(path.join(root, "locations", loc.slug, svc.slug, "index.html"), buildComboPage(loc, svc));
  });
});

console.log(`\nDone. Generated ${3 + services.length + 1 + locations.length + locations.length * services.length} pages.`);
