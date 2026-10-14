(function(root){'use strict';
const t=(key,vars={})=>root.GameI18n?root.GameI18n.t(key,vars):key;
const BIOMES=[
{id:'meadow',nameKey:'biome0',bossType:'boss',bossKey:'boss1',enemies:['sproutling','briarwolf'],skill:'dash',colors:['#466b3b','#527b43','#3e6235','#65864a']},
{id:'crystal',nameKey:'biome1',bossType:'boss2',bossKey:'boss2',enemies:['crystalbat','geodegolem'],skill:'shield',colors:['#354a56','#496573','#405c69','#607e85']},
{id:'volcano',nameKey:'biome2',bossType:'boss3',bossKey:'boss3',enemies:['cinderimp','magmawyrm'],skill:'spin',colors:['#593c32','#784334','#914934','#b66a42']},
{id:'frost',nameKey:'biome3',bossType:'boss4',bossKey:'boss4',enemies:['icesprite','frosttroll'],skill:'fire',colors:['#59747b','#6a8990','#83a6aa','#a2bec0']},
{id:'marsh',nameKey:'biome4',bossType:'boss5',bossKey:'boss5',enemies:['bogtoad','willowwraith'],skill:'frost',colors:['#405948','#506c4e','#647c51','#89915c']},
{id:'sky',nameKey:'biome5',bossType:'boss6',bossKey:'boss6',enemies:['harpy','stormgolem'],skill:'lightning',colors:['#62778a','#71899e','#89a2b0','#a1afae']},
{id:'shadow',nameKey:'biome6',bossType:'boss7',bossKey:'boss7',enemies:['shadefox','thornwitch'],skill:'heal',colors:['#343b3b','#41483e','#4d563f','#63684a']},
{id:'desert',nameKey:'biome7',bossType:'boss8',bossKey:'boss8',enemies:['sandscarab','dunestalker'],skill:'blink',colors:['#917344','#a8844d','#bf9957','#d5b46e']},
{id:'garden',nameKey:'biome8',bossType:'boss9',bossKey:'boss9',enemies:['moonmoth','lunadeer'],skill:'storm',colors:['#544c72','#65577d','#817098','#a18bab']},
{id:'rift',nameKey:'biome9',bossType:'boss10',bossKey:'boss10',enemies:['riftling','voiddrake'],skill:'cataclysm',colors:['#332b50','#47335d','#633c69','#894867']}
];
const TYPES={goblin:{hp:24,speed:62,r:19,xp:2},slime:{hp:46,speed:37,r:22,xp:3},skeleton:{hp:38,speed:48,r:20,xp:4},boar:{hp:78,speed:68,r:26,xp:6},dragon:{hp:66,speed:62,r:24,xp:7},wisp:{hp:32,speed:102,r:16,xp:5},shroom:{hp:62,speed:31,r:24,xp:6},beetle:{hp:118,speed:44,r:27,xp:8},
sproutling:{hp:30,speed:57,r:17,xp:3},briarwolf:{hp:62,speed:84,r:23,xp:6},crystalbat:{hp:38,speed:93,r:17,xp:5},geodegolem:{hp:126,speed:33,r:30,xp:9},cinderimp:{hp:44,speed:78,r:19,xp:5},magmawyrm:{hp:92,speed:45,r:27,xp:8},icesprite:{hp:40,speed:68,r:18,xp:5},frosttroll:{hp:112,speed:36,r:29,xp:9},bogtoad:{hp:67,speed:48,r:25,xp:7},willowwraith:{hp:53,speed:71,r:21,xp:7},harpy:{hp:51,speed:89,r:21,xp:7},stormgolem:{hp:138,speed:35,r:31,xp:10},shadefox:{hp:56,speed:96,r:20,xp:8},thornwitch:{hp:76,speed:42,r:23,xp:9},sandscarab:{hp:74,speed:55,r:24,xp:8},dunestalker:{hp:62,speed:77,r:22,xp:9},moonmoth:{hp:47,speed:81,r:20,xp:8},lunadeer:{hp:98,speed:59,r:25,xp:10},riftling:{hp:71,speed:73,r:23,xp:10},voiddrake:{hp:105,speed:65,r:28,xp:12},
boss:{hp:1800,speed:56,r:57,xp:100},boss2:{hp:2400,speed:50,r:60,xp:120},boss3:{hp:3000,speed:52,r:62,xp:140},boss4:{hp:3600,speed:44,r:64,xp:160},boss5:{hp:4300,speed:51,r:66,xp:180},boss6:{hp:5100,speed:55,r:68,xp:200},boss7:{hp:6000,speed:49,r:70,xp:220},boss8:{hp:7000,speed:57,r:72,xp:250},boss9:{hp:8200,speed:53,r:74,xp:280},boss10:{hp:10000,speed:59,r:78,xp:320}};
const SKILLS={dash:{cooldown:12},shield:{cooldown:20},spin:{cooldown:18},fire:{cooldown:24},frost:{cooldown:22},lightning:{cooldown:20},heal:{cooldown:35},blink:{cooldown:16},storm:{cooldown:28},cataclysm:{cooldown:40}};
const isBoss=type=>type.startsWith('boss');
function loadSkills(){try{return JSON.parse(localStorage.getItem('kitten-survivor-skills')||'[]')}catch{return []}}
function saveSkills(skills){try{localStorage.setItem('kitten-survivor-skills',JSON.stringify(skills))}catch{}}
const UPGRADES=[
{id:'sword',icon:'⚔',nameKey:'upSword',descKey:'upSwordDesc',max:6},
{id:'haste',icon:'↯',nameKey:'upHaste',descKey:'upHasteDesc',max:5},
{id:'orb',icon:'✧',nameKey:'upOrb',descKey:'upOrbDesc',max:4},
{id:'blades',icon:'◈',nameKey:'upBlades',descKey:'upBladesDesc',max:4},
{id:'frost',icon:'❄',nameKey:'upFrost',descKey:'upFrostDesc',max:4},
{id:'lightning',icon:'ϟ',nameKey:'upLightning',descKey:'upLightningDesc',max:4},
{id:'speed',icon:'➶',nameKey:'upSpeed',descKey:'upSpeedDesc',max:4},
{id:'magnet',icon:'✦',nameKey:'upMagnet',descKey:'upMagnetDesc',max:4},
{id:'armor',icon:'♜',nameKey:'upArmor',descKey:'upArmorDesc',max:4},
{id:'heart',icon:'♥',nameKey:'upHeart',descKey:'upHeartDesc',max:6}
];
class SurvivorGame{
constructor(random=Math.random){this.random=random;this.view={w:1100,h:620};this.reset()}
reset(){this.mode='ready';this.time=0;this.kills=0;this.level=1;this.xp=0;this.need=8;this.spawnClock=.15;this.enemies=[];this.gems=[];this.hearts=[];this.shots=[];this.effects=[];this.events=[];this.choices=[];this.bossSpawned=false;this.nextBossAt=300;this.biome=0;this.unlockedSkills=loadSkills().filter(id=>SKILLS[id]);this.activeSkill=this.unlockedSkills.at(-1)||null;this.skillCooldown=0;this.shieldTimer=0;this.orbClock=0;this.bladeClock=0;this.frostClock=0;this.lightningClock=0;this.up={};this.player={x:0,y:0,r:17,hp:100,maxHp:100,speed:180,damage:26,range:106,cooldown:.76,attackClock:.1,attack:0,face:1,inv:0,moving:false};this.nextId=1}
start(){this.reset();this.mode='playing'}
pause(){if(this.mode==='playing')this.mode='paused'} resume(){if(this.mode==='paused')this.mode='playing'}
emit(type,data={}){this.events.push({type,...data})} drainEvents(){return this.events.splice(0)}
spawn(type='goblin',position){const def=TYPES[type]||TYPES.goblin,p=this.player;let x,y;if(position){x=position.x;y=position.y}else{const a=this.random()*Math.PI*2,dx=Math.cos(a),dy=Math.sin(a),radius=Math.min((this.view.w/2+80)/Math.max(.001,Math.abs(dx)),(this.view.h/2+80)/Math.max(.001,Math.abs(dy)));x=p.x+dx*radius;y=p.y+dy*radius}const boss=isBoss(type),scaling=boss?1:1+this.time/750,bossIndex=boss?(type==='boss'?0:Number(type.slice(4))-1):-1;const e={id:this.nextId++,type,bossIndex,x,y,r:def.r,hp:def.hp*scaling,maxHp:def.hp*scaling,speed:def.speed*(1+Math.min(.5,this.time/1200)),xp:def.xp,t:0,fire:1.4+this.random()*1.8,charge:'idle',chargeTimer:2+this.random()*2,dx:0,dy:0,hit:0,face:-1};this.enemies.push(e);return e}
hurtEnemy(e,damage){if(e.hp<=0)return;e.hp-=damage;e.hit=.15;this.effects.push({kind:'number',x:e.x,y:e.y-45,t:.6,max:.6,text:String(Math.round(damage)),color:'#fff1ad'});if(e.hp<=0){this.kills++;this.gems.push({x:e.x,y:e.y,value:e.xp});if(!isBoss(e.type)&&this.random()<.05)this.hearts.push({x:e.x,y:e.y,dead:false});this.effects.push({kind:'burst',x:e.x,y:e.y,t:.35,max:.35,color:e.type==='boss2'?'#9de8f4':'#e9d99a'});if(isBoss(e.type)){const defeated=this.biome,skill=BIOMES[defeated].skill;if(!this.unlockedSkills.includes(skill)){this.unlockedSkills.push(skill);saveSkills(this.unlockedSkills)}this.activeSkill=skill;this.skillCooldown=0;this.enemies=this.enemies.filter(other=>other!==e);this.shots=this.shots.filter(s=>s.friendly);if(defeated<BIOMES.length-1){this.biome=defeated+1;this.bossSpawned=false;this.nextBossAt=(defeated+2)*300;this.emit('biome',{biome:this.biome,text:t('biomeUnlock',{name:t(BIOMES[this.biome].nameKey)})});this.emit('skill',{skill,biome:defeated})}else{this.emit('skill',{skill,biome:defeated});this.mode='won';this.emit('end',{win:true,skill})}}}}
hurtPlayer(damage){const p=this.player;if(p.inv>0||this.mode!=='playing'||this.shieldTimer>0)return;p.hp=Math.max(0,p.hp-Math.max(1,Math.round(damage*Math.pow(.85,this.up.armor||0))));p.inv=.75;this.effects.push({kind:'hit',x:p.x,y:p.y,t:.25,max:.25});if(p.hp<=0){this.mode='over';this.emit('end',{win:false})}}
addXP(n){this.xp+=n;if(this.mode==='playing'&&this.xp>=this.need)this.levelUp()}
levelUp(){this.xp-=this.need;this.level++;this.need=Math.round(8+Math.pow(this.level,1.3)*4);this.mode='upgrade';const pool=UPGRADES.filter(u=>(this.up[u.id]||0)<u.max);this.choices=[];while(pool.length&&this.choices.length<3){const up=pool.splice(Math.floor(this.random()*pool.length),1)[0];this.choices.push({...up,name:t(up.nameKey),desc:t(up.descKey)})}if(!this.choices.length)this.choices=[{id:'heal',icon:'♥',name:t('upRest'),desc:t('upRestDesc')}];this.emit('level',{level:this.level,choices:this.choices})}
choose(id){if(this.mode!=='upgrade'||!this.choices.some(c=>c.id===id))return false;this.up[id]=(this.up[id]||0)+1;const p=this.player;if(id==='sword'){p.damage*=1.35;p.range+=12}if(id==='haste')p.cooldown*=.85;if(id==='speed')p.speed*=1.12;if(id==='heart'){p.maxHp+=20;p.hp=Math.min(p.maxHp,p.hp+35)}if(id==='heal')p.hp=Math.min(p.maxHp,p.hp+35);this.mode='playing';this.choices=[];if(this.xp>=this.need)this.levelUp();return true}
nearest(range=Infinity,from=this.player,excluded=new Set()){let chosen=null,distance=range;for(const e of this.enemies){if(e.hp<=0||excluded.has(e))continue;const d=Math.hypot(e.x-from.x,e.y-from.y);if(d<distance){chosen=e;distance=d}}return chosen}
wave(){if(this.time>=this.nextBossAt-25&&!this.bossSpawned)return t('waveBossApproach',{biome:t(BIOMES[this.biome].nameKey)});if(this.biome===0){if(this.time<15)return t('waveGoblins');if(this.time<40)return t('waveSlimes');if(this.time<65)return t('waveBoars');if(this.time<95)return t('waveArchers')}return t(BIOMES[this.biome].waveKey||'waveBiome',{biome:t(BIOMES[this.biome].nameKey)})}
activateSkill(direction={x:0,y:0}){
if(this.mode!=='playing'||!this.activeSkill||this.skillCooldown>0)return false;
const p=this.player,id=this.activeSkill,enemies=this.enemies.filter(e=>e.hp>0),near=enemies.filter(e=>Math.hypot(e.x-p.x,e.y-p.y)<330),damage=(e,n)=>this.hurtEnemy(e,n),angle=Math.atan2(direction.y||0,direction.x||p.face);
const visual=(x=p.x,y=p.y,extra={})=>this.effects.push({kind:'skill',skill:id,x,y,angle,t:1.15,max:1.15,...extra});
this.skillCooldown=SKILLS[id].cooldown;
if(id==='dash'||id==='blink'){
const ox=p.x,oy=p.y,dx=direction.x||p.face,dy=direction.y,mag=Math.hypot(dx,dy)||1;
visual(ox,oy,{angle:Math.atan2(dy,dx)});
const distance=id==='dash'?205:310;p.x+=dx/mag*distance;p.y+=dy/mag*distance;
if(id==='blink')visual(p.x,p.y,{angle:Math.atan2(dy,dx)});
p.inv=Math.max(p.inv,id==='dash'?.9:.6);for(const e of enemies)if(Math.hypot(e.x-p.x,e.y-p.y)<100)damage(e,65)
}else{
visual();
if(id==='shield'){this.shieldTimer=5;p.inv=Math.max(p.inv,5)}
else if(id==='spin'){for(const e of near)damage(e,100)}
else if(id==='fire'){for(const e of enemies)if(Math.hypot(e.x-p.x,e.y-p.y)<390){damage(e,125);e.burn=Math.max(e.burn||0,3)}}
else if(id==='frost'){for(const e of enemies)if(Math.hypot(e.x-p.x,e.y-p.y)<430){damage(e,70);e.freeze=Math.max(e.freeze||0,4)}}
else if(id==='lightning'){const targets=near.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y)).slice(0,8);for(const e of targets){this.effects.push({kind:'bolt',x1:p.x,y1:p.y,x2:e.x,y2:e.y,t:.38,max:.38});damage(e,110)}}
else if(id==='heal'){const restored=Math.min(50,p.maxHp-p.hp);p.hp+=restored;this.emit('notice',{text:t('skillHeal',{hp:restored})})}
else if(id==='storm'){for(const e of enemies)if(Math.hypot(e.x-p.x,e.y-p.y)<560){damage(e,160);e.freeze=Math.max(e.freeze||0,1.5)}}
else if(id==='cataclysm'){for(const e of enemies)damage(e,280)}
}
this.emit('skillUsed',{skill:id});return true
}
tick(dt,input={x:0,y:0}){if(this.mode!=='playing')return;dt=Math.min(.05,Math.max(0,dt));this.time+=dt;const p=this.player,mag=Math.hypot(input.x,input.y),div=Math.max(1,mag);p.moving=mag>.05;p.x+=input.x/div*p.speed*dt;p.y+=input.y/div*p.speed*dt;if(Math.abs(input.x)>.05)p.face=input.x>0?1:-1;p.inv=Math.max(0,p.inv-dt);this.skillCooldown=Math.max(0,this.skillCooldown-dt);this.shieldTimer=Math.max(0,this.shieldTimer-dt);p.attack=Math.max(0,p.attack-dt);p.attackClock-=dt;
if(this.time>=this.nextBossAt&&!this.bossSpawned){this.bossSpawned=true;const biome=BIOMES[this.biome];this.spawn(biome.bossType);this.emit('notice',{text:t('bossArrives',{name:t(biome.bossKey)})})}
this.spawnClock-=dt;if(this.spawnClock<=0&&this.enemies.length<180){const available=['goblin'];if(this.time>15)available.push('slime');if(this.time>40)available.push('boar');if(this.time>65)available.push('skeleton');if(this.time>95)available.push('dragon');available.push(...BIOMES[this.biome].enemies);if(this.biome===1)available.push('wisp','shroom','beetle');for(let i=0;i<1+Math.floor(this.time/100);i++){if(this.enemies.length>=180)break;this.spawn(available[Math.floor(this.random()*available.length)])}this.spawnClock=Math.max(.22,1.25-this.time/550)}
if(p.attackClock<=0){const near=this.nearest(p.range);if(near){const a=Math.atan2(near.y-p.y,near.x-p.x);p.attack=.28;p.attackAngle=a;p.face=Math.cos(a)>=0?1:-1;p.attackClock=p.cooldown;this.effects.push({kind:'slash',x:p.x,y:p.y,angle:a,t:.24,max:.24,range:p.range});for(const e of this.enemies){const d=Math.hypot(e.x-p.x,e.y-p.y),angle=Math.atan2(e.y-p.y,e.x-p.x),diff=Math.abs(Math.atan2(Math.sin(angle-a),Math.cos(angle-a)));if(d<p.range+e.r&&diff<1.1){this.hurtEnemy(e,p.damage);const push=20;if(d>0){e.x+=(e.x-p.x)/d*push;e.y+=(e.y-p.y)/d*push}}}}}
this.orbClock-=dt;if(this.up.orb&&this.orbClock<=0){const near=this.nearest(600);if(near){const a=Math.atan2(near.y-p.y,near.x-p.x),n=this.up.orb;for(let i=0;i<n;i++){const angle=a+(i-(n-1)/2)*.12;this.shots.push({friendly:true,kind:'orb',x:p.x,y:p.y,vx:Math.cos(angle)*370,vy:Math.sin(angle)*370,r:8,damage:26+this.level*2,t:2})}this.orbClock=1.3}}
this.bladeClock-=dt;if(this.up.blades&&this.bladeClock<=0){const n=this.up.blades+1;for(let i=0;i<n;i++){const a=this.time*2.5+i*Math.PI*2/n,x=p.x+Math.cos(a)*75,y=p.y+Math.sin(a)*75;for(const e of this.enemies)if(Math.hypot(e.x-x,e.y-y)<e.r+18)this.hurtEnemy(e,14+this.level)}this.bladeClock=.26}
this.frostClock-=dt;if(this.up.frost&&this.frostClock<=0){const radius=155+this.up.frost*24;this.effects.push({kind:'frost',x:p.x,y:p.y,t:.45,max:.45,radius});for(const e of this.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<radius+e.r){this.hurtEnemy(e,20+this.up.frost*10);e.freeze=Math.max(e.freeze||0,1+this.up.frost*.35)}this.frostClock=Math.max(1.8,4.8-this.up.frost*.45)}
this.lightningClock-=dt;if(this.up.lightning&&this.lightningClock<=0){let from=p,hit=new Set(),count=1+this.up.lightning;for(let i=0;i<count;i++){const e=this.nearest(285,from,hit);if(!e)break;hit.add(e);this.effects.push({kind:'bolt',x1:from.x,y1:from.y,x2:e.x,y2:e.y,t:.18,max:.18});this.hurtEnemy(e,24+this.up.lightning*8);from=e}this.lightningClock=Math.max(1.05,3.2-this.up.lightning*.35)}
for(const e of this.enemies){if(e.hp<=0)continue;e.t+=dt;e.hit=Math.max(0,e.hit-dt);e.freeze=Math.max(0,(e.freeze||0)-dt);const dx=p.x-e.x,dy=p.y-e.y,d=Math.max(1,Math.hypot(dx,dy));e.face=dx>=0?1:-1;let vx=dx/d*e.speed,vy=dy/d*e.speed;if(e.freeze>0)vx=vy=0;
if(e.type==='boar'&&e.freeze<=0){e.chargeTimer-=dt;if(e.charge==='idle'&&e.chargeTimer<=0){e.charge='warn';e.chargeTimer=.75;e.dx=dx/d;e.dy=dy/d}if(e.charge==='warn'){vx=vy=0;if(e.chargeTimer<=0){e.charge='rush';e.chargeTimer=.65}}else if(e.charge==='rush'){vx=e.dx*390;vy=e.dy*390;if(e.chargeTimer<=0){e.charge='idle';e.chargeTimer=3}}}
if(['skeleton','dragon','boss','boss2','boss3','boss4','boss5','boss6','boss7','boss8','boss9','boss10','shroom','thornwitch','voiddrake'].includes(e.type)){if(e.type==='skeleton'&&d<260)vx=vy=0;if(e.type==='shroom'&&d<210)vx=vy=0;e.fire-=dt;if(e.fire<=0&&d<800){const boss=isBoss(e.type),n=boss?7+Math.min(5,e.bossIndex):e.type==='shroom'?5:1,base=Math.atan2(dy,dx),speed=boss?200+e.bossIndex*4:210;for(let i=0;i<n;i++){const a=base+(i-(n-1)/2)*(e.type==='shroom'?.23:.16);this.shots.push({friendly:false,kind:e.type==='skeleton'?'arrow':e.type==='boss2'||e.type==='boss4'?'ice':'fire',x:e.x,y:e.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:e.type==='skeleton'?7:boss?11:10,damage:boss?18+e.bossIndex*2:12,t:4})}e.fire=boss?Math.max(1.1,2.2-e.bossIndex*.08):e.type==='dragon'?2.7:e.type==='shroom'?3.5:3.2}}
if(e.type==='wisp'&&Math.floor(e.t*2)%4===0){vx*=.18;vy*=.18}e.x+=vx*dt;e.y+=vy*dt;if(Math.hypot(e.x-p.x,e.y-p.y)<e.r+p.r)this.hurtPlayer(isBoss(e.type)?25+e.bossIndex*2:e.type==='boar'?20:10)}
const grid=new Map();for(const e of this.enemies){if(e.hp<=0)continue;const key=Math.floor(e.x/55)+','+Math.floor(e.y/55),peers=grid.get(key)||[];for(const b of peers){let dx=e.x-b.x,dy=e.y-b.y,d=Math.hypot(dx,dy),gap=(e.r+b.r)*.8;if(d>0&&d<gap){const push=(gap-d)*.16;e.x+=dx/d*push;e.y+=dy/d*push;b.x-=dx/d*push;b.y-=dy/d*push}}peers.push(e);grid.set(key,peers)}
for(const s of this.shots){s.t-=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.friendly){for(const e of this.enemies)if(e.hp>0&&Math.hypot(e.x-s.x,e.y-s.y)<e.r+s.r){this.hurtEnemy(e,s.damage);s.t=0;break}}else if(Math.hypot(p.x-s.x,p.y-s.y)<p.r+s.r){this.hurtPlayer(s.damage);s.t=0}}
const radius=92*Math.pow(1.4,this.up.magnet||0);let collected=0;for(const gem of this.gems){const dx=p.x-gem.x,dy=p.y-gem.y,d=Math.hypot(dx,dy);if(d<radius&&d>12){gem.x+=dx/d*Math.min(d,400*dt);gem.y+=dy/d*Math.min(d,400*dt)}if(d<20){collected+=gem.value;gem.dead=true}}this.gems=this.gems.filter(g=>!g.dead);if(this.gems.length>700){const oldest=this.gems.splice(0,100),value=oldest.reduce((sum,g)=>sum+g.value,0);this.gems.unshift({x:oldest[0].x,y:oldest[0].y,value})}if(collected)this.addXP(collected);for(const heart of this.hearts){const dx=p.x-heart.x,dy=p.y-heart.y,d=Math.hypot(dx,dy);if(d<radius&&d>12){heart.x+=dx/d*Math.min(d,400*dt);heart.y+=dy/d*Math.min(d,400*dt)}if(d<24&&p.hp<p.maxHp){const restored=Math.min(25,p.maxHp-p.hp);p.hp+=restored;heart.dead=true;this.effects.push({kind:'number',x:p.x,y:p.y-40,t:.8,max:.8,text:`+${restored}`,color:'#ff9cae'});this.emit('notice',{text:t('heartNotice',{hp:restored})})}}this.hearts=this.hearts.filter(h=>!h.dead);if(this.hearts.length>100)this.hearts.splice(0,this.hearts.length-100);
this.enemies=this.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<2200);this.shots=this.shots.filter(s=>s.t>0);for(const f of this.effects)f.t-=dt;this.effects=this.effects.filter(f=>f.t>0)}
}
root.SurvivorGame=SurvivorGame;root.SURVIVOR_UPGRADES=UPGRADES;root.SURVIVOR_BIOMES=BIOMES;root.SURVIVOR_SKILLS=SKILLS;
})(typeof window!=='undefined'?window:globalThis);
