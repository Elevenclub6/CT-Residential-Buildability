const towns = [
  {name:"East Lyme",county:"New London",score:82,pop:"18,760",value:"$390,000",mill:"22.45",open:"22%",strength:"Location, land availability, low risk",metrics:{availability:85,cost:68,environment:80,infrastructure:88,accessibility:90,tax:60,growth:78}},
  {name:"Killingly",county:"Windham",score:78,pop:"17,900",value:"$315,000",mill:"31.12",open:"18%",strength:"Large parcels, lower land cost",metrics:{availability:88,cost:82,environment:74,infrastructure:67,accessibility:70,tax:58,growth:63}},
  {name:"Lebanon",county:"New London",score:76,pop:"7,100",value:"$350,000",mill:"26.10",open:"29%",strength:"Affordability, rural character",metrics:{availability:91,cost:79,environment:77,infrastructure:58,accessibility:60,tax:67,growth:62}},
  {name:"Plainfield",county:"Windham",score:74,pop:"15,400",value:"$305,000",mill:"29.76",open:"17%",strength:"Land availability, low environmental risk",metrics:{availability:86,cost:80,environment:76,infrastructure:64,accessibility:72,tax:56,growth:61}},
  {name:"Voluntown",county:"New London",score:72,pop:"2,600",value:"$330,000",mill:"25.20",open:"44%",strength:"Large lots, lower taxes",metrics:{availability:83,cost:73,environment:82,infrastructure:48,accessibility:51,tax:74,growth:55}},
  {name:"Sterling",county:"Windham",score:70,pop:"3,700",value:"$320,000",mill:"30.44",open:"25%",strength:"Affordability, growth potential",metrics:{availability:79,cost:77,environment:72,infrastructure:55,accessibility:58,tax:61,growth:68}},
  {name:"Canterbury",county:"Windham",score:69,pop:"5,200",value:"$340,000",mill:"28.60",open:"31%",strength:"Rural, available land",metrics:{availability:82,cost:71,environment:75,infrastructure:51,accessibility:55,tax:63,growth:60}},
  {name:"Scotland",county:"Windham",score:68,pop:"1,700",value:"$335,000",mill:"27.10",open:"36%",strength:"Large parcels, low development constraints",metrics:{availability:80,cost:72,environment:79,infrastructure:46,accessibility:48,tax:65,growth:57}},
  {name:"Hampton",county:"Windham",score:66,pop:"1,900",value:"$342,000",mill:"27.50",open:"39%",strength:"Affordability, low risk",metrics:{availability:77,cost:70,environment:81,infrastructure:45,accessibility:50,tax:64,growth:52}},
  {name:"Brooklyn",county:"Windham",score:64,pop:"8,500",value:"$360,000",mill:"28.25",open:"21%",strength:"Land availability, lower taxes",metrics:{availability:75,cost:69,environment:70,infrastructure:60,accessibility:65,tax:62,growth:59}},
  {name:"Groton",county:"New London",score:61,pop:"38,900",value:"$360,000",mill:"29.50",open:"19%",strength:"Infrastructure, shoreline access",metrics:{availability:52,cost:55,environment:61,infrastructure:91,accessibility:88,tax:52,growth:58}},
  {name:"Middletown",county:"Middlesex",score:58,pop:"47,000",value:"$355,000",mill:"27.90",open:"16%",strength:"Central access, infrastructure",metrics:{availability:57,cost:58,environment:63,infrastructure:85,accessibility:82,tax:54,growth:56}}
];

const metricNames = {
  availability:"Land Availability", cost:"Land Cost", environment:"Environmental Risk",
  infrastructure:"Infrastructure", accessibility:"Accessibility", tax:"Tax Environment", growth:"Population Growth"
};

function colorForScore(s){
  if(s>=81) return "#1fbb73";
  if(s>=61) return "#71d55b";
  if(s>=41) return "#e8d34f";
  if(s>=21) return "#ef8a43";
  return "#d64050";
}
function metricColor(s){return s>=75?"#4de47e":s>=60?"#e6d64d":"#ed8a45"}

function renderRankings(filter=""){
  const body=document.getElementById("rankingsBody");
  body.innerHTML="";
  towns.filter(t=>t.name.toLowerCase().includes(filter.toLowerCase())).forEach((t,i)=>{
    const tr=document.createElement("tr"); tr.className="rank-row";
    tr.innerHTML=`<td>${i+1}</td><td><strong>${t.name}</strong></td><td>${t.county}</td>
      <td><div class="score-pill"><span>${t.score}</span><div class="score-track"><div class="score-fill" style="width:${t.score}%;background:${colorForScore(t.score)}"></div></div></div></td>
      <td>${t.strength}</td>`;
    tr.onclick=()=>selectTown(t,tr); body.appendChild(tr);
  });
}

function selectTown(t,row){
  document.querySelectorAll(".rank-row").forEach(r=>r.classList.remove("selected"));
  if(row) row.classList.add("selected");
  document.getElementById("townName").textContent=t.name;
  document.getElementById("townCounty").textContent=t.county+" County";
  document.getElementById("scoreValue").textContent=t.score;
  document.getElementById("scoreBadge").textContent=t.score>=81?"Strong Potential":t.score>=61?"Good Potential":"Moderate Potential";
  document.getElementById("factPopulation").textContent=t.pop;
  document.getElementById("factValue").textContent=t.value;
  document.getElementById("factMill").textContent=t.mill;
  document.getElementById("factOpen").textContent=t.open;
  document.getElementById("summaryText").textContent=`${t.name} scores well as a preliminary screening candidate based on the current criteria. This is a planning signal only; parcel-level zoning, wetlands, utilities, frontage, soils and local regulations still require detailed research.`;
  const list=document.getElementById("metricList"); list.innerHTML="";
  Object.entries(t.metrics).forEach(([k,v])=>{
    const el=document.createElement("div"); el.className="metric";
    el.innerHTML=`<span>${metricNames[k]}</span><div class="metric-track"><div class="metric-bar" style="width:${v}%;background:${metricColor(v)}"></div></div><strong>${v}</strong>`;
    list.appendChild(el);
  });
}

function buildMap(){
  const g=document.getElementById("townCells"); const labels=document.getElementById("cityLabels");
  const cols=10, rows=6, x0=90,y0=92,w=66,h=54;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const base=24 + ((c*9 + r*7 + (c*r)%11) % 72);
      const x=x0+c*w+(r%2?8:0), y=y0+r*h;
      const pts=[[x,y],[x+w-4,y+3],[x+w-8,y+h-6],[x+4,y+h]];
      const p=document.createElementNS("http://www.w3.org/2000/svg","polygon");
      p.setAttribute("points",pts.map(v=>v.join(",")).join(" "));
      p.setAttribute("fill",colorForScore(base)); p.setAttribute("class","town-cell");
      p.addEventListener("click",()=>{const t=towns[(r*cols+c)%towns.length];selectTown(t);});
      g.appendChild(p);
    }
  }
  const labs=[["Salisbury",145,150],["Torrington",255,205],["Hartford",425,218],["Putnam",650,180],["Waterbury",327,292],["Middletown",456,310],["Norwich",610,330],["New Haven",360,390],["New London",612,406],["Danbury",170,348],["Bridgeport",255,420],["Stamford",115,446]];
  labs.forEach(([name,x,y])=>{const t=document.createElementNS("http://www.w3.org/2000/svg","text");t.setAttribute("x",x);t.setAttribute("y",y);t.setAttribute("class","map-label");t.textContent=name;labels.appendChild(t);});
}

document.getElementById("landValue").addEventListener("input",e=>document.getElementById("landValueOut").textContent="$"+Math.round(e.target.value/1000)+"K");
document.getElementById("searchTown").addEventListener("input",e=>renderRankings(e.target.value));
document.getElementById("analyzeBtn").addEventListener("click",()=>{
  const pulse=document.querySelector(".map-card"); pulse.animate([{filter:"brightness(1)"},{filter:"brightness(1.25)"},{filter:"brightness(1)"}],{duration:500});
});
document.getElementById("resetBtn").addEventListener("click",()=>location.reload());

buildMap();renderRankings();selectTown(towns[0]);
