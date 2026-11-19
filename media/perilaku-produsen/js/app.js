const $=id=>document.getElementById(id),rp=n=>'Rp'+Math.round(n).toLocaleString('id-ID');
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const boom=(o={})=>{if(window.confetti&&!calm)confetti({particleCount:90,spread:75,origin:{y:.7},colors:['#f4f4f5','#a1a1aa','#22c55e','#d4d4d8'],...o})};
const P={home:1,materi:2,spinner:3,kesimpulan:4};

/* Navigasi + reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach((e,i)=>{e.style.transitionDelay=(i%4*80)+'ms';io.observe(e)});
function show(id){
 document.querySelectorAll('.page').forEach(p=>p.classList.toggle('on',p.id===id));
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.id==='n-'+id));
 const n=P[id],pc=n*25;$('pl').textContent='Tahap '+n+' dari 4';$('pp').textContent=pc+'%';$('pb').style.width=pc+'%';
 window.scrollTo({top:0,behavior:'smooth'});if(id==='spinner')sim();if(id==='kesimpulan')boom({origin:{y:.4}});
}

/* Efek sorot kursor + tilt kartu */
function fx(e){
 e.addEventListener('pointermove',v=>{const r=e.getBoundingClientRect(),x=v.clientX-r.left,y=v.clientY-r.top;e.style.setProperty('--mx',x+'px');e.style.setProperty('--my',y+'px');
  if(e.classList.contains('card')&&v.pointerType==='mouse'&&!calm)e.style.transform=`perspective(700px) rotateX(${(.5-y/r.height)*8}deg) rotateY(${(x/r.width-.5)*8}deg) translateY(-4px)`});
 e.addEventListener('pointerleave',()=>e.style.transform='');
}


/* Contoh soal bertahap */
const S=[
['Total Biaya Variabel (TVC)','TVC = AVC × Q = 3.000 × 100 = <b>Rp300.000</b>','Seluruh bahan untuk 100 roti membutuhkan Rp300.000. Jika roti yang dibuat bertambah, TVC ikut naik, sedangkan AVC tetap Rp3.000.'],
['Total Biaya (TC)','TC = TFC + TVC = 200.000 + 300.000 = <b>Rp500.000</b>','Untuk membuat 100 roti, pengusaha mengeluarkan Rp500.000 secara keseluruhan. Biaya per roti sekitar Rp5.000 (500.000 ÷ 100).'],
['Total Penerimaan (TR)','TR = P × Q = 10.000 × 100 = <b>Rp1.000.000</b>','Dari penjualan 100 roti, pengusaha menerima uang Rp1.000.000. Ini belum termasuk dikurangi biaya.'],
['Keuntungan','Keuntungan = TR − TC = 1.000.000 − 500.000 = <b>Rp500.000</b>','Hasilnya positif, berarti usaha untung Rp500.000. Cek: untung per roti = 10.000 − 5.000 = Rp5.000, dikali 100 roti = Rp500.000.'],
['Break Even Point (BEP) Unit','BEP unit = TFC ÷ (P − AVC) = 200.000 ÷ (10.000 − 3.000) = 200.000 ÷ 7.000 = 28,57 ≈ <b>29 roti</b>','Usaha mulai untung saat menjual 29 roti. Dibulatkan ke atas karena roti tidak bisa dijual sebagian. Produksi 100 roti sudah jauh di atas BEP.'],
['Membuktikan BEP','Jual 28 roti: TR = 280.000, TC = 200.000 + (3.000 × 28) = 284.000, hasil = <b>rugi Rp4.000</b><br>Jual 29 roti: TR = 290.000, TC = 200.000 + (3.000 × 29) = 287.000, hasil = <b>untung Rp3.000</b>','Pada 28 roti usaha masih rugi, pada 29 roti sudah untung. Titik impas ada di antara keduanya, yaitu 28,57 roti.']];
$('steps').innerHTML=S.map((s,i)=>'<div class="step"><strong>Langkah '+(i+1)+': '+s[0]+'</strong><br>'+s[1]+'<div class="mk">💡 <b>Artinya:</b> '+s[2]+'</div></div>').join('');
let sn=0;
function upd(){const b=$('stepBtn');if(sn>=S.length){b.textContent='Semua langkah sudah ditampilkan ✓';b.disabled=true}else{b.disabled=false;b.textContent='Hitung langkah '+(sn+1)+': '+S[sn][0]+' →'}}
function nextStep(){const s=document.querySelectorAll('.step');if(sn<s.length){s[sn].classList.add('on');s[sn].scrollIntoView({behavior:'smooth',block:'center'});sn++;if(sn===s.length)boom()}upd()}
function resetSteps(){document.querySelectorAll('.step').forEach(s=>s.classList.remove('on'));sn=0;upd()}

/* Spinner (logika asli dipertahankan) */
const SP={},PAL=[];
function draw(k){
 const c=SP[k],R=c.rem,n=R.length,s=360/n,r=148,f=x=>x.toFixed(2),fs=n>12?16:n>6?22:30,ty=n>12?38:n>6?44:50;let h='';
 const tx=(v,rot)=>'<text x="150" y="'+ty+'" transform="rotate('+rot+' 150 150)" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="'+fs+'" font-weight="700">'+v+'</text>';
 if(n===1)h+='<circle cx="150" cy="150" r="'+r+'" fill="#3f3f46" stroke="#fff" stroke-width="2"/>'+tx(R[0],0);
 else for(let i=0;i<n;i++){const a=i*s*Math.PI/180,b=(i+1)*s*Math.PI/180,col=(n%2&&i===n-1)?'#52525b':(i%2?'#27272a':'#3f3f46');
  h+='<path d="M150 150L'+f(150+r*Math.sin(a))+' '+f(150-r*Math.cos(a))+'A'+r+' '+r+' 0 0 1 '+f(150+r*Math.sin(b))+' '+f(150-r*Math.cos(b))+'Z" fill="'+col+'" stroke="#fff" stroke-width="1.5"/>'+tx(R[i],i*s+s/2)}
 if(n===0)h+='<circle cx="150" cy="150" r="'+r+'" fill="#27272a"/>';
 h+='<circle cx="150" cy="150" r="148" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="4"/><circle cx="150" cy="150" r="22" fill="#161618" stroke="#fff" stroke-width="3"/>';$('ws'+k).innerHTML=h;
 c.rot=0;const w=$('wh'+k);w.style.transition='none';w.style.transform='rotate(0deg)';void w.offsetWidth;w.style.transition='';
}
function build(k,n,cnt,title,desc,keep=0,skip=[]){
 SP[k]={n:n,cnt:cnt,keep:keep,skip:skip,rot:0,busy:false,log:[],rem:Array.from({length:n},(_,i)=>i+1).filter(x=>!skip.includes(x))};
 const d=document.createElement('div');d.className='box';d.style.textAlign='center';
 d.innerHTML='<h3>'+title+'</h3><p style="color:var(--mu);margin:0">'+desc+'</p><div class="wheel"><div class="wh" id="wh'+k+'"><svg id="ws'+k+'" viewBox="0 0 300 300" aria-label="Roda nomor"></svg></div><div class="ptr"></div></div>'+
 '<div class="rg" style="max-width:480px;margin:12px auto"><div><small>'+(cnt>1?'Nomor terpilih ('+cnt+' angka)':'Nomor terpilih')+'</small><strong id="res'+k+'" style="font-size:'+(cnt>1?'1.5rem':'2.2rem')+'">–</strong></div><div><small>Sudah keluar</small><strong id="hist'+k+'" style="font-size:.95rem;display:block;max-height:220px;overflow-y:auto;line-height:1.7">–</strong></div></div>'+
 '<div id="msg'+k+'" style="color:var(--no);min-height:1.4em"></div>'+
 '<button class="btn" id="btn'+k+'" onclick="spin('+k+')" style="margin-top:4px">🎡 Putar Spinner</button><button class="btn sec" onclick="spReset('+k+')">Reset</button>';
 $('spBox').appendChild(d);fx(d);draw(k);
}
function spin(k){
 const c=SP[k];if(c.busy)return;
 const m=$('msg'+k);
 if(c.keep&&c.rem.length<=c.keep){m.style.color='var(--tx)';m.textContent='Sisa akhir ('+c.rem.length+' nomor): '+c.rem.join(', ')+'. Tekan Reset untuk mengulang.';return}
 m.style.color='var(--no)';
 if(c.rem.length<c.cnt){$('msg'+k).textContent=c.rem.length?'Nomor yang tersisa kurang dari '+c.cnt+'. Tekan Reset untuk mengulang.':'Semua nomor sudah keluar. Tekan Reset untuk mengulang.';return}
 $('msg'+k).textContent='';
 const ix=c.rem.map((_,i)=>i);for(let i=ix.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ix[i],ix[j]]=[ix[j],ix[i]]}
 const take=c.keep?Math.min(c.cnt,c.rem.length-c.keep):c.cnt,pi=ix.slice(0,take),pick=pi.map(i=>c.rem[i]),s=360/c.rem.length,ctr=pi[0]*s+s/2+(Math.random()-.5)*s*.5,target=(360-ctr%360+360)%360;
 c.rot+=1800+(((target-c.rot%360)+360)%360);
 c.busy=true;$('btn'+k).disabled=true;$('res'+k).textContent='…';$('wh'+k).style.transform='rotate('+c.rot+'deg)';
 setTimeout(()=>{
  const rs=$('res'+k);rs.textContent=pick.join(', ');c.log.push(pick);boom({origin:{y:.55}});
  if(window.gsap&&!calm)gsap.fromTo(rs,{scale:.4},{scale:1,duration:.8,ease:'elastic.out(1,.4)'});
  $('hist'+k).innerHTML=c.log.map((x,i)=>'<span style="display:block;'+(i?'margin-top:8px;padding-top:8px;border-top:1px dashed var(--bd)':'')+'">'+x.join(', ')+'</span>').join('');
  setTimeout(()=>{c.rem=c.rem.filter(x=>!pick.includes(x));draw(k);c.busy=false;$('btn'+k).disabled=false},1000);
 },4200);
}
function spReset(k){const c=SP[k];if(c.busy)return;c.log=[];c.rem=Array.from({length:c.n},(_,i)=>i+1).filter(x=>!c.skip.includes(x));draw(k);$('res'+k).textContent='–';$('hist'+k).textContent='–';$('msg'+k).textContent=''}
build(1,19,6,'🎡 Spinner 1: Nomor 1–19 (tanpa 9)','Satu kali putar menghasilkan 6 nomor berbeda. Nomor yang sudah keluar dihapus dari roda.',0,[9]);
build(2,3,1,'🎡 Spinner 2: Nomor 1–3',' Spin Kelompok');
document.querySelectorAll('.card,.box').forEach(fx);
upd();

/* Cek Tugas */
const num=s=>{s=String(s).replace(/rp|\s/gi,'').replace(/−/g,'-');return /^-?[\d.,]+$/.test(s)?parseFloat(s.replace(/\./g,'').replace(',','.')):NaN};
const fmt=n=>n.toLocaleString('id-ID',{maximumFractionDigits:2}),money=n=>(n<0?'−':'')+rp(Math.abs(n));
document.querySelectorAll('.ci').forEach(i=>{
 i.addEventListener('blur',()=>{const n=num(i.value);if(i.value.trim()&&!isNaN(n))i.value=fmt(n)});
 i.addEventListener('keydown',e=>{if(e.key==='Enter')cekTugas()})});
/* Grafik BEP untuk data usaha di menu 03 */
let ch;
function sim(){
 if(!window.Chart||!$('spinner').classList.contains('on'))return;
 const g=k=>{const n=num($('c'+k).value);return isNaN(n)||n<0?0:n},F=g('F'),A=g('A'),P_=g('P'),Q=g('Q');
 const TR=P_*Q,d=P_-A,bx=d>0?F/d:null,mx=Math.max(Q,bx||0,10)*1.6;
 const D=[[{x:0,y:0},{x:mx,y:P_*mx}],[{x:0,y:F},{x:mx,y:F+A*mx}],bx!=null?[{x:bx,y:P_*bx}]:[],[{x:Q,y:TR}]];
 if(!ch){const t='#9a9aae',gr='rgba(255,255,255,.06)',ds=(label,color,extra)=>({label,borderColor:color,backgroundColor:color,borderWidth:3,pointRadius:0,tension:0,...extra});
  ch=new Chart($('ch'),{type:'line',data:{datasets:[ds('TR (Penerimaan)','#22c55e',{data:D[0]}),ds('TC (Total Biaya)','#ef4444',{data:D[1]}),ds('BEP','#f4f4f5',{type:'scatter',data:D[2],pointRadius:9,pointStyle:'rectRot'}),ds('Q sekarang','#a1a1aa',{type:'scatter',data:D[3],pointRadius:6})]},
  options:{maintainAspectRatio:false,animation:{duration:300},interaction:{mode:'nearest'},plugins:{legend:{labels:{color:t,boxWidth:12}}},scales:{x:{type:'linear',min:0,title:{display:true,text:'Jumlah (Q)',color:t},ticks:{color:t},grid:{color:gr}},y:{min:0,ticks:{color:t,callback:n=>n>=1e6?n/1e6+' jt':n>=1e3?n/1e3+' rb':n},grid:{color:gr}}}}})}
 else D.forEach((d,i)=>ch.data.datasets[i].data=d);
 ch.options.scales.x.max=mx;ch.update();
}
['F','A','P','Q'].forEach(k=>{const t=$('c'+k),r=$('r'+k);
 t.addEventListener('input',()=>{const n=num(t.value);if(!isNaN(n)&&n>=0){if(n>+r.max)r.max=Math.ceil(n*1.2/+r.step)*+r.step;r.value=n}sim()});
 r.addEventListener('input',()=>{t.value=fmt(+r.value);sim()})});
function cekTugas(){
 const g=id=>num($(id).value),F=g('cF'),A=g('cA'),P_=g('cP'),Q=g('cQ'),sm=$('cSum');
 if([F,A,P_,Q].some(x=>isNaN(x)||x<0)){$('cRes').innerHTML='';sm.style.color='var(--no)';sm.textContent='Isi dulu data usahamu (TFC, AVC, harga jual, dan jumlah terjual) dengan angka.';return}
 const TVC=A*Q,TC=F+TVC,TR=P_*Q,L=TR-TC,d=P_-A,bx=d>0?F/d:null;
 const st=L>0?'untung':L<0?'rugi':'impas',cl=L>0?'var(--ok)':L<0?'var(--no)':'var(--tx)';
 $('cRes').innerHTML='<h4 class="ct">2. Hasil perhitungan</h4><div class="rg" style="animation:f .5s">'+[['TVC',money(TVC)],['TC',money(TC)],['TR',money(TR)],['Keuntungan ('+st+')','<span style="color:'+cl+'">'+money(L)+'</span>'],['BEP unit',bx!==null?Math.ceil(bx-1e-9)+' unit'+(bx%1?'<small>('+fmt(bx)+')</small>':''):'–']].map(r=>'<div><small>'+r[0]+'</small><strong style="font-size:1.05rem">'+r[1]+'</strong></div>').join('')+'</div>';
 sm.style.color='var(--tx)';
 sm.innerHTML=bx!==null?'Dengan data kelompokmu, usaha '+st+': terjual '+fmt(Q)+' unit, BEP '+Math.ceil(bx-1e-9)+' unit.':'BEP tidak ada karena harga jual harus lebih besar dari AVC.';
 if(L>0)boom({particleCount:120,spread:90});
}
function resetCek(){document.querySelectorAll('.ci').forEach(i=>i.value='');['F','A','P','Q'].forEach(k=>$('r'+k).value=0);sim();$('cSum').textContent='';$('cRes').innerHTML=''}

/* Pintu masuk */
document.body.classList.add('lock');
function masuk(){
 $('gate').classList.add('out');
 document.body.classList.remove('lock');
 window.scrollTo(0,0);
 boom({origin:{y:.5}});
}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&!$('gate').classList.contains('out'))masuk()});