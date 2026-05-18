const API='https://devhire-jdmi.onrender.com/api';
let useApi=true,aType='all',aCat='all',sortV='new',srch='',curJ=null,dbT=null;
let saved=new Set(JSON.parse(localStorage.getItem('dh_sv')||'[]'));

const JOBS=[
  {id:'1',title:'Senior Frontend Engineer',co:'Razorpay',cod:'India\'s leading payment gateway powering 8M+ businesses with full-stack financial solutions.',web:'razorpay.com',fnd:'2014',emp:'3,000+',loc:'Bangalore, India',type:'Full-time',cat:'Frontend',sal:'₹28–42 LPA',exp:'5+ years',feat:true,da:1,
   desc:'Join Razorpay\'s Dashboard Experience team to own the frontend for products used by 8 million merchants daily. You\'ll work at the intersection of design and engineering, shipping features that directly impact how India\'s businesses handle money.',
   resp:['Own React-based micro-frontend architecture for Razorpay Dashboard','Lead Core Web Vitals optimisation across merchant-facing products','Build and maintain the internal component library used by 50+ engineers','Collaborate with product and design on new merchant experience features','Mentor junior engineers through code reviews'],
   reqs:['5+ years frontend engineering, 3+ with React','Expert-level TypeScript','Deep understanding of browser performance','Experience with micro-frontends or module federation','Proficiency in Jest, Cypress, and RTL'],
   nth:['GraphQL / Apollo Client','Fintech domain knowledge','Open source contributions']},
  {id:'2',title:'React Native Developer',co:'Zepto',cod:'Hyper-fast grocery delivery startup delivering in 10 minutes across 10+ Indian cities.',web:'zeptonow.com',fnd:'2021',emp:'4,000+',loc:'Remote',type:'Remote',cat:'Mobile',sal:'₹20–32 LPA',exp:'3+ years',feat:true,da:2,
   desc:'Build the Zepto consumer app experience — one of India\'s fastest-growing mobile products with 5M+ MAUs. You\'ll obsess over performance, offline-first patterns, and smooth animations that make grocery shopping feel effortless.',
   resp:['Build core app screens in React Native','Implement complex animations with Reanimated 2','Optimize app startup time and reduce JS bundle size','Work with iOS and Android platform teams','Ship features end-to-end — design to app store'],
   reqs:['3+ years React Native in production','Deep knowledge of iOS/Android deployment','React Native performance profiling experience','Redux Toolkit or Zustand familiarity','Understanding of native modules and bridging'],
   nth:['Expo experience','Background task and push notification expertise','E-commerce or q-commerce domain']},
  {id:'3',title:'Backend Engineer — Node.js',co:'Swiggy',cod:'India\'s leading food delivery and hyperlocal commerce platform, serving 500+ cities.',web:'swiggy.com',fnd:'2014',emp:'6,500+',loc:'Bangalore, India',type:'Full-time',cat:'Backend',sal:'₹24–36 LPA',exp:'4+ years',feat:false,da:2,
   desc:'Design and scale the APIs powering Swiggy\'s hyperlocal logistics engine. You\'ll work with high-throughput event queues and MongoDB at massive scale through peak ordering windows.',
   resp:['Design RESTful and event-driven APIs for logistics microservices','Optimize MongoDB queries for low-latency at 100k+ req/min','Own on-call rotation and incident response','Collaborate with data engineering on real-time pipelines','Write thorough technical design documents'],
   reqs:['4+ years backend engineering with Node.js','Strong MongoDB and Redis experience','Experience with Kafka or RabbitMQ','Distributed systems design knowledge','Proficiency in unit and integration testing'],
   nth:['Kubernetes and Docker','Go or Python as secondary language','Logistics domain knowledge']},
  {id:'4',title:'Senior DevOps Engineer',co:'CRED',cod:'India\'s premium credit card rewards platform with 6M+ high-trust members.',web:'cred.club',fnd:'2018',emp:'1,200+',loc:'Remote',type:'Remote',cat:'DevOps',sal:'₹26–38 LPA',exp:'5+ years',feat:true,da:3,
   desc:'Architect and own cloud infrastructure powering CRED\'s 99.99% uptime SLA. You\'ll build platforms that let 200+ engineers ship fast and safely, and define reliability engineering practices org-wide.',
   resp:['Design multi-region AWS infrastructure using Terraform','Own CI/CD pipelines across 40+ microservices','Lead SRE practices — SLOs, error budgets, post-mortems','Build internal developer platform tooling','Champion security best practices across cloud layers'],
   reqs:['5+ years DevOps or SRE experience','Expert-level AWS (EKS, RDS, ElastiCache)','Infrastructure as Code with Terraform','Kubernetes cluster management at scale','Strong Python or Bash scripting'],
   nth:['eBPF or Datadog/Grafana observability','Chaos engineering experience','Fintech compliance and security exposure']},
  {id:'5',title:'Full Stack Engineer',co:'PhonePe',cod:'India\'s #1 digital payments app with 500M+ registered users and 40% UPI market share.',web:'phonepe.com',fnd:'2015',emp:'4,000+',loc:'Hyderabad, India',type:'Full-time',cat:'Full Stack',sal:'₹22–34 LPA',exp:'3+ years',feat:false,da:4,
   desc:'Join PhonePe\'s Merchant Platform team to build tools for 30M+ merchants accepting digital payments. You\'ll work across the full stack — React on frontend, Node.js on backend.',
   resp:['Build merchant dashboard features end-to-end in React + Node.js','Design MongoDB schemas for new product lines','Collaborate with mobile teams on shared API design','Participate in architecture reviews','Ship weekly with high test coverage'],
   reqs:['3+ years full-stack experience','React and Node.js / Express proficiency','MongoDB or PostgreSQL experience','Comfortable owning a feature end-to-end','Good REST API design understanding'],
   nth:['Java Spring Boot experience','Payments background','Feature flags and A/B testing experience']},
  {id:'6',title:'Product Designer — Growth',co:'Groww',cod:'India\'s largest retail investment platform with 10M+ active investors.',web:'groww.in',fnd:'2016',emp:'1,800+',loc:'Remote',type:'Remote',cat:'Design',sal:'₹18–28 LPA',exp:'3+ years',feat:false,da:5,
   desc:'Design clear, trustworthy investment experiences for first-time investors. You\'ll own design for the Growth team — onboarding, activation, and retention flows that convert curious users into confident investors.',
   resp:['Own end-to-end design for onboarding and activation flows','Run user research and usability tests','Collaborate with engineers on interaction specs','Contribute to Groww design system','Present design rationale to leadership'],
   reqs:['3+ years product design in consumer apps','Expert-level Figma','Strong portfolio showing end-to-end product thinking','User research experience','Clear communication of design decisions'],
   nth:['Financial products design experience','Accessibility standards knowledge','Motion design skills']},
  {id:'7',title:'Data Engineer',co:'Meesho',cod:'India\'s fastest-growing e-commerce platform enabling 15M+ small businesses to sell online.',web:'meesho.com',fnd:'2015',emp:'3,500+',loc:'Bangalore, India',type:'Full-time',cat:'Data',sal:'₹20–30 LPA',exp:'3+ years',feat:false,da:5,
   desc:'Build the data infrastructure powering Meesho\'s seller intelligence, demand forecasting, and recommendation systems. You\'ll design pipelines handling terabytes of daily transaction data.',
   resp:['Design and maintain ETL pipelines on Spark and Airflow','Build real-time streaming pipelines with Kafka and Flink','Collaborate with data scientists on feature engineering','Optimize BigQuery and Redshift performance','Maintain data quality monitoring dashboards'],
   reqs:['3+ years data engineering','Strong Python and SQL','Spark, Airflow, or similar orchestration experience','Cloud data warehouse experience (BigQuery/Redshift/Snowflake)','Streaming data concepts understanding'],
   nth:['dbt experience','ML pipeline experience (MLflow/Kubeflow)','E-commerce domain knowledge']},
  {id:'8',title:'Senior Backend Engineer',co:'Zomato',cod:'India\'s #1 food delivery platform operating in 800+ cities with 20M+ monthly orders.',web:'zomato.com',fnd:'2008',emp:'5,800+',loc:'Gurugram, India',type:'Full-time',cat:'Backend',sal:'₹30–45 LPA',exp:'5+ years',feat:true,da:6,
   desc:'Scale Zomato\'s core ordering systems to handle peak demand during food festivals and IPL seasons. Architect systems serving 20M+ monthly orders with sub-200ms latency.',
   resp:['Lead design of high-throughput microservices in Go or Java','Optimize MySQL and Redis at 1M+ QPS','Drive database sharding and caching strategy','Own reliability for critical payment flows','Mentor a team of 4–5 backend engineers'],
   reqs:['5+ years backend engineering','Expert Go, Java, or Python','Strong MySQL, PostgreSQL, Redis experience','Kafka or event streaming experience','Track record scaling systems to millions of users'],
   nth:['Food-tech or logistics domain','ML serving infrastructure experience','Open source contributions']},
  {id:'9',title:'iOS Engineer',co:'Ola',cod:'India\'s leading mobility platform — ride-hailing, EV scooters, and financial services.',web:'olacabs.com',fnd:'2010',emp:'5,000+',loc:'Bangalore, India',type:'Full-time',cat:'Mobile',sal:'₹22–35 LPA',exp:'4+ years',feat:false,da:7,
   desc:'Build the Ola rider app experience for 150M+ users. Work on real-time mapping, driver tracking, and booking flows that must work flawlessly across thousands of device and network configurations.',
   resp:['Develop new features in Swift for the Ola rider app','Implement real-time location tracking with MapKit','Optimize for low-end iOS devices','Build offline-first capabilities','Collaborate with backend teams on API design'],
   reqs:['4+ years iOS development with Swift','Deep UIKit and SwiftUI understanding','Core Location and MapKit experience','App Store deployment and certificate management','Background fetch and push notification expertise'],
   nth:['Ride-hailing or maps domain','React Native or Flutter experience','Accessibility engineering']},
  {id:'10',title:'Frontend Architect',co:'Flipkart',cod:'India\'s largest e-commerce marketplace with 400M+ registered customers and 150M+ products.',web:'flipkart.com',fnd:'2007',emp:'30,000+',loc:'Bangalore, India',type:'Full-time',cat:'Frontend',sal:'₹40–60 LPA',exp:'8+ years',feat:true,da:7,
   desc:'Define frontend architecture strategy for Flipkart\'s next-gen shopping experience. You\'ll work at the intersection of engineering leadership and hands-on coding, setting standards for 300+ frontend engineers.',
   resp:['Own frontend architecture decisions across 15+ product squads','Lead migration to micro-frontend architecture','Define performance budgets enforced through CI/CD','Collaborate with platform teams on developer tooling','Represent Flipkart at industry conferences'],
   reqs:['8+ years frontend engineering, 3+ in architecture role','Expert React.js and deep browser internals','Led teams of 20+ engineers','Proven large-scale frontend migration experience','Strong technical writing and communication'],
   nth:['Major open source project contributions','Edge computing or CDN optimization','E-commerce performance case studies']},
  {id:'11',title:'Full Stack Engineer',co:'Freshworks',cod:'Global SaaS company building customer experience software used by 60,000+ businesses worldwide.',web:'freshworks.com',fnd:'2010',emp:'7,000+',loc:'Remote',type:'Remote',cat:'Full Stack',sal:'₹22–33 LPA',exp:'3+ years',feat:false,da:8,
   desc:'Build delightful CRM and helpdesk features for products used by teams at Netflix, HP, and thousands of SMBs. You\'ll work in a product-minded team that ships fast and iterates on data.',
   resp:['Build features across React frontend and Node.js or Rails backend','Design PostgreSQL schemas for new modules','Write comprehensive tests end-to-end','Participate in customer calls','Review code and contribute to engineering blog'],
   reqs:['3+ years full-stack engineering','React and Node.js/Rails/Django proficiency','PostgreSQL or MySQL experience','SaaS product shipping experience','Comfortable in async remote-first teams'],
   nth:['SaaS or B2B product background','Multi-tenancy pattern experience','Webhooks and third-party integration experience']},
  {id:'12',title:'Backend Developer — Python',co:'Zoho',cod:'India\'s most successful bootstrapped SaaS company with 100M+ users globally.',web:'zoho.com',fnd:'1996',emp:'15,000+',loc:'Chennai, India',type:'Full-time',cat:'Backend',sal:'₹14–22 LPA',exp:'2+ years',feat:false,da:9,
   desc:'Join Zoho\'s CRM team building backend features used by 300,000+ businesses globally. Write Python code that\'s clean, well-tested, and built to last — for a product that beats Salesforce in several markets.',
   resp:['Build RESTful APIs for CRM automation and analytics modules','Optimize SQL queries and design efficient schemas','Integrate with email, telephony, and payment services','Write unit and integration tests','Participate in architecture discussions'],
   reqs:['2+ years backend engineering with Python','Strong SQL (MySQL or PostgreSQL)','Django or Flask experience','REST API design principles understanding','Good debugging and problem-solving skills'],
   nth:['Redis or Memcached experience','Celery or task queue experience','Previous SaaS experience']},
  {id:'13',title:'DevOps Lead',co:'Paytm',cod:'India\'s pioneering digital payments and financial services super-app with 350M+ users.',web:'paytm.com',fnd:'2010',emp:'8,000+',loc:'Noida, India',type:'Full-time',cat:'DevOps',sal:'₹28–42 LPA',exp:'6+ years',feat:false,da:9,
   desc:'Lead the platform engineering team for Paytm\'s financial transaction infrastructure — one of India\'s most critical high-scale systems. Own cloud platform strategy and lead a team of 8 engineers.',
   resp:['Lead and grow a team of 8 DevOps and SRE engineers','Own multi-cloud strategy (AWS + GCP)','Drive adoption of GitOps and automation','Set SLOs for payment-critical services','Lead blameless post-mortem culture'],
   reqs:['6+ years DevOps or platform engineering','People management experience (3+ engineers)','Expert AWS or GCP with Kubernetes','Terraform and IaC expertise','Payments or fintech domain strongly preferred'],
   nth:['PCI-DSS compliance experience','Service mesh (Istio or Linkerd)','Prometheus and Grafana stack']},
  {id:'14',title:'Product Manager — Consumer',co:'Nykaa',cod:'India\'s leading beauty and fashion e-commerce platform with 35M+ active customers.',web:'nykaa.com',fnd:'2012',emp:'2,500+',loc:'Mumbai, India',type:'Full-time',cat:'Product',sal:'₹25–38 LPA',exp:'4+ years',feat:false,da:10,
   desc:'Own discovery and personalization for Nykaa\'s 35M+ beauty shoppers. Combine data-driven insights with customer empathy to build features that make finding the perfect product feel magical.',
   resp:['Define product roadmap for search, discovery, and recommendations','Run A/B tests and analyze results','Write detailed PRDs for engineering and design','Conduct customer interviews and synthesize insights','Work with data science on recommendation models'],
   reqs:['4+ years PM at a consumer tech company','Strong analytical skills and SQL comfort','A/B testing and results interpretation experience','Exceptional written and verbal communication','Track record of successful consumer feature launches'],
   nth:['Beauty, fashion, or lifestyle industry knowledge','Recommendation systems experience','MBA from a top institution']},
  {id:'15',title:'QA Automation Engineer',co:'BrowserStack',cod:'The world\'s leading cloud-based browser and app testing platform, used by 50,000+ companies.',web:'browserstack.com',fnd:'2011',emp:'1,100+',loc:'Remote',type:'Remote',cat:'Full Stack',sal:'₹16–26 LPA',exp:'3+ years',feat:false,da:10,
   desc:'Build automation frameworks that keep BrowserStack\'s own platform rock-solid at scale. Write code that tests code — building intelligent test suites that catch regressions before customers do.',
   resp:['Design end-to-end test automation frameworks','Build API testing suites using Playwright or Cypress','Integrate tests into CI/CD for every merge','Create performance and load testing suites','Collaborate with devs to shift testing left'],
   reqs:['3+ years QA automation engineering','Expert Playwright, Cypress, or Selenium','Strong JavaScript or Python scripting','REST API testing and Newman experience','GitHub Actions or Jenkins CI integration'],
   nth:['Mobile automation with Appium','Performance testing with k6 or JMeter','Cross-browser testing expertise']},
  {id:'16',title:'Senior Software Engineer',co:'Postman',cod:'The world\'s leading API development platform used by 30M+ developers in 500,000+ companies.',web:'postman.com',fnd:'2014',emp:'900+',loc:'Bangalore, India',type:'Full-time',cat:'Full Stack',sal:'₹35–55 LPA',exp:'5+ years',feat:true,da:11,
   desc:'Help build the tools that 30M developers use to design, test, and ship APIs. Work on core product — solving hard problems in API schema management, collaboration, and real-time sync at scale.',
   resp:['Build core features across Postman desktop app (Electron + React)','Design and implement backend services in Node.js','Work on real-time collaboration with CRDTs','Optimize sync performance for large API collections','Contribute to Postman\'s open source tooling'],
   reqs:['5+ years full-stack experience','Strong React and Electron or desktop app experience','Node.js and API design expertise','Real-time systems or collaborative editing experience','Deep HTTP, REST, and API concepts understanding'],
   nth:['Open source contributions','WebSockets or CRDT experience','GraphQL and gRPC knowledge']},
  {id:'17',title:'Data Scientist — ML Platform',co:'InMobi',cod:'Global ad-tech company powering 1.5B+ devices with intelligent mobile advertising.',web:'inmobi.com',fnd:'2007',emp:'2,200+',loc:'Bangalore, India',type:'Full-time',cat:'Data',sal:'₹28–45 LPA',exp:'4+ years',feat:false,da:12,
   desc:'Build ML models behind InMobi\'s intelligent ad-targeting platform serving 30B+ ad impressions daily. Work at the intersection of research and production engineering.',
   resp:['Design and train CTR and conversion prediction models at scale','Build ML pipelines from data collection to model serving','A/B test model changes against real advertising traffic','Collaborate on model serving infrastructure','Represent InMobi at conferences'],
   reqs:['4+ years data science or ML engineering','Strong Python — Pandas, NumPy, PyTorch or TensorFlow','Production ML model deployment experience','SQL and large-scale data processing (Spark/Hive)','Statistics and probability fundamentals'],
   nth:['Advertising or recommendation systems domain','MLflow or Kubeflow experience','Published research or top Kaggle rankings']},
  {id:'18',title:'Frontend Developer — React',co:'Dunzo',cod:'Bangalore-based quick-commerce platform enabling 20-minute delivery of everyday essentials.',web:'dunzo.com',fnd:'2015',emp:'800+',loc:'Remote',type:'Contract',cat:'Frontend',sal:'₹14–20 LPA',exp:'2+ years',feat:false,da:12,
   desc:'Build and optimize the Dunzo web experience for users who need things fast. Work on ordering flows, real-time order tracking, and partner dashboards — all with laser focus on speed.',
   resp:['Build consumer-facing features in React','Optimize LCP and FID across Dunzo web properties','Collaborate with design on pixel-perfect implementations','Integrate REST APIs and handle error states','Write unit tests for all components'],
   reqs:['2+ years React.js in production','Good CSS and responsive design','REST API integration experience','Git and PR workflow familiarity','Eye for UI detail and design accuracy'],
   nth:['Next.js experience','PWA concepts knowledge','Quick-commerce domain experience']},
  {id:'19',title:'Android Developer',co:'ShareChat',cod:'India\'s largest regional social media platform with 250M+ users across 15 Indian languages.',web:'sharechat.com',fnd:'2015',emp:'1,500+',loc:'Bangalore, India',type:'Full-time',cat:'Mobile',sal:'₹20–32 LPA',exp:'3+ years',feat:false,da:13,
   desc:'Build ShareChat Android for 250M users — many experiencing social media for the first time in their mother tongue. Tackle unique challenges of low-end devices, regional scripts, and 2G networks.',
   resp:['Build features in Kotlin for the ShareChat Android app','Optimize for entry-level Android devices','Implement video playback and short-form video feed','Work with regional language rendering','Contribute to shared Android component library'],
   reqs:['3+ years Android development with Kotlin','Android Architecture Components (ViewModel, LiveData, Room)','Low-end device performance optimization experience','Jetpack Compose willingness to learn','Play Store release management'],
   nth:['ExoPlayer video optimization experience','Regional language challenges in Android','Social media or UGC platform experience']},
  {id:'20',title:'Senior DevOps Engineer',co:'Atlassian',cod:'Global leader in team collaboration software — makers of Jira, Confluence, and Bitbucket.',web:'atlassian.com',fnd:'2002',emp:'12,000+',loc:'Remote',type:'Remote',cat:'DevOps',sal:'₹40–65 LPA',exp:'6+ years',feat:true,da:14,
   desc:'Join Atlassian\'s Cloud Infrastructure team keeping Jira and Confluence running for 250,000+ companies globally. Full-remote role with competitive international compensation.',
   resp:['Design multi-region AWS infrastructure for Atlassian cloud products','Build self-service platform tooling for 1,000+ engineers','Drive Kubernetes migration from legacy VM infrastructure','Define reliability engineering standards','Participate in 24/7 on-call with generous compensation'],
   reqs:['6+ years DevOps or platform engineering','Expert AWS (solutions architect level)','Enterprise-scale Kubernetes','Terraform and GitOps workflows','Excellent English for async-first culture'],
   nth:['Atlassian product experience','Global SaaS company background','CNCF project contributions']}
];

// ── Color system ──
const CLR=[{bg:'rgba(0,212,255,0.1)',c:'#00d4ff'},{bg:'rgba(124,58,237,0.1)',c:'#a78bfa'},{bg:'rgba(6,255,165,0.08)',c:'#06ffa5'},{bg:'rgba(255,183,3,0.1)',c:'#ffb703'},{bg:'rgba(255,77,109,0.08)',c:'#ff4d6d'},{bg:'rgba(99,179,237,0.1)',c:'#63b3ed'},{bg:'rgba(236,72,153,0.08)',c:'#f472b6'},{bg:'rgba(52,211,153,0.08)',c:'#34d399'}];
function clr(s){if(!s||typeof s!=='string')return CLR[0];let h=0;for(let c of s)h=(h*31+c.charCodeAt(0))%CLR.length;return CLR[h]}
function ini(s){if(!s||typeof s!=='string')return'??';return s.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
function ago(d){if(d===0)return'just now';if(d===1)return'1d ago';return d+'d ago'}

// ── API ──
async function chkApi(){
  updBar(false, true);
  try{const r=await fetch(API+'/jobs',{signal:AbortSignal.timeout(20000)});if(r.ok){useApi=true;updBar(true);return true}}catch{}
  updBar(false);return false;
}
function updBar(live, loading=false){
  document.getElementById('apiDot').className='api-dot'+(live?' live':'');
  document.getElementById('apiTxt').textContent=
    loading?'Waking up server, please wait...':
    live?'Backend connected — data live from MongoDB':
    'Demo mode — 20 companies loaded. Run backend to connect MongoDB.';
  document.getElementById('apiTxt').style.color=
    loading?'var(--amber)':live?'var(--green)':'var(--amber)';
}

// ── Filter & Sort ──
function filt(src){
  let j=[...src];
  if(srch){const q=srch.toLowerCase();j=j.filter(x=>{
    const title=(x.title||'').toLowerCase();
    const co=(x.co||x.company||'').toLowerCase();
    const loc=(x.loc||x.location||'').toLowerCase();
    const cat=(x.cat||x.category||'').toLowerCase();
    return title.includes(q)||co.includes(q)||loc.includes(q)||cat.includes(q);
  })}
  if(aType!=='all')j=j.filter(x=>(x.type||'')=== aType);
  if(aCat!=='all')j=j.filter(x=>(x.cat||x.category||'')=== aCat);
  if(sortV==='feat')j.sort((a,b)=>(b.feat||b.featured?1:0)-(a.feat||a.featured?1:0));
  else if(sortV==='sal')j.sort((a,b)=>{const n=s=>parseInt((s||'0').replace(/[^\d]/g,''))||0;return n(b.sal||b.salary)-n(a.sal||a.salary)});
  else j.sort((a,b)=>(a.da||0)-(b.da||0));
  return j;
}
function setT(v,el){aType=v;document.querySelectorAll('.chip:not(.cat)').forEach(c=>c.classList.remove('on'));el.classList.add('on');render()}
function setC(v,el){aCat=v;document.querySelectorAll('.chip.cat').forEach(c=>c.classList.remove('on'));el.classList.add('on');render()}
function srt(v){sortV=v;render()}
function dbs(){clearTimeout(dbT);dbT=setTimeout(go,300)}
function go(){srch=document.getElementById('si').value.trim();render()}
function resetAll(){srch='';aType='all';aCat='all';sortV='new';document.getElementById('si').value='';document.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));document.querySelector('[data-t="all"]').classList.add('on');document.querySelector('[data-c="all"]').classList.add('on');document.querySelector('.sort-sel').value='new';render()}

// ── Render ──
function render(src){
  const j=filt(src||window._J||JOBS);
  const g=document.getElementById('grid');
  document.getElementById('jcnt').textContent=j.length+' role'+(j.length!==1?'s':'');
  updStats(j);
  if(!j.length){g.innerHTML='<div class="empty"><div class="empty-icon">◌</div><h3 style="font-family:Syne,sans-serif;font-size:1rem;color:var(--muted)">No roles match your filters</h3><p style="font-size:13px;margin-top:6px">Try adjusting your search or filters</p></div>';return}
  g.innerHTML=j.map(j=>{
    const cl=clr(j.co||j.company);
    const tc=j.type==='Remote'?'trm':j.type==='Contract'?'tct':j.type==='Part-time'?'tpt':'tft';
    const sv=saved.has(j.id||j._id);
    return`<div class="jcard" onclick="det('${j.id||j._id}')">
      ${(j.feat||j.featured)?'<div class="feat-badge">★ Featured</div>':''}
      <div class="ct">
        <div class="ctl">
          <div class="av" style="background:${cl.bg};color:${cl.c}">${ini(j.co||j.company)}</div>
          <div><div class="jt">${j.title}</div><div class="jco">${j.co||j.company} · ${j.loc||j.location}</div></div>
        </div>
        <button class="ibtn${sv?' sv':''}" title="${sv?'Unsave':'Save'}" onclick="event.stopPropagation();tog('${j.id||j._id}',this)">${sv?'♥':'♡'}</button>
      </div>
      <div class="ctags">
        <span class="tag ${tc}">${j.type}</span>
        <span class="tag tcat">${j.cat}</span>
        ${j.exp?`<span class="tag texp">${j.exp}</span>`:''}
      </div>
      <div class="jdesc">${j.desc||j.description}</div>
      <div class="cf">
        <div class="sal">${j.sal||j.salary||'Competitive'}</div>
        <div class="cfr">
          <span class="posted">${ago(j.da||0)}</span>
          <button class="btn-ap" onclick="event.stopPropagation();qap('${j.id||j._id}')">Apply →</button>
        </div>
      </div>
    </div>`}).join('');
}
function updStats(j){
  document.getElementById('sJ').innerHTML=`<em>${j.length}</em>`;
  document.getElementById('sR').innerHTML=`<em>${j.filter(x=>x.type==='Remote').length}</em>`;
  document.getElementById('sC').innerHTML=`<em>${[...new Set(j.map(x=>x.co))].length}</em>`;
  document.getElementById('sS').innerHTML=`<em>${saved.size}</em>`;
}

// ── Detail modal ──
function det(id){
  const j=find(id);if(!j)return;curJ=j;
  const cl=clr(j.co);
  const tc=j.type==='Remote'?'trm':j.type==='Contract'?'tct':j.type==='Part-time'?'tpt':'tft';
  const sv=saved.has(id);
  const dAv=document.getElementById('dAv');
  dAv.style.cssText=`background:${cl.bg};color:${cl.c}`;dAv.textContent=ini(j.co);
  document.getElementById('dCn').textContent=j.co;
  document.getElementById('dCm').innerHTML=`<span>📍 ${j.loc}</span>${j.fnd?`<span>🗓 Est. ${j.fnd}</span>`:''}${j.emp?`<span>👥 ${j.emp}</span>`:''}${j.web?`<a href="https://${j.web}" target="_blank" rel="noopener">🌐 ${j.web}</a>`:''}`;
  document.getElementById('dBd').innerHTML=`
    <div class="dm-jt">${j.title}</div>
    <div class="ctags" style="margin-bottom:12px">
      <span class="tag ${tc}">${j.type}</span><span class="tag tcat">${j.cat}</span>
      ${j.exp?`<span class="tag texp">${j.exp}</span>`:''}
      ${j.feat?'<span class="tag" style="background:rgba(255,183,3,0.1);color:var(--amber);border:1px solid rgba(255,183,3,0.25)">★ Featured</span>':''}
    </div>
    <div class="dm-sal">${j.sal?`💰 ${j.sal}`:'Competitive package — negotiable'}</div>
    ${j.cod?`<div class="dm-sec"><div class="dm-st">About ${j.co}</div><div class="dm-txt">${j.cod}</div></div>`:''}
    <div class="dm-sec"><div class="dm-st">About the Role</div><div class="dm-txt">${(j.desc||'').replace(/\n/g,'<br>')}</div></div>
    ${j.resp&&j.resp.length?`<div class="dm-sec"><div class="dm-st">Responsibilities</div><ul class="dm-ul">${j.resp.map(r=>`<li>${r}</li>`).join('')}</ul></div>`:''}
    ${j.reqs&&j.reqs.length?`<div class="dm-sec"><div class="dm-st">Requirements</div><ul class="dm-ul">${j.reqs.map(r=>`<li>${r}</li>`).join('')}</ul></div>`:''}
    ${j.nth&&j.nth.length?`<div class="dm-sec"><div class="dm-st">Nice to Have</div><ul class="dm-ul nice">${j.nth.map(r=>`<li>${r}</li>`).join('')}</ul></div>`:''}
  `;
  const sb=document.getElementById('dSv');
  sb.textContent=sv?'♥ Saved':'♡ Save Job';
  sb.className='btn-sb'+(sv?' sv':'');
  op('dO');
}
function apFD(){if(curJ)openAp(curJ.id||curJ._id)}
function svFD(){if(curJ)tog(curJ.id||curJ._id,null,true)}

// ── Apply modal ──
function qap(id){openAp(id)}
function openAp(id){
  const j=find(id);if(!j)return;curJ=j;
  const cl=clr(j.co);
  document.getElementById('aPrv').innerHTML=`<div class="ap-av" style="background:${cl.bg};color:${cl.c}">${ini(j.co)}</div><div><div style="font-size:14px;font-weight:500;color:#fff;margin-bottom:2px">${j.title}</div><div style="font-size:12px;color:var(--muted)">${j.co} · ${j.loc}</div></div>`;
  ['an','ae','aph','al','ac'].forEach(i=>{const e=document.getElementById(i);e.value='';e.classList.remove('err')});
  document.getElementById('axp').value='';
  op('aO');
}
function subAp(){
  const n=document.getElementById('an').value.trim();
  const e=document.getElementById('ae').value.trim();
  const l=document.getElementById('al').value.trim();
  const cv=document.getElementById('ac').value.trim();
  let ok=true;
  if(!n){document.getElementById('an').classList.add('err');ok=false}
  if(!e||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){document.getElementById('ae').classList.add('err');ok=false}
  if(!l){document.getElementById('al').classList.add('err');ok=false}
  if(!cv){document.getElementById('ac').classList.add('err');ok=false}
  if(!ok){tost('Please fill all required fields','warn');return}
  cl('aO');tost(`✓ Application sent to ${curJ?.co}! They'll review and get in touch.`);
}

// ── Post Job ──
function openPost(){op('pO')}
async function subJob(){
  const t=document.getElementById('ft').value.trim();
  const co=document.getElementById('fc').value.trim();
  const lo=document.getElementById('fl').value.trim();
  const tp=document.getElementById('ftp').value;
  const ca=document.getElementById('fca').value;
  const de=document.getElementById('fde').value.trim();
  const rq=document.getElementById('frq').value.trim();
  let ok=true;
  [['ft',t],['fc',co],['fl',lo],['ftp',tp],['fca',ca],['fde',de],['frq',rq]].forEach(([id,v])=>{
    const el=document.getElementById(id);
    if(!v){el.classList.add('err');ok=false}else el.classList.remove('err');
  });
  if(!ok){tost('Please fill all required (*) fields','warn');return}
  const job={
    id:Date.now().toString(),title:t,co,cod:document.getElementById('fcd').value.trim(),
    web:document.getElementById('fw').value.trim(),loc:lo,type:tp,cat:ca,
    sal:document.getElementById('fsa').value.trim(),exp:document.getElementById('fex').value.trim(),
    fnd:document.getElementById('ffo').value.trim(),emp:document.getElementById('fem').value.trim(),
    desc:de,resp:document.getElementById('fre').value.split('\n').filter(Boolean),
    reqs:rq.split('\n').filter(Boolean),nth:document.getElementById('fni').value.split('\n').filter(Boolean),
    feat:false,da:0
  };
  if(useApi){
    try{
      const r=await fetch(API+'/jobs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:t,company:co,location:lo,type:tp,category:ca,salary:job.sal,description:de,requirements:job.reqs,companyDesc:job.cod,website:job.web,experience:job.exp})});
      if(r.ok){const sv=await r.json();job.id=sv._id||job.id}
    }catch{}
  }
  window._J.unshift(job);
  cl('pO');
  tost(`✓ "${t}" at ${co} is now live!`);
  render();
  ['ft','fc','fcd','fw','fl','fsa','fex','ffo','fem','fde','fre','frq','fni'].forEach(i=>{const el=document.getElementById(i);if(el)el.value=''});
  document.getElementById('ftp').value='';document.getElementById('fca').value='';
}

// ── Save / Bookmark ──
function tog(id,btn,fromDet){
  if(saved.has(id)){saved.delete(id);tost('Removed from saved jobs','warn')}
  else{saved.add(id);tost('✓ Job saved!')}
  localStorage.setItem('dh_sv',JSON.stringify([...saved]));
  updSaved();
  if(fromDet&&curJ){const sv=saved.has(id);const sb=document.getElementById('dSv');sb.textContent=sv?'♥ Saved':'♡ Save Job';sb.className='btn-sb'+(sv?' sv':'')}
  // sync card buttons
  document.querySelectorAll('.jcard').forEach(card=>{
    const apBtn=card.querySelector('.btn-ap');if(!apBtn)return;
    const m=apBtn.getAttribute('onclick')?.match(/'([^']+)'/);if(!m)return;
    if(m[1]===id){const ib=card.querySelector('.ibtn');const s=saved.has(id);ib.className='ibtn'+(s?' sv':'');ib.textContent=s?'♥':'♡';ib.title=s?'Unsave':'Save'}
  });
  updStats(filt(window._J||JOBS));
}
function updSaved(){
  const n=saved.size;const el=document.getElementById('scnt');
  el.textContent=n;el.style.display=n?'flex':'none';
}

// ── Saved Panel ──
function openSaved(){
  const bd=document.getElementById('svBd');
  const j=(window._J||JOBS).filter(x=>saved.has(x.id||x._id));
  if(!j.length){bd.innerHTML='<div style="text-align:center;padding:3rem 1rem;color:var(--muted)"><div style="font-size:2rem;margin-bottom:1rem;opacity:0.25">♡</div><p>No saved jobs yet.<br>Click ♡ on any card to save it.</p></div>'}
  else bd.innerHTML=j.map(x=>{const cl=clr(x.co);return`<div class="sv-item" onclick="cl('svO');det('${x.id||x._id}')"><div style="width:36px;height:36px;border-radius:8px;background:${cl.bg};color:${cl.c};display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:11px;font-weight:700;flex-shrink:0">${ini(x.co)}</div><div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:500;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${x.title}</div><div style="font-size:12px;color:var(--muted)">${x.co} · ${x.loc}</div></div><button style="background:transparent;border:none;color:var(--red);cursor:pointer;font-size:14px;flex-shrink:0;padding:4px" onclick="event.stopPropagation();tog('${x.id||x._id}',null);openSaved()" title="Remove">✕</button></div>`}).join('');
  op('svO');
}

// ── Share ──
function share(){
  if(!curJ)return;
  navigator.clipboard.writeText(`${curJ.title} at ${curJ.co} — ${curJ.sal||'Competitive'} | ${curJ.loc}\nhttps://${curJ.web||'devhire.app'}`).then(()=>tost('✓ Job link copied to clipboard!'));
}

// ── Overlays ──
function op(id){document.getElementById(id).classList.add('open')}
function cl(id){document.getElementById(id).classList.remove('open')}
function oc(e,id){if(e.target===document.getElementById(id))cl(id)}
// keydown escape handled in auth section below

// ── Toast ──
function tost(msg,t=''){
  const el=document.getElementById('toast');el.textContent=msg;el.className='toast show'+(t?' '+t:'');
  clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),3200);
}

// ── Utils ──
function find(id){return(window._J||JOBS).find(x=>(x.id||x._id)===id)||JOBS.find(x=>(x.id||x._id)===id)}

// ── Seed ──
async function seedDb(){
  if(!useApi)return;
  try{
    const r=await fetch(API+'/jobs');const ex=await r.json();
    if(ex.length===0)await fetch(API+'/jobs/seed',{method:'POST',headers:{'Content-Type':'application/json'}});
  }catch{}
}

// ── Init ──
async function init(){
  updSaved();
  const live=await chkApi();
  if(live){
    try{await seedDb();const r=await fetch(API+'/jobs');const d=await r.json();window._J=d.length?d:JOBS}
    catch{window._J=JOBS}
  }else window._J=JOBS;
  render();
}
// ── Resume Matcher ──
let rmTab = 'file';
let rmFileText = '';

function openMatcher() {
  if (!curJ) return;
  const cl = clr(curJ.co);
  document.getElementById('rmJobBar').innerHTML = `
    <div style="width:34px;height:34px;border-radius:7px;background:${cl.bg};color:${cl.c};display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:11px;font-weight:700;flex-shrink:0">${ini(curJ.co)}</div>
    <div>
      <div style="font-size:13px;font-weight:500;color:#fff">${curJ.title}</div>
      <div style="font-size:11px;color:var(--muted)">${curJ.co} · ${curJ.loc}</div>
    </div>`;
  // Reset state
  rmFileText = '';
  rmSetTab('file');
  document.getElementById('rmFileOk').classList.remove('show');
  document.getElementById('rmPasteIn').value = '';
  document.getElementById('rmSpinner').style.display = 'none';
  document.getElementById('rmResult').style.display = 'none';
  document.getElementById('rmAnalyseBtn').style.display = 'block';
  document.getElementById('rmFileIn').value = '';
  op('rmO');
}

function rmSetTab(t) {
  rmTab = t;
  document.getElementById('rmTabFile').className = 'rm-tab' + (t === 'file' ? ' on' : '');
  document.getElementById('rmTabPaste').className = 'rm-tab' + (t === 'paste' ? ' on' : '');
  document.getElementById('rmPanelFile').style.display = t === 'file' ? 'block' : 'none';
  document.getElementById('rmPanelPaste').style.display = t === 'paste' ? 'block' : 'none';
}

function rmOnFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    rmFileText = e.target.result;
    document.getElementById('rmFileName').textContent = file.name + ' loaded';
    document.getElementById('rmFileOk').classList.add('show');
  };
  reader.readAsText(file);
}

function rmOnDrop(e) {
  e.preventDefault();
  document.getElementById('rmDrop').classList.remove('drag');
  const file = e.dataTransfer.files[0];
  if (!file) return;
  const fakeInput = { files: [file] };
  rmOnFile(fakeInput);
}

function rmClearFile() {
  rmFileText = '';
  document.getElementById('rmFileIn').value = '';
  document.getElementById('rmFileOk').classList.remove('show');
}

async function rmAnalyse() {
  const resumeText = rmTab === 'paste'
    ? document.getElementById('rmPasteIn').value.trim()
    : rmFileText.trim();

  if (!resumeText) {
    tost(rmTab === 'paste' ? 'Please paste your resume text first.' : 'Please upload a resume file first.', 'warn');
    return;
  }

  // Build job description string
  const j = curJ;
  const jobDescription = [
    j.desc || '',
    j.reqs && j.reqs.length ? 'Requirements:\n' + j.reqs.join('\n') : '',
    j.resp && j.resp.length ? 'Responsibilities:\n' + j.resp.join('\n') : '',
    j.nth  && j.nth.length  ? 'Nice to have:\n'    + j.nth.join('\n')  : ''
  ].filter(Boolean).join('\n\n');

  document.getElementById('rmAnalyseBtn').style.display = 'none';
  document.getElementById('rmSpinner').style.display = 'flex';
  document.getElementById('rmResult').style.display = 'none';

  try {
    const res = await fetch(API + '/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, jobDescription, jobTitle: j.title, company: j.co })
    });

    if (!res.ok) throw new Error('Server error ' + res.status);
    const data = await res.json();
    rmShowResult(data);
  } catch (err) {
    document.getElementById('rmSpinner').style.display = 'none';
    document.getElementById('rmAnalyseBtn').style.display = 'block';
    tost('AI match failed — make sure the backend is running with ANTHROPIC_API_KEY set.', 'warn');
  }
}

function rmShowResult(d) {
  document.getElementById('rmSpinner').style.display = 'none';

  const score = Math.max(0, Math.min(100, d.matchScore || 0));
  const verdict = d.verdict || '';
  const verdictClass = score >= 85 ? 'strong' : score >= 65 ? 'good' : score >= 40 ? 'partial' : 'weak';

  // SVG ring
  const r = 34, cx = 40, cy = 40, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const ringColor = score >= 85 ? 'var(--green)' : score >= 65 ? 'var(--accent)' : score >= 40 ? 'var(--amber)' : 'var(--red)';

  const strHTML = (d.strengths || []).map(s =>
    `<li><span class="rm-dot">✓</span><span>${s}</span></li>`).join('');
  const gapHTML = (d.gaps || []).map(g =>
    `<li><span class="rm-dot">✕</span><span>${g}</span></li>`).join('');
  const tipHTML = (d.tips || []).map(t =>
    `<li><span class="rm-dot">→</span><span>${t}</span></li>`).join('');

  document.getElementById('rmResult').innerHTML = `
    <div class="rm-score-wrap">
      <div class="rm-ring">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border2)" stroke-width="7"/>
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ringColor}" stroke-width="7"
            stroke-dasharray="${dash} ${circ}" stroke-linecap="round" style="transition:stroke-dasharray 0.8s ease"/>
        </svg>
        <div class="rm-ring-pct">${score}%</div>
      </div>
      <div class="rm-verdict">
        <div class="rm-verdict-lbl">Match Score</div>
        <div class="rm-verdict-val ${verdictClass}">${verdict}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:4px">${curJ.title} at ${curJ.co}</div>
      </div>
    </div>
    ${strHTML ? `<div class="rm-sec-title">✦ Strengths</div><ul class="rm-list str">${strHTML}</ul>` : ''}
    ${gapHTML ? `<div class="rm-sec-title">◌ Gaps to Address</div><ul class="rm-list gap">${gapHTML}</ul>` : ''}
    ${tipHTML ? `<div class="rm-sec-title">→ Quick Tips</div><ul class="rm-list tip">${tipHTML}</ul>` : ''}
    <button class="btn-sub" onclick="rmReset()" style="margin-top:1.25rem;background:var(--surface3);border:1px solid var(--border2);color:var(--text)">← Try Another Resume</button>
  `;
  document.getElementById('rmResult').style.display = 'block';
}

function rmReset() {
  rmFileText = '';
  document.getElementById('rmFileIn').value = '';
  document.getElementById('rmFileOk').classList.remove('show');
  document.getElementById('rmPasteIn').value = '';
  document.getElementById('rmResult').style.display = 'none';
  document.getElementById('rmAnalyseBtn').style.display = 'block';
  rmSetTab('file');
}

// ── Auth ──────────────────────────────────────────────────────────────────
let currentUser = null;

async function authCheck() {
  try {
    const res = await fetch(API.replace('/api', '') + '/api/auth/me', { credentials: 'include' });
    const data = await res.json();
    if (data.loggedIn) {
      currentUser = data.user;
      renderUserNav(data.user);
    }
  } catch (_) {}
}

function renderUserNav(user) {
  const navAuth = document.getElementById('navAuth');
  const initial = user.name?.charAt(0).toUpperCase() || '?';
  const avatarHTML = user.avatar
    ? `<img class="nav-avatar" src="${user.avatar}" alt="${user.name}" referrerpolicy="no-referrer">`
    : `<div class="nav-avatar-placeholder">${initial}</div>`;

  navAuth.innerHTML = `
    <button class="nav-user" onclick="toggleMenu(event)">
      ${avatarHTML}
      <span class="nav-user-name">${user.name.split(' ')[0]}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style="color:var(--muted);flex-shrink:0"><path d="M6 8L1 3h10z"/></svg>
    </button>`;

  document.getElementById('menuName').textContent  = user.name;
  document.getElementById('menuEmail').textContent = user.email;
}

function toggleMenu(e) {
  e.stopPropagation();
  document.getElementById('userMenu').classList.toggle('open');
}
function closeMenu() { document.getElementById('userMenu').classList.remove('open'); }
document.addEventListener('click', closeMenu);

function openAuth() { op('authO'); }

function authWithGoogle() {
  // Full-page redirect to backend OAuth entry point
  window.location.href = (API.replace('/api', '')) + '/api/auth/google';
}

async function authLogout() {
  closeMenu();
  await fetch(API.replace('/api', '') + '/api/auth/logout', {
    method: 'POST', credentials: 'include'
  });
  currentUser = null;
  document.getElementById('navAuth').innerHTML = `
    <button class="btn-login" onclick="openAuth()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
      Sign In
    </button>`;
  tost('Signed out — see you soon!', 'warn');
}

// Guard "Post a Job" behind login
function guardedPost() {
  if (!currentUser) { openAuth(); tost('Sign in to post a job listing.', 'warn'); return; }
  openPost();
}

// Handle ?auth=success or ?auth=fail redirect from Google callback
function handleAuthRedirect() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('auth') === 'success') {
    authCheck().then(() => {
      if (currentUser) tost(`✓ Welcome, ${currentUser.name.split(' ')[0]}!`);
    });
    window.history.replaceState({}, '', window.location.pathname);
  } else if (params.get('auth') === 'fail') {
    tost('Google sign-in failed — please try again.', 'warn');
    window.history.replaceState({}, '', window.location.pathname);
  }
}

// ── Init ──────────────────────────────────────────────────────────────────
async function init() {
  updSaved();
  handleAuthRedirect();
  authCheck();
  const live = await chkApi();
  if (live) {
    try {
      await seedDb();
      const r = await fetch(API + '/jobs');
      const d = await r.json();
      window._J = d.length ? d : JOBS;
    } catch { window._J = JOBS; }
  } else window._J = JOBS;
  render();
}

// Add authO to escape handler
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') ['dO','aO','pO','svO','rmO','authO'].forEach(cl);
});

init();

