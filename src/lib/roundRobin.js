// Deterministic, best-effort rotating doubles schedule. No external dependencies.
export function generateRoundRobin(players, courtCount, roundCount) {
  const names = players.map(p => p.trim()).filter(Boolean);
  if (names.length < 4 || new Set(names.map(n => n.toLowerCase())).size !== names.length) {
    throw new Error('Enter at least four players with unique names.');
  }
  const courts = Number(courtCount), rounds = Number(roundCount);
  if (!Number.isInteger(courts) || courts < 1 || !Number.isInteger(rounds) || rounds < 1 || rounds > 30) {
    throw new Error('Choose at least one court and 1–30 rounds.');
  }
  const played = new Map(), partners = new Map(), opponents = new Map(), rested = new Map();
  const pairKey = (a,b) => [a,b].sort().join('|');
  const count = (map,key) => map.get(key) || 0;
  const bump = (map,key) => map.set(key,count(map,key)+1);
  const output = [];
  for (let round=0;round<rounds;round++) {
    const available = [...names].sort((a,b) =>
      count(played,a)-count(played,b) || count(rested,b)-count(rested,a) ||
      ((names.indexOf(a)+round)%names.length)-((names.indexOf(b)+round)%names.length));
    const slots = Math.min(courts,Math.floor(names.length/4));
    const active = available.slice(0,slots*4);
    const byes = available.slice(slots*4);
    byes.forEach(p=>bump(rested,p));
    const matches=[];
    for(let court=0;court<slots;court++) {
      const group = [active.shift()];
      while(group.length<4) {
        const candidate = active.reduce((best,p)=>{
          const penalty = group.reduce((s,q)=>s+count(partners,pairKey(p,q))*3+count(opponents,pairKey(p,q)),0);
          return !best || penalty<best.penalty ? {p,penalty}:best;
        },null).p;
        group.push(candidate);active.splice(active.indexOf(candidate),1);
      }
      const variants = [
        [[group[0],group[1]],[group[2],group[3]]],
        [[group[0],group[2]],[group[1],group[3]]],
        [[group[0],group[3]],[group[1],group[2]]]
      ];
      const [teamA,teamB]=variants.reduce((best,v)=>{
        const penalty=count(partners,pairKey(...v[0]))*5+count(partners,pairKey(...v[1]))*5+
          v[0].reduce((s,a)=>s+v[1].reduce((t,b)=>t+count(opponents,pairKey(a,b)),0),0);
        return !best || penalty<best.penalty?{v,penalty}:best;
      },null).v;
      [teamA,teamB].flat().forEach(p=>bump(played,p));
      bump(partners,pairKey(...teamA));bump(partners,pairKey(...teamB));
      teamA.forEach(a=>teamB.forEach(b=>bump(opponents,pairKey(a,b))));
      matches.push({id:`r${round+1}-c${court+1}`,court:court+1,teamA,teamB});
    }
    output.push({number:round+1,matches,byes});
  }
  return output;
}
export function calculateStandings(rounds,scores,players) {
  const stats=Object.fromEntries(players.map(name=>[name,{name,wins:0,losses:0,pointsFor:0,pointsAgainst:0,games:0}]));
  rounds.forEach(round=>round.matches.forEach(match=>{
    const score=scores[match.id];
    if(!score || score.a==='' || score.b==='') return;
    const a=Number(score.a),b=Number(score.b);
    if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||a===b) return;
    [[match.teamA,a,b],[match.teamB,b,a]].forEach(([team,own,other])=>team.forEach(name=>{
      const s=stats[name];s.games++;s.pointsFor+=own;s.pointsAgainst+=other;
      if(own>other)s.wins++;else s.losses++;
    }));
  }));
  return Object.values(stats).sort((a,b)=>b.wins-a.wins || (b.pointsFor-b.pointsAgainst)-(a.pointsFor-a.pointsAgainst) || a.name.localeCompare(b.name));
}
