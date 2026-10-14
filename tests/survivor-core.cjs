const assert=require('assert');require('../web/core.js');
const fresh=()=>{let g=new SurvivorGame(()=>.1);g.start();g.spawnClock=999;return g};
let g=fresh();g.tick(.05,{x:1,y:1});assert(Math.abs(Math.hypot(g.player.x,g.player.y)-9)<.001,'diagonal movement normalized');g.pause();const x=g.player.x;g.tick(.05,{x:1,y:0});assert.equal(g.player.x,x);g.resume();assert.equal(g.mode,'playing');
g=fresh();g.spawn('goblin',{x:70,y:0});g.player.attackClock=0;g.tick(.05);assert.equal(g.kills,1);assert.equal(g.gems.length,1,'auto attack drops XP');
g=new SurvivorGame(()=>.049);g.start();g.spawnClock=999;g.spawn('goblin',{x:70,y:0});g.player.attackClock=0;g.tick(.05);assert.equal(g.hearts.length,1,'rare heart drops from a defeated enemy');g.player.hp=60;g.hearts[0].x=g.player.x;g.hearts[0].y=g.player.y;g.tick(.01);assert.equal(g.player.hp,85,'heart restores 25 HP');assert.equal(g.hearts.length,0,'picked up heart is removed');
g=new SurvivorGame(()=>.051);g.start();g.spawnClock=999;g.spawn('goblin',{x:70,y:0});g.player.attackClock=0;g.tick(.05);assert.equal(g.hearts.length,0,'drop probability is capped at five percent');
g=fresh();g.spawn('slime',{x:80,y:0});g.player.attackClock=0;g.tick(.05);assert.equal(g.kills,0);assert(g.enemies[0].hp<g.enemies[0].maxHp,'armored slime survives one strike');
g=fresh();g.gems.push({x:0,y:0,value:8});g.tick(.01);assert.equal(g.mode,'upgrade');assert.equal(g.level,2);assert.equal(g.choices.length,3);assert.equal(g.choose('not-offered'),false);assert(g.choose(g.choices[0].id));assert.equal(g.mode,'playing');
g=fresh();g.addXP(100);let levels=0;while(g.mode==='upgrade'){g.choose(g.choices[0].id);levels++}assert(levels>1,'overflow XP triggers further levels');
g=fresh();g.player.hp=60;g.mode='upgrade';g.choices=[SURVIVOR_UPGRADES.find(x=>x.id==='heart')];g.choose('heart');assert.equal(g.player.maxHp,120);assert.equal(g.player.hp,95);
g=fresh();g.hurtPlayer(10);g.hurtPlayer(10);assert.equal(g.player.hp,90,'invulnerability prevents repeated damage');
g=fresh();let boar=g.spawn('boar',{x:250,y:0});boar.chargeTimer=0;g.tick(.01);assert.equal(boar.charge,'warn');for(let i=0;i<80;i++)g.tick(.01);assert.equal(boar.charge,'rush');
g=fresh();let skeleton=g.spawn('skeleton',{x:250,y:0});skeleton.fire=0;g.tick(.01);assert(g.shots.some(s=>s.kind==='arrow'&&!s.friendly),'archer fires');
g=fresh();g.up.orb=1;g.spawn('slime',{x:300,y:0});g.tick(.01);assert(g.shots.some(s=>s.friendly),'magic fires automatically');
g=fresh();assert.equal(g.nextBossAt,300,'first boss arrives at five minutes');for(let i=0;i<10;i++){g.time=g.nextBossAt;g.tick(.01);const expected=SURVIVOR_BIOMES[i].bossType;const boss=g.enemies.find(e=>e.type===expected);assert(boss,`biome ${i+1} spawns its unique boss`);g.hurtEnemy(boss,999999);assert.equal(g.activeSkill,SURVIVOR_BIOMES[i].skill,`boss ${i+1} rewards its active skill`);if(i<9){assert(g.activateSkill({x:1,y:0}),`skill ${i+1} can be activated`);assert(g.effects.some(f=>f.kind==='skill'&&f.skill===SURVIVOR_BIOMES[i].skill),`skill ${i+1} creates its own visual effect`)}if(i<9){assert.equal(g.biome,i+1);assert.equal(g.nextBossAt,(i+2)*300)}else assert.equal(g.mode,'won')}assert.equal(g.unlockedSkills.length,10);assert(g.drainEvents().some(e=>e.type==='end'&&e.win));assert(g.activeSkill,'final boss equips the reward');
g=fresh();g.hurtPlayer(1000);assert.equal(g.mode,'over');g.start();assert.equal(g.player.hp,100);assert.equal(g.kills,0);

require('../web/i18n.js');
for(const language of ['ru','en','uk']){GameI18n.setLanguage(language);assert.equal(GameI18n.t('biome9').length>0,true,'all biomes have localized names');assert.equal(GameI18n.t('boss10').length>0,true,'all bosses have localized names');assert.equal(GameI18n.t('skill_cataclysm').length>0,true,'super abilities have localized names');g=fresh();g.addXP(8);assert.equal(g.mode,'upgrade');assert(g.choices.every(choice=>choice.name&&choice.desc),'localized upgrades include a name and description');if(language==='en')assert(g.choices.every(choice=>!/[А-Яа-яЁёІіЇїЄєҐґ]/.test(choice.name+choice.desc)),'English upgrade text is English')}
GameI18n.setLanguage('ru');

console.log('PASS: movement, pause, combat, 5% healing drops, upgrades, 10 localized biomes and bosses, colorful super-skill effects and rewards, defeat and restart');
module.exports = { passed: true };
