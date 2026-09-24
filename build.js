const fs = require("fs");
const path = require("path");
const services = require("./data/services.js");
const locations = require("./data/locations.js");

const PHONE_DISPLAY = "(313) 546-4441";
const PHONE_TEL = "tel:+13135464441";
const PHONE_SMS = "sms:+13135464441";
const EMAIL = "info@brofoamexperts.com";

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

function footer() {
  return `<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-img">
      <img src="/images/svc-open-cell.jpg" alt="Open-cell spray foam expanding in a wall cavity">
    </div>
    <div class="footer-main">
      <p class="eyebrow eyebrow-light">Have a project in mind?</p>
      <p class="footer-copy">BroFoam Experts is a Metro Detroit insulation contractor serving homeowners and businesses. We deliver high-quality installs with honesty, precision, and real follow-through.</p>
      <a href="${PHONE_SMS}" class="btn btn-pill btn-white">Let's Chat</a>

      <div class="footer-links">
        <div class="footer-col">
          <h4>Services</h4>
          ${services.map(s => `<a href="/services/${s.slug}/">${s.name}</a>`).join("\n          ")}
        </div>
        <div class="footer-col">
          <h4>Locations</h4>
          ${locations.map(l => `<a href="/locations/${l.slug}/">${l.name}</a>`).join("\n          ")}
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="${PHONE_TEL}">${PHONE_DISPLAY}</a>
          <a href="mailto:${EMAIL}">${EMAIL}</a>
          <span class="footer-address">Serving Metro Detroit, MI</span>
        </div>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <span>Copyright &copy; 2026 BroFoam Experts</span>
      <a href="#top" class="to-top">To Top &#8593;</a>
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

function page(title, description, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
${head(title, description)}
<body>
${header()}
<main id="top">
${bodyHtml}
</main>
${footer()}
</body>
</html>
`;
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("wrote", filePath);
}

// ===================== SERVICE PAGE =====================
function serviceHero(svc) {
  return `<section class="breadcrumb-bar">${""}</section>
  ${breadcrumb([{ href: "/", label: "Home" }, { href: "/services/", label: "Services" }, { label: svc.name }])}
  <section class="page-hero">
    <div class="container page-hero-panel">
      ${miniTrust()}
      <h1>${svc.name} Contractor in Metro Detroit</h1>
      <p class="tagline">${svc.tagline.toUpperCase()}</p>
      <div class="hero-actions">
        <a href="${PHONE_SMS}" class="btn btn-pill btn-white">Request a Quote</a>
        <a href="${PHONE_TEL}" class="btn btn-pill btn-outline-light">${PHONE_DISPLAY}</a>
      </div>
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
    <div class="container page-hero-panel">
      ${miniTrust()}
      <h1>Insulation Services</h1>
      <p class="tagline">EVERYTHING WE INSTALL, REMOVE AND REPAIR ACROSS RESIDENTIAL AND COMMERCIAL PROPERTY.</p>
    </div>
  </section>

  <section class="split-section" style="padding-bottom:0;">
    <div class="container">
      <p class="eyebrow">What we do</p>
      <h2 style="max-width:640px;">Insulation Services for Every Space and Property Type</h2>
      <p style="font-size:15.5px;line-height:1.7;color:#3a3d44;max-width:640px;margin-top:16px;">Every building is different, so the right material depends on the assembly, the climate and how the space is used. Below is what we install. If you are not sure which applies, we will tell you after looking at the property.</p>
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
    <div class="container page-hero-panel">
      ${miniTrust()}
      <h1>Insulation Contractor in ${loc.name}</h1>
      <p class="tagline">RESIDENTIAL AND COMMERCIAL INSULATION ACROSS ${loc.name.toUpperCase()} AND THE SURROUNDING AREA.</p>
      <div class="hero-actions">
        <a href="${PHONE_SMS}" class="btn btn-pill btn-white">Request a Quote</a>
        <a href="${PHONE_TEL}" class="btn btn-pill btn-outline-light">${PHONE_DISPLAY}</a>
      </div>
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
    body
  );
}

// ===================== LOCATIONS HUB =====================
function buildLocationsHub() {
  const body = `
  ${breadcrumb([{ href: "/", label: "Home" }, { label: "Locations" }])}
  <section class="page-hero">
    <div class="container page-hero-panel">
      ${miniTrust()}
      <h1>Where We Work</h1>
      <p class="tagline">SPRAY FOAM AND INSULATION INSTALLED ACROSS METRO DETROIT.</p>
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
    <div class="container page-hero-panel">
      ${miniTrust()}
      <h1>${svc.name} in ${loc.name}</h1>
      <p class="tagline">${svc.tagline.toUpperCase()} SERVING ${loc.name.toUpperCase()} AND THE SURROUNDING AREA.</p>
      <div class="hero-actions">
        <a href="${PHONE_SMS}" class="btn btn-pill btn-white">Request a Quote</a>
        <a href="${PHONE_TEL}" class="btn btn-pill btn-outline-light">${PHONE_DISPLAY}</a>
      </div>
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
    body
  );
}

// ===================== RUN =====================
const root = __dirname;

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

console.log(`\nDone. Generated ${1 + services.length + 1 + locations.length + locations.length * services.length} pages.`);
