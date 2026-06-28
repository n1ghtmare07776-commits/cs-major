const STARTING_BUDGET = 100;
const PLAYER_TEAM = "Team gun";
const CAMPAIGN_SEASONS = 3;
const CUPS = [
  {
    id: "katowice",
    short: "KATOWICE",
    name: "IEM Katowice",
    yearBase: 2027,
    tone: "冷蓝主场，强调纪律和反清。",
    intro: "Spodek 的冷风把第一杯赛的紧张感吹得很实。这里容不下慢热。",
    atmosphere: "Spodek 的灯光一排排压下来，观众席在选手入场时慢慢站起。耳机戴上的那一刻，外面的声浪像潮水一样撞在玻璃房外。",
    motto: "黄沙百战穿金甲，不破楼兰终不还。第一站不问退路，只问谁敢先把枪线顶住。",
  },
  {
    id: "cologne",
    short: "COLOGNE",
    name: "IEM Cologne",
    yearBase: 2027,
    tone: "老牌大场馆，节奏更快，观众更吵。",
    intro: "科隆的比赛更像拉满转速的马达。默认控图稍慢一步，就会被现场声浪吞掉。",
    atmosphere: "科隆的舞台像一台转速拉满的机器，灯牌、掌声和解说声混在一起。每一次击杀都会让看台震一下，队员连深呼吸都像踩在鼓点上。",
    motto: "长风破浪会有时，直挂云帆济沧海。越吵的场馆，越要把自己的声音听清。",
  },
  {
    id: "major",
    short: "MAJOR",
    name: "CS Major",
    yearBase: 2027,
    tone: "蓝金仪式感，所有细节都会被无限放大。",
    intro: "Major 没有平静局。每一个选择都会被解说、观众和对手反复审判。",
    atmosphere: "Major 的蓝金灯光扫过观众席，镜头从奖杯切到选手席。场馆安静下来的几秒，比欢呼更重，因为所有人都知道这一局会被反复回看。",
    motto: "会当凌绝顶，一览众山小。能走到这里的人，都该相信自己配得上最后的舞台。",
  },
];

const teamNames = {
  spirit: "Team Spirit",
  vitality: "Team Vitality",
  falcons: "Team Falcons",
  mouz: "MOUZ",
  faze: "FaZe Clan",
  furia: "FURIA Esports",
  navi: "Natus Vincere",
  mongolz: "The MongolZ",
  tyloo: "TYLOO",
};

const AI_TEAM_ORDER = ["vitality", "spirit", "falcons", "mouz", "faze", "furia", "navi", "mongolz"];
const ECONOMY_COST = {
  bonus: 42,
  full_buy: 60,
  force_buy: 46,
  half_buy: 30,
  eco: 14,
};
const LOSS_REWARD = [18, 28, 36];
const WIN_REWARD = {
  bonus: 34,
  full_buy: 38,
  force_buy: 40,
  half_buy: 40,
  eco: 44,
};
const BUY_LABEL = {
  bonus: "奖励局",
  full_buy: "全起",
  force_buy: "强起",
  half_buy: "半起",
  eco: "ECO",
};
const OPENING_TACTICS = {
  rush: { label: "快攻包点", counter: "stack", antiCounter: "default" },
  default: { label: "默认架枪", counter: "aggression", antiCounter: "fake" },
  lurk: { label: "慢控单摸", counter: "info", antiCounter: "default" },
  fake: { label: "假打转点", counter: "retake", antiCounter: "rush" },
};

const AI_TEAM_PROFILES = {
  vitality: {
    id: "vitality",
    name: "Team Vitality",
    short: "VIT",
    stars: ["ZywOo", "ropz", "flameZ", "apEX", "mezii"],
    style: "稳定残局",
    styleNote: "Vitality 靠 ZywOo 的残局兜底和成熟体系把比赛拖进后期。",
    base: { firepower: 87, tacticalExecution: 86, cohesion: 83, discipline: 83, clutch: 89 },
  },
  spirit: {
    id: "spirit",
    name: "Team Spirit",
    short: "SPI",
    stars: ["donk", "sh1ro", "chopper", "s1ren", "magixx"],
    style: "火力冲击",
    styleNote: "Spirit 的强点是 donk 带来的正面火力和连续冲击。",
    base: { firepower: 89, tacticalExecution: 80, cohesion: 79, discipline: 76, clutch: 84 },
  },
  falcons: {
    id: "falcons",
    name: "Team Falcons",
    short: "FLC",
    stars: ["NiKo", "m0NESY", "TeSeS", "kyxsan", "Magisk"],
    style: "双星上限",
    styleNote: "Falcons 纸面火力很高，但多核心资源分配会考验纪律。",
    base: { firepower: 87, tacticalExecution: 79, cohesion: 73, discipline: 74, clutch: 83 },
  },
  mouz: {
    id: "mouz",
    name: "MOUZ",
    short: "MOUZ",
    stars: ["xertioN", "Jimpphat", "torzsi", "Brollan", "siuhy"],
    style: "青年体系",
    styleNote: "MOUZ 靠年轻枪男和体系执行打连续回合，不是只拼单点明星。",
    base: { firepower: 82, tacticalExecution: 82, cohesion: 81, discipline: 79, clutch: 78 },
  },
  faze: {
    id: "faze",
    name: "FaZe Clan",
    short: "FAZE",
    stars: ["frozen", "broky", "rain", "karrigan", "EliGE"],
    style: "老将体系",
    styleNote: "FaZe 的老将体系更擅长把混乱回合拖回纪律和经验。",
    base: { firepower: 83, tacticalExecution: 83, cohesion: 79, discipline: 82, clutch: 82 },
  },
  furia: {
    id: "furia",
    name: "FURIA Esports",
    short: "FUR",
    stars: ["KSCERATO", "yuurih", "FalleN", "molodoy", "YEKINDAR"],
    style: "巴西韧性",
    styleNote: "FURIA 靠 KSCERATO 的稳定和老将韧性撑住中后段。",
    base: { firepower: 81, tacticalExecution: 79, cohesion: 77, discipline: 77, clutch: 80 },
  },
  navi: {
    id: "navi",
    name: "Natus Vincere",
    short: "NAVI",
    stars: ["b1t", "jL", "Aleksib", "iM", "w0nderful"],
    style: "体系执行",
    styleNote: "NAVI 的强项是 Aleksib 体系、纪律和地图中段调整。",
    base: { firepower: 83, tacticalExecution: 85, cohesion: 82, discipline: 84, clutch: 81 },
  },
  mongolz: {
    id: "mongolz",
    name: "The MongolZ",
    short: "MGLZ",
    stars: ["910", "Senzu", "bLitz", "mzinho", "Techno"],
    style: "快节奏混战",
    styleNote: "The MongolZ 节奏快、敢接正面，会把比赛带进连续拼枪。",
    base: { firepower: 82, tacticalExecution: 78, cohesion: 79, discipline: 74, clutch: 77 },
  },
};

const browserAiReservePlayers = [
  { id: "danking", name: "danking", role: "awp", firepower: 78, tactics: 68, discipline: 69, clutch: 73, traits: ["streaky_star"], profile: "中国赛区狙击手，作为 AI 队伍缺人时的真实姓名补位。" },
  { id: "jee", name: "Jee", role: "awp", firepower: 76, tactics: 70, discipline: 71, clutch: 73, traits: ["streaky_star"], profile: "中国赛区狙击手，补位时提供开镜威胁和残局抽奖。" },
  { id: "jamyoung", name: "JamYoung", role: "rifler", firepower: 80, tactics: 72, discipline: 74, clutch: 76, traits: ["calm_clutcher"], profile: "中国赛区步枪核心，残局和中段补枪更稳。" },
  { id: "mercury", name: "Mercury", role: "entry", firepower: 77, tactics: 69, discipline: 68, clutch: 69, traits: ["hot_blooded"], profile: "中国赛区突破手，补位后会提高开局冲击力。" },
  { id: "childking", name: "ChildKing", role: "entry", firepower: 75, tactics: 68, discipline: 69, clutch: 68, traits: ["hot_blooded"], profile: "中国赛区年轻枪男，适合填补突破位。" },
  { id: "somebody", name: "somebody", role: "rifler", firepower: 76, tactics: 73, discipline: 74, clutch: 72, traits: ["crowd_favorite"], profile: "中国赛区老面孔，补位时更像经验型步枪手。" },
  { id: "kaze", name: "kaze", role: "awp", firepower: 77, tactics: 70, discipline: 72, clutch: 74, traits: ["calm_clutcher"], profile: "亚洲赛区狙击手，作为替补能补残局质量。" },
  { id: "westmelon", name: "westmelon", role: "rifler", firepower: 79, tactics: 71, discipline: 73, clutch: 75, traits: ["streaky_star"], profile: "中国赛区步枪手，手感起来时有爆点。" },
  { id: "starry", name: "Starry", role: "rifler", firepower: 78, tactics: 72, discipline: 74, clutch: 73, traits: ["disciplined"], profile: "中国赛区稳定步枪手，适合补强第二火力。" },
  { id: "z4kr", name: "z4kr", role: "support", firepower: 73, tactics: 74, discipline: 75, clutch: 70, traits: ["disciplined"], profile: "中国赛区辅助位，补道具和纪律。" },
  { id: "emiliaqaq", name: "EmiliaQAQ", role: "igl", firepower: 70, tactics: 79, discipline: 76, clutch: 70, traits: ["system_leader"], profile: "中国赛区指挥型补位，能让 AI 阵容保持体系。" },
  { id: "flying", name: "flying", role: "support", firepower: 72, tactics: 72, discipline: 74, clutch: 69, traits: ["disciplined"], profile: "中国赛区辅助位，适合补全六人名单。" },
  { id: "advent", name: "advent", role: "igl", firepower: 65, tactics: 82, discipline: 80, clutch: 70, traits: ["system_leader"], profile: "中国赛区老指挥，作为补位更重战术纪律。" },
  { id: "attacker", name: "Attacker", role: "rifler", firepower: 74, tactics: 70, discipline: 72, clutch: 70, traits: ["crowd_favorite"], profile: "中国赛区步枪手，补位时提供经验。" },
  { id: "captainmo", name: "captainMo", role: "rifler", firepower: 72, tactics: 73, discipline: 75, clutch: 71, traits: ["crowd_favorite"], profile: "中国赛区老将型补位，稳定更高。" },
  { id: "slowly", name: "SLOWLY", role: "support", firepower: 71, tactics: 73, discipline: 76, clutch: 70, traits: ["disciplined"], profile: "中国赛区辅助位，补位时更看重团队执行。" },
];

const traitInfo = {
  hot_blooded: {
    label: "热血突破",
    text: "公开赛场风格：敢抢节奏、愿意先开枪。比赛里更容易主动打开局面，但落后时也可能让队伍纪律承压。",
  },
  streaky_star: {
    label: "爆点明星",
    text: "公开赛场风格：高上限选手。顺起来能打出决定比赛的高光，但连续受挫时稳定性会下降。",
  },
  calm_clutcher: {
    label: "冷静残局",
    text: "公开赛场风格：后期处理稳。残局、赛点和保枪决策更让人放心，也能帮助队伍稳住节奏。",
  },
  crowd_favorite: {
    label: "大场面人气",
    text: "公开赛场风格：能吃观众能量。顺风时会带动全队情绪，逆风时也会承受更多舆论压力。",
  },
  disciplined: {
    label: "体系纪律",
    text: "公开赛场风格：少犯低级错误。更擅长按体系打完回合，能减少经济局和补枪里的低级失误。",
  },
  system_leader: {
    label: "体系指挥",
    text: "公开赛场风格：负责中期判断和语音秩序。能让队伍更愿意听同一个声音，但个人火力通常不是第一卖点。",
  },
};

const roleLabel = {
  entry: "突破手",
  awp: "狙击手",
  rifler: "补枪手",
  lurker: "自由人",
  igl: "指挥",
  support: "防守者",
};

const draftRoleFilters = [
  { id: "all", label: "全部" },
  { id: "awp", label: "狙击手" },
  { id: "igl", label: "指挥" },
  { id: "entry", label: "突破手" },
  { id: "rifler", label: "补枪手" },
  { id: "lurker", label: "自由人" },
  { id: "support", label: "防守者" },
];

const players = [
  ["donk", "donk", "spirit", "entry", 89, 72, 62, 75, 46, 29, ["hot_blooded", "streaky_star"], "顶级突破火力，能一波撕开防线，但纪律和情绪必须靠体系托住。"],
  ["zywoo", "ZywOo", "vitality", "awp", 85, 83, 88, 91, 82, 28, ["calm_clutcher", "crowd_favorite"], "不靠满分火力碾压，而是靠稳定、残局和大赛下限让队伍不容易崩。"],
  ["monesy", "m0NESY", "falcons", "awp", 84, 75, 70, 85, 61, 27, ["streaky_star", "crowd_favorite"], "天才 AWP，上限很高，但需要队友给他舒服的开镜空间。"],
  ["niko", "NiKo", "falcons", "rifler", 84, 76, 66, 80, 52, 27, ["hot_blooded", "crowd_favorite"], "巨星步枪手，能用个人能力硬解，也会在逆风时把语音温度拉高。"],
  ["ropz", "ropz", "vitality", "lurker", 80, 82, 89, 86, 80, 24, ["disciplined", "calm_clutcher"], "纪律性极高的收割者，火力不是最炸，但能提升队伍下限和残局质量。"],
  ["sh1ro", "sh1ro", "spirit", "awp", 79, 79, 84, 86, 76, 23, ["calm_clutcher", "disciplined"], "稳健 AWP，保枪和后期残局收益很高，适合托住激进突破手。"],
  ["kscerato", "KSCERATO", "furia", "lurker", 80, 79, 84, 83, 78, 22, ["calm_clutcher", "disciplined"], "可靠步枪核心，适合给明星阵容补稳定性。"],
  ["b1t", "b1t", "navi", "rifler", 80, 77, 82, 80, 77, 17, ["disciplined"], "准星硬、纪律好，适合当第二火力点。"],
  ["w0nderful", "w0nderful", "navi", "awp", 79, 76, 80, 83, 73, 17, ["calm_clutcher"], "中后期残局很稳，能把失误局硬拖回来。"],
  ["frozen", "frozen", "faze", "rifler", 79, 80, 83, 81, 78, 16, ["disciplined"], "均衡步枪手，几乎不拖累体系。"],
  ["broky", "broky", "faze", "awp", 82, 77, 79, 83, 74, 16, ["calm_clutcher"], "性价比 AWP，关键局能补足残局。"],
  ["simple-fz", "s1mple", "faze", "awp", 87, 76, 66, 91, 58, 24, ["streaky_star", "crowd_favorite"], "传奇 AWP，上限仍然夸张，但阵容需要承受更大的情绪波动。"],
  ["twistzz", "Twistzz", "faze", "rifler", 80, 79, 82, 81, 76, 20, ["disciplined", "crowd_favorite"], "枪法干净、经验足，既能补火力，也能让强队阵容更稳。"],
  ["device", "device", "faze", "awp", 85, 83, 88, 90, 82, 24, ["calm_clutcher", "disciplined"], "老牌明星 AWP，价格很高，但残局、纪律和大赛经验都能抬高下限。"],
  ["naf", "NAF", "faze", "lurker", 81, 80, 86, 83, 80, 17, ["calm_clutcher", "disciplined"], "稳定自由人，不会抢戏，但能把很多残局和补枪局处理得很干净。"],
  ["hunter", "huNter-", "falcons", "rifler", 84, 78, 79, 80, 75, 15, ["disciplined", "crowd_favorite"], "经验丰富的步枪手，适合给年轻核心做第二火力和情绪缓冲。"],
  ["electronic", "electroNic", "navi", "rifler", 82, 78, 72, 78, 60, 20, ["hot_blooded", "crowd_favorite"], "有指挥经验的强硬步枪手，能顶住强对抗，但也会让语音更有火药味。"],
  ["stavn", "stavn", "mouz", "rifler", 84, 77, 76, 80, 68, 15, ["streaky_star"], "中高价爆点步枪，顺风能连杀，逆风需要体系稳住。"],
  ["jabbi", "jabbi", "mouz", "rifler", 82, 76, 78, 76, 72, 14, ["disciplined"], "价格适中的团队步枪手，适合补第二梯队火力和中段站位。"],
  ["xertion", "xertioN", "mouz", "entry", 81, 73, 69, 73, 60, 15, ["hot_blooded"], "冲击力强，但可能带来提前减员风险。"],
  ["senzu", "Senzu", "mongolz", "entry", 81, 71, 70, 74, 61, 15, ["hot_blooded"], "节奏来得很猛，适合当低预算快攻发起点。"],
  ["torzsi", "torzsi", "mouz", "awp", 80, 76, 78, 79, 70, 15, ["calm_clutcher"], "架中路和残局兜底都不错，属于很顺手的中价狙。"],
  ["flamez", "flameZ", "vitality", "entry", 80, 74, 74, 75, 64, 15, ["hot_blooded"], "主动性强，适合快攻体系。"],
  ["yuurih", "yuurih", "furia", "rifler", 81, 77, 80, 79, 76, 16, ["disciplined"], "稳定副核，适合预算紧张时补强。"],
  ["910", "910", "mongolz", "awp", 80, 73, 75, 79, 70, 15, ["calm_clutcher"], "中价 AWP，适合替补或第二套战术。"],
  ["teSeS", "TeSeS", "falcons", "entry", 83, 73, 74, 75, 65, 14, ["hot_blooded"], "前顶和补枪都够硬，但容易上头，需要队友兜底。"],
  ["brollan", "Brollan", "mouz", "rifler", 81, 73, 71, 72, 67, 13, ["streaky_star"], "手感热的时候能连杀抬节奏，冷下来会有点飘。"],
  ["jimpphat", "Jimpphat", "mouz", "lurker", 82, 79, 82, 79, 76, 15, ["disciplined"], "年轻但稳，能提高团队纪律。"],
  ["jl", "jL", "navi", "entry", 79, 74, 75, 78, 66, 14, ["crowd_favorite"], "大场面气质，顺风时能抬高全队情绪。"],
  ["yekindar", "YEKINDAR", "furia", "entry", 79, 70, 63, 71, 52, 14, ["hot_blooded"], "爱抢 timing，赌对了能把对手直接打停。"],
  ["magisk", "Magisk", "falcons", "support", 80, 80, 84, 76, 75, 14, ["disciplined"], "老练辅助位，能让整套枪线更稳更整。"],
  ["mezii", "mezii", "vitality", "support", 79, 77, 82, 74, 74, 13, ["disciplined"], "补道具和补枪都很干净，适合平衡明星阵。"],
  ["spinx-m", "Spinx", "mouz", "support", 78, 76, 78, 75, 72, 12, ["disciplined"], "工具人属性扎实，适合补默契和中段火力。"],
  ["cypher-v", "Cypher", "vitality", "rifler", 77, 71, 73, 72, 68, 11, ["streaky_star"], "敢打非常规偷位，有时能偷到关键首杀。"],
  ["zont1x", "zont1x", "spirit", "rifler", 81, 73, 79, 73, 71, 14, ["disciplined"], "补枪线路清楚，能把 donk 这种前压核心托住。"],
  ["rain", "rain", "faze", "entry", 81, 74, 76, 74, 72, 13, ["crowd_favorite"], "老牌突破，关键局肯顶第一身位。"],
  ["karrigan", "karrigan", "faze", "igl", 65, 92, 81, 73, 76, 18, ["system_leader"], "FaZe 老派指挥，枪法不贵，但能把高火力阵容拧成体系。"],
  ["jcobbb", "jcobbb", "faze", "entry", 77, 70, 72, 70, 67, 10, ["streaky_star"], "年轻步枪位，价格低、上限有弹性，适合当第六人或低预算轮换。"],
  ["mzinho", "mzinho", "mongolz", "rifler", 81, 71, 74, 74, 68, 13, ["streaky_star"], "枪感波动大，但打疯了会很难顶。"],
  ["im", "iM", "navi", "rifler", 82, 73, 73, 75, 64, 13, ["streaky_star"], "手热时能硬接正面对枪，适合做第二波发力点。"],
  ["molodoy", "molodoy", "furia", "awp", 79, 69, 71, 74, 66, 12, ["streaky_star"], "年轻狙击手，有抽奖感，但真抽中了能接管小图。"],
  ["techno", "Techno", "mongolz", "support", 78, 72, 75, 72, 71, 12, ["disciplined"], "中规中矩但很听指挥，能补团队下限。"],
  ["jamyoung", "JamYoung", "tyloo", "rifler", 79, 73, 75, 76, 74, 15, ["calm_clutcher"], "TYLOO 步枪核心，残局处理和中段补枪都更稳，适合预算不够时补真实强度。"],
  ["danking", "danking", "tyloo", "awp", 78, 69, 69, 76, 65, 14, ["streaky_star"], "TYLOO 狙击手，手感热时能连续打开局面，但需要队伍给他足够空间。"],
  ["moseyuh", "Moseyuh", "tyloo", "rifler", 77, 72, 74, 73, 72, 12, ["disciplined"], "TYLOO 步枪手，枪线和补枪比较稳，适合做中价轮换。"],
  ["mercury", "Mercury", "tyloo", "entry", 76, 70, 69, 70, 64, 11, ["hot_blooded"], "TYLOO 突破位，敢抢第一身位，顺起来能把节奏带快。"],
  ["jee", "Jee", "tyloo", "awp", 76, 70, 71, 73, 66, 10, ["streaky_star"], "TYLOO 狙击手，年轻、有开镜爆点，价格不高但需要队伍给他架枪和补枪空间。"],
  ["zero-tyloo", "Zero", "tyloo", "support", 72, 74, 76, 70, 73, 8, ["disciplined"], "TYLOO 防守者，偏团队和道具，适合压预算时补第六人。"],
  ["olofmeister-fz", "olofmeister", "faze", "support", 70, 76, 82, 76, 78, 10, ["disciplined", "crowd_favorite"], "老将型替补，火力不是巅峰，但纪律、经验和关键局心态很有价值。"],
  ["apex", "apEX", "vitality", "igl", 71, 90, 67, 70, 54, 18, ["system_leader", "hot_blooded"], "高战术指挥，能用火爆语音压低敌人士气，也可能影响纪律。"],
  ["aleksib", "Aleksib", "navi", "igl", 66, 89, 84, 73, 77, 15, ["system_leader", "disciplined"], "默认控图和残局指挥都很清楚，适合稳队形。"],
  ["chopper", "chopper", "spirit", "igl", 68, 88, 77, 70, 69, 12, ["system_leader"], "中低价指挥位，适合补战术执行。"],
  ["fallen", "FalleN", "furia", "igl", 68, 88, 83, 74, 79, 14, ["system_leader", "crowd_favorite"], "老将领袖，适合缓冲舆论压力。"],
  ["siuhy", "siuhy", "mouz", "igl", 69, 87, 81, 72, 75, 13, ["system_leader"], "战术板讲得明白，适合把年轻枪男们串起来。"],
  ["kyxsan", "kyxsan", "falcons", "igl", 70, 85, 80, 72, 71, 10, ["system_leader"], "便宜好用的指挥位，控预算时很好搭阵。"],
  ["bLitz", "bLitz", "mongolz", "igl", 74, 84, 79, 73, 74, 9, ["system_leader"], "喜欢用前期节奏带动全队，适合偏凶一点的阵容。"],
  ["elio", "EliGE", "faze", "rifler", 80, 73, 67, 75, 58, 15, ["streaky_star"], "火力上限还在，但有时会把交换打成个人秀。"],
  ["magixx", "magixx", "spirit", "support", 74, 74, 76, 71, 72, 11, ["disciplined"], "防守站位扎实，适合给冲阵补最后一环。"],
  ["makazze", "makazze", "navi", "support", 72, 69, 71, 68, 69, 10, ["disciplined"], "便宜轮换位，拿来补替补席不亏。"],
  ["dupreeh-f", "dupreeh", "falcons", "rifler", 74, 75, 77, 73, 74, 10, ["crowd_favorite"], "经验值很高，逆风时能给队伍一点老将稳定感。"],
  ["chelo", "chelo", "furia", "support", 72, 70, 72, 68, 68, 10, ["crowd_favorite"], "不算华丽，但能吃掉一些脏活累活。"],
  ["s1ren", "s1ren", "spirit", "support", 72, 72, 75, 69, 73, 10, ["disciplined"], "低价替补，纪律不差，适合预算补位。"],
  ["skullz-fz", "skullz", "faze", "support", 73, 71, 75, 69, 71, 10, ["disciplined"], "轮换价值不错，适合当预算期的第六人。"],
  ["annihilation", "Annihilation", "mongolz", "awp", 76, 68, 69, 70, 65, 10, ["streaky_star"], "纯看手感的副狙型选择，适合当奇兵。"],
].map(([id, name, team, role, firepower, tactics, discipline, clutch, personality, price, traits, profile]) => ({
  id,
  name,
  team,
  role,
  firepower,
  tactics,
  discipline,
  clutch,
  personality,
  price,
  traits,
  profile,
}));

const betweenCupEventPool = [
  {
    id: "early-exit-review",
    severity: "mild",
    tone: "negative",
    placements: ["八强"],
    title: "第一轮出局复盘",
    narrative: "八强出局以后，训练室没有人谈冠军。分析师把失误剪成三段：手枪局细节、默认控图断点、经济局该不该强起。现在要先把最基础的洞补上。",
    passive: "社媒声音不算大，更多是在问：这套阵容到底哪里卡住了。",
    options: [
      { id: "fix-defaults", label: "重修默认和补枪", result: "你没有急着改体系，而是把默认架枪、二点补枪和回防站位重新过了一遍。下一杯至少不会再从同一个洞漏人。", delta: "战术执行 +3，纪律 +2", effect: { tacticalExecution: 3, discipline: 2 } },
      { id: "economy-review", label: "复盘经济线", result: "教练组把每一局的钱都列出来，哪些局该保、哪些局该薄道具拼一波，终于不再靠感觉判断。", delta: "纪律 +3，配合 +1", effect: { discipline: 3, cohesion: 1 } },
      { id: "aim-reset", label: "先把手感打回来", result: "你把长复盘压掉一半，让队员多打基础对枪。问题没全解决，但至少下一站不会带着僵硬的准星进场。", delta: "火力 +3，战术执行 -1", effect: { firepower: 3, tacticalExecution: -1 } },
    ],
  },
  {
    id: "anti-strat",
    severity: "mild",
    tone: "neutral",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "情报组递来新报告",
    narrative: "分析师把下一个杯赛热门队的默认控图拆成了 14 个镜头。现在你可以决定，是继续啃反清细节，还是给队员放一天空档。",
    passive: "社媒上已经开始讨论 Team gun 会不会被对手研究透。",
    options: [
      { id: "deep-anti", label: "加练反清和补枪", result: "训练室多亮了三小时。默认架枪更稳，补枪链更整齐。", delta: "战术执行 +4，纪律 +2", effect: { tacticalExecution: 4, discipline: 2 } },
      { id: "rest-reset", label: "只做轻复盘，让手感回暖", result: "你把复盘压短，只保留最关键的几个镜头。大家很配合复盘工作，保持了往常的手感。", delta: "火力 +2，配合 +3", effect: { firepower: 2, cohesion: 3 } },
      { id: "detail-lab", label: "深度分析每一个细节，产出新战术", result: "你让分析师继续拆每一个镜头：谁先给闪、谁负责二点补枪、哪一秒默认会露出空档。最后教练组把这些细节整理成一套新的反清开局，不是靠藏招，而是靠把对手习惯拆到足够细。", delta: "隐藏", effect: { tacticalExecution: 3, discipline: 1 } },
    ],
  },
  {
    id: "fan-pressure",
    severity: "mild",
    tone: "negative",
    target: "star",
    tags: ["star-pressure"],
    placements: ["四强", "亚军", "冠军"],
    title: "舆论压上来了",
    narrative: "Team gun 打进淘汰赛深处以后，弹幕和论坛一下热了起来。有人已经开始喊冠军，也有人盯着明星选手这几场打得怎么样，稍有失误就会被放大。",
    passive: "直播间热搜挂了一整晚，俱乐部那边也希望你们把这波关注度接住。",
    options: [
      { id: "shield", label: "先把外界声音挡掉", result: "你让所有人先收手机，训练室终于安静下来，队里也没人再被弹幕带着走。", delta: "隐藏", effect: { discipline: 3, cohesion: 2, form: -1, targetGroup: "star" } },
      { id: "embrace", label: "把热度转成士气", result: "你把外面的期待拿来做动员。队员情绪被点起来了，但也更容易打得过热。", delta: "隐藏", effect: { firepower: 3, discipline: -2, form: -1, targetGroup: "star" } },
      { id: "leader-talk", label: "让队长出来控场", result: "队长把话讲透以后，队里的情绪总算稳住了，训练室也重新回到比赛节奏里。", delta: "隐藏", effect: { tacticalExecution: 2, cohesion: 2 } },
    ],
  },
  {
    id: "burnout",
    severity: "mild",
    tone: "negative",
    tags: ["role-pressure"],
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "状态有点绷",
    narrative: "连续杯赛之后，选手手感和注意力都开始出现轻微波动。有人复盘时越来越急，有人训练赛后一句话都不想说。",
    passive: "队医提醒：再这么顶下去，下一杯容易把低迷带进正赛。",
    options: [
      { id: "mental-day", label: "放半天假，先把脑子清空", result: "短休不长，但足够把训练室里的毛躁按下来。", delta: "隐藏", effect: { cohesion: 4, discipline: -1, form: -1, targetGroup: "role" } },
      { id: "aim-routine", label: "维持例行训练，不放掉手感", result: "准星没丢，但体能和情绪没有完全恢复。", delta: "隐藏", effect: { firepower: 2, discipline: 1, form: -1 } },
      { id: "tactical-light", label: "减少对枪，做纯战术会议", result: "你把枪线压力换成白板压力。执行更清楚了，火热状态却降了一点。", delta: "隐藏", effect: { tacticalExecution: 4, firepower: -1, form: -1, targetGroup: "star" } },
    ],
  },
  {
    id: "visa-delay",
    severity: "severe",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "签证卡住了",
    narrative: "出发前两天，工作人员把你叫到走廊：一名教练组成员的签证还没下来。不是没人努力，是流程真的卡住了。下一站赛前准备要少一个最熟悉复盘节奏的人。",
    passive: "队员嘴上说没事，但你知道，少一个能把 demo 拆明白的人，赛前判断一定会变粗。",
    options: [
      { id: "remote-review", label: "远程接入复盘", result: "你让他远程参与 demo 会议。信息还能传回来，但临场沟通慢了半拍。", delta: "战术执行 -1，纪律 +1", effect: { tacticalExecution: -1, discipline: 1 } },
      { id: "player-led-review", label: "让队长带复盘", result: "队长接过了复盘，但他要同时考虑自己训练和全队判断。年轻队员更愿意听他，细节却少了一些。", delta: "配合 +1，战术执行 -2", effect: { cohesion: 1, tacticalExecution: -2 } },
      { id: "simplify-prep", label: "缩小战术包", result: "你砍掉两套复杂准备，只保留最熟的默认和反清。队伍更清楚，但能拿出来的变化少了。", delta: "纪律 +2，战术执行 -3", effect: { discipline: 2, tacticalExecution: -3 } },
    ],
  },
  {
    id: "scrim-collapse",
    severity: "severe",
    tone: "negative",
    target: "role",
    tags: ["role-pressure"],
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "训练赛被打穿",
    narrative: "下一杯赛前的训练赛，你们被一支陪练队连续打穿默认。比分不重要，难看的是每次掉人的位置都差不多。",
    passive: "队员没有公开抱怨，但复盘室里明显安静了。大家都知道，这不是单纯手感问题。",
    options: [
      { id: "hard-review", label: "逐回合拆错", result: "你把每个死亡位置都剪出来，一帧一帧看。问题变清楚了，但训练室气氛也被压得很紧。", delta: "隐藏", effect: { tacticalExecution: 2, cohesion: -1, discipline: 1, form: -1, targetGroup: "role" } },
      { id: "confidence-reset", label: "先停掉训练赛", result: "你取消了当天剩下的训练赛，让队员打个人练习找手感。短期心态稳了，但问题没有马上解决。", delta: "隐藏", effect: { firepower: 1, tacticalExecution: -2, form: -1 } },
      { id: "role-reset", label: "临时调站位", result: "你改了两个默认站位。对手短期更难读，但队内补枪路线要重新磨。", delta: "隐藏", effect: { tacticalExecution: 1, cohesion: -3, form: -1, targetGroup: "role" } },
    ],
  },
  {
    id: "public-criticism",
    severity: "mild",
    tone: "negative",
    placements: ["八强", "四强", "亚军"],
    title: "外界开始质疑",
    narrative: "杯赛结束后，论坛剪出你们几波失败回防反复播放。有人说阵容太贵但结构不清，也有人说明星选手没有被用在正确位置。",
    passive: "这种声音不会直接打掉准星，但会让下一次失误变得更刺耳。",
    options: [
      { id: "block-noise", label: "封住外界声音", result: "你让队员少看社媒，训练室短暂安静下来。但外面的质疑不会因为不看就消失。", delta: "纪律 +1，士气 -1", effect: { discipline: 1, cohesion: -1 } },
      { id: "public-answer", label: "公开回应质疑", result: "你在采访里把责任揽到自己身上。队员压力小了一点，但下一杯你会被盯得更死。", delta: "配合 +2，战术执行 -1", effect: { cohesion: 2, tacticalExecution: -1 } },
      { id: "use-as-fuel", label: "拿来刺激队伍", result: "你把剪辑放给全队看。有人被点燃，有人明显更沉默。", delta: "火力 +2，配合 -2，纪律 -1", effect: { firepower: 2, cohesion: -2, discipline: -1 } },
    ],
  },
  {
    id: "opponent-hot-hand",
    severity: "severe",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "下个对手状态火热",
    narrative: "情报组把最近几张图的数据摆到你面前：下一站热门队的双核心都在升温，尤其是首杀回合，几乎每次都能把对手逼进少打多。",
    passive: "这不是坏运气，是你们接下来必须面对的现实。对面手热的时候，默认控图的每个断点都会更危险。",
    options: [
      { id: "star-duel", label: "让明星选手大胆发挥，针锋相对", result: "你把话说得很直接：对面核心手热，那就让自己的明星选手去接这个对位。训练重点不再是躲开他们，而是给核心创造关键对枪空间，正面把节奏打回来。", delta: "隐藏", effect: { firepower: 3, cohesion: -1, discipline: -1 } },
      { id: "anti-entry-pack", label: "围绕首杀回合做反制", result: "你把训练重点放在反清闪、二点补枪和退守口令上。不求每次先杀人，至少不能第一波就被打成 4v5。", delta: "隐藏", effect: { discipline: 3, tacticalExecution: 1, firepower: -1 } },
      { id: "slow-map", label: "用慢控消耗对手手感", result: "你决定把比赛拖慢，用烟火和假动作消耗对手的热手感。它不华丽，但能让对面不那么舒服地一路冲起来。", delta: "隐藏", effect: { tacticalExecution: 3, cohesion: 1 } },
    ],
  },
  {
    id: "sponsor-pressure",
    severity: "mild",
    tone: "negative",
    placements: ["四强", "亚军", "冠军"],
    title: "商务活动挤进赛程",
    narrative: "俱乐部临时加了一场赞助商拍摄。时间不长，但正好卡在训练前。选手嘴上说可以，实际上每个人都知道，比赛周最怕被无关事情切碎节奏。",
    passive: "曝光有用，钱也重要，可如果训练质量被挤掉，下一站会在服务器里还回来。",
    options: [
      { id: "short-shoot", label: "压缩拍摄时间", result: "你把拍摄压到最短，只保留必须镜头。俱乐部不算太满意，但训练节奏保住了。", delta: "纪律 +2，配合 +1", effect: { discipline: 2, cohesion: 1 } },
      { id: "accept-shoot", label: "配合完整拍摄", result: "队伍把商务流程走完了，外界曝光拉满，但当天训练只剩半套内容。", delta: "预算氛围 +2，战术执行 -2，火力 -1", effect: { tacticalExecution: -2, firepower: -1, cohesion: 1 } },
      { id: "captain-buffer", label: "让队长稳住队伍", result: "队长把话说在前面：拍完就回训练，不抱怨，也不把情绪带进服务器。队伍没完全恢复，但至少没有散。", delta: "配合 +2，纪律 +1，火力 -1", effect: { cohesion: 2, discipline: 1, firepower: -1 } },
    ],
  },
  {
    id: "map-pool-exposed",
    severity: "mild",
    tone: "negative",
    placements: ["八强", "四强", "亚军"],
    title: "地图池被抓住短板",
    narrative: "对手教练在采访里没有明说，但所有人都听懂了：他们认为 Team gun 的弱图处理太粗，特别是中期转点和回防站位。",
    passive: "这不是放假信息，而是职业队之间最常见的试探。你可以不理，但对手很可能真的会这么准备。",
    options: [
      { id: "study-elite-demos", label: "反复观摩强队录像学习打法", result: "你把几个顶级队在这张图上的 demo 拉出来反复看：什么时候停默认、什么时候二次提速、回防第一颗烟该给哪里。队员看得有点累，但至少知道强队为什么这么处理。", delta: "隐藏", effect: { tacticalExecution: 3, discipline: 1, firepower: -1 } },
      { id: "dry-run-details", label: "命令队员跑图寻找细节", result: "你把服务器开到很晚，让队员一遍遍跑转点路线、补枪距离和回防站位。没人会因为跑图兴奋，但下一次真被打到弱图时，脚下的位置会更清楚。", delta: "隐藏", effect: { tacticalExecution: 2, discipline: 3, cohesion: -1 } },
      { id: "search-online-tactics", label: "在网上搜索战术", result: "你翻了大量公开战术解析和社区 demo 笔记，确实捡到几套能临时用的思路。但网上答案终究不是你们自己的体系，照搬太多会让队伍临场反应变慢。", delta: "隐藏", effect: { tacticalExecution: 1, cohesion: -2, firepower: 1 } },
    ],
  },
  {
    id: "champion-targeted",
    severity: "severe",
    tone: "negative",
    placements: ["冠军"],
    title: "冠军被重点研究",
    narrative: "刚拿完冠军，训练赛邀请和采访都多了。更麻烦的是，强队开始专门剪你们的默认控图和明星位站位。下一杯没人再把 Team gun 当黑马，你们每个习惯都会被提前准备。",
    passive: "冠军不是护身符，反而会让下一站的每个开局都更难打。",
    options: [
      { id: "refresh-openings", label: "重做两套开局", result: "你没有沉在冠军录像里，而是把两套最常用开局拆掉重做。队员短期会不舒服，但下一杯至少不会被照着答案打。", delta: "隐藏", effect: { tacticalExecution: 1, discipline: 1, cohesion: -2 } },
      { id: "protect-stars", label: "保护明星位习惯", result: "你减少明星选手在训练赛里的固定站位暴露，宁愿牺牲一点训练质量，也不把正赛答案提前交出去。", delta: "隐藏", effect: { firepower: -1, tacticalExecution: 2, discipline: -1 } },
      { id: "accept-target", label: "继续打自己的体系", result: "你告诉队员：被研究是强队必须经历的事。大家心态稳住了，但如果对手真读到开局，临场代价会更大。", delta: "隐藏", effect: { cohesion: 2, tacticalExecution: -2 } },
    ],
  },
  {
    id: "travel-fatigue",
    severity: "mild",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "转场太赶",
    narrative: "下一站前的航班时间很差，队员落地以后只剩半天调整。没人抱怨，但你看得出来，训练室里反应慢了半拍，语音也没有平时那么紧。",
    passive: "这种小疲劳不会上新闻，却会在第一张图的每一次补枪里显形。",
    options: [
      { id: "sleep-first", label: "先补觉再训练", result: "你砍掉一段复盘，先让队员把觉补回来。训练内容少了，但人终于不再像硬撑着打服务器。", delta: "隐藏", effect: { firepower: 1, tacticalExecution: -1, cohesion: 1 } },
      { id: "light-server", label: "只跑关键道具", result: "你把训练压缩到关键烟、闪和回防口令。内容不多，但下一杯最基础的东西不会散。", delta: "隐藏", effect: { tacticalExecution: 1, discipline: 1, firepower: -1 } },
      { id: "push-through", label: "照常加练", result: "你没有改计划。训练量保住了，但疲劳会被带进赛前准备，队员脸上的火气也更重。", delta: "隐藏", effect: { tacticalExecution: 1, cohesion: -2, discipline: -1 } },
    ],
  },
  {
    id: "private-life-noise",
    severity: "severe",
    tone: "negative",
    target: "star",
    tags: ["star-pressure"],
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "场外节奏冲进训练室",
    narrative: "一名选手的私生活被人拿到网上讨论。事情本身不该影响比赛，但消息已经传进训练室，队友不知道该不该问，他本人也明显沉默了。",
    passive: "职业队最怕这种不在服务器里的失误：它不掉血，却会慢慢掏空注意力。",
    options: [
      { id: "shield-player", label: "先把人护住", result: "你让俱乐部对外处理舆论，训练室里只谈比赛。被影响的选手缓过来一些，但队伍需要临时分担他的沟通压力。", delta: "隐藏", effect: { cohesion: 1, discipline: 1, firepower: -2, form: -1, targetGroup: "star" } },
      { id: "captain-room", label: "让队长单独聊", result: "队长把话讲得很直：出事可以扛，但进服务器就要报点、补枪、听指挥。训练室气氛紧了一点，好在没有继续发酵。", delta: "隐藏", effect: { discipline: 2, cohesion: -1, form: -1, targetGroup: "star" } },
      { id: "hard-boundary", label: "立刻立规矩", result: "你把训练纪律重新钉死。短期内队伍更守规矩，但被点名的选手明显更压抑。", delta: "隐藏", effect: { discipline: 3, firepower: -2, cohesion: -2, form: -2, targetGroup: "star", formStrong: -1 } },
    ],
  },
  {
    id: "opponent-roster-shuffle",
    severity: "mild",
    tone: "positive",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "对手临时换人",
    narrative: "下一站热门队突然把一名首发放进替补席，换上年轻选手。新人枪不软，但和原阵容打正式赛太少，补枪距离、回防口令和道具顺序都可能慢半拍。",
    passive: "这种消息不能让你盲目乐观。职业队临时换人也可能打出新鲜感，但他们的默契一定需要时间重新对齐。",
    options: [
      { id: "attack-link", label: "打他们新老连接位", result: "你让分析师剪出新人和老队员之间的补枪路线。训练重点不是欺负新人，而是打他们还没磨合好的连接位。", delta: "隐藏", effect: { tacticalExecution: 3, discipline: 1 } },
      { id: "keep-normal", label: "按原计划打，不被消息带跑", result: "你提醒队伍别把对面想得太乱。该清的点照清，该补的枪照补，别因为一条换人新闻把自己的默认打丢。", delta: "隐藏", effect: { discipline: 3, cohesion: 1 } },
      { id: "early-pressure", label: "开局就给新人压力", result: "你准备在前两张图多打新人区域。只要第一波让他感到线下赛压力，对面的轮转就会更保守。", delta: "隐藏", effect: { firepower: 2, tacticalExecution: 1, cohesion: -1 } },
    ],
  },
  {
    id: "opponent-coach-delay",
    severity: "mild",
    tone: "positive",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "对方教练迟到",
    narrative: "消息从场馆那边传来：对方主教练因为行程问题还没到队。他们不至于完全没人指挥，但暂停和赛前复盘一定会少一点外部视角。",
    passive: "这是机会，也是陷阱。没有教练的队伍可能变乱，也可能让 IGL 打得更自由。",
    options: [
      { id: "tempo-test", label: "前期提速试他们反应", result: "你把前几局设计成快慢交替，逼对面自己处理信息。只要他们暂停慢半拍，你就能看到缝隙。", delta: "隐藏", effect: { tacticalExecution: 2, firepower: 1 } },
      { id: "discipline-first", label: "不贪便宜，先稳默认", result: "你没有因为对面教练迟到就瞎提速。队伍先把默认站稳，等对面自己露出沟通问题。", delta: "隐藏", effect: { discipline: 3, cohesion: 1, firepower: -1 } },
      { id: "timeout-plan", label: "准备中盘变招", result: "你把真正的变化留在比赛中段。一旦对面没有教练帮忙复盘，他们就更难连续两次读到同一套变化。", delta: "隐藏", effect: { tacticalExecution: 3, discipline: -1 } },
    ],
  },
  {
    id: "opponent-inner-noise",
    severity: "mild",
    tone: "positive",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "对手训练室有杂音",
    narrative: "训练赛后台传出消息：对手两名核心对地图角色有分歧。真假不好判断，但他们最近几张图的补枪确实有些脱节。",
    passive: "你不会把希望押在别人吵架上，可如果对面连接位松了，比赛里必须敢打。",
    options: [
      { id: "pressure-weak-link", label: "重点压他们连接位", result: "你把进攻重心放在两名核心之间的区域。不是赌他们内讧，而是用连续压力验证那里到底有没有裂缝。", delta: "隐藏", effect: { tacticalExecution: 3, firepower: 1, discipline: -1 } },
      { id: "ignore-rumor", label: "不碰传闻，专注自己", result: "你把传闻从复盘里删掉，只看 demo 上确定发生的失误。训练室没有被八卦带偏，准备也更干净。", delta: "隐藏", effect: { discipline: 3, cohesion: 1 } },
      { id: "late-round-test", label: "多拖残局看沟通", result: "你准备把一些回合拖到后段，让对手自己决定谁回防、谁保枪。越到残局，沟通裂缝越容易露出来。", delta: "隐藏", effect: { tacticalExecution: 2, cohesion: 1, firepower: -1 } },
    ],
  },
  {
    id: "opponent-travel-delay",
    severity: "mild",
    tone: "positive",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "对手凌晨才落地",
    narrative: "对手航班延误，凌晨才到酒店。职业队不会因为少睡几个小时就不会打 CS，但反应、沟通和耐心都会被消耗。",
    passive: "这类优势不该写在脸上。你要做的是让比赛节奏不断考验他们，而不是期待他们自己崩。",
    options: [
      { id: "fast-first-map", label: "第一张图先提速", result: "你决定第一张图多打快节奏，用第一波交火测试对手醒没醒。打不穿也能逼他们更早暴露调整。", delta: "隐藏", effect: { firepower: 2, tacticalExecution: 1, discipline: -1 } },
      { id: "drag-late-rounds", label: "拖慢回合消耗耐心", result: "你让队伍别急着撞点，更多用控图和道具逼对面一直沟通。疲劳不会立刻爆炸，但会慢慢磨掉他们的判断。", delta: "隐藏", effect: { tacticalExecution: 3, firepower: -1 } },
      { id: "same-plan", label: "照常准备，不改体系", result: "你不想因为对手疲劳就破坏自己的节奏。该怎么打还怎么打，把优势交给细节而不是幻想。", delta: "隐藏", effect: { discipline: 2, cohesion: 1 } },
    ],
  },
  {
    id: "analyst-overload",
    severity: "mild",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "情报太多了",
    narrative: "分析师交上来的资料很厚：对手默认、手枪局站位、经济局赌点、弱图回防。问题是比赛前一天，选手不可能把所有信息都吃下去。",
    passive: "情报是武器，塞太多就会变成负重。你必须决定哪些东西该留下，哪些该删掉。",
    options: [
      { id: "three-points", label: "只保留三条重点", result: "你把情报压成三条能在语音里喊出来的重点。信息少了，但每个人终于知道自己要记什么。", delta: "隐藏", effect: { discipline: 2, cohesion: 2, tacticalExecution: -1 } },
      { id: "full-package", label: "完整讲完，不放过细节", result: "你坚持把所有细节讲完。准备更细，但队员脸上的疲惫也很明显，真正进比赛时未必能全部调用。", delta: "隐藏", effect: { tacticalExecution: 2, firepower: -1, cohesion: -1 } },
      { id: "igl-filter", label: "交给 IGL 做过滤", result: "你把厚资料交给 IGL，让他决定比赛里哪些信息该喊。队伍更愿意听同一个声音，但他身上的压力也更大。", delta: "隐藏", effect: { cohesion: 2, discipline: 1, tacticalExecution: 1, firepower: -1 } },
    ],
  },
  {
    id: "scrim-partner-cancel",
    severity: "mild",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "陪练临时取消",
    narrative: "原定的高质量训练赛被对方临时取消。你们少了一次检验新战术的机会，训练室里突然空出两个小时，所有人都在看你怎么安排。",
    passive: "没有训练赛不等于没法训练，但新东西没经过对抗，正赛拿出来就会更抖。",
    options: [
      { id: "internal-scrim", label: "改打队内攻防演练", result: "你把五个人拆开做攻防演练，反复跑道具和补枪路线。强度不如训练赛，但细节还能抠。", delta: "隐藏", effect: { tacticalExecution: 2, discipline: 1 } },
      { id: "aim-block", label: "改成个人对枪训练", result: "你把空出来的时间交给个人对枪。枪感回来了，但新战术还是没有被真正撞过。", delta: "隐藏", effect: { firepower: 2, tacticalExecution: -1 } },
      { id: "review-block", label: "加一段失败录像复盘", result: "你拿最近输掉的图做复盘。问题更清楚了，可队员的情绪也被旧伤口带低了一点。", delta: "隐藏", effect: { tacticalExecution: 1, discipline: 2, cohesion: -1 } },
    ],
  },
  {
    id: "hotel-noise",
    severity: "mild",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "酒店一夜没睡好",
    narrative: "酒店隔壁房间半夜还在吵，几名选手早上明显没睡够。没人想把锅甩给环境，但你看得出来，热身时准星有点飘。",
    passive: "这种小事最烦：它不像伤病那么明确，却会让第一张图每一波开局对位都变难。",
    options: [
      { id: "late-warmup", label: "延后热身，先恢复精神", result: "你砍掉一段赛前会议，让队员先吃饭、补觉、再热身。准备少了点，人至少没那么空。", delta: "隐藏", effect: { firepower: 1, tacticalExecution: -1, cohesion: 1 } },
      { id: "short-call", label: "缩短口径，只讲关键点", result: "你把赛前布置压到最短，只强调开局、经济局和暂停口令。睡眠不足时，越简单越能执行。", delta: "隐藏", effect: { discipline: 2, tacticalExecution: 1 } },
      { id: "normal-routine", label: "按原流程走完", result: "你担心临时改流程更乱，于是照常开会、热身、进场。纪律保住了，但疲劳也一起带进比赛。", delta: "隐藏", effect: { discipline: 1, firepower: -1, cohesion: -1 } },
    ],
  },
  {
    id: "peripheral-issue",
    severity: "mild",
    tone: "negative",
    target: "star",
    tags: ["star-pressure"],
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "外设手感不对",
    narrative: "热身时，一名首发说鼠标脚贴和桌垫摩擦感不对。不是设备坏了，但职业选手对这种细节很敏感，尤其是需要关键对枪的角色。",
    passive: "你可以让他换备用设备，也可以让他继续适应。两种选择都有代价。",
    options: [
      { id: "backup-gear", label: "立刻换备用外设", result: "你让后勤拿来备用设备，重新校准灵敏度。问题解决得更干净，但热身时间被吃掉了一截。", delta: "隐藏", effect: { firepower: 1, discipline: 1, tacticalExecution: -1, form: -1, targetGroup: "star" } },
      { id: "adapt-gear", label: "继续热身适应手感", result: "你没有临时换设备，让他用剩下的时间适应。风险还在，但至少流程没有乱。", delta: "隐藏", effect: { discipline: 2, firepower: -1, form: -1, targetGroup: "star" } },
      { id: "protect-duels", label: "减少正面硬拼", result: "你临时改了开局，让他前几回合少接高风险对枪。队伍能保护他，但其他人要补上更多压力。", delta: "隐藏", effect: { tacticalExecution: 1, cohesion: 1, firepower: -1, form: -1, targetGroup: "star" } },
    ],
  },
  {
    id: "role-meeting",
    severity: "severe",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "枪位分配有分歧",
    narrative: "复盘到一半，两名选手都觉得自己该拿更多主动权。一个想要更多主攻位资源，一个想保留残局资源。话没有吵崩，但训练室里的空气已经冷了。",
    passive: "强阵容最容易在这种地方卡住：每个人都有能力，但不是每个人都能同时拿最舒服的位置。",
    options: [
      { id: "map-by-map", label: "按地图重新分枪位", result: "你没有让任何人永久让位，而是按地图写清谁主攻、谁补枪、谁收残局。问题暂时压住了，但磨合要重新开始。", delta: "隐藏", effect: { tacticalExecution: 2, discipline: 1, cohesion: -2 } },
      { id: "star-hierarchy", label: "明确核心优先级", result: "你把核心顺位讲清楚。明星选手知道该怎么打了，但牺牲资源的人明显没那么舒服。", delta: "隐藏", effect: { firepower: 2, cohesion: -3, discipline: 1 } },
      { id: "team-first", label: "强调补枪链优先", result: "你把讨论拉回团队：先保证补枪链，再谈个人舒服。没人完全满意，但至少所有人知道输赢比数据重要。", delta: "隐藏", effect: { cohesion: 2, discipline: 2, firepower: -1 } },
    ],
  },
  {
    id: "youngster-confidence",
    severity: "mild",
    tone: "positive",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "新人突然打出来了",
    narrative: "队里的年轻选手在训练里连续打出漂亮残局。老队员开玩笑说他终于不像来参观的了，训练室气氛也因此松了一点。",
    passive: "年轻人的状态来得快，也容易掉得快。你要决定给他更多空间，还是先把他放在稳定角色里。",
    options: [
      { id: "give-space", label: "给他一张图更多主动权", result: "你决定在一张地图上给新人更多开局对位空间。风险很明显，但如果他真的打出来，队伍会多一把能破局的枪。", delta: "隐藏", effect: { firepower: 2, cohesion: 1, discipline: -1 } },
      { id: "stable-role", label: "保持原角色，别捧太高", result: "你没有立刻加资源，只夸了他的训练质量。新人没有被捧晕，队伍结构也更稳定。", delta: "隐藏", effect: { discipline: 2, cohesion: 1 } },
      { id: "mentor-pair", label: "安排老将带他复盘", result: "你让老将陪他看残局选择。年轻人的自信还在，但多了一点职业队该有的耐心。", delta: "隐藏", effect: { tacticalExecution: 1, cohesion: 2 } },
    ],
  },
  {
    id: "veteran-wrist-care",
    severity: "mild",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "老将需要保养",
    narrative: "一名老将训练后一直在揉手腕。队医说不是伤病，但高强度对枪会让他恢复变慢。你要在经验和状态之间做取舍。",
    passive: "经验丰富的老将能稳住队伍，但他的身体不会因为比赛重要就自动恢复。",
    options: [
      { id: "reduce-aim", label: "减少对枪，保留复盘", result: "你把他的对枪量降下来，让他多看 demo 和带新人跑图。火力训练少了，但经验还能留在队伍里。", delta: "隐藏", effect: { firepower: -1, tacticalExecution: 2, cohesion: 1 } },
      { id: "normal-load", label: "维持训练量", result: "你选择不改计划。老将没有抱怨，但身体疲劳会让下一杯的状态更难预测。", delta: "隐藏", effect: { discipline: 1, firepower: 1, cohesion: -1 } },
      { id: "use-sub", label: "让替补分担训练赛", result: "你让替补吃掉一部分训练赛时间。主力恢复得更好，但首发五人的连续磨合少了一点。", delta: "隐藏", effect: { firepower: 1, cohesion: -1, discipline: 1 } },
    ],
  },
  {
    id: "media-replacement-question",
    severity: "mild",
    tone: "negative",
    target: "role",
    tags: ["role-pressure"],
    placements: ["八强", "四强", "亚军"],
    title: "采访问到换人",
    narrative: "赛后采访里，记者直接问你是否考虑更换首发。这个问题很尖锐，因为队员就在后台看直播。你说什么，都会被他们听见。",
    passive: "有些话不是说给记者听的，是说给训练室里的人听的。",
    options: [
      { id: "protect-roster", label: "公开保护现有阵容", result: "你说现在的问题不是某一个人，而是全队要一起解决。队员听见了，至少知道教练没有把锅甩出去。", delta: "隐藏", effect: { cohesion: 2, discipline: 1, firepower: -1 } },
      { id: "raise-standard", label: "强调首发要靠表现争", result: "你没有点名，但把竞争说清楚：首发位置属于表现最好的人。训练室压力上来了，火力也被逼得更狠。", delta: "隐藏", effect: { firepower: 2, cohesion: -2, discipline: 1, form: -1, targetGroup: "role" } },
      { id: "avoid-answer", label: "避开换人话题", result: "你把问题带回下一杯准备，没有给媒体更多标题。风波没扩大，但队员也没从你这里得到明确答案。", delta: "隐藏", effect: { discipline: 1, cohesion: -1, form: -1, targetGroup: "role" } },
    ],
  },
  {
    id: "opponent-antistrat-package",
    severity: "severe",
    tone: "negative",
    placements: ["四强", "亚军", "冠军"],
    title: "对手开始反制你们",
    narrative: "训练赛消息传来：几支强队已经在专门练 Team gun 的默认反清。你们过去能靠习惯赢的回合，下一站可能会被提前架住。",
    passive: "被研究不是坏事，说明你们已经值得被研究。但如果不变，服务器会把答案给得很难看。",
    options: [
      { id: "new-openings", label: "重做两套开局", result: "你把最常用的两套开局拆掉重做。队伍短期会别扭，但至少不会把上一杯的答案原封不动交出去。", delta: "隐藏", effect: { tacticalExecution: 2, cohesion: -2, discipline: 1 } },
      { id: "bait-antistrat", label: "保留旧动作，关键局再变", result: "你没有完全扔掉旧默认，而是准备在关键局利用对手的反制习惯反打。这个思路很吃执行，但一旦成功会很赚。", delta: "隐藏", effect: { tacticalExecution: 3, discipline: -2 } },
      { id: "fundamentals", label: "先把补枪细节打扎实", result: "你承认被读不可避免，于是把训练重点放回补枪、道具和回防。就算被读到，也不能轻易崩盘。", delta: "隐藏", effect: { discipline: 2, cohesion: 2, firepower: -1 } },
    ],
  },
  {
    id: "crowd-hostile",
    severity: "mild",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "客场声音很大",
    narrative: "下一站对手的人气很高，场馆里大概率会是一边倒的欢呼。你的队员不是没见过线下赛，但当每次击杀都被对面观众点燃，压力会变得很具体。",
    passive: "观众不会进服务器帮他们打枪，却会让每个残局都像站在聚光灯下。",
    options: [
      { id: "embrace-noise", label: "把嘘声当成燃料", result: "你告诉队员：被嘘说明你们有威胁。有人被点燃了，也有人需要时间适应这种强度。", delta: "隐藏", effect: { firepower: 2, cohesion: -1, discipline: -1 } },
      { id: "quiet-routine", label: "固定赛前流程，少受干扰", result: "你把赛前流程固定下来：热身、短会、进场。越吵越按流程走，别跟观众比情绪。", delta: "隐藏", effect: { discipline: 3, cohesion: 1 } },
      { id: "leader-front", label: "让老将先扛住情绪", result: "你让老将在进场前多说几句，把年轻人的注意力拉回第一张图。场馆还是吵，但队伍没散。", delta: "隐藏", effect: { cohesion: 2, discipline: 1 } },
    ],
  },
  {
    id: "map-veto-trap",
    severity: "severe",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "BP 可能被设计了",
    narrative: "分析师提醒你：下个对手最近在公开比赛里故意放出一张看似薄弱的地图，但细看 demo，他们其实准备了很多新东西。那可能是陷阱。",
    passive: "地图 BP 是赛前第一场比赛。选错图不一定立刻输，但会让后面的所有选择都变窄。",
    options: [
      { id: "ban-risk", label: "直接按掉风险图", result: "你决定不赌那张图，把风险从 BP 里拿掉。代价是你们要去打另一张没那么舒服的图。", delta: "隐藏", effect: { discipline: 2, tacticalExecution: 1, firepower: -1 } },
      { id: "call-bluff", label: "敢放出来，现场验证", result: "你不想被对面牵着走，决定放出这张图现场验证。这个决定很硬，但如果判断错了，开局会很难。", delta: "隐藏", effect: { firepower: 1, tacticalExecution: 2, discipline: -2 } },
      { id: "prep-counter", label: "准备一套反套路开局", result: "你没有完全相信，也没有完全回避，而是准备一套专门反他们新东西的开局。执行难度更高，但信息最完整。", delta: "隐藏", effect: { tacticalExecution: 3, cohesion: -1 } },
    ],
  },
  {
    id: "sponsor-bonus",
    severity: "mild",
    tone: "positive",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "赞助商追加预算",
    narrative: "成绩出来以后，赞助商主动联系俱乐部，愿意追加一笔设备预算。新外设、更好的差旅条件、训练室升级——这些不会直接提升枪法，但会让队员知道有人在为他们的每一枪买单。",
    passive: "经济压力小了一点。接下来可以把更多精力放在训练上，不再为硬件和差旅分心。",
    options: [
      { id: "upgrade-gear", label: "升级训练外设", result: "你用新预算给全队换了一套统一外设。手感更一致，但适应新设备也需要时间。", delta: "隐藏", effect: { firepower: 2, discipline: 1, form: -1 } },
      { id: "travel-comfort", label: "改善差旅条件", result: "你把钱花在更好的航班和酒店上。队员休息更充分，转场不再像打仗。", delta: "隐藏", effect: { cohesion: 2, firepower: 1 } },
      { id: "bonus-pool", label: "设成绩奖金激励", result: "你把一部分预算设为下一杯的奖金池。有人因为钱打得更拼，但也有人觉得压力变大了。", delta: "隐藏", effect: { firepower: 3, cohesion: -1, form: -1, targetGroup: "star" } },
    ],
  },
  {
    id: "scrim-streak",
    severity: "mild",
    tone: "positive",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "训练赛打出信心",
    narrative: "连续几场训练赛，你们把几支实力不错的队伍按在地上打。不是对手放水，是你们的默认和补枪确实比上一杯更紧。训练室里笑声变多了，连平时话最少的人都开始主动提建议。",
    passive: "信心是打出来的，不是喊出来的。这种连胜的味道比任何鸡汤都管用。",
    options: [
      { id: "ride-momentum", label: "趁热打铁，加练新战术", result: "你利用这股信心尝试了两套新战术。队员更愿意冒险，因为现在他们有不怕失败的底气。", delta: "隐藏", effect: { tacticalExecution: 3, firepower: 2, discipline: -1 } },
      { id: "stay-grounded", label: "别飘，继续抠细节", result: "你没有因为几场训练赛就改变训练计划。好状态来之不易，现在该做的是把它磨得更稳。", delta: "隐藏", effect: { discipline: 3, cohesion: 2 } },
      { id: "momentum-rest", label: "保持轻量训练，留着正赛爆", result: "你减少了训练强度，让队员把状态留在正赛。手感还在，但身体没有被提前消耗。", delta: "隐藏", effect: { firepower: 2, cohesion: 1 } },
    ],
  },
  {
    id: "player-nominated",
    severity: "mild",
    tone: "positive",
    target: "star",
    tags: ["star-pressure"],
    placements: ["四强", "亚军", "冠军"],
    title: "明星选手被提名",
    narrative: "你的明星选手入选了本届杯赛 MVP 候选名单。这是他应得的，但你也知道，被看见意味着被研究。网络上开始有人剪他的高光集锦——也有人在剪他的失误。",
    passive: "被提名不是终点，是下一轮的放大镜。打得好被夸，打得差被嘲，聚光灯不会偏袒任何人。",
    options: [
      { id: "celebrate-quietly", label: "内部低调庆祝，专注下一杯", result: "你在训练室里恭喜了他，然后立刻拉回训练。他知道自己配得上，但也知道正赛不等人。", delta: "隐藏", effect: { discipline: 2, firepower: 1 } },
      { id: "media-round", label: "安排媒体曝光，扩大影响力", result: "你让他接了几个采访。个人品牌起来了，但训练时间也少了。", delta: "隐藏", effect: { cohesion: 2, firepower: -1, form: -1, targetGroup: "star" } },
      { id: "protect-star", label: "保护选手，压住外界声音", result: "你帮他挡掉了大部分采访请求，让他专心训练。外界关注没断，但至少没有打乱训练节奏。", delta: "隐藏", effect: { cohesion: 2, discipline: 1 } },
    ],
  },
  {
    id: "community-support",
    severity: "mild",
    tone: "positive",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "粉丝自发组织助威",
    narrative: "一群粉丝发起了线下观赛活动，俱乐部官号下收到大量鼓励私信。甚至有人画了一组选手头像做应援物料。这种支持不会加枪法，但会在逆风局让你知道有人站在你身后。",
    passive: "社媒上的声音不只是噪音，它有时候也是燃料。",
    options: [
      { id: "acknowledge-fans", label: "让队员看到这些声音", result: "你把粉丝的私信和应援图贴在训练室墙上。有人笑，有人沉默了——但不是被压垮的那种沉默。", delta: "隐藏", effect: { cohesion: 3, discipline: 1 } },
      { id: "fan-interaction", label: "安排一次线上问答回馈粉丝", result: "你花了一小时让队员跟粉丝互动。训练少了，但队伍和社区的关系更近了。", delta: "隐藏", effect: { cohesion: 2, firepower: -1 } },
      { id: "focus-training", label: "感谢但保持距离", result: "你让官号统一回复，训练室照常运作。粉丝热情没被浇灭，但也没有影响训练节奏。", delta: "隐藏", effect: { discipline: 2, cohesion: 1 } },
    ],
  },
  {
    id: "analyst-breakthrough",
    severity: "severe",
    tone: "positive",
    placements: ["四强", "亚军", "冠军"],
    title: "分析师挖出金矿",
    narrative: "分析师在连续看了四十局 demo 之后，发现了下一个对手的回防规律：他们在三号位回防时，几乎每次都先封同一颗烟再去补枪。这个习惯很隐蔽，但一旦被读出来，就是突破口。",
    passive: "有些情报是靠手挖出来的，不靠运气，靠的是比别人多看了十遍。",
    options: [
      { id: "exploit-pattern", label: "针对这个习惯设计战术", result: "你让全队围绕那个回防习惯重新设计进攻路线。训练很累，但如果执行成功，对面会被打得很不自在。", delta: "隐藏", effect: { tacticalExecution: 4, discipline: -1 } },
      { id: "share-sparingly", label: "只告诉关键选手，留作底牌", result: "你没有让全队知道——只告诉 IGL 和明星选手，让他们在关键局自己做判断。", delta: "隐藏", effect: { tacticalExecution: 2, cohesion: 1, discipline: -1 } },
      { id: "bait-pattern", label: "先按常规打，关键时刻反制", result: "你决定前半场按常规打，等待最佳时机再利用这个习惯。耐心需要多一点，但收益可能更大。", delta: "隐藏", effect: { tacticalExecution: 3, firepower: -1 } },
    ],
  },
  {
    id: "team-bonding",
    severity: "mild",
    tone: "positive",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "团建把队伍拉近了",
    narrative: "上一杯赛后，你安排了一次非正式聚餐。没人谈战术，没人提失误。老队员讲了几个当年的笑话，新人终于敢大声笑。这种放松不会加枪法，但在下一杯的逆风局里，语音会多一些信任。",
    passive: "服务器里认识的人，和餐桌上认识的人，打架方式不一样。",
    options: [
      { id: "keep-bond", label: "多搞几次非正式活动", result: "你决定在赛程允许时多安排非正式聚餐。队伍更融洽，但训练时间被分走了一点。", delta: "隐藏", effect: { cohesion: 4, firepower: -1 } },
      { id: "bond-light", label: "点到即止，重心回训练", result: "你觉得效果够了，不再额外安排。团建的价值被放大，但训练节奏没有被干扰。", delta: "隐藏", effect: { cohesion: 2, discipline: 2 } },
      { id: "trust-tactics", label: "把默契带进战术讨论", result: "团建之后你让每个人主动提一条战术建议。因为气氛放松了，有人提了一个平时不敢说的想法——还挺好用。", delta: "隐藏", effect: { tacticalExecution: 2, cohesion: 2 } },
    ],
  },
  {
    id: "game-patch",
    severity: "severe",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "版本更新打乱了战术",
    narrative: "游戏刚更新了一个小版本。几把枪的属性微调了，一张图的道具点位变了两个。正式比赛里谁先适应谁占便宜，你们的旧战术需要重新验证。",
    passive: "版本更新不等人，也不会因为你没练就推迟比赛。",
    options: [
      { id: "patch-grind", label: "全员针对性跑图", result: "你把训练重心全压在更新内容上，反复跑新道具和新枪感。准备是够了，人也累得不轻。", delta: "隐藏", effect: { tacticalExecution: 3, firepower: -1, cohesion: -1, form: -1 } },
      { id: "simple-adjust", label: "只调整核心要点", result: "你没有全盘推翻旧体系，只调整最关键的两三个细节。完整性不如推倒重来，但队伍适应更快。", delta: "隐藏", effect: { discipline: 2, tacticalExecution: 1 } },
      { id: "scout-meta", label: "先看别人怎么打", result: "你搜了其他队伍的训练赛录像，看看他们对新版本的解法。照搬不一定好，但至少不会走最明显的弯路。", delta: "隐藏", effect: { tacticalExecution: 1, cohesion: 1 } },
    ],
  },
  {
    id: "venue-adapt",
    severity: "mild",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "场馆设置不习惯",
    narrative: "适应场馆的第一天，几个选手说桌子高度不对，椅子靠背太软，屏幕距离也比习惯的远。没人觉得这是大问题，但职业选手对每一厘米的偏差都很敏感。",
    passive: "线下赛不是坐在家里打排位。场馆里的一切都要重新适应。",
    options: [
      { id: "extra-practice", label: "加练适应环境", result: "你增加了场馆练习时间。适应更快了，但也意味着赛前休息被压缩。", delta: "隐藏", effect: { firepower: 2, cohesion: -1, form: -1 } },
      { id: "bring-gear", label: "自带外设和椅子", result: "你让队员使用自己的外设甚至椅子，硬件感觉对了，但运输和设置花了不少时间。", delta: "隐藏", effect: { cohesion: 1, discipline: 1 } },
      { id: "simplify-setup", label: "只调关键设备", result: "你让每个人只调鼠标和耳机高度，其他的尽快适应。准备时间省下来了，但个别人的不适感还在。", delta: "隐藏", effect: { discipline: 2, firepower: -1, form: -1, targetGroup: "star" } },
    ],
  },
  {
    id: "language-barrier",
    severity: "mild",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "国际赛沟通障碍",
    narrative: "下一站是跨赛区比赛。主办方给的场馆说明、赛程表甚至菜单都是外语。一个队员半开玩笑地说：我只想打个 CS，怎么还要学外语。",
    passive: "语言不通不会让你输，但不懂赛程和规则出错，远比输一局更冤。",
    options: [
      { id: "hire-translator", label: "找个临时翻译", result: "你找了个当地翻译陪队。效率高了，但队伍行程里多了一个陌生人，有些人不太自在。", delta: "隐藏", effect: { cohesion: 1, discipline: 2 } },
      { id: "captain-translate", label: "让队长处理沟通", result: "你让队长负责和主办方沟通。他做得不错，但多了一份负担，训练时间也少了一点。", delta: "隐藏", effect: { cohesion: 2, firepower: -1, form: -1, targetGroup: "igl" } },
      { id: "minimal-comms", label: "压缩外部沟通，专注比赛", result: "你决定只对接必要信息，其他的忽略。效率稍低，但队伍没有被琐事分散注意力。", delta: "隐藏", effect: { discipline: 3 } },
    ],
  },
  {
    id: "schedule-crunch",
    severity: "severe",
    tone: "negative",
    placements: ["四强", "亚军", "冠军"],
    title: "杯赛安排太密集",
    narrative: "两个杯赛之间只有四天。这意味着你们几乎没有完整训练周期——复盘、调整、准备新战术全部挤在一起。有人提议取消休息日，但你看到训练室里已经有黑眼圈了。",
    passive: "赛程不等人，要么适应，要么被拖垮。",
    options: [
      { id: "focus-dry-run", label: "放弃新战术，只跑基础", result: "你放弃了所有新东西，只确保默认、补枪和道具完整性。训练简单了，但也意味着下一杯没有秘密武器。", delta: "隐藏", effect: { discipline: 3, tacticalExecution: -1 } },
      { id: "push-through", label: "咬牙吃满训练", result: "你决定按原计划训练，包括新战术。准备是够了，但身体的疲惫会在比赛里还回来。", delta: "隐藏", effect: { tacticalExecution: 2, firepower: -1, cohesion: -2, form: -1 } },
      { id: "quality-over-hours", label: "缩短训练，提高密度", result: "你把每天训练时间砍掉三分之一，但把每一段训练都压缩得更狠。时间少了，质量没掉太多，人的状态也比硬撑好。", delta: "隐藏", effect: { cohesion: 1, discipline: 2 } },
    ],
  },
  {
    id: "betting-odds",
    severity: "mild",
    tone: "negative",
    placements: ["四强", "亚军", "冠军"],
    title: "赔率开始动了",
    narrative: "有粉丝发来截图：你们的赔率在下一杯之前被大幅调低了。原因不明，可能是外界看好对手，也可能是你们上一杯的表现让人犹豫。队员没说话，但你看到有人搜了自己的赔率。",
    passive: "博彩市场不是教练，但它会影响舆论，而舆论会钻进选手的手机。",
    options: [
      { id: "block-odds", label: "禁止讨论赔率", result: "你明确要求训练室里不准谈博彩相关话题。干净是干净了，但你知道有人私下还是会看。", delta: "隐藏", effect: { discipline: 3, cohesion: -1, form: -1, targetGroup: "star" } },
      { id: "embrace-underdog", label: "利用不被看好激发斗志", result: "你告诉队员：赔率低说明没人觉得你们能赢。现在你们没有任何包袱。", delta: "隐藏", effect: { firepower: 2, cohesion: 1 } },
      { id: "ignore-all", label: "完全不管，打好自己的", result: "你什么也没说。赔率是别人的判断，比赛是你们打的。", delta: "隐藏", effect: { discipline: 1, cohesion: 1 } },
    ],
  },
  {
    id: "weather-disruption",
    severity: "mild",
    tone: "negative",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "当地天气影响",
    narrative: "比赛城市突然降温十几度，场馆里空调还没跟上。热身时有人裹着外套打，手感明显比平常僵硬。这不是什么大新闻，但在需要前期压力和细节操作的比赛中，冷手就是额外的难度。",
    passive: "职业选手应该适应任何环境，但理想和现实之间隔着十一度的温差。",
    options: [
      { id: "extend-warmup", label: "延长热身时间", result: "你提前半小时进场热身。手终于热起来了，但精力也提前消耗了一截。", delta: "隐藏", effect: { firepower: 2, cohesion: -1, form: -1 } },
      { id: "keep-warm", label: "准备保暖措施", result: "你让后勤准备暖手宝和热饮。虽然看起来有点过度准备，但队员的手确实更灵活了。", delta: "隐藏", effect: { cohesion: 1, firepower: 1 } },
      { id: "adapt-strats", label: "减少高要求对枪战术", result: "你临时调整了战术，减少需要极限对枪细节的路线。效果没被完全发挥，但至少不会因为手冷被对面钻空子。", delta: "隐藏", effect: { tacticalExecution: -1, discipline: 2 } },
    ],
  },
  {
    id: "veteran-comment",
    severity: "mild",
    tone: "negative",
    placements: ["四强", "亚军", "冠军"],
    title: "退役名将公开评价",
    narrative: "一位退役的 CS 名将在直播里公开评价了你们的体系，说你们的回防站位太保守，面对顶级队会被撕开。这个评价在网上炸了，你的队员不可能没看到。",
    passive: "前辈的一句话说轻了是指导，说重了就是压力。",
    options: [
      { id: "analyze-critique", label: "认真分析他的观点", result: "你让分析师把他的观点拆开，看哪些是真的、哪些是过度简化。队内得到了有价值的反馈，但也有人因此不自信。", delta: "隐藏", effect: { tacticalExecution: 2, cohesion: -1, form: -1, targetGroup: "role" } },
      { id: "shield-players", label: "保护队员不受干扰", result: "你禁止在训练室讨论这个评价。训练继续，但你知道有人在被窝里看了回放。", delta: "隐藏", effect: { discipline: 2, firepower: -1 } },
      { id: "prove-wrong", label: "用实力回应", result: "你把评价当成动力，告诉队员：唯一的回应方式是在回防上打得更果断。", delta: "隐藏", effect: { firepower: 3, cohesion: 1, discipline: -1 } },
    ],
  },
  {
    id: "player-milestone",
    severity: "mild",
    tone: "positive",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "选手迎来里程碑",
    narrative: "一名首发选手迎来了他职业生涯的第 200 场正式赛，或者只是他的生日。这不影响枪法，但训练室里气氛明显不一样。有人买了蛋糕，有人写了卡片放在键盘旁边。",
    passive: "职业赛场很残酷，但这种小温暖会让服务器里的压力没那么重。",
    options: [
      { id: "small-celebration", label: "简单庆祝一下", result: "你让大家暂停训练十五分钟吹蜡烛。时间不长，但笑声比上一周加起来还多。", delta: "隐藏", effect: { cohesion: 3, firepower: -1 } },
      { id: "dedicate-win", label: "把下一杯献给他", result: "你告诉全队：下一杯的第一分要为他打。这不是战术，但确实有人因此打得更拼了。", delta: "隐藏", effect: { firepower: 2, cohesion: 1 } },
      { id: "normal-day", label: "照常训练，赛后再说", result: "你让训练正常进行。赛后你会给他补庆祝，但现在服务器不等人。", delta: "隐藏", effect: { discipline: 2 } },
    ],
  },
  {
    id: "fan-art-viral",
    severity: "mild",
    tone: "positive",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "粉丝作品在网上火了",
    narrative: "一位粉丝画了一组队伍全员漫画头像，在电竞社区被转发了上万次。连对手的粉丝都在夸画得好。你的队员在群里互相发图，训练室终于有了点轻松的吵闹声。",
    passive: "被粉丝画进漫画里，是打了这么多年最值钱的回报之一。",
    options: [
      { id: "share-feature", label: "官方转发并感谢", result: "你让官号转发并致谢。粉丝开心，队员也开心——他们知道自己的努力被人看到了。", delta: "隐藏", effect: { cohesion: 2, discipline: 1 } },
      { id: "use-morale", label: "打印出来贴在训练室", result: "你把这些画打印出来贴在训练室。不是迷信，是提醒自己也提醒别人：有人相信你们的每一枪。", delta: "隐藏", effect: { cohesion: 3, firepower: 1 } },
      { id: "focus-only", label: "看过就够了，专注比赛", result: "你感谢粉丝但不让这成为话题。训练室的注意力仍然在白板上，不在漫画上。", delta: "隐藏", effect: { discipline: 2 } },
    ],
  },
  {
    id: "official-feature",
    severity: "mild",
    tone: "positive",
    placements: ["四强", "亚军", "冠军"],
    title: "赛事官方专题报道",
    narrative: "赛事官方发了一篇关于你们队伍的专题：从赛季初的不被看好到现在站上主舞台。文章很长，配了训练照和采访。有人看完以后说自己眼眶红了。",
    passive: "被官方记住，就是这段旅程已经不只是你们自己的事了。",
    options: [
      { id: "read-together", label: "全队一起看", result: "你把文章投屏给大家看。有人笑，有人沉默，但看完以后训练效率高了很多。", delta: "隐藏", effect: { cohesion: 3, discipline: 1 } },
      { id: "use-media", label: "借势多上采访", result: "你借这股热度多安排了几次采访。外界关注更多了，但训练时间也被挤掉一点。", delta: "隐藏", effect: { firepower: -1, cohesion: 2, form: -1, targetGroup: "star" } },
      { id: "silent-pride", label: "看了但不多说", result: "你私下看了，但没在训练室里多提。骄傲在心里就够了，服务器才是下一站。", delta: "隐藏", effect: { discipline: 2, cohesion: 1 } },
    ],
  },
  {
    id: "mental-coach-question",
    severity: "mild",
    tone: "neutral",
    placements: ["八强", "四强", "亚军", "冠军"],
    title: "有人建议请心理教练",
    narrative: "俱乐部建议为队伍请一名心理教练，帮助应对线下赛压力和团队沟通问题。队员反应不一：有人觉得有帮助，有人觉得多一个人在场边会更紧张。",
    passive: "电竞的心理准备越来越被重视。但请不请、怎么用，比请了更重要。",
    options: [
      { id: "hire-coach", label: "请进来试一段时间", result: "你让心理教练试带几次团体会谈。有人被触动，有人沉默，但至少队伍开始说一些平时不敢说的话。", delta: "隐藏", effect: { cohesion: 3, firepower: -1 } },
      { id: "one-on-one", label: "只给有需要的人安排个别咨询", result: "你没有要求全队参加，只让真正需要的选手单独约。效果更精准，但没有覆盖全队。", delta: "隐藏", effect: { cohesion: 1, discipline: 1 } },
      { id: "trust-veterans", label: "让老队员做心理疏导", result: "你决定不走专业路线，让老队员多和新人聊聊。方法没有专业教练系统，但更接地气。", delta: "隐藏", effect: { cohesion: 2, discipline: 1 } },
    ],
  },
  {
    id: "sub-roster-question",
    severity: "severe",
    tone: "negative",
    target: "role",
    tags: ["role-pressure"],
    placements: ["八强", "四强"],
    title: "有人建议启用替补",
    narrative: "分析师私下提醒你：一名首发最近的状态曲线在往下走，而替补在训练赛里一直打得很稳。轮换不一定是坏事，但如何在训练室里处理好这件事，比换人本身更难。",
    passive: "首发和替补之间的平衡是教练最难把握的线。",
    options: [
      { id: "rotate-map", label: "让替补打一张图", result: "你决定给替补一张地图的首发机会。首发感到压力，训练室气氛紧了一点，但替补确实打出了水平。", delta: "隐藏", effect: { firepower: 2, cohesion: -2, form: -1, targetGroup: "role" } },
      { id: "extra-scrim-minutes", label: "增加替补训练赛时间", result: "你没有直接换人，而是让替补在训练赛里多打，给首发保留压力但没有立刻调整阵容。", delta: "隐藏", effect: { discipline: 1, cohesion: 1 } },
      { id: "keep-starting-five", label: "信任首发，不换人", result: "你决定不给替补机会。首发感觉到了信任，但也有人把这当成理所当然。", delta: "隐藏", effect: { cohesion: 2, firepower: -1 } },
    ],
  },
];

const offseasonEventPool = [
  {
    id: "offseason-vacation",
    severity: "mild",
    tone: "neutral",
    title: "休赛期怎么放",
    narrative: "赛季结束了。无论成绩如何，选手们已经连续比赛了几个月。队长问你：'假怎么放？' 每个人都想休息，但所有人也知道，休太久手感会凉。",
    choice: "放一周假，第二周轻度训练",
    result: "你给了一周彻底休息，第二周只打死斗、看 demo，不上强度。手感没全凉，人也没完全回血，但训练室里的疲惫终于降了下来。",
    delta: "状态 +4 · 士气 +4 · 火力 -1 · 战术 -1 · 纪律 +1",
    effect: { firepower: -1, tacticalExecution: -1, cohesion: 1, discipline: 1 },
  },
  {
    id: "team-cooking-night",
    severity: "mild",
    tone: "positive",
    title: "做饭",
    narrative: "起因很小：有人说想吃家常菜了。老队员接了一句：'那自己做。' 晚上八点，训练基地里真的飘出了炒菜的香味。",
    choice: "让他们自己做，你在旁边看着",
    result: "菜做得不算好，盐还放重了。但五个人围在一张小桌旁吃完了。没人聊战术，聊的是家乡、第一次打线下赛、还有谁小时候最挑食。",
    delta: "团队配合 +5 · 士气 +4 · 状态 +2",
    effect: { cohesion: 5, discipline: 1 },
  },
  {
    id: "team-vacation-chemistry",
    severity: "mild",
    tone: "positive",
    title: "出去走走",
    narrative: "连续杯赛之后，训练室里的空气有点闷。新人一个人吃饭，明星选手话少了，老将训练完就走。队长找你说：'能不能带大家换个地方？'",
    choice: "去山里两天，轻训练加团建",
    result: "上午爬山，下午轻度训练，晚上烧烤。训练赛打得一般，但新人和核心聊了很久。回基地后，补枪和语音明显自然了一点。",
    delta: "团队配合 +6 · 士气 +5 · 火力 -2 · 纪律 +1",
    effect: { firepower: -2, cohesion: 6, discipline: 1 },
  },
  {
    id: "young-player-growth",
    severity: "mild",
    tone: "positive",
    title: "年轻选手加练",
    narrative: "赛季结束后，队里的年轻人没有立刻回宿舍。他一个人在训练室补预瞄，灯亮到很晚。不是为了表现给谁看，是他自己知道还差一步。",
    choice: "给他明确目标，不直接许诺首发",
    result: "你没有画大饼，只给了他三项休赛期任务：预瞄、补枪、沟通。第二天他来得更早。年轻选手最需要的不是安慰，是能追上的目标。",
    delta: "火力 +2 · 纪律 +3 · 战术执行 +1",
    effect: { firepower: 2, tacticalExecution: 1, discipline: 3 },
  },
  {
    id: "opponent-roster-chaos",
    severity: "mild",
    tone: "positive",
    title: "竞争对手换人",
    narrative: "情报组报告：一支热门队伍休赛期突然换了首发。新人火力不差，但没跟原阵容打过几场正式赛。下赛季他们可能更猛，也可能先乱一阵。",
    choice: "先准备针对他们配合生疏的位置",
    result: "分析师把他们两名新老选手之间的补枪路线剪了出来。你们不需要赌他们一定会乱，只需要在他们犹豫时先下手。",
    delta: "战术执行 +3 · 纪律 +2",
    effect: { tacticalExecution: 3, discipline: 2 },
  },
  {
    id: "coaching-staff-change",
    severity: "mild",
    tone: "positive",
    title: "教练组窗口",
    narrative: "休赛期，助理教练拿来一份新战术方案。他很紧张，因为这套东西和你们原来的默认不太一样：更快、更冒险，也更吃沟通。",
    choice: "先小范围试，不推翻原体系",
    result: "你没有让全队马上改打法，而是把新方案拆成两套关键回合调用。老体系还在，新东西也开始进入工具箱。",
    delta: "战术执行 +3 · 配合 +2 · 纪律 +1",
    effect: { tacticalExecution: 3, cohesion: 2, discipline: 1 },
  },
  {
    id: "offseason-contract-talk",
    severity: "mild",
    tone: "neutral",
    title: "续约谈判",
    narrative: "休赛期刚开始，经纪人就把续约问题摆上桌。有队员想要更明确的核心位置，也有人只关心下一场大赛到底怎么打。",
    choice: "先谈角色，再谈合同数字",
    result: "你没有直接画饼，而是把下赛季的角色、地图位置和训练目标说清楚。钱的问题还在，但至少队员知道自己为什么留下。",
    delta: "团队配合 +3 · 纪律 +2 · 火力 -1",
    effect: { firepower: -1, cohesion: 3, discipline: 2 },
  },
  {
    id: "offseason-meta-shift",
    severity: "mild",
    tone: "negative",
    title: "版本节奏变了",
    narrative: "新版本让几张地图的道具和进攻节奏都变了。过去一年的默认还能用，但已经不够锋利。分析师提醒你：如果还照旧打，开年很容易被读。",
    choice: "保留核心默认，重做两套开局",
    result: "你没有让队伍推倒重来，只把最容易被反清的两个开局重做。短期训练压力变大，但下一场大赛不会完全吃旧体系红利。",
    delta: "战术执行 +4 · 纪律 +1 · 团队配合 -1",
    effect: { tacticalExecution: 4, discipline: 1, cohesion: -1 },
  },
  {
    id: "offseason-minor-injury",
    severity: "severe",
    tone: "negative",
    target: "star",
    tags: ["star-pressure"],
    title: "小伤病",
    narrative: "一名首发手腕有点不舒服。队医说不是大伤，但如果休赛期还硬顶高强度训练，很可能把小问题拖成大问题。",
    choice: "降低对枪强度，保留战术训练",
    result: "你减少了个人对枪量，把更多时间放在 demo 和低强度跑图上。手感没那么热，但至少没有把风险带进下一场大赛。",
    delta: "火力 -2 · 战术执行 +2 · 纪律 +2",
    effect: { firepower: -2, tacticalExecution: 2, discipline: 2, form: -1, targetGroup: "star" },
  },
  {
    id: "offseason-role-conflict",
    severity: "severe",
    tone: "negative",
    title: "核心位置谈不拢",
    narrative: "休赛期复盘时，两名选手都认为自己应该拿更多主攻位资源和残局资源。话没有吵起来，但训练室里的空气变硬了：谁先要枪位，谁后手补枪，突然都变得敏感。",
    choice: "重新分配地图角色",
    result: "你没有让他们靠资历压人，而是按地图把主攻位、补枪位和残局位重新写清。问题暂时压住了，但下一场大赛如果连续输图，这根刺还会冒出来。",
    delta: "隐藏",
    effect: { firepower: -1, tacticalExecution: 1, cohesion: -3, discipline: 1 },
  },
  {
    id: "offseason-analyst-departure",
    severity: "severe",
    tone: "negative",
    title: "分析师被挖走",
    narrative: "一支强队在休赛期挖走了你们的分析师。他带不走队员，但带走了很多准备比赛的习惯：谁负责看弱图，谁剪反清，谁整理对手经济局。",
    choice: "让助教和队长临时接手",
    result: "你把工作拆给助教和队长，勉强把体系续上。队伍没有散，但下一场大赛的赛前准备一定会更粗糙。",
    delta: "隐藏",
    effect: { tacticalExecution: -3, discipline: -1, cohesion: 1 },
  },
  {
    id: "offseason-fan-backlash",
    severity: "mild",
    tone: "negative",
    target: "role",
    tags: ["role-pressure"],
    title: "粉丝开始翻旧账",
    narrative: "休赛期没有比赛，论坛开始反复翻你们输掉的几张图。有人质疑选人，有人质疑暂停，还有人把某个残局剪成短视频到处发。",
    choice: "只回应训练方向，不跟节奏吵",
    result: "你没有跟网友争输赢，只在采访里讲清下一场大赛的训练方向。外面的声音还在，但队伍至少不用每天被带着情绪走。",
    delta: "隐藏",
    effect: { discipline: 1, cohesion: -1, form: -1, targetGroup: "role" },
  },
  {
    id: "offseason-opponent-superteam",
    severity: "severe",
    tone: "negative",
    title: "对手组出银河战舰",
    narrative: "休赛期最大的新闻不是你们，而是一支竞争对手砸钱补进明星位。纸面上他们的火力已经溢出来了，下一场大赛所有队都要重新评估夺冠路线。",
    choice: "优先准备打强队的默认",
    result: "你把训练目标从“补短板”改成“打强队怎么活过前两波”。这会牺牲一些舒适训练，但下一场大赛不至于被纯火力碾过去。",
    delta: "隐藏",
    effect: { tacticalExecution: 2, firepower: -1, discipline: 1 },
  },
  {
    id: "offseason-mental-counseling",
    severity: "mild",
    tone: "positive",
    title: "心理辅导",
    narrative: "休赛期心理辅导约在基地小会议室。不是让队员喊口号，而是把红温、沉默、怕背锅这些反应拆开讲清楚。",
    choice: "安排一对一沟通",
    result: "你让心理教练逐个聊，而不是开大会点名。几个人说话没立刻变多，但训练赛里互相甩锅少了。",
    delta: "隐藏",
    effect: { cohesion: 3, discipline: 2, firepower: -1 },
  },
  {
    id: "offseason-fitness-block",
    severity: "mild",
    tone: "neutral",
    title: "体能训练",
    narrative: "队医提醒你，连续杯赛之后队员肩颈和手腕都在报警。一直加练能保手感，但身体不可能永远透支。",
    choice: "加一周体能和康复",
    result: "训练室少了几组死斗，多了拉伸、睡眠记录和康复训练。枪感没那么烫，但队员坐到电脑前时明显不再硬撑。",
    delta: "隐藏",
    effect: { firepower: -1, discipline: 3, cohesion: 1 },
  },
  {
    id: "offseason-peripheral-refresh",
    severity: "mild",
    tone: "positive",
    title: "外设更换",
    narrative: "外设赞助商送来新批次鼠标、键盘和耳机。看上去是小事，但职业选手对重量、回弹和耳机底噪都很敏感。",
    choice: "只给愿意试的人换",
    result: "你没有强行全队统一外设，只让队员在训练赛里慢慢试。有人换了鼠标，有人坚持旧设备，至少没人被商业安排打乱手感。",
    delta: "隐藏",
    effect: { firepower: 1, discipline: 2, cohesion: 1 },
  },
  {
    id: "offseason-coach-exchange",
    severity: "mild",
    tone: "positive",
    title: "教练交流",
    narrative: "一名老教练路过基地，愿意花半天和你们聊地图池、暂停节奏和年轻选手管理。东西不新，但足够扎实。",
    choice: "让教练组闭门交流",
    result: "你把队员先放去休息，只留下教练组和指挥。几套暂停后的开局被重新整理，下一场大赛至少多了几张备用牌。",
    delta: "隐藏",
    effect: { tacticalExecution: 3, discipline: 1 },
  },
  {
    id: "offseason-new-sponsor",
    severity: "mild",
    tone: "neutral",
    title: "新赞助商",
    narrative: "商务部门谈来新赞助商，对方想要更多拍摄和露出。钱能缓解预算，但拍摄日会挤掉训练时间。",
    choice: "压缩拍摄，保留预算",
    result: "你同意合作，但把拍摄压到一个下午。俱乐部多了一点现金流，队员也没有被商业安排拖散一整周。",
    delta: "隐藏",
    effect: { discipline: -1, cohesion: 1 },
  },
  {
    id: "offseason-streaming-contract",
    severity: "mild",
    tone: "negative",
    target: "star",
    tags: ["star-pressure"],
    title: "直播合约",
    narrative: "平台希望明星选手休赛期补直播时长。流量很好看，但直播到太晚会直接影响第二天训练质量。",
    choice: "限定直播时间",
    result: "你没有和平台硬顶，只把直播排到休息日前一晚。热度保住一点，训练节奏也没有彻底被打乱。",
    delta: "隐藏",
    effect: { firepower: -1, discipline: 2, cohesion: -1, form: -1, targetGroup: "star" },
  },
  {
    id: "offseason-media-training",
    severity: "mild",
    tone: "positive",
    title: "媒体应对训练",
    narrative: "采访越来越多，问题也越来越尖。有人问阵容矛盾，有人问谁该背锅，队员如果随口回答，很容易被剪成节奏。",
    choice: "做一次媒体应对训练",
    result: "你让队员练习怎么回答尖锐问题：不甩锅、不阴阳、不把内部复盘说给全网听。舆论不一定安静，但队伍少踩了几个坑。",
    delta: "隐藏",
    effect: { discipline: 3, cohesion: 1 },
  },
  {
    id: "offseason-overseas-bootcamp",
    severity: "severe",
    tone: "neutral",
    title: "海外集训",
    narrative: "欧洲训练资源更好，约训练赛更方便，但长途飞行、时差和陌生环境会消耗队员。去不去，都会有代价。",
    choice: "短期海外集训",
    result: "你把集训压成短周期，重点约强队训练赛和地图池检查。队伍见识了更快的节奏，也付出了疲劳成本。",
    delta: "隐藏",
    effect: { tacticalExecution: 4, firepower: -1, discipline: -1, form: -1 },
  },
  {
    id: "offseason-map-pool-rework",
    severity: "severe",
    tone: "negative",
    tags: ["role-pressure"],
    title: "地图池调整",
    narrative: "分析师的结论很直接：你们有一张图已经被研究透了，再硬撑只会在下一场大赛继续被点名。",
    choice: "砍掉弱图，重练新图",
    result: "你让队伍承认问题，暂停旧图训练，把资源转到新图。短期会很痛，但继续假装没事只会更痛。",
    delta: "隐藏",
    effect: { tacticalExecution: 3, firepower: -2, discipline: 1, cohesion: -1, form: -1, targetGroup: "role" },
  },
  {
    id: "offseason-scrim-leak",
    severity: "severe",
    tone: "negative",
    title: "训练赛泄漏",
    narrative: "一段训练赛 VOD 被传了出去。里面有你们新练的默认、道具顺序和几套暂停后变招。",
    choice: "重做被泄漏的开局",
    result: "你没有去网上争谁泄漏的，先把被看光的几套开局拆掉重写。队伍很烦，但至少不会带着明牌去打下一站。",
    delta: "隐藏",
    effect: { tacticalExecution: 2, discipline: 1, cohesion: -2 },
  },
  {
    id: "offseason-rookie-trial",
    severity: "mild",
    tone: "neutral",
    target: "role",
    tags: ["role-pressure"],
    title: "新人试训",
    narrative: "青训教练推荐了一名新人试训。枪法够快，沟通还嫩。试训不代表签人，但会让现有替补和拼图位感到压力。",
    choice: "给新人两天试训",
    result: "你把试训范围说清楚：不是马上换人，而是看看队伍缺口。新人打出几波好枪，老队员也开始更认真对待训练。",
    delta: "隐藏",
    effect: { firepower: 1, discipline: 1, cohesion: -1, form: -1, targetGroup: "role" },
  },
  {
    id: "offseason-veteran-retirement",
    severity: "severe",
    tone: "negative",
    tags: ["role-pressure"],
    title: "老将退役念头",
    narrative: "老将单独找你聊了一次。他没有说一定退，只说自己不知道还能不能继续适应高强度赛程。",
    choice: "谈清角色和训练量",
    result: "你没有用情怀绑人，而是把下一场大赛前的角色、休息和训练量摊开谈。老将暂时留下，但你也知道这不是永久答案。",
    delta: "隐藏",
    effect: { cohesion: 2, discipline: 2, firepower: -1, form: -1, targetGroup: "veteran" },
  },
  {
    id: "offseason-academy-promotion",
    severity: "mild",
    tone: "positive",
    title: "青训提拔",
    narrative: "青训队有个孩子最近进步很快，主队训练赛缺人时顶上来，几次补枪都很干净。",
    choice: "让他跟一队训练",
    result: "你没有急着把他推到镜头前，只让他跟一队跑图、听语音。年轻人的冲劲给训练室添了点新鲜感。",
    delta: "隐藏",
    effect: { firepower: 1, cohesion: 2, discipline: 1 },
  },
  {
    id: "offseason-fan-meet",
    severity: "mild",
    tone: "positive",
    title: "粉丝见面会",
    narrative: "俱乐部安排粉丝见面会。队员能感受到支持，但签名、合照和采访也会消耗一整天。",
    choice: "缩短流程，保留互动",
    result: "你把流程砍短，只留下合照和简短问答。队员看见了真实支持，也没有被活动拖到太晚。",
    delta: "隐藏",
    effect: { cohesion: 3, discipline: -1 },
  },
  {
    id: "offseason-charity-showmatch",
    severity: "mild",
    tone: "neutral",
    title: "慈善表演赛",
    narrative: "主办方邀请 Team gun 打一场慈善表演赛。强度不高，曝光不错，但会占用半天训练和恢复时间。",
    choice: "派三名主力参加",
    result: "你没有让全队都去，把活动变成轻松交流。队伍形象变好了，训练计划也没有被完全打碎。",
    delta: "隐藏",
    effect: { cohesion: 2, firepower: -1, discipline: 1 },
  },
  {
    id: "offseason-facility-upgrade",
    severity: "mild",
    tone: "positive",
    title: "基地升级",
    narrative: "俱乐部终于愿意升级训练基地：更好的椅子、隔音、康复区和复盘屏。钱花得不酷，但很实用。",
    choice: "优先升级训练和复盘区",
    result: "你把预算先砸到训练和复盘，不做花哨装修。队员每天坐在这里，基础条件变好会一点点反映到状态里。",
    delta: "隐藏",
    effect: { discipline: 2, cohesion: 2, tacticalExecution: 1 },
  },
  {
    id: "offseason-showmatch-invite",
    severity: "mild",
    tone: "neutral",
    title: "表演赛邀约",
    narrative: "海外平台邀请你们参加表演赛。对手强、热度高，但赛程离下一站大赛太近，去了就少两天完整训练。",
    choice: "只打一场练兵",
    result: "你把表演赛当成练兵，不暴露完整战术。队员适应了跨赛区节奏，也没有把准备时间全赔进去。",
    delta: "隐藏",
    effect: { firepower: 1, tacticalExecution: 1, discipline: -1 },
  },
  {
    id: "offseason-international-scouting",
    severity: "mild",
    tone: "positive",
    title: "国际赛区情报",
    narrative: "分析师整理了一份国际赛区情报：有队伍开始更频繁打快转点，也有队伍在经济局喜欢假冒强起。",
    choice: "做成赛前情报模板",
    result: "你让分析师把情报拆成可执行模板，而不是一份没人看的长文档。下一场大赛前，赛前准备会更像真正的教练工作。",
    delta: "隐藏",
    effect: { tacticalExecution: 3, discipline: 1 },
  },
  {
    id: "offseason-internet-issue",
    severity: "mild",
    tone: "negative",
    title: "基地网络升级",
    narrative: "基地网络施工比预期慢了一天，训练赛临时取消。队员一开始都很烦，但你知道这种空档不能浪费：没服务器，也能做复盘、沟通和体能恢复。",
    choice: "改成线下复盘和轻团建",
    result: "你把断网日拆成上午复盘、下午轻体能、晚上队内交流。训练强度降了，但几名平时不太说话的队员终于把沟通问题摆到了桌面上。",
    delta: "隐藏",
    effect: { tacticalExecution: 1, cohesion: 3, firepower: -1 },
  },
  {
    id: "offseason-fan-gifts",
    severity: "mild",
    tone: "positive",
    title: "粉丝应援礼物",
    narrative: "粉丝寄来一箱手写信、队伍贴纸和选手肖像画。东西不贵，但每个人都能看到有人真正在等 Team gun 变好。",
    choice: "让队员自己读完再回信",
    result: "你没有把它做成营业素材，而是让队员安静看完。训练室那天没有变得热血沸腾，但大家心里多了一点不能轻易摆烂的理由。",
    delta: "隐藏",
    effect: { cohesion: 3, discipline: 1 },
  },
  {
    id: "offseason-transfer-rumor",
    severity: "severe",
    tone: "negative",
    title: "核心选手被询价",
    narrative: "转会窗口刚开，就有俱乐部试探性询价你的核心选手。价格不低，但队内很快听到了风声：有人担心阵容要散，有人开始猜谁会被替代。",
    choice: "先稳住训练室，再谈市场",
    result: "你告诉队员：报价存在，但首要目标仍是下一场大赛。市场不会因为一句话消失，可至少训练室不再每天围着传闻转。",
    delta: "隐藏",
    effect: { cohesion: 2, discipline: 2, tacticalExecution: -1 },
  },
  {
    id: "offseason-personal-leave",
    severity: "mild",
    tone: "neutral",
    title: "家事请假",
    narrative: "一名选手家里临时有事，需要离开基地几天。比赛还远，但休赛期训练计划已经排好，少一个人会让跑图和补枪练习都变形。",
    choice: "批准请假，调整训练内容",
    result: "你没有让他带着心事硬坐在电脑前，而是把这几天改成 demo、个人练习和四人道具复盘。队伍少跑了一些配合，但信任被保住了。",
    delta: "隐藏",
    effect: { cohesion: 3, tacticalExecution: -1, discipline: 1 },
  },
  {
    id: "offseason-training-intensity",
    severity: "mild",
    tone: "neutral",
    title: "训练强度分歧",
    narrative: "教练组想趁休赛期加练，队医却提醒你疲劳已经堆得很高。选手也分成两派：有人怕手感凉，有人只想真正睡几天好觉。",
    choice: "分层安排训练强度",
    result: "你没有一刀切，而是按状态分组：手感差的人补对枪，疲劳重的人做恢复和低强度跑图。训练计划更复杂，但队员知道自己不是被机器一样消耗。",
    delta: "隐藏",
    effect: { firepower: 1, cohesion: 2, discipline: 1 },
  },
  {
    id: "offseason-scrim-schedule",
    severity: "mild",
    tone: "neutral",
    title: "训练赛强度不足",
    narrative: "休赛期约到的训练赛质量参差不齐。有些对手认真，有些队伍像在随便打。数据看起来不少，但真正能暴露问题的对抗并不多。",
    choice: "减少低质量约战，补封闭赛",
    result: "你砍掉几场没意义的训练赛，转而安排内部封闭赛和指定主题练习。训练量少了一点，但每一局更接近真正要解决的问题。",
    delta: "隐藏",
    effect: { tacticalExecution: 2, discipline: 2, firepower: -1 },
  },
  {
    id: "offseason-rival-practice",
    severity: "mild",
    tone: "positive",
    title: "宿敌约训练赛",
    narrative: "一支老对手私下约你们打封闭训练赛。没有镜头，没有观众，只有最直接的地图池和体系碰撞。",
    choice: "接受约战，但保留关键战术",
    result: "你让队伍认真打，但不把所有底牌交出去。对抗强度上来了，几套默认的问题也被对手逼得很清楚。",
    delta: "隐藏",
    effect: { tacticalExecution: 3, firepower: 1, discipline: -1 },
  },
  {
    id: "offseason-skill-coach",
    severity: "mild",
    tone: "positive",
    title: "专项技术教练",
    narrative: "一名退役职业选手愿意来基地做专项带练。他不讲大道理，只盯预瞄、peek 节奏、补枪距离和回防站位。",
    choice: "让他带两周专项训练",
    result: "训练不轻松，很多小毛病被当场指出。队员一开始有点不适应，但两周后，几条常见对枪路线明显更干净。",
    delta: "隐藏",
    effect: { firepower: 2, discipline: 2, cohesion: -1 },
  },
  {
    id: "offseason-doc-review",
    severity: "mild",
    tone: "positive",
    title: "赛季纪录片回顾",
    narrative: "俱乐部剪了一段内部纪录片粗剪版。里面有胜利后的拥抱，也有输图后没人说话的训练室。队员第一次从第三视角看到这一年。",
    choice: "用纪录片做一次团队复盘",
    result: "你没有把它当宣传片，而是暂停在几个关键片段上让队员说感受。有人沉默，有人笑了，但这次复盘比数据表更像一次真正的整理。",
    delta: "隐藏",
    effect: { cohesion: 3, tacticalExecution: 1, discipline: 1 },
  },
  {
    id: "offseason-sponsor-pressure",
    severity: "mild",
    tone: "neutral",
    title: "赞助商活动冲突",
    narrative: "赞助商把拍摄日排在集训中段，正好撞上你们原本准备重练地图池的时间。商务很重要，但下一场大赛不会因为广告拍得好就少输一张图。",
    choice: "把拍摄压缩到半天",
    result: "你没有拒绝合作，但把流程压得很紧。队员完成了必要露出，下午还能回到训练室把关键道具跑完。",
    delta: "隐藏",
    effect: { discipline: 1, tacticalExecution: 1, cohesion: -1, form: -1 },
  },
  {
    id: "offseason-management-change",
    severity: "severe",
    tone: "negative",
    title: "管理层换人",
    narrative: "俱乐部新运营总监上任，第一件事就是要求更多商业露出和更清楚的成绩目标。他不懂每张图的细节，但他能影响预算和日程。",
    choice: "把训练底线写进计划",
    result: "你和管理层谈清楚：商业可以配合，但关键训练日不能随便挪。关系没有立刻变亲近，不过教练组至少守住了备战时间。",
    delta: "隐藏",
    effect: { discipline: 2, tacticalExecution: 1, cohesion: -2, form: -1, targetGroup: "role" },
  },
  {
    id: "offseason-team-name-discussion",
    severity: "mild",
    tone: "neutral",
    title: "品牌升级讨论",
    narrative: "赞助商希望 Team gun 做一次品牌升级：新视觉、国际化口号、更多海外社媒内容。队员不反感，但没人希望训练室变成拍摄棚。",
    choice: "只更新视觉，不动队伍内核",
    result: "你接受新视觉方案，但把队伍故事讲回训练和比赛本身。外面的包装变了，里面那套日常训练节奏不能被换掉。",
    delta: "隐藏",
    effect: { cohesion: 1, discipline: 1 },
  },
  {
    id: "offseason-equipment-delay",
    severity: "mild",
    tone: "negative",
    title: "设备延迟到货",
    narrative: "新显示器和训练机延期到货，原本计划的设备适应周被打乱。队员嘴上说旧设备也能打，但你知道这会影响训练节奏。",
    choice: "先锁旧设备参数训练",
    result: "你要求后勤先把旧设备参数统一，等新设备到齐再集中适应。短期没有升级收益，但训练不会每天被等待物流打断。",
    delta: "隐藏",
    effect: { discipline: 2, firepower: -1 },
  },
  {
    id: "offseason-new-game-release",
    severity: "mild",
    tone: "neutral",
    title: "新游戏发售",
    narrative: "一款热门新 FPS 在休赛期发售，队员休息时间都在聊。放松没有错，但如果每天凌晨还在开黑，第二天训练质量一定会掉。",
    choice: "允许放松，设定训练日前作息",
    result: "你没有装作队员没有生活，只规定训练日前不要熬夜。大家还能玩，但不会把休息变成另一种消耗。",
    delta: "隐藏",
    effect: { cohesion: 2, discipline: 1, firepower: -1 },
  },
  {
    id: "offseason-community-meetup",
    severity: "mild",
    tone: "positive",
    title: "线下粉丝见面会",
    narrative: "本地 CS 社区组织了一场小型线下见面会。没有大舞台，只有几十个真正看比赛的人，带着队服和自己做的海报来见 Team gun。",
    choice: "安排短见面和合影",
    result: "你控制了时间，没有让活动拖成营业任务。队员见到这些人之后，训练室里那种“我们到底为谁打”的问题少了一点。",
    delta: "隐藏",
    effect: { cohesion: 3, discipline: -1 },
  },
  {
    id: "offseason-star-overexposure",
    severity: "severe",
    tone: "negative",
    target: "star",
    tags: ["star-pressure"],
    title: "明星选手被过度曝光",
    narrative: "休赛期商务和采访都点名要明星选手出镜。流量确实高，但他连续几天训练前都在拍摄和接受采访，热身时明显没有平时那种锐度。",
    choice: "砍掉一半曝光，先保训练",
    result: "你把采访和拍摄砍掉一半。商务那边不太满意，但明星选手终于能按正常节奏训练，队里也不会觉得所有资源都围着一个人转。",
    delta: "隐藏",
    effect: { firepower: -1, cohesion: 1, discipline: 1, form: -1, targetGroup: "star" },
  },
  {
    id: "offseason-role-player-anxiety",
    severity: "mild",
    tone: "negative",
    target: "role",
    tags: ["role-pressure"],
    title: "拼图位担心首发",
    narrative: "转会窗口传出几个名字以后，队里的拼图位选手训练时明显更急。他不是不努力，而是每一次失误都像在提醒自己：位置可能不稳。",
    choice: "讲清首发标准和训练目标",
    result: "你没有空口保证谁一定首发，只把下一场大赛前的标准写清楚：补枪、报点、道具和纪律。压力还在，但至少不再靠猜。",
    delta: "隐藏",
    effect: { tacticalExecution: 1, cohesion: -1, discipline: 1, form: -1, targetGroup: "role" },
  },
  {
    id: "offseason-flu-week",
    severity: "severe",
    tone: "negative",
    tags: ["role-pressure"],
    title: "流感周",
    narrative: "基地里几个人接连感冒。不是严重伤病，但训练赛里反应慢、语音短、复盘时注意力也很难集中。",
    choice: "停掉高强度训练，先恢复",
    result: "你把高强度训练停掉两天，只保留轻复盘和基础跑图。短期准备少了，但至少没有把低迷拖成更长的状态问题。",
    delta: "隐藏",
    effect: { firepower: -2, tacticalExecution: -1, discipline: 1, form: -1, formStrong: -1 },
  },
  {
    id: "offseason-bench-rumor",
    severity: "mild",
    tone: "negative",
    target: "role",
    tags: ["role-pressure"],
    title: "替补传闻发酵",
    narrative: "社区开始讨论谁该去替补席。最受影响的不是明星，而是那些数据不显眼、靠补枪和道具吃饭的人。他们越想证明自己，越容易把简单回合打复杂。",
    choice: "内部确认角色边界",
    result: "你把话说清楚：补枪手和防守者的价值不只在击杀数。队员心里稳了一点，但这类传闻不会马上消失。",
    delta: "隐藏",
    effect: { cohesion: 1, discipline: 1, firepower: -1, form: -1, targetGroup: "role" },
  },
  {
    id: "offseason-map-pool-shift",
    severity: "severe",
    tone: "neutral",
    title: "地图池要换了",
    narrative: "赛事方确认下一场大赛会调整地图池。你们练得最熟的一张图还在，但另一张常用图被替换，过去的舒适区少了一块。",
    choice: "提前重排地图优先级",
    result: "你让队伍先接受现实：少抱怨，多跑新图。头几天错误很多，但至少下一场大赛不会第一次在正赛里找答案。",
    delta: "隐藏",
    effect: { tacticalExecution: 3, firepower: -1, cohesion: -1 },
  },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function softCapTeamModifier(value = 0) {
  const sign = value < 0 ? -1 : 1;
  const absolute = Math.abs(Number(value) || 0);
  if (absolute <= 4) return value;
  if (absolute <= 12) return sign * Math.round(4 + (absolute - 4) * 0.45);
  return sign * Math.round(8 + Math.sqrt(absolute - 12) * 0.9);
}

function softCapTeamStat(value, ceiling = 94) {
  if (value <= ceiling) return Math.round(value);
  return Math.round(ceiling + (value - ceiling) * 0.14);
}

function rotateArray(values, steps) {
  const offset = ((steps % values.length) + values.length) % values.length;
  return values.slice(offset).concat(values.slice(0, offset));
}

function createEventHistory(history = {}) {
  return {
    betweenCup: [...(history.betweenCup ?? [])],
    offseason: [...(history.offseason ?? [])],
    match: [...(history.match ?? [])],
  };
}

function appendEventHistory(history, lane, eventId, limit = 99) {
  const next = createEventHistory(history);
  next[lane] = [...(next[lane] ?? []), eventId].slice(-limit);
  return next;
}

function recentEventCount(history, lane, eventId, windowSize = 9) {
  return (history?.[lane] ?? []).slice(-windowSize).filter((id) => id === eventId).length;
}

function pickFreshEvent(pool, seed, history, lane) {
  if (!pool.length) return undefined;
  const recent = history?.[lane] ?? [];
  const rotated = rotateArray(pool, seed);
  const neverUsed = rotated.find((event) => !recent.includes(event.id));
  if (neverUsed) return neverUsed;
  const fresh = rotated.find((event) => !recent.slice(-6).includes(event.id));
  if (fresh) return fresh;
  const underLimit = rotated.find((event) => recentEventCount(history, lane, event.id, 12) < 3);
  return underLimit ?? rotated[0];
}

function createTextHistory(history = {}) {
  return {
    cup: [...(history.cup ?? [])],
    annual: [...(history.annual ?? [])],
    chronicle: [...(history.chronicle ?? [])],
    match: [...(history.match ?? [])],
  };
}

function appendTextHistory(history, lane, textId, limit = 99) {
  const next = createTextHistory(history);
  next[lane] = [...(next[lane] ?? []), textId].slice(-limit);
  return next;
}

function pickFreshText(pool, seed, history, lane) {
  if (!pool.length) return undefined;
  const used = history?.[lane] ?? [];
  const rotated = rotateArray(pool, seed);
  return rotated.find((entry) => !used.includes(entry.id)) ?? rotated[0];
}

function templateId(prefix, template) {
  let hash = 0;
  for (let index = 0; index < template.length; index += 1) {
    hash = ((hash << 5) - hash + template.charCodeAt(index)) | 0;
  }
  return `${prefix}:${Math.abs(hash)}`;
}

function pickFreshTemplate(pool, seed, history, lane, localUsed, prefix) {
  if (!pool.length) return undefined;
  const rotated = rotateArray(pool, seed);
  const careerUsed = new Set(history?.[lane] ?? []);
  const neverUsed = rotated.find((template) => !localUsed.has(templateId(prefix, template)) && !careerUsed.has(templateId(prefix, template)));
  const localFresh = rotated.find((template) => !localUsed.has(templateId(prefix, template)));
  const picked = neverUsed ?? localFresh ?? rotated[0];
  const id = templateId(prefix, picked);
  localUsed.add(id);
  return { template: picked, id };
}

function createRng(seed) {
  let current = seed >>> 0;
  return {
    next() {
      current = (current * 1664525 + 1013904223) >>> 0;
      return current / 4294967296;
    },
    int(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    pick(list) {
      return list[this.int(0, list.length - 1)];
    },
  };
}

function seededNoise(seed, min, max) {
  return createRng(seed).int(min, max);
}

function lineupKeyFromRoster(roster, substituteId) {
  return activeRoster(roster, substituteId)
    .map((player) => player.id)
    .sort()
    .join("|");
}

function continuityBonusForMatches(matchCount) {
  return clamp(Math.floor(matchCount / 3), 0, 3);
}

function seasonDifficultyAdjustment(campaign, continuityBonus = 0) {
  const seasonIndex = campaign?.seasonIndex ?? 1;
  const cupIndex = campaign?.cupIndex ?? 0;
  const budget = campaign?.budget ?? 0;
  const trophies = campaign?.trophies ?? 0;
  const earlyFinals = (campaign?.cupRecords ?? [])
    .filter((record) => record.seasonIndex <= 2 && (record.placement === "冠军" || record.placement === "亚军"))
    .length;
  const newTeamPenalty = seasonIndex === 1
    ? -15 + Math.min(1, cupIndex)
    : seasonIndex === 2
      ? -10 + Math.min(2, cupIndex)
      : -2 + Math.min(2, cupIndex);
  const continuityRelief = seasonIndex >= 3 ? Math.min(8, continuityBonus * 3) : Math.min(3, continuityBonus);
  const economyRelief = seasonIndex >= 3 ? Math.min(4, Math.floor(budget / 24)) : Math.min(1, Math.floor(budget / 45));
  const championTargetPenalty = trophies > 0 ? -Math.min(11, trophies * 4 + earlyFinals * 2) : 0;
  const earlyWealthDrag = seasonIndex <= 2 && budget >= 18 ? -Math.min(6, Math.floor((budget - 12) / 8)) : 0;
  return clamp(newTeamPenalty + continuityRelief + economyRelief + championTargetPenalty + earlyWealthDrag, -18, 8);
}

function economyTierFromBank(bank, previousOutcome = "loss") {
  if (previousOutcome === "win" && bank >= 54) return "bonus";
  if (bank >= 58) return "full_buy";
  if (bank >= 40) return "force_buy";
  if (bank >= 28) return "half_buy";
  return "eco";
}

function createEconomyState(bank = 74, previousOutcome = "loss") {
  return {
    bank,
    lossStreak: 0,
    winStreak: previousOutcome === "win" ? 1 : 0,
    previousOutcome,
    tier: economyTierFromBank(bank, previousOutcome),
  };
}

function settleEconomyRound(state, buyTier, outcome) {
  const spend = ECONOMY_COST[buyTier] ?? ECONOMY_COST.full_buy;
  const nextLossStreak = outcome === "loss" ? state.lossStreak + 1 : 0;
  const nextWinStreak = outcome === "win" ? (state.winStreak ?? 0) + 1 : 0;
  const carriedWinBuffer = outcome === "loss" && (state.winStreak ?? 0) >= 2 ? 24 : 0;
  const reward = outcome === "win"
    ? WIN_REWARD[buyTier] ?? WIN_REWARD.full_buy
    : LOSS_REWARD[Math.min(nextLossStreak - 1, LOSS_REWARD.length - 1)] + carriedWinBuffer;
  const bank = clamp(state.bank - spend + reward, 0, 100);
  return {
    bank,
    lossStreak: nextLossStreak,
    winStreak: nextWinStreak,
    previousOutcome: outcome,
    tier: economyTierFromBank(bank, outcome),
  };
}

function describeEconomyPath({ openingBuy = "full_buy", outcomes = [], startingBank = 74 }) {
  const path = [{ round: 1, bank: startingBank, tier: openingBuy }];
  let state = createEconomyState(startingBank, "loss");
  let currentBuy = openingBuy;
  outcomes.forEach((outcome, index) => {
    state = settleEconomyRound(state, currentBuy, outcome);
    if (index < outcomes.length - 1) {
      currentBuy = state.tier;
      path.push({ round: index + 2, bank: state.bank, tier: currentBuy });
    }
  });
  return path;
}

function summarizeReadPressure(recentOpenings = []) {
  if (recentOpenings.length < 2) return { label: "fresh", penalty: 0, hint: "对手还没完全摸清你的开局。", repeated: undefined };
  const repeated = recentOpenings.at(-1);
  const tail = [...recentOpenings].reverse();
  const streak = tail.findIndex((entry) => entry !== repeated);
  const repeatCount = streak === -1 ? recentOpenings.length : streak;
  if (repeatCount >= 3) {
    return { label: "read", penalty: -6, hint: `对手已经在等你的${OPENING_TACTICS[repeated]?.label ?? "同类开局"}。`, repeated };
  }
  return { label: "warming", penalty: -3, hint: `你的${OPENING_TACTICS[repeated]?.label ?? "开局"}开始被重点照顾。`, repeated };
}

function buildOpeningHistory(campaign) {
  return campaign?.strategyMemory?.recentOpenings ?? [];
}

function currentContinuityBonus(state, campaign) {
  const roster = selectedPlayers(state);
  const lineupKey = lineupKeyFromRoster(roster, state.substitute ?? state.selected[5]);
  return continuityBonusForMatches(campaign?.lineupMatches?.[lineupKey] ?? 0);
}

function frictionPenalty(value = 0) {
  return clamp(Math.round(Number(value) || 0), 0, 6);
}

function addRosterFriction(current = 0, amount = 0) {
  return clamp(frictionPenalty(current) + Math.round(amount), 0, 6);
}

function recoverRosterFriction(current = 0, amount = 1) {
  return clamp(frictionPenalty(current) - Math.round(amount), 0, 6);
}

function mapEventEffect(effect = {}) {
  return {
    firepower: effect.firepower ?? 0,
    tacticalExecution: effect.tacticalExecution ?? effect.tactics ?? 0,
    cohesion: effect.cohesion ?? 0,
    discipline: effect.discipline ?? 0,
  };
}

function applyTeamEffect(base, effect = {}) {
  return {
    firepower: base.firepower + (effect.firepower ?? 0),
    tacticalExecution: base.tacticalExecution + (effect.tacticalExecution ?? effect.tactics ?? 0),
    cohesion: base.cohesion + (effect.cohesion ?? 0),
    discipline: base.discipline + (effect.discipline ?? 0),
  };
}

function fillTemplate(template, variables) {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => variables[key] ?? `{${key}}`);
}

function playerById(id) {
  const player = players.find((entry) => entry.id === id);
  if (!player) throw new Error(`Unknown player: ${id}`);
  return player;
}

function personalityLabel(player = {}) {
  const traits = player.traits ?? [];
  if (player.id === "donk") return "魔王降世";
  if (player.id === "monesy") return "青春风暴";
  if (player.id === "sh1ro") return "冷面终结者";
  if (player.firepower >= 90 && traits.includes("hot_blooded")) return "刀尖魔王";
  if (player.id === "simple-fz" || (player.clutch >= 88 && traits.includes("streaky_star"))) return "刀尖舞者";
  if (traits.includes("system_leader")) return player.tactics >= 88 ? "团队大脑" : "战术舵手";
  if (traits.includes("calm_clutcher")) return player.clutch >= 86 ? "冷面终结者" : "残局冷手";
  if (traits.includes("disciplined")) return player.discipline >= 82 ? "沉稳老将" : "团队拼图";
  if (traits.includes("crowd_favorite")) return "大场面先生";
  if (traits.includes("hot_blooded")) return "前压火种";
  if (traits.includes("streaky_star")) return "爆点奇兵";
  if (player.personality >= 78) return "队伍黏合剂";
  return "团队拼图";
}

function formLabel(score = 0) {
  if (score >= 1) return "亢奋";
  if (score <= -1) return "低迷";
  return "平稳";
}

function formClass(score = 0) {
  if (score >= 1) return "hot";
  if (score <= -1) return "slump";
  return "steady";
}

function normalizePlayerForm(form = {}) {
  return Object.fromEntries(players.map((player) => [player.id, clamp(Number(form[player.id] ?? 0), -2, 2)]));
}

function activeFormScore(player, playerForm = {}) {
  return clamp(Number(playerForm?.[player.id] ?? 0), -2, 2);
}

function formEffectForRoster(active, playerForm = {}) {
  if (!active.length) return { firepower: 0, tacticalExecution: 0, cohesion: 0, discipline: 0, edge: 0 };
  const total = active.reduce((sum, player) => sum + activeFormScore(player, playerForm), 0);
  const lowCount = active.filter((player) => activeFormScore(player, playerForm) <= -1).length;
  const hotCount = active.filter((player) => activeFormScore(player, playerForm) >= 1).length;
  return {
    firepower: Math.round(total * 1.3),
    tacticalExecution: Math.round(total * 0.5),
    cohesion: Math.round((hotCount - lowCount) * 0.8),
    discipline: Math.round(total * 0.6) - lowCount,
    edge: total * 1.2 - lowCount,
  };
}

function formAdjustedDelta(playerStats, delta = {}) {
  const adjusted = {};
  for (const [playerId, statDelta] of Object.entries(delta)) {
    const formScore = playerStats[playerId]?.formScore ?? 0;
    const next = { ...statDelta };
    if (formScore >= 1) {
      next.impact = (next.impact ?? 0) + formScore;
      if ((next.kills ?? 0) > 0 && formScore >= 2) next.assists = (next.assists ?? 0) + 1;
    }
    if (formScore <= -1) {
      next.impact = (next.impact ?? 0) - Math.abs(formScore);
      if ((next.deaths ?? 0) === 0 && (next.kills ?? 0) === 0) next.deaths = Math.abs(formScore) >= 2 ? 1 : 0;
    }
    adjusted[playerId] = next;
  }
  return adjusted;
}

function applyCoachFormChoice(active, playerForm = {}, scoutingChoice) {
  const next = { ...normalizePlayerForm(playerForm) };
  const delta = scoutingChoice === "drill" ? 1 : scoutingChoice === "confidence" ? 0 : -1;
  for (const player of active) {
    const personalityTilt = player.traits.includes("hot_blooded") && scoutingChoice === "drill" ? 1 : 0;
    const calmBuffer = player.traits.includes("calm_clutcher") && scoutingChoice === "hide-looks" ? 1 : 0;
    next[player.id] = clamp((next[player.id] ?? 0) + delta + personalityTilt + calmBuffer, -2, 2);
  }
  return next;
}

function pickFormTargets(selectedIds = [], effect = {}, seed = 0) {
  const uniqueIds = [...new Set(selectedIds)].filter(Boolean);
  if (!uniqueIds.length) return [];
  const explicitTargets = [effect.targetId, effect.playerId, ...(effect.targetIds ?? [])].filter((id) => uniqueIds.includes(id));
  if (explicitTargets.length) return [...new Set(explicitTargets)];
  const groupPool = uniqueIds.filter((id) => {
    const player = players.find((entry) => entry.id === id);
    if (!player) return false;
    if (effect.targetGroup === "star") return player.price >= 21 || player.firepower >= 84 || player.traits.includes("streaky_star");
    if (effect.targetGroup === "role") return player.price <= 15 || ["support", "anchor", "igl"].includes(player.role);
    if (effect.targetGroup === "veteran") return player.traits.includes("disciplined") || player.traits.includes("system_leader");
    if (effect.targetGroup === "young") return player.price <= 15 || player.traits.includes("hot_blooded");
    return true;
  });
  const candidateIds = groupPool.length ? groupPool : uniqueIds;
  const mood = (effect.firepower ?? 0) + (effect.cohesion ?? 0) + (effect.discipline ?? 0) + (effect.tacticalExecution ?? 0) + (effect.form ?? 0);
  const severe = effect.formStrong || Math.abs(effect.form ?? 0) >= 2 || Math.abs(mood) >= 10;
  const targetCount = severe ? Math.min(candidateIds.length, 4) : Math.min(candidateIds.length, Math.abs(mood) >= 6 ? 2 : 1);
  const rng = createRng(seed + candidateIds.join("").length * 17 + Math.round(Math.abs(mood) * 11));
  const pool = [...candidateIds];
  const targets = [];
  while (targets.length < targetCount && pool.length) {
    const index = rng.int(0, pool.length - 1);
    targets.push(pool.splice(index, 1)[0]);
  }
  return targets;
}

function applyEventFormEffect(playerForm = {}, selectedIds = [], effect = {}, seed = 0) {
  const next = { ...normalizePlayerForm(playerForm) };
  const explicitForm = Number(effect.form ?? 0);
  const mood = (effect.firepower ?? 0) + (effect.cohesion ?? 0) + (effect.discipline ?? 0) + (effect.tacticalExecution ?? 0);
  const delta = explicitForm
    ? clamp(explicitForm, -2, 2)
    : mood >= 3 ? 1 : mood <= -3 ? -1 : 0;
  if (!delta) return next;
  for (const id of pickFormTargets(selectedIds, effect, seed)) next[id] = clamp((next[id] ?? 0) + delta, -2, 2);
  return next;
}

function updatePlayerFormAfterMatch(campaign, state) {
  const next = { ...normalizePlayerForm(campaign.playerForm) };
  const roster = selectedPlayers(state);
  const activeIds = activeRoster(roster, state.substitute).map((player) => player.id);
  const lineupKey = lineupKeyFromRoster(roster, state.substitute);
  const continuity = continuityBonusForMatches(campaign.lineupMatches?.[lineupKey] ?? 0);
  for (const id of activeIds) {
    const row = state.match.playerStats[id];
    const impactDelta = row?.impact >= 8 ? 1 : row?.impact <= -1 || (row?.deaths ?? 0) >= 2 ? -1 : 0;
    const continuityDelta = continuity >= 4 && row?.impact >= 4 ? 1 : 0;
    next[id] = clamp((next[id] ?? 0) + impactDelta + continuityDelta, -2, 2);
  }
  for (const id of Object.keys(next)) {
    if (!activeIds.includes(id)) next[id] = clamp(next[id] + (next[id] > 0 ? -1 : next[id] < 0 ? 1 : 0), -2, 2);
  }
  return next;
}

function rosterPrice(ids) {
  return ids.reduce((sum, id) => sum + playerById(id).price, 0);
}

function marketPrice(player, campaign = {}) {
  if (!player) return 0;
  const highlightCount = (campaign.highlightLog ?? [])
    .filter((entry) => entry.playerId === player.id || entry.playerName === player.name)
    .length;
  const bump = Math.min(6, highlightCount * (player.price >= 21 ? 3 : 2));
  return player.price + bump;
}

function marketPriceNote(player, campaign = {}) {
  const market = marketPrice(player, campaign);
  if (market <= player.price) return `身价 $${player.price}`;
  return `身价 $${market} · 高光溢价 +$${market - player.price}`;
}

function selectedPlayers(state) {
  return state.selected.map(playerById);
}

function createEmptyMatch() {
  return {
    opponent: "",
    roundLabel: "",
    cupName: "",
    eventIndex: 0,
    score: [0, 0],
    timeoutUsed: false,
    scoutingChoice: "",
    cards: [],
    resolved: [],
    playerStats: {},
    opponentStats: {},
    prematchNarrative: undefined,
    opponentTeam: undefined,
    playerEconomy: createEconomyState(),
    opponentEconomy: createEconomyState(),
    readPressure: summarizeReadPressure(),
    hidden: {
      seed: 0,
      pistolChoice: undefined,
      continuityBonus: 0,
      baseEdge: 0,
      openingChoice: undefined,
      tacticChoice: undefined,
      tacticEdge: 0,
      timeoutBonus: 0,
      eventSwing: 0,
      opponentPlan: undefined,
    },
  };
}

function createEmptyHub() {
  return {
    events: [],
    eventIndex: 0,
    event: undefined,
    choice: undefined,
    resolvedEvents: [],
    allEventsResolved: false,
    passive: "",
    result: "",
    delta: "",
    tradeOffers: [],
    tradeAttemptUsed: false,
    tradeResult: undefined,
    tradeSelection: {
      outgoingId: undefined,
      targetId: undefined,
      outgoingRoleFilter: "all",
      targetRoleFilter: "all",
    },
  };
}

function createInitialState() {
  return {
    screen: "draft",
    selected: [],
    substitute: undefined,
    draftRoleFilter: "all",
    error: "",
    result: undefined,
    annualSummary: undefined,
    chronicle: undefined,
    campaign: undefined,
    hub: createEmptyHub(),
    match: createEmptyMatch(),
  };
}

function activeRoster(roster, substituteId) {
  const benchId = substituteId ?? roster[5]?.id;
  return roster.filter((player) => player.id !== benchId).slice(0, 5);
}

function createPlayerStats(roster) {
  return Object.fromEntries(roster.map((player) => [player.id, {
    id: player.id,
    name: player.name,
    formScore: 0,
    formLabel: "平稳",
    kills: 0,
    deaths: 0,
    assists: 0,
    impact: 0,
  }]));
}

function createNamedStats(names, roleFallback = "对手位") {
  return Object.fromEntries(names.map((name, index) => [name, {
    id: `opponent-${index}-${name}`,
    name,
    role: roleFallback,
    kills: 0,
    deaths: 0,
    assists: 0,
    impact: 0,
  }]));
}

function applyPlayerDelta(playerStats, delta = {}) {
  const next = Object.fromEntries(Object.entries(playerStats).map(([id, entry]) => [id, { ...entry }]));
  for (const [playerId, statDelta] of Object.entries(delta)) {
    if (!next[playerId]) continue;
    next[playerId].kills += statDelta.kills ?? 0;
    next[playerId].deaths += statDelta.deaths ?? 0;
    next[playerId].assists += statDelta.assists ?? 0;
    next[playerId].impact += statDelta.impact ?? 0;
  }
  return next;
}

function mergePlayerDeltaEntries(entries) {
  return entries.reduce((merged, [playerId, statDelta]) => {
    if (!playerId) return merged;
    const current = merged[playerId] ?? { kills: 0, deaths: 0, assists: 0, impact: 0 };
    merged[playerId] = {
      kills: current.kills + (statDelta.kills ?? 0),
      deaths: current.deaths + (statDelta.deaths ?? 0),
      assists: current.assists + (statDelta.assists ?? 0),
      impact: current.impact + (statDelta.impact ?? 0),
    };
    return merged;
  }, {});
}

function latestFallenIds(match) {
  const lastResolved = match.resolved.at(-1);
  if (!lastResolved?.playerDelta) return new Set();
  if (Array.isArray(lastResolved.score) && (lastResolved.score[0] !== 0 || lastResolved.score[1] !== 0)) {
    return new Set();
  }
  return new Set(
    Object.entries(lastResolved.playerDelta)
      .filter(([, statDelta]) => (statDelta.deaths ?? 0) > 0)
      .map(([playerId]) => playerId),
  );
}

function latestOpponentFallen(match) {
  const lastResolved = match.resolved.at(-1);
  if (!lastResolved?.opponentDelta) return new Set();
  if (Array.isArray(lastResolved.score) && (lastResolved.score[0] !== 0 || lastResolved.score[1] !== 0)) {
    return new Set();
  }
  return new Set(
    Object.entries(lastResolved.opponentDelta)
      .filter(([, statDelta]) => (statDelta.deaths ?? 0) > 0)
      .map(([playerName]) => playerName),
  );
}

function applyNamedDelta(playerStats, delta = {}) {
  const next = Object.fromEntries(Object.entries(playerStats).map(([id, entry]) => [id, { ...entry }]));
  for (const [name, statDelta] of Object.entries(delta)) {
    if (!next[name]) continue;
    next[name].kills += statDelta.kills ?? 0;
    next[name].deaths += statDelta.deaths ?? 0;
    next[name].assists += statDelta.assists ?? 0;
    next[name].impact += statDelta.impact ?? 0;
  }
  return next;
}

function mergeNamedDeltaEntries(entries) {
  return entries.reduce((merged, [name, statDelta]) => {
    if (!name) return merged;
    const current = merged[name] ?? { kills: 0, deaths: 0, assists: 0, impact: 0 };
    merged[name] = {
      kills: current.kills + (statDelta.kills ?? 0),
      deaths: current.deaths + (statDelta.deaths ?? 0),
      assists: current.assists + (statDelta.assists ?? 0),
      impact: current.impact + (statDelta.impact ?? 0),
    };
    return merged;
  }, {});
}

function deathsBySideForMap(resolvedEvents, mapIndex, deltaKey) {
  const deaths = new Set();
  for (const event of resolvedEvents ?? []) {
    if (event.mapIndex !== mapIndex) continue;
    for (const [id, statDelta] of Object.entries(event[deltaKey] ?? {})) {
      if ((statDelta.deaths ?? 0) > 0) deaths.add(id);
    }
  }
  return deaths;
}

function enforceSingleDeathPerMap(delta = {}, alreadyDead = new Set(), rosterEntries = [], keyForEntry = (entry) => entry.id) {
  const next = Object.fromEntries(Object.entries(delta).map(([id, statDelta]) => [id, { ...statDelta }]));
  const dead = new Set(alreadyDead);
  let overflowDeaths = 0;

  for (const [id, statDelta] of Object.entries(next)) {
    const deaths = statDelta.deaths ?? 0;
    if (deaths <= 0) continue;
    if (dead.has(id)) {
      overflowDeaths += deaths;
      next[id] = { ...statDelta, deaths: 0 };
      continue;
    }
    if (deaths > 1) {
      overflowDeaths += deaths - 1;
      next[id] = { ...statDelta, deaths: 1 };
    }
    dead.add(id);
  }

  for (const entry of rosterEntries) {
    if (overflowDeaths <= 0) break;
    const id = keyForEntry(entry);
    if (!id || dead.has(id)) continue;
    const current = next[id] ?? {};
    next[id] = { ...current, deaths: 1 };
    dead.add(id);
    overflowDeaths -= 1;
  }

  return next;
}

function normalizeRoundDeathDeltas(match, resolved) {
  const mapIndex = resolved.mapIndex;
  if (typeof mapIndex !== "number") return resolved;
  return {
    ...resolved,
    playerDelta: enforceSingleDeathPerMap(
      resolved.playerDelta,
      deathsBySideForMap(match.resolved, mapIndex, "playerDelta"),
      Object.values(match.playerStats),
      (entry) => entry.id,
    ),
    opponentDelta: enforceSingleDeathPerMap(
      resolved.opponentDelta,
      deathsBySideForMap(match.resolved, mapIndex, "opponentDelta"),
      Object.values(match.opponentStats),
      (entry) => entry.name,
    ),
  };
}

function enrichExchangeDeltas(match, resolved) {
  const playerDelta = { ...(resolved.playerDelta ?? {}) };
  const opponentDelta = { ...(resolved.opponentDelta ?? {}) };
  const playerKillGap = Object.values(opponentDelta).reduce((sum, entry) => sum + (entry.deaths ?? 0), 0)
    - Object.values(playerDelta).reduce((sum, entry) => sum + (entry.kills ?? 0), 0);
  const opponentKillGap = Object.values(playerDelta).reduce((sum, entry) => sum + (entry.deaths ?? 0), 0)
    - Object.values(opponentDelta).reduce((sum, entry) => sum + (entry.kills ?? 0), 0);

  if (playerKillGap > 0) {
    const livingPlayers = Object.values(match.playerStats)
      .filter((entry) => (playerDelta[entry.id]?.deaths ?? 0) === 0)
      .sort((left, right) => right.impact - left.impact);
    for (let index = 0; index < playerKillGap; index += 1) {
      const target = livingPlayers[index % Math.max(1, livingPlayers.length)] ?? Object.values(match.playerStats)[index % Object.values(match.playerStats).length];
      if (!target) break;
      const current = playerDelta[target.id] ?? { kills: 0, deaths: 0, assists: 0, impact: 0 };
      playerDelta[target.id] = { ...current, kills: (current.kills ?? 0) + 1, impact: (current.impact ?? 0) + 2 };
    }
  }

  if (opponentKillGap > 0) {
    const livingOpponents = Object.values(match.opponentStats)
      .filter((entry) => (opponentDelta[entry.name]?.deaths ?? 0) === 0)
      .sort((left, right) => right.impact - left.impact);
    for (let index = 0; index < opponentKillGap; index += 1) {
      const target = livingOpponents[index % Math.max(1, livingOpponents.length)] ?? Object.values(match.opponentStats)[index % Object.values(match.opponentStats).length];
      if (!target) break;
      const current = opponentDelta[target.name] ?? { kills: 0, deaths: 0, assists: 0, impact: 0 };
      opponentDelta[target.name] = { ...current, kills: (current.kills ?? 0) + 1, impact: (current.impact ?? 0) + 2 };
    }
  }

  return { ...resolved, playerDelta, opponentDelta };
}

const bondRules = [
  {
    ids: ["donk", "magixx"],
    note: "donk + magixx 好友羁绊",
    effect: { cohesion: 7, discipline: 3, tacticalExecution: 2 },
  },
  {
    ids: ["donk", "chopper"],
    note: "Spirit 指挥托底",
    effect: { cohesion: 5, discipline: 4, tacticalExecution: 4 },
  },
  {
    ids: ["donk", "sh1ro"],
    note: "Spirit 核心羁绊",
    effect: { cohesion: 5, tacticalExecution: 2, discipline: 2 },
  },
  {
    ids: ["niko", "monesy"],
    note: "NiKo + m0NESY 父子羁绊",
    effect: { cohesion: 6, firepower: 2, tacticalExecution: 1 },
  },
  {
    ids: ["karrigan", "rain"],
    note: "FaZe 老将体系",
    effect: { cohesion: 6, discipline: 4, tacticalExecution: 3 },
  },
  {
    ids: ["karrigan", "broky"],
    note: "karrigan 经验托底",
    effect: { cohesion: 4, discipline: 3, tacticalExecution: 3 },
  },
  {
    ids: ["karrigan", "frozen"],
    note: "FaZe 体系适配",
    effect: { cohesion: 4, discipline: 2, tacticalExecution: 2 },
  },
  {
    ids: ["twistzz", "karrigan"],
    note: "FaZe 冠军记忆",
    effect: { cohesion: 4, discipline: 3, tacticalExecution: 2 },
  },
  {
    ids: ["aleksib", "b1t"],
    note: "NaVi 默认架枪默契",
    effect: { cohesion: 4, discipline: 3, tacticalExecution: 3 },
  },
  {
    ids: ["fallen", "kscerato"],
    note: "FURIA 老将保护核心",
    effect: { cohesion: 5, discipline: 3, tacticalExecution: 2 },
  },
  {
    ids: ["apex", "zywoo"],
    note: "Vitality 指挥核心",
    effect: { cohesion: 5, tacticalExecution: 4, discipline: 1 },
  },
];

const youngPlayerIds = new Set([
  "donk",
  "monesy",
  "jimpphat",
  "jcobbb",
  "makazze",
  "moseyuh",
  "molodoy",
  "zont1x",
  "senzu",
  "xertion",
]);

const veteranPlayerIds = new Set([
  "karrigan",
  "rain",
  "fallen",
  "device",
  "olofmeister-fz",
  "dupreeh-f",
  "apex",
  "aleksib",
  "captainmo",
  "somebody",
  "advent",
]);

function leaderScore(player) {
  if (!player?.traits?.includes("system_leader")) return 0;
  const roleBonus = player.role === "igl" ? 2 : 0;
  return Math.round(player.tactics * 0.65 + player.discipline * 0.35 + roleBonus);
}

function bestOnFieldLeader(active) {
  return [...active]
    .filter((player) => player.traits.includes("system_leader"))
    .sort((left, right) => leaderScore(right) - leaderScore(left))[0];
}

function isYoungPlayer(player) {
  return youngPlayerIds.has(player.id);
}

function isVeteranPlayer(player) {
  return veteranPlayerIds.has(player.id)
    || (player.traits.includes("system_leader") && player.tactics >= 87 && player.discipline >= 80)
    || (player.traits.includes("disciplined") && player.clutch >= 88);
}

function veteranMentorScore(player) {
  if (!isVeteranPlayer(player)) return 0;
  return Math.round(player.tactics * 0.5 + player.discipline * 0.35 + player.clutch * 0.15);
}

function rolePhaseProfile(active) {
  const countByRole = active.reduce((map, player) => map.set(player.role, (map.get(player.role) ?? 0) + 1), new Map());
  const hasLeader = active.some((player) => player.traits.includes("system_leader"));
  const edge = { attack: 0, defense: 0, clutch: 0, execution: 0, lurk: 0 };
  const effects = { firepower: 0, tacticalExecution: 0, cohesion: 0, discipline: 0 };
  const notes = [];
  const risks = [];

  if ((countByRole.get("entry") ?? 0) === 0) {
    risks.push("缺少突破者，进攻回合容易打不开");
    edge.attack -= 6;
    effects.firepower -= 4;
    effects.tacticalExecution -= 2;
  }
  if ((countByRole.get("support") ?? 0) === 0) {
    risks.push("缺少防守者，防守回合容易漏补枪和道具");
    edge.defense -= 8;
    effects.cohesion -= 6;
    effects.discipline -= 7;
    effects.tacticalExecution -= 2;
  }
  if ((countByRole.get("rifler") ?? 0) === 0) {
    risks.push("缺少补枪手，进攻和防守的交换链都会变薄");
    edge.attack -= 3;
    edge.defense -= 3;
    effects.firepower -= 1;
    effects.cohesion -= 2;
    effects.tacticalExecution -= 3;
    effects.discipline -= 1;
  }
  if ((countByRole.get("awp") ?? 0) === 0) {
    risks.push("缺少狙击手，残局缺少兜底");
    edge.clutch -= 5;
    effects.firepower -= 2;
    effects.tacticalExecution -= 2;
  }
  if ((countByRole.get("lurker") ?? 0) === 0) {
    risks.push("缺少自由人，单摸和防绕后都更容易被抓");
    edge.lurk -= 5;
    edge.defense -= 1;
    effects.tacticalExecution -= 2;
    effects.cohesion -= 1;
  } else {
    notes.push("自由人能提高单摸和反绕后质量");
    edge.lurk += 4;
    edge.clutch += 1;
    effects.tacticalExecution += 1;
  }
  if (!hasLeader) {
    edge.execution -= 4;
  }

  return { edge, effects, notes, risks };
}

function chemistryProfile(active) {
  const ids = new Set(active.map((player) => player.id));
  const notes = [];
  const risks = [];
  const effect = { firepower: 0, tacticalExecution: 0, cohesion: 0, discipline: 0 };
  const addEffect = (delta = {}) => {
    effect.firepower += delta.firepower ?? 0;
    effect.tacticalExecution += delta.tacticalExecution ?? 0;
    effect.cohesion += delta.cohesion ?? 0;
    effect.discipline += delta.discipline ?? 0;
  };
  const countByRole = active.reduce((map, player) => map.set(player.role, (map.get(player.role) ?? 0) + 1), new Map());
  const teams = active.reduce((map, player) => map.set(player.team, (map.get(player.team) ?? 0) + 1), new Map());
  const largestSameTeam = Math.max(0, ...teams.values());
  const leader = bestOnFieldLeader(active);
  const leaderQuality = leaderScore(leader);
  const hasLeader = Boolean(leader);
  const disciplinedCount = active.filter((player) => player.traits.includes("disciplined") || player.traits.includes("calm_clutcher")).length;
  const volatilePlayers = active.filter((player) => player.traits.includes("hot_blooded") || player.traits.includes("streaky_star"));
  const starCores = active.filter((player) => player.price >= 21 || player.firepower >= 87);
  const volatileCores = starCores.filter((player) => player.traits.includes("hot_blooded") || player.traits.includes("streaky_star"));
  const youngCount = active.filter(isYoungPlayer).length;
  const mentor = [...active].sort((left, right) => veteranMentorScore(right) - veteranMentorScore(left))[0];
  const mentorQuality = veteranMentorScore(mentor);
  const roleProfile = rolePhaseProfile(active);

  for (const rule of bondRules) {
    if (rule.ids.every((id) => ids.has(id))) {
      notes.push(rule.note);
      addEffect(rule.effect);
    }
  }

  if (largestSameTeam >= 4) {
    notes.push(`${teamNames[[...teams.entries()].find(([, count]) => count === largestSameTeam)?.[0]] ?? "原队"}核心保留`);
    addEffect({ cohesion: 8, discipline: 4, tacticalExecution: 4 });
  } else if (largestSameTeam >= 3) {
    notes.push("现实队友默契");
    addEffect({ cohesion: 5, discipline: 2, tacticalExecution: 2 });
  } else if (largestSameTeam >= 2) {
    notes.push("双人默契");
    addEffect({ cohesion: 2, discipline: 1 });
  }

  if (hasLeader && disciplinedCount >= 2) {
    notes.push("指挥托底");
    addEffect({ tacticalExecution: 5, cohesion: 3, discipline: 4 });
  }
  if (hasLeader && starCores.length >= 2) {
    if (leaderQuality >= 88) {
      notes.push(`${leader.name} 经验托底，多核心冲突被压住`);
      addEffect({ tacticalExecution: 4, cohesion: 8, discipline: 6 });
    } else if (leaderQuality >= 84) {
      notes.push(`${leader.name} 能帮多核心压住节奏`);
      addEffect({ tacticalExecution: 3, cohesion: 5, discipline: 4 });
    } else {
      notes.push("有指挥梳理多核心资源");
      addEffect({ tacticalExecution: 2, cohesion: 2, discipline: 2 });
    }
  } else if (hasLeader && volatileCores.length >= 1) {
    notes.push("明星火力有指挥压节奏");
    addEffect({ cohesion: 2, discipline: 3 });
  }
  if (disciplinedCount >= 4) {
    notes.push("纪律壳完整");
    addEffect({ cohesion: 3, discipline: 5 });
  }
  if (youngCount >= 1 && youngCount <= 2 && mentorQuality >= 82) {
    notes.push("老将带新人，队伍更稳");
    addEffect({ cohesion: 4, discipline: 3, tacticalExecution: 1 });
  }

  if (!hasLeader && starCores.length >= 2) {
    risks.push("拼装明星阵容抢资源");
    addEffect({ tacticalExecution: -8, cohesion: -12, discipline: -8 });
  }
  if (volatileCores.length >= 2 && !hasLeader) {
    risks.push("针锋相对");
    addEffect({ firepower: 2, cohesion: -10, discipline: -7 });
  }
  if (volatilePlayers.length >= 4) {
    risks.push("内讧风险");
    addEffect({ cohesion: -9, discipline: -6 });
  }
  if ((countByRole.get("awp") ?? 0) >= 2) {
    risks.push("双狙资源冲突");
    addEffect({ firepower: -2, tacticalExecution: -3, cohesion: -4 });
  }
  if ((countByRole.get("entry") ?? 0) >= 3) {
    risks.push("主攻位资源拥挤");
    addEffect({ firepower: 1, tacticalExecution: -3, discipline: -4 });
  }
  if (!hasLeader) {
    risks.push("缺少专职指挥");
    addEffect({ tacticalExecution: -5, cohesion: -4, discipline: -3 });
  }
  if (youngCount >= 3 && leaderQuality < 86 && mentorQuality < 82) {
    risks.push("年轻人过多，逆风局容易各打各的");
    addEffect({ cohesion: -6, discipline: -5, tacticalExecution: -2 });
  }
  for (const note of roleProfile.notes) notes.push(note);
  for (const risk of roleProfile.risks) risks.push(risk);
  addEffect(roleProfile.effects);

  return { notes: [...new Set(notes)], risks: [...new Set(risks)], effect };
}

function rolePhaseEdgeForRoster(roster, substituteId) {
  const active = activeRoster(roster, substituteId);
  return rolePhaseProfile(active).edge;
}

function teamStats(roster, substituteId, modifiers = {}) {
  const starters = activeRoster(roster, substituteId);
  const active = starters.length === 5 ? starters : roster.slice(0, 5);
  const formEffect = formEffectForRoster(active, modifiers.playerForm ?? {});
  const avg = (key) => Math.round(active.reduce((sum, player) => sum + player[key], 0) / active.length);
  const profile = chemistryProfile(active);
  const hasLeader = active.some((player) => player.traits.includes("system_leader"));
  const disciplinedCount = active.filter((player) => player.traits.includes("disciplined") || player.traits.includes("calm_clutcher")).length;
  const hotCount = active.filter((player) => player.traits.includes("hot_blooded") || player.traits.includes("streaky_star")).length;
  const starCount = active.filter((player) => player.price >= 21).length;
  const traitUtility = active.reduce((sum, player) => sum + traitUtilityScore(player), 0);
  const traitFirepower = active.reduce((sum, player) => sum
    + (player.traits.includes("hot_blooded") ? 2 : 0)
    + (player.traits.includes("streaky_star") ? 1 : 0)
    - (player.traits.includes("disciplined") && player.firepower < 80 ? 1 : 0), 0);
  const traitExecution = active.reduce((sum, player) => sum
    + (player.traits.includes("system_leader") ? 3 : 0)
    + (player.traits.includes("disciplined") ? 2 : 0)
    + (player.traits.includes("calm_clutcher") ? 1 : 0)
    - (player.traits.includes("hot_blooded") ? 1 : 0), 0);
  const rawFirepower = avg("firepower") + Math.round(traitFirepower / 2) + (hotCount >= 2 ? 1 : 0);
  const rawExecution = avg("tactics") + (hasLeader ? 5 : 0) + Math.round(traitExecution / 3);
  const rawCohesion = avg("personality") + (disciplinedCount >= 3 ? 3 : 0) - (hotCount >= 3 ? 5 : 0) + Math.round(traitUtility / 5);
  const rawDiscipline = avg("discipline") + (disciplinedCount >= 3 ? 4 : 0) - (hotCount >= 3 ? 4 : 0) + Math.round(traitUtility / 6);
  const noLeaderPenalty = hasLeader ? 0 : starCount >= 2 ? 7 : 3;
  const continuityBonus = modifiers.continuityBonus ?? 0;
  const modFirepower = softCapTeamModifier(modifiers.firepower ?? 0);
  const modExecution = softCapTeamModifier(modifiers.tacticalExecution ?? 0);
  const modCohesion = softCapTeamModifier(modifiers.cohesion ?? 0);
  const modDiscipline = softCapTeamModifier(modifiers.discipline ?? 0);
  const rosterFriction = frictionPenalty(modifiers.rosterFriction ?? 0);
  const statCeiling = 90 + Math.min(5, Math.floor(continuityBonus / 2));
  return {
    firepower: clamp(softCapTeamStat(rawFirepower + profile.effect.firepower + formEffect.firepower + modFirepower - Math.floor(rosterFriction / 3), statCeiling + 1), 1, 98),
    tacticalExecution: clamp(softCapTeamStat(rawExecution + profile.effect.tacticalExecution + formEffect.tacticalExecution + modExecution - noLeaderPenalty + continuityBonus - rosterFriction, statCeiling), 1, 98),
    cohesion: clamp(softCapTeamStat(rawCohesion + profile.effect.cohesion + formEffect.cohesion + modCohesion + continuityBonus - rosterFriction * 2, statCeiling), 1, 98),
    discipline: clamp(softCapTeamStat(rawDiscipline + profile.effect.discipline + formEffect.discipline + modDiscipline - noLeaderPenalty + Math.floor(continuityBonus / 2) - Math.ceil(rosterFriction / 2), statCeiling), 1, 98),
  };
}

function chemistryNotes(roster, substituteId) {
  const active = activeRoster(roster, substituteId);
  const profile = chemistryProfile(active);
  const notes = [...profile.notes];
  const risks = [...profile.risks];
  const isVolatile = (player) => player.traits.includes("hot_blooded") || player.traits.includes("streaky_star");
  const isCore = (player) => player.price >= 21 || player.firepower >= 86;
  const hot = active.filter(isVolatile).length;
  const volatileCores = active.filter((player) => isCore(player) && isVolatile(player));
  const calm = active.some((player) => player.traits.includes("calm_clutcher"));
  const leader = active.some((player) => player.traits.includes("system_leader"));
  const bench = roster.find((player) => player.id === substituteId);
  const benchLeader = bench?.traits?.includes("system_leader");
  const disciplined = active.filter((player) => player.traits.includes("disciplined") || player.traits.includes("calm_clutcher")).length;
  const hasStabilityShell = leader && disciplined >= 2;

  if (hot && calm) notes.push("明星 + 稳定器");
  if (leader && disciplined >= 2) notes.push("体系核心");
  if (volatileCores.length >= 2) {
    if (hasStabilityShell) notes.push("双核心有指挥托底");
    else risks.push("双核心需要指挥压节奏");
  }
  if (!leader && benchLeader && active.filter((player) => isCore(player)).length >= 2) {
    risks.push("指挥在替补席，场上没人压住多明星资源");
  }
  return { notes: [...new Set(notes)], risks: [...new Set(risks)] };
}

function currentCupMeta(campaign) {
  return CUPS[campaign.cupIndex];
}

function currentCupYear(campaign) {
  return currentCupMeta(campaign).yearBase + campaign.seasonIndex - 1;
}

function teamStrength(team) {
  return (
    team.stats.firepower * 0.31 +
    team.stats.tacticalExecution * 0.31 +
    team.stats.cohesion * 0.20 +
    team.stats.discipline * 0.18
  );
}

function makeBrowserAiFiller(teamId, index) {
  const reserve = browserAiReservePlayers[(AI_TEAM_ORDER.indexOf(teamId) * 3 + index) % browserAiReservePlayers.length];
  return {
    id: `browser-reserve-${teamId}-${reserve.id}-${index}`,
    name: reserve.name,
    team: teamId,
    role: reserve.role,
    firepower: reserve.firepower,
    tactics: reserve.tactics,
    discipline: reserve.discipline,
    clutch: reserve.clutch,
    personality: 68 + (index % 9),
    age: 24 + (index % 5),
    price: 9 + Math.floor((reserve.firepower - 70) / 5),
    traits: reserve.traits,
    profile: reserve.profile,
  };
}

function buildAvailableTeamRoster(teamId, selectedIds) {
  const selectedSet = new Set(selectedIds);
  const available = players
    .filter((player) => player.team === teamId && !selectedSet.has(player.id))
    .sort((left, right) => playerValue(right) - playerValue(left));
  const roster = [...available];
  let fillerIndex = 0;
  while (roster.length < 6) {
    roster.push(makeBrowserAiFiller(teamId, fillerIndex));
    fillerIndex += 1;
  }
  return roster.slice(0, 6);
}

function aiSeasonGrowth(teamId, campaign = {}) {
  const seasonIndex = clamp(Number(campaign?.seasonIndex ?? 1), 1, CAMPAIGN_SEASONS);
  const cupIndex = clamp(Number(campaign?.cupIndex ?? 0), 0, CUPS.length - 1);
  const progress = (seasonIndex - 1) * CUPS.length + cupIndex;
  const general = Math.floor(progress / 2);
  const growth = { firepower: general, tacticalExecution: general, cohesion: general, discipline: Math.floor(general / 2), clutch: general };
  const add = (key, value) => { growth[key] += value; };
  if (teamId === "spirit") add("firepower", Math.ceil(progress / 2));
  if (teamId === "vitality") {
    add("tacticalExecution", Math.ceil(progress / 2));
    add("clutch", Math.ceil(progress / 3));
  }
  if (teamId === "navi") {
    add("tacticalExecution", Math.ceil(progress / 2));
    add("discipline", Math.ceil(progress / 3));
  }
  if (teamId === "faze") {
    add("discipline", Math.ceil(progress / 2));
    add("clutch", Math.ceil(progress / 3));
  }
  if (teamId === "mouz" || teamId === "mongolz") {
    add("firepower", Math.ceil(progress / 3));
    add("cohesion", Math.ceil(progress / 2));
  }
  if (teamId === "falcons") {
    add("firepower", Math.ceil(progress / 3));
    add("cohesion", Math.floor(progress / 3));
  }
  if (teamId === "furia") {
    add("cohesion", Math.ceil(progress / 3));
    add("discipline", Math.ceil(progress / 3));
  }
  return growth;
}

function buildAiTeamSnapshot(teamId, selectedIds, campaign = {}) {
  const profile = AI_TEAM_PROFILES[teamId];
  const growth = aiSeasonGrowth(teamId, campaign);
  const stolenPlayers = selectedIds
    .map(playerById)
    .filter((player) => player.team === teamId);
  const availableRoster = buildAvailableTeamRoster(teamId, selectedIds);
  const availableLineup = availableRoster.slice(0, 5);
  const firePenalty = stolenPlayers.reduce((sum, player) => sum + Math.max(1, Math.round((player.firepower - 72) / 6)), 0);
  const tacticPenalty = stolenPlayers.reduce((sum, player) => sum + Math.max(1, Math.round((player.tactics - 70) / 8)), 0);
  const disciplinePenalty = stolenPlayers.reduce((sum, player) => sum + (player.traits.includes("disciplined") || player.traits.includes("system_leader") ? 2 : 1), 0);
  const lineupNames = availableLineup.map((player) => player.name);
  const stars = lineupNames.length >= 5 ? lineupNames : [...lineupNames, ...profile.stars.filter((name) => !lineupNames.includes(name))].slice(0, 5);
  return {
    id: profile.id,
    name: profile.name,
    short: profile.short,
    style: profile.style,
    styleNote: profile.styleNote,
    stars,
    roster: availableRoster.map((player) => player.name),
    substitute: availableRoster[5]?.name ?? "待定替补",
    stats: {
      firepower: clamp(profile.base.firepower + growth.firepower - firePenalty, 68, 94),
      tacticalExecution: clamp(profile.base.tacticalExecution + growth.tacticalExecution - tacticPenalty, 68, 94),
      cohesion: clamp(profile.base.cohesion + growth.cohesion - Math.max(0, stolenPlayers.length - 1), 66, 92),
      discipline: clamp(profile.base.discipline + growth.discipline - disciplinePenalty, 65, 92),
      clutch: clamp(profile.base.clutch + growth.clutch - Math.round(firePenalty / 2), 66, 94),
    },
  };
}

function buildPlayerTeamSnapshot(state, modifiers) {
  const roster = selectedPlayers(state);
  const active = activeRoster(roster, state.substitute);
  const lineupKey = lineupKeyFromRoster(roster, state.substitute);
  const continuityBonus = continuityBonusForMatches(modifiers?.lineupMatches?.[lineupKey] ?? 0);
  const stats = teamStats(roster, state.substitute, { ...modifiers, continuityBonus });
  const stars = [...active]
    .sort((left, right) => (right.firepower + right.clutch + right.tactics) - (left.firepower + left.clutch + left.tactics))
    .map((player) => player.name);
  return {
    id: "player-team",
    name: PLAYER_TEAM,
    short: "GUN",
    stars,
    stats: {
      ...stats,
      clutch: Math.round(active.reduce((sum, player) => sum + player.clutch, 0) / active.length),
    },
    continuityBonus,
  };
}

function playerValue(player) {
  return Math.round(
    player.firepower * 0.42 +
    player.tactics * 0.24 +
    player.discipline * 0.16 +
    player.clutch * 0.12 +
    player.personality * 0.06,
  );
}

function traitUtilityScore(player) {
  const traits = player.traits ?? [];
  let score = 0;
  if (traits.includes("system_leader")) score += 12;
  if (traits.includes("disciplined")) score += 9;
  if (traits.includes("calm_clutcher")) score += 8;
  if (traits.includes("crowd_favorite")) score += 3;
  if (traits.includes("hot_blooded")) score -= 5;
  if (traits.includes("streaky_star")) score -= 3;
  if (traits.includes("hot_blooded") && traits.includes("streaky_star")) score -= 4;
  if (player.role === "igl" && traits.includes("system_leader")) score += 4;
  return score;
}

function placementPrize(placement) {
  if (placement === "冠军") return 18;
  if (placement === "亚军") return 12;
  if (placement === "四强") return 7;
  return 5;
}

function budgetPressurePenalty(selectedIds) {
  const roster = selectedIds.map(playerById);
  const spend = rosterPrice(selectedIds);
  const starCount = roster.filter((player) => player.price >= 21).length;
  if (spend >= 99 && starCount >= 2) return 4;
  if (spend >= 96 && starCount >= 2) return 2;
  return 0;
}

function playerArchetype(player) {
  if (player.traits.includes("system_leader")) return "领袖风范";
  if (player.age <= 21 && player.firepower >= 84) return "年轻魔王";
  if (player.age <= 21) return "天才新秀";
  if (player.age >= 28 && player.traits.includes("disciplined")) return "沉稳老将";
  if (player.traits.includes("calm_clutcher")) return "残局核心";
  if (player.traits.includes("hot_blooded")) return "凶狠突破";
  if (player.traits.includes("streaky_star")) return "高波动爆点";
  if (player.traits.includes("crowd_favorite")) return "大场面选手";
  return "体系拼图";
}

function createTradeCandidates(state, campaign) {
  const budget = campaign.budget ?? 0;
  const available = players
    .filter((player) => !state.selected.includes(player.id))
    .map((player) => ({
      ...player,
      tradeTag: playerArchetype(player),
      marketPrice: marketPrice(player, campaign),
      affordable: budget + 24 >= marketPrice(player, campaign),
    }))
    .sort((left, right) => playerValue(right) - playerValue(left));
  return available;
}

function getTradePackage(state, campaign, outgoingId, targetId) {
  if (!outgoingId || !targetId) return undefined;
  const outgoing = playerById(outgoingId);
  const target = playerById(targetId);
  if (!outgoing || !target || outgoing.id === target.id) return undefined;
  const outgoingMarketPrice = marketPrice(outgoing, campaign);
  const targetMarketPrice = marketPrice(target, campaign);
  const rawCash = targetMarketPrice - outgoingMarketPrice;
  const cash = rawCash < 0 ? rawCash : rawCash === 0 ? 0 : clamp(rawCash + 3, 2, 20);
  const packageValue = outgoingMarketPrice + Math.max(0, cash);
  const fit = playerValue(target) - playerValue(outgoing);
  const sameRole = outgoing.role === target.role;
  const cashPhrase = cash > 0 ? ` + $${cash}` : cash < 0 ? `，对方补给你 $${Math.abs(cash)}` : "";
  return {
    id: `trade-${outgoing.id}-${target.id}`,
    targetId: target.id,
    outgoingId: outgoing.id,
    cash,
    packageValue,
    fit,
    sameRole,
    outgoing: { ...outgoing, marketPrice: outgoingMarketPrice },
    target: { ...target, marketPrice: targetMarketPrice },
    outgoingMarketPrice,
    targetMarketPrice,
    summary: `送出 ${outgoing.name}${cashPhrase}，尝试换来 ${target.name}`,
    angle: sameRole
      ? "同位置直接轮换"
      : target.team === outgoing.team
        ? "现实队友重聚"
        : target.traits.includes("system_leader")
          ? "补体系指挥"
          : target.traits.includes("disciplined")
            ? "补纪律和补枪"
            : "补角色深度",
  };
}

function tradeBidRange(state, offer) {
  const budget = state.campaign?.budget ?? 0;
  const fairCash = offer?.cash ?? 0;
  if (fairCash < 0) {
    return {
      min: fairCash,
      max: fairCash,
      fair: fairCash,
      current: fairCash,
    };
  }
  return {
    min: 0,
    max: Math.max(0, budget),
    fair: clamp(fairCash, 0, Math.max(0, budget)),
    current: clamp(state.hub?.tradeSelection?.cashOffer ?? fairCash, 0, Math.max(0, budget)),
  };
}

function tradeSuccessWindow(state, outgoingId, targetId, cashOffer) {
  const offer = getTradePackage(state, state.campaign, outgoingId, targetId);
  if (!offer) return { low: 0, high: 0, mid: 0, label: "无法估价" };
  if (offer.cash < 0) {
    const valueGap = Math.abs(offer.cash);
    let mid = 0.48 + Math.min(0.24, valueGap * 0.035);
    mid += offer.sameRole ? 0.04 : -0.02;
    mid += offer.target.traits.includes("disciplined") || offer.target.traits.includes("system_leader") ? 0.04 : 0;
    mid = clamp(mid, 0.38, 0.86);
    return {
      low: clamp(mid - 0.07, 0.30, 0.84),
      high: clamp(mid + 0.07, 0.45, 0.90),
      mid,
      label: "降薪换深度",
    };
  }
  const fair = Math.max(0, offer.cash);
  const cash = clamp(Number(cashOffer ?? fair), 0, state.campaign?.budget ?? 0);
  const ratio = fair === 0 ? (cash >= 2 ? 1.2 : cash > 0 ? 0.9 : 0.65) : cash / fair;
  let mid = 0.18 + ratio * 0.34;
  mid += offer.sameRole ? 0.05 : -0.02;
  mid += offer.targetMarketPrice <= 14 ? 0.10 : offer.targetMarketPrice >= 21 ? -0.08 : 0;
  mid += offer.target.traits.includes("crowd_favorite") ? -0.04 : 0;
  mid += cash > fair ? Math.min(0.18, (cash - fair) * 0.018) : 0;
  mid = clamp(mid, 0.08, cash >= fair + 8 ? 0.92 : 0.84);
  const spread = cash < fair ? 0.08 : 0.06;
  const low = clamp(mid - spread, 0.04, 0.92);
  const high = clamp(mid + spread, 0.10, 0.94);
  const label = cash < fair * 0.7
    ? "试探报价"
    : cash < fair
      ? "偏低报价"
      : cash <= fair + 3
        ? "接近合理"
        : "溢价强推";
  return { low, high, mid, label };
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function applyTradeAttempt(state, outgoingId, targetId) {
  if (state.hub.tradeAttemptUsed) {
    return { ...state, error: "这一段赛程的交易窗口已经用掉了。" };
  }
  const offer = getTradePackage(state, state.campaign, outgoingId, targetId);
  if (!offer) return state;

  const campaign = {
    ...state.campaign,
    modifiers: { ...state.campaign.modifiers },
  };
  const target = offer.target;
  const outgoing = offer.outgoing;
  const budget = campaign.budget ?? 0;
  const range = tradeBidRange(state, offer);
  const cashOffer = clamp(Number(state.hub.tradeSelection?.cashOffer ?? offer.cash), range.min, range.max);
  const odds = tradeSuccessWindow(state, outgoingId, targetId, cashOffer);

  if (cashOffer > 0 && budget < cashOffer) {
    return {
      ...state,
      hub: {
        ...state.hub,
        tradeAttemptUsed: true,
        tradeResult: {
          success: false,
          title: "报价被拒",
          text: `你想给到 $${cashOffer}，但账上预算不够。对方没有把这当成正式报价，只提醒你先准备好现金再谈。`,
          delta: `预算不足，仍差 $${cashOffer - budget}`,
        },
      },
      error: "",
    };
  }

  const rng = createRng(createMatchSeed(campaign, Math.abs(cashOffer) + offer.targetMarketPrice + offer.outgoingMarketPrice));
  const success = rng.next() <= odds.mid;

  if (!success) {
    const failReasons = [
      "对方管理层不想在赛季中段拆掉这套首发，报价被压了回来。",
      `${target.name} 对这笔转会兴趣不高，谈到一半就明显降温了。`,
      `你送出的筹码还不够，对面没有松口，只愿意继续往上抬价。`,
    ];
    return {
      ...state,
      campaign,
      hub: {
        ...state.hub,
        tradeAttemptUsed: true,
        tradeResult: {
          success: false,
          title: "交易没谈成",
          text: cashOffer < 0
            ? `${failReasons[rng.int(0, failReasons.length - 1)]} 你希望对方补给 $${Math.abs(cashOffer)}，但他们认为回收成本太高，暂时不愿接。`
            : `${failReasons[rng.int(0, failReasons.length - 1)]} 你的报价是 $${cashOffer}，对方认为还不够打动他们。`,
          delta: `报价未被接受 · 预估成功率 ${formatPercent(odds.low)}-${formatPercent(odds.high)} · 本窗口机会已用完`,
        },
      },
      error: "",
    };
  }

  const selected = [...state.selected];
  const replaceIndex = selected.findIndex((id) => id === outgoing.id);
  selected[replaceIndex] = target.id;
  const substitute = state.substitute === outgoing.id ? target.id : state.substitute;
  campaign.budget = cashOffer < 0 ? budget + Math.abs(cashOffer) : Math.max(0, budget - cashOffer);
  campaign.modifiers.cohesion += target.team === outgoing.team ? 1 : -1;
  campaign.modifiers.tacticalExecution += target.traits.includes("system_leader") ? 1 : 0;
  campaign.modifiers.firepower += target.firepower > outgoing.firepower ? 1 : 0;
  campaign.rosterFriction = addRosterFriction(campaign.rosterFriction, offer.sameRole ? 3 : 4);
  campaign.lineupMatches = {};

  return {
    ...state,
    selected,
    substitute,
    campaign,
    hub: {
      ...state.hub,
      tradeAttemptUsed: true,
      tradeResult: {
        success: true,
        title: "交易达成",
        text: cashOffer < 0
          ? `${target.name} 点头了。${outgoing.name} 离队，对方补给你 $${Math.abs(cashOffer)}。这不是向上补强，而是降薪换角色深度；不过新队友进来以后，默契还是要重新磨。`
          : `${target.name} 点头了。${outgoing.name} 离队，${PLAYER_TEAM} 用 $${cashOffer} 的补价把这单压了下来。新阵容会进入磨合期，后面的训练和比赛会慢慢把默契找回来。`,
        delta: cashOffer < 0 ? `预算回收，${target.name} 入队 · 阵容进入磨合期` : `${target.name} 入队 · 阵容进入磨合期`,
      },
    },
    error: "",
  };
}

function createBracketMatch(id, round, teamA, teamB) {
  return {
    id,
    round,
    teamA,
    teamB,
    winnerId: undefined,
    score: undefined,
    headline: "",
  };
}

function createCupBracket(state, campaign) {
  const meta = currentCupMeta(campaign);
  const rotated = rotateArray(AI_TEAM_ORDER, (campaign.seasonIndex - 1) * 2 + campaign.cupIndex);
  const playerTeam = buildPlayerTeamSnapshot(state, { ...campaign.modifiers, rosterFriction: campaign.rosterFriction ?? 0 });
  const aiTeams = rotated.map((teamId) => buildAiTeamSnapshot(teamId, state.selected, campaign));
  const quarterfinals = [
    createBracketMatch("quarter-0", "quarterfinal", playerTeam, aiTeams[0]),
    createBracketMatch("quarter-1", "quarterfinal", aiTeams[1], aiTeams[2]),
    createBracketMatch("quarter-2", "quarterfinal", aiTeams[3], aiTeams[4]),
    createBracketMatch("quarter-3", "quarterfinal", aiTeams[5], aiTeams[6]),
  ];
  return {
    cupId: meta.id,
    cupName: meta.name,
    cupShort: meta.short,
    year: currentCupYear(campaign),
    intro: meta.intro,
    tone: meta.tone,
    atmosphere: meta.atmosphere,
    motto: meta.motto,
    rounds: {
      quarterfinal: quarterfinals,
      semifinal: [],
      final: [],
    },
    currentRound: "quarterfinal",
    currentMatchId: "quarter-0",
    lastRoundSummary: "",
    champion: undefined,
    runnerUp: undefined,
    semifinalists: [],
    completed: false,
    playerEliminated: false,
  };
}

function resolveOffscreenMatch(match, seed) {
  const rng = createRng(seed);
  const strengthA = teamStrength(match.teamA) + rng.int(-6, 6);
  const strengthB = teamStrength(match.teamB) + rng.int(-6, 6);
  const winner = strengthA >= strengthB ? match.teamA : match.teamB;
  const loser = winner.id === match.teamA.id ? match.teamB : match.teamA;
  const loserMaps = clamp(Math.round(Math.abs(strengthA - strengthB) < 4 ? 2 : Math.abs(strengthA - strengthB) < 10 ? 1 : 0), 0, 2);
  return {
    ...match,
    winnerId: winner.id,
    score: winner.id === match.teamA.id ? [3, loserMaps] : [loserMaps, 3],
    headline: `${winner.stars[0]} 带着 ${winner.name} 拿下了这轮 BO5，${loser.name} 被挡在了后面。`,
  };
}

function findMatch(rounds, matchId) {
  for (const roundName of ["quarterfinal", "semifinal", "final"]) {
    const match = rounds[roundName].find((entry) => entry.id === matchId);
    if (match) return match;
  }
  return undefined;
}

function roundLabel(round) {
  if (round === "quarterfinal") return "四分之一决赛";
  if (round === "semifinal") return "半决赛";
  return "决赛";
}

function scoutingResultLine(choice) {
  if (choice === "drill") return "重点练了反清和补枪，开局几轮默认更不容易被打断。";
  if (choice === "confidence") return "赛前先理清沟通，稳住自己的节奏，别被对面的情绪波动带着走。";
  return "关键战术先藏着，等对手以为读懂你们时再换节奏。";
}

function scoutingPlanForChoice(choice) {
  if (choice === "hide-looks") {
    return {
      id: "hide-looks",
      description: "藏住关键战术，等中后段用反读、转点和残局细节打对手一个措手不及。",
      mapBonuses: { 2: 2, 3: 3, 4: 2 },
      seriesPlan: { closeBonus: 2, deciderBonus: 2 },
    };
  }
  if (choice === "drill") {
    return {
      id: "drill",
      description: "把反清、补枪和默认站位练得更扎实，前两局更不容易被开局打乱。",
      mapBonuses: { 0: 1, 1: 1 },
      seriesPlan: { closeBonus: 0, deciderBonus: 0 },
    };
  }
  if (choice === "confidence") {
    return {
      id: "confidence",
      description: "赛前先稳住沟通和情绪，逆风时更容易把语音重新拉回同一条线上。",
      mapBonuses: { 3: 1 },
      seriesPlan: { closeBonus: 1, deciderBonus: 1 },
    };
  }
  return {
    id: "neutral",
    description: "保持常规准备，不额外改变比赛节奏。",
    mapBonuses: {},
    seriesPlan: { closeBonus: 0, deciderBonus: 0 },
  };
}

function prematchCopy(choice, opponent, starName) {
  if (!choice) {
    return {
      title: `赛前情报室：${opponent.name}`,
      body: [
        `公开样本只能告诉你 ${opponent.name} 大概是什么路数，真正的落点还得进比赛里看他们开局几轮怎么交道具、怎么铺人。`,
        `${starName} 当然是最值得盯的人，但赛前不能先把整套答案写死。你现在要决定的，是这场更想查他们的节奏、语音状态，还是换防习惯。`,
      ],
      labels: [
        "激进冒险",
        "小心试探",
        "隐藏战术",
      ],
    };
  }
  if (choice === "drill") {
    return {
      title: `四分之一决赛赛前：${opponent.name}`,
      body: [
        `${opponent.name} 这队更喜欢先把默认站稳，再逼你自己先露信息。真要打他们，前期补枪和反清得先接住。`,
        `${starName} 一旦前期打顺，整队节奏会越滚越快。你这边如果先把中段控图和补枪节奏理顺，就不容易被他一路带着跑。`,
      ],
      labels: [
        "激进冒险",
        "小心试探",
        "隐藏战术",
      ],
    };
  }
  if (choice === "confidence") {
    return {
      title: `赛前房间：先把节奏稳住`,
      body: [
        `你没继续往屏幕上堆更多情报，先把节奏从对手身上拿回来。`,
        `赛前先理清沟通，稳住自己的节奏，别被 ${opponent.name} 和 ${starName} 的情绪波动带着走。`,
      ],
      labels: [
        "小心试探",
        "激进冒险",
        "隐藏战术",
      ],
    };
  }
  return {
    title: `赛前保密：把新内容留到关键局`,
    body: [
      `你不打算在赛前和训练样本里把新内容露太多，真正准备好的东西要留到比赛关键段再掏出来。`,
      `只要 ${starName} 第一时间没拿到太舒服的信息，对面就没法那么早把你们今天的准备读透。`,
    ],
    labels: [
      "隐藏战术",
      "激进冒险",
      "小心试探",
    ],
  };
}

function compactDeltaText(value, label, signOnly = false) {
  if (typeof value !== "number") return label;
  if (!signOnly) return `${label} ${value}`;
  return `${label} ${value > 0 ? `+${value}` : value}`;
}

function openingTacticFromChoice(choice) {
  if (choice === "rush") return "rush";
  if (choice === "fake") return "fake";
  if (choice === "lurk") return "lurk";
  return "default";
}

function buyTierFromChoice(choice) {
  if (choice === "save") return "eco";
  if (choice === "balanced") return "half_buy";
  return "full_buy";
}

function buildMatchVariables({ roster, opponentTeam, playerTeamStats, roundName }) {
  const star = [...roster].sort((left, right) => (right.firepower + right.clutch) - (left.firepower + left.clutch))[0];
  const pickUnique = (predicate, used = new Set(), fallbackSort) => {
    const candidates = roster.filter((player) => !used.has(player.id) && (!predicate || predicate(player)));
    if (fallbackSort) candidates.sort(fallbackSort);
    return candidates[0] ?? roster.find((player) => !used.has(player.id)) ?? star;
  };
  const used = new Set([star.id]);
  const awper = pickUnique((player) => player.role === "awp", used, (a, b) => (b.firepower + b.clutch) - (a.firepower + a.clutch));
  used.add(awper.id);
  const caller = pickUnique((player) => player.traits.includes("system_leader") || player.role === "igl", used, (a, b) => b.tactics - a.tactics);
  used.add(caller.id);
  const entry = pickUnique((player) => player.role === "entry" || player.traits.includes("hot_blooded"), used, (a, b) => b.firepower - a.firepower);
  used.add(entry.id);
  const support = pickUnique((player) => player.role === "support" || player.traits.includes("disciplined"), used, (a, b) => (b.tactics + b.discipline) - (a.tactics + a.discipline));
  used.add(support.id);
  const lurker = pickUnique((player) => player.role === "lurker" || player.role === "rifler", used, (a, b) => (b.clutch + b.discipline) - (a.clutch + a.discipline));
  used.add(lurker.id);
  const anchor = pickUnique((player) => player.role === "rifler" || player.traits.includes("disciplined"), used, (a, b) => (b.discipline + b.clutch) - (a.discipline + a.clutch));
  const starAlias = star.id === entry.id || star.id === caller.id || star.id === awper.id || star.id === support.id || star.id === anchor.id ? lurker : star;
  return {
    star: starAlias,
    caller,
    entry,
    support,
    lurker,
    anchor,
    awper,
    enemyStar: opponentTeam.stars[0] ?? `${opponentTeam.name} 明星位`,
    enemySecond: opponentTeam.stars[1] ?? `${opponentTeam.name} 补枪位`,
    templateVars: {
      team: PLAYER_TEAM,
      rival_team: opponentTeam.name,
      player: starAlias.name,
      player_a: entry.name,
      player_b: caller.name,
      player_c: awper.name,
      player_d: support.name,
      player_e: anchor.name,
      opponent: opponentTeam.stars[0] ?? `${opponentTeam.name} 核心`,
      opponent_a: opponentTeam.stars[0] ?? `${opponentTeam.name} 核心`,
      opponent_b: opponentTeam.stars[1] ?? `${opponentTeam.name} 二号位`,
      opponent_c: opponentTeam.stars[2] ?? `${opponentTeam.name} 三号位`,
      opponent_d: opponentTeam.stars[3] ?? `${opponentTeam.name} 四号位`,
      site: roundName === "决赛" ? "A 点" : "中路",
      weapon: playerTeamStats.firepower >= 86 ? "AK-47" : "M4A4",
      hp: "23",
      count: "2",
      time: "18",
      score: roundName,
      rookie_name: anchor.name,
      veteran_name: caller.name,
      star_player_name: starAlias.name,
      caller_name: caller.name,
      anchor_name: anchor.name,
      star_id: starAlias.id,
      caller_id: caller.id,
      entry_id: entry.id,
      support_id: support.id,
      lurker_id: lurker.id,
      anchor_id: anchor.id,
      awper_id: awper.id,
    },
  };
}

function chooseKillLine(weaponClass, variables, fallback) {
  return fillTemplate(fallback, variables);
}

function chooseFormSwing(variables) {
  return `${variables.player} 这一段手感开始发热。\n\n${variables.rival_team} 试着把枪线重新压回来，但 ${variables.player} 的 timing 更快。\n\n这波之后，比赛节奏重新回到了 Team gun 手里。`;
}

const narrativeSites = ["A 点", "B 点", "中路", "香蕉道", "小道", "连接", "二楼", "警家", "VIP"];

const combatBeatLibrary = {
  opening: [
    "{player_c} 的 AWP 在 {site} 架了整整十几秒。烟雾散开一条缝，{opponent_a} 只露了半个身位，甩狙命中。镜头甚至没来得及切过去，首杀已经出现。",
    "{player_a} 第一身位干拉进 {site}，急停、三连点，第三发修正到头。{opponent_a} 倒地时手里还捏着没交出去的闪光。",
    "{rival_team} 先顶出来拿信息，{player_d} 的补闪正好在空中爆开。{opponent_b} 全白两秒，{player_a} 贴脸把首杀收掉。",
    "{player_b} 没急着露大身位，只在箱边晃了一下。{opponent_a} 先开枪暴露位置，{player_c} 的补枪立刻跟上，第一波信息和首杀一起到手。",
    "{caller_name} 让全队先停半秒，等对手反清闪爆完再动。{player_a} 从烟边贴出去，关键一枪把 {opponent_b} 留在了近点。",
    "{opponent_a} 想用前压打乱默认，可 {player_e} 早就架着退路。枪声刚响，{rival_team} 的第一波主动权就被打断。",
    "{player_c} 在中路没有贪第二枪，只拿首杀就往后退。这个选择不华丽，但把 5v4 和枪线都稳稳带回队里。",
    "{player_d} 的闪光没有白太久，却刚好白到 {opponent_b} 转头那一下。{player_a} 顺着 timing 推进去，首杀来得很干净。",
    "{rival_team} 试图用双人前顶抢信息，结果第二个人还没补到枪，{player_b} 已经横拉出来把交换关上。",
    "{caller_name} 开局先叫警家烟，{player_c} 架住中路过点。{opponent_a} 想从连接反摸，刚露肩就被预瞄按住。",
    "{player_a} 没直接冲包点，而是先清小道近点。{player_d} 的补闪一爆，{opponent_b} 从警家回防的脚步被迫停住。",
    "{rival_team} 想抢香蕉道第一波信息，{player_b} 贴墙等到脚步压近才拉出去。这个首杀不是莽，是专门等前压的人。",
  ],
  trade: [
    "{rival_team} 的回防没有慢。{opponent_c} 从烟边补出来先带走 {player_a}，{player_b} 立刻横拉补枪。两边各掉一人，局面从 5v5 被打成 4v4。",
    "{player_d} 的烟把入口封住，但 {opponent_b} 直接混烟扫射，先打残两人。{player_e} 没退，蹲在烟边把补枪接上，硬把人数换回同等。",
    "{player_c} 先拿一枪，马上被 {opponent_d} 从侧翼换掉。这个回合不是高光局，是补枪局，谁慢半秒谁就少一个人。",
    "{player_a} 顶第一身位被 {opponent_a} 接住，但 {player_b} 没有犹豫，直接贴着墙补出去。这个人头不漂亮，却让进攻没有断在门口。",
    "{opponent_b} 先把 {player_d} 打掉，想立刻退回二点。{player_e} 把枪口压住退路，硬是把这波交换追回来。",
    "两边在 {site} 入口互相交了三轮补枪。第一个人倒下没人欢呼，因为第二个、第三个人马上就会从烟边补出来。",
    "{player_b} 的补枪慢了半拍，{opponent_c} 差点从二点打出双杀。好在 {anchor_name} 没乱动，最后一枪把局面拉回 3v3。",
    "{rival_team} 想用贴脸双架吃掉突破位，{player_a} 虽然倒了，却把两个位置都报清楚了。后面的补枪终于没有再迷路。",
    "{player_e} 先被打残，仍然没有退。等 {opponent_b} 追枪追出来，他把最后几发子弹全压在同一个身位上。",
    "这一波没人赚大便宜。Team gun 拿到入口，{rival_team} 拿到人数交换，剩下的回合被拖进更难处理的中后段。",
    "{lurker_name} 从小道单摸到连接后方，正好撞见 {opponent_c} 回防。他没急着开枪，等第二个人脚步靠近才一起收。",
    "{player_d} 在警家烟边混了半梭子，没直接杀人，却把 {opponent_b} 打成大残。{player_b} 后续补枪终于不用硬吃满血对枪。",
    "{player_a} 先从二楼给压力，{lurker_name} 再从连接断后。{rival_team} 的回防被切成两段，补枪链没有连起来。",
  ],
  utility: [
    "{player_d} 的燃烧瓶砸在入口，火墙把 {rival_team} 的回防卡了十几秒。对面不是不想打，是被道具按在门外，只能等火灭。",
    "{opponent_b} 的高爆落得很深，{player_a} 和 {player_e} 同时被炸成大残。血量没归零，但下一次对枪已经变成一发子弹的事。",
    "双方在 {site} 门口连续交了烟、火、双闪。画面里全是白光和灰烟，真正的胜负不在准星，而在谁还能记住下一步该站哪。",
    "{caller_name} 把烟留到最后才交，正好封住 {opponent_a} 的回防路线。对手能听见雷包声，却看不到拆包位。",
    "{rival_team} 的反清闪爆得很深，{player_a} 被迫退回墙后。你们没有掉人，但这一退把进点时间让出去了一大截。",
    "{player_d} 先给火逼退近点，再用烟把回防切开。道具不多，但每一颗都落在了让对手难受的位置。",
    "{opponent_b} 的烟把包点入口封成灰墙，Team gun 只能先停。这个停顿很短，却足够让对手第二名回防到位。",
    "一颗高爆在脚下炸开，{player_b} 的血量瞬间见底。队伍还能继续打，只是每个身位都不敢再多露半秒。",
    "{player_e} 的闪光飞得很准，逼得 {opponent_c} 先转头。可后点还有一个人没白，进点依然要靠补枪硬啃。",
    "烟火把 {site} 分成了两个小战场。前点听不到后点，后点看不到包边，谁先把信息拼完整，谁就能先动手。",
    "{player_d} 的警家烟落得很深，直接把 A 点回防视野切断。{rival_team} 只能从连接绕回来，时间被迫烧掉一大截。",
    "{opponent_b} 想隔着烟混点，可 {player_e} 先往烟里反混两枪，逼得对手不敢直接穿点进来。",
    "{player_c} 对着默认穿点位扫了三发，子弹穿过木箱打到 {opponent_a}。不是玄学，是他知道对手每次都喜欢贴那个角。",
    "{caller_name} 没把烟全交在入口，而是留一颗封警家回防。包一下好，{player_b} 就能专心架包边。",
  ],
  highlight: [
    "{player_a} 的 {weapon} 完成了一次漂亮的扫射转移。第一个人从左边出，第二个人从烟边补，第三个人想捡枪，全被同一个弹匣收掉。",
    "{player_d} 消失了半分钟。等 {rival_team} 开始回防时，他已经绕到二楼下方，蹲走偷背身，两枪先拆掉对手的补枪链。",
    "{player_c} 在中路打出一枪穿烟。不是运气，他前两秒听到了脚步停顿，提前把准星放在烟边的常规身位。",
    "{star_player_name} 没有等队友催，自己先把第一条枪线清掉。第二个人横拉出来时，他的准星已经贴在头线。",
    "{player_b} 这一波补枪像排练过。突破位倒下的瞬间，他从同一条线滑出来，把对手刚拿到的优势立刻打没。",
    "{player_c} 的 AWP 没有追求花活，只打一枪就换位置。可就是这一枪，让 {rival_team} 的回防节奏断了整整五秒。",
    "{player_e} 在烟里听到拆包声，没有急着扫。等对手第二次碰包，他才开火，子弹全打在最疼的位置。",
    "{caller_name} 临场叫了一次二段提速，{player_a} 和 {player_b} 几乎同时进点。对手第一条枪线被两个人一起撞碎。",
    "{player_d} 把最后一颗闪留到残局前才交。白光一亮，{star_player_name} 终于拿到干净的关键对枪窗口。",
    "这一波不是单人集锦，而是五个人都刚好站在该站的位置。枪声连成一条线，{rival_team} 的回防被一点点拆开。",
    "{lurker_name} 绕后绕到了警家外侧，面前是背对着他的 {opponent_b}。他没有切刀整活，直接两枪把回防断掉。",
    "{player_c} 盲狙烟雾，子弹从警家烟里穿过去，正好命中准备拆包的 {opponent_a}。他自己都愣了一下。",
    "{star_player_name} 把准星提前放在穿点线上，{opponent_c} 还没完全露出来就被打穿。这个击杀直接让对面不敢再贴烟强拆。",
    "{player_b} 下了一个很难拆的包，然后立刻退到小道外架。{rival_team} 想强排，必须先把两条枪线都清干净。",
  ],
  starHighlight: [
    "{star_player_name} 这波没有停枪。第一名回防刚从警家露头就被扫倒，第二个人想从烟边补枪，他直接把弹道压过去完成扫射转移。第三个人还想捡枪，被同一个弹匣最后几发按在包点外。",
    "{awper_name} 在中路只看到一瞬间肩膀。准星还没完全停稳，他已经完成甩狙，子弹穿过烟边把回防狙打掉。这个击杀不是常规架点，是纯粹的反应和胆子。",
    "{support_name} 的闪光在包点上空炸开，{rival_team} 两个人全白。{entry_name} 没急着追，先让补枪位贴到近点，再一口气把包点清干净。",
    "{anchor_name} 站在后点没有退。火烧到脚边，烟也快封住视野，他还是左键按死一梭子，接住三个往里挤的人，硬把 {rival_team} 逼退到门外。",
    "{caller_name} 临场叫了一套双闪配合。第一颗逼背身，第二颗白二点，{star_player_name} 进点时几乎没有吃到正面枪线，包点像被道具拆开了一样。",
    "{lurker_name} 从小道一路摸到警家外侧，没有多余动作。等 {rival_team} 开始回防，他先断拆包位，再把补枪的人一起带走，这波绕后直接改变了整张图的气味。",
    "{awper_name} 没有等第二次机会。他从连接干拉出来，关键一枪甩掉近点，第二枪立刻切到包边。解说刚喊出名字，回防已经少了两个人。",
    "{star_player_name} 在混烟里听到了拆包声。他没有盲目扫满弹匣，而是先压三发逼停拆包，再等对手重新碰包时穿点命中。这个回合赢在耐心，不是运气。",
  ],
  playerLoss: [
    "{rival_team} 这一回合把第一波信息拿得很准。{player_a} 想从 {site} 入口换枪，可对手的二点补枪已经站好，Team gun 只能被迫退回烟后重新组织。",
    "{player_b} 想把转点做完整，但时间被烟火拖得太久。最后十五秒全队被迫提速，包还没稳定安下去，{opponent_b} 的回防已经踩到包点边缘。",
    "残局没打成。{player} 先假拆想钓人，可 {rival_team} 没急着peek。等第二次真拆，{opponent_a} 和 {opponent_c} 的交叉火力一起压出来。",
    "{player_d} 的补闪慢了半拍，{player_a} 已经先吃到反清枪线。你们不是完全没机会，而是第一波交换亏掉以后，后面的站位全被迫往后缩。",
    "{rival_team} 没急着收人头，只是把 {site} 两侧出口一步步封住。Team gun 枪还在手里，但能选的位置越来越少。",
    "{lurker_name} 这波单摸被提前听到脚步。{opponent_b} 没出去找他，而是等在连接死角，Team gun 还没转点就先少一个人。",
    "警家烟散得太早，{rival_team} 的回防视野重新打开。包点里的人还没站好架包位，第一条枪线就被拆掉了。",
    "{player_b} 想从小道绕后断回防，但 {opponent_c} 回头清得很细。绕后没成，反而让正面少了一个补枪点。",
  ],
  pistolLoss: [
    "手枪局最怕第一波没换到人。{player_a} 想顶第一身位打开缺口，可 {opponent_a} 蹲在近点没有急着开枪，等补枪位露头后才一起收网。",
    "{player_d} 的烟封住入口时慢了一拍，{opponent_b} 从烟边先点掉拆包位。没有长枪兜底的手枪局，少一个人就很难再把包点拿回来。",
    "{player_c} 第一发打中了身体，却没能补上第二发。{rival_team} 立刻把人数优势压到包边，Team gun 的回防被迫变成少打多。",
    "你们的半甲手枪本来要靠抱团补枪，但第一波被对面双人交叉拆开。枪线一断，后面的假拆和补枪都变成了临时救火。",
  ],
  utilityLoss: [
    "{rival_team} 的道具没有乱丢。第一颗火逼退 {player_a}，第二颗闪让 {player_d} 转头，等你们重新架枪时，包点入口已经被对手重新拿回。",
    "{opponent_b} 的高爆落在脚下，{player_a} 和 {player_e} 同时变成大残。你们还能开枪，但每一次对枪都变成一发就倒的风险。",
    "烟墙铺起来以后，Team gun 的报点开始断层。{player_b} 只听到脚步，却看不到人，等烟散开时，{opponent_a} 已经贴到能补枪的位置。",
    "{site} 门口连续吃了两颗闪。第一颗让突破停住，第二颗让补枪错过 timing。你们不是没准备进点，是道具把节奏切成了碎片。",
    "{rival_team} 用燃烧瓶把退路封死，逼着 {player_d} 提前交烟。后面的回防少了关键道具，拆包位只能硬站在枪线里。",
    "{opponent_b} 对着警家烟混了整整一个弹匣。{player_a} 本来想贴烟过点，结果还没看到人就被子弹扫成大残。",
    "{site} 的穿点位被对手提前预瞄。{player_c} 刚想靠箱子换弹，墙后子弹就穿了过来，连补枪都没来得及补。",
    "你们的包点烟没封严，警家和连接之间留了一条缝。{opponent_a} 就从这条缝里看见了拆包位。",
  ],
  economyLoss: [
    "经济局的火力差距很现实。{player_a} 拿着弱枪想抢第一波，可 {opponent_a} 的长枪位没有给任何近身空间，第一把枪没偷到，后面就只能硬熬。",
    "这把钱花得很紧，烟闪不够完整。Team gun 第一波没打穿后，剩下的道具已经撑不起二次进攻，只能被 {rival_team} 慢慢压缩。",
    "半起局最怕第一波没有缴枪。{player_b} 贴烟想捡机会，可对面没有贪，稳稳退到长枪距离，把你们的短枪优势全部化掉。",
    "你们把钱压进这一局，但关键道具还是差一颗。进点时闪光没能覆盖二点，{opponent_b} 只需要稳住准星，就能把进攻切断。",
    "eco 想赢要靠偷枪和叠点，可 {rival_team} 没给单挑。对面先用道具探点，再抱团补枪，Team gun 没能把低概率局变成混战。",
  ],
  readLoss: [
    "{caller_name} 还想沿用上一局的默认节奏，但 {rival_team} 已经提前压到中段。你们刚展开，边线信息就被试掉，转点路线也跟着变窄。",
    "{rival_team} 没有立刻接战，而是把你们习惯的默认枪线一条条拆掉。{player_c} 的架点没错，错在对手已经知道你们会先看哪里。",
    "这波转点被读得太早。{player_b} 的脚步刚离开假点，{opponent_b} 的回防烟就已经落到包点门口，时间直接被烧掉。",
    "对手没有被假动作骗走。{player_a} 在假点交了脚步和道具，可主攻真正落到 {site} 时，里面站着的不是一个人，是完整交叉火力。",
    "默认控图没有拿到真正的信息，反而把自己走成了明牌。最后二十秒被迫提速时，{rival_team} 已经把入口和二点都架好了。",
    "你们的小道单摸已经被对手记住了。{lurker_name} 刚到连接口，{opponent_b} 的反清闪就爆在脸上，后路也被锁死。",
    "{rival_team} 没去赌点，而是先把警家烟、连接烟和中路前压全对上。你们每条控图路线都有人等。",
    "{caller_name} 想靠假打拉动回防，可对手只动了一个人。警家还站着两个，主攻真正落点时，包点里根本不是空的。",
  ],
  clutchLoss: [
    "残局差的不是勇气，是关键对枪之后的第二个位置。{player} 点掉第一个人后没法立刻转走，{opponent_c} 从侧面补出来，把最后的空间收掉。",
    "假拆没有骗出枪声。{rival_team} 两个人都很沉得住气，等 {player_d} 第二次碰包时，交叉火力才一起压出来。",
    "回防路线已经清到最后一步，可拆包时间不够了。{player_b} 刚蹲下去，{opponent_b} 的烟后穿射就把钳子打断。",
    "{star_player_name} 只剩一点血，还要同时处理包边和外场两条枪线。关键一枪中了，第二枪差了半个身位，残局就这样滑掉。",
    "最后十秒语音很安静，但局面没有变简单。Team gun 需要一次完美同步，可 {rival_team} 没给同步的窗口。",
    "{player} 已经把第一个回防骗出来了，可第二个人没有跟枪。等他再回头，拆包时间和血量一起见底。",
    "这波不是没人敢打，是每个人都晚了半秒。{opponent_b} 先把包边清掉，{opponent_c} 再从侧翼补上，残局被稳稳收走。",
    "{star_player_name} 想把对手拆成两次单挑，但 {rival_team} 没给他这个机会。两个人一起拉，关键一枪打中也救不了第二条线。",
    "假拆声音响起时，对手没有动。Team gun 等不到枪声，只能自己先露，结果刚好撞进双人交叉火力。",
    "{player_b} 已经摸到拆包位，坏在少了一颗烟。拆包声刚起，对手就从长线压出来，把最后的希望打断。",
    "残局拖到最后五秒，所有选择都变成坏选择。保枪太晚，硬拆太危险，找人又没时间。",
    "{rival_team} 没有给英雄局。第一名队员只负责拖，第二名队员只负责补，Team gun 的最后一把枪被一点点耗死。",
    "下包后架包位没站住，{opponent_b} 从警家烟后摸到包边。{player_b} 听见拆包声再拉，已经慢了半拍。",
    "这个包下得不够深，{rival_team} 有拆弹套的时候根本不用完全露身位。{player} 想穿点阻止拆包，却只打到墙边。",
    "{player} 猜到对手会强拆，提前对着包点木箱穿了几枪。可对面假拆之后立刻退开，子弹全打空了。",
  ],
  clutch: [
    "1v2。{player} 只剩 {hp} 血，C4 的声音越来越急。一个人在包边，一个人在 {site} 外架回防，这种残局不能靠喊，只能靠细节处理。",
    "最后二十秒，语音突然安静。{player} 没再问任何人，他先听脚步，再看烟散，最后才把准星挪到假拆后最可能被拉的位置。",
    "这不是集锦里的轻松残局。{player} 手里有枪，但没道具；有位置，但没血量。赢下来是英雄，输掉就是经济和比分一起断。",
    "{player} 没有急着碰包，先往后退了半步。对手以为他要保枪，刚松第一下身位，准星已经等在常规回防线上。",
    "包点边只剩一个小角度能站。{player} 没有多余动作，先清近点，再把枪口拉回长箱。残局被他硬拖成了两次 1v1。",
    "{site} 的烟快散完了，拆包声一响，对手第一反应就是横拉。{player} 等的就是这一下，关键一枪稳住，第二枪才有故事。",
    "这波残局没有谁能替 {player} 做决定。队友的报点已经用完，剩下只有脚步、雷包倒计时和他手里那把枪。",
    "{player} 先假碰一下包，没有贪第二次。对手忍不住从掩体后挪出半个身位，他立刻把枪线压过去。",
    "最后十几秒，镜头只给到 {player} 的准星。对面两个人都知道他位置，他也知道对面一定会一起拉。",
    "{player} 只剩一点血，但位置还没暴露。他没有找英雄式的大拉，只把自己藏在对手最容易漏看的那条线后面。",
    "包点里的声音很乱，脚步、拆包、换弹全挤在一起。{player} 先不看包，先看人，因为这一局先活下来才有拆包机会。",
    "残局被压到最后一口气。{player} 手里没有完整道具，只能靠预瞄和移动把两个回防拆开。",
    "下包后，{player} 没守在包点里，而是退到小道外架。对手一碰包，他就能顺着声音穿点，不用看见人也能拖时间。",
    "{player} 先封警家烟，再退到连接口。这个站位不贪人头，只要对手强拆，他就能第一时间拉出来打拆包位。",
    "对面以为 {player} 躲在包边，结果他已经绕到警家后侧。拆包声刚响，他从背后拉出来，把残局拆成最干净的一枪。",
  ],
};

function renderCombatBeat(role, variables, seed = 0, overrides = {}, picker) {
  const pool = combatBeatLibrary[role] ?? combatBeatLibrary.trade;
  const picked = picker
    ? picker(`combat:${role}`, pool, seed)
    : pickWeighted(pool, seed, 0);
  return fillTemplate(picked, {
    ...variables,
    ...overrides,
    site: overrides.site ?? pickWeighted(narrativeSites, seed + 1, 0),
    time: overrides.time ?? String(12 + Math.abs(seed % 11)),
    hp: overrides.hp ?? String(14 + Math.abs(seed % 22)),
  });
}

function renderLossBeat(cause, variables, seed = 0, overrides = {}, picker) {
  const role = {
    pistol: "pistolLoss",
    utility: "utilityLoss",
    economy: "economyLoss",
    read: "readLoss",
    clutch: "clutchLoss",
  }[cause] ?? "playerLoss";
  return renderCombatBeat(role, variables, seed, overrides, picker);
}

function starHighlightWeight(player) {
  let weight = 4;
  weight += Math.max(0, player.firepower - 72) * 0.55;
  weight += Math.max(0, player.clutch - 72) * 0.45;
  weight += Math.max(0, player.tactics - 75) * 0.18;
  if (player.traits.includes("streaky_star")) weight += 8;
  if (player.traits.includes("calm_clutcher")) weight += 5;
  if (player.traits.includes("crowd_favorite")) weight += 4;
  if (player.traits.includes("disciplined")) weight += 2;
  if (player.role === "entry") weight += 6;
  if (player.role === "awp") weight += 6;
  if (player.role === "lurker") weight += 4;
  if (player.role === "support") weight += 3;
  if (player.id === "donk") weight += 10;
  if (player.id === "monesy") weight += 8;
  if (player.id === "zywoo") weight += 7;
  if (player.id === "sh1ro") weight += 5;
  if (player.id === "niko") weight += 6;
  if (player.id === "ropz") weight += 4;
  return Math.max(3, Math.round(weight));
}

function pickStarHighlightFocus(roster, seed = 0, recentHighlightIds = []) {
  const eligible = roster.filter((player) => player && (player.role !== "igl" || player.firepower >= 72 || player.traits.includes("streaky_star")));
  const pool = eligible.length ? eligible : roster;
  const recent = new Set(recentHighlightIds);
  const weighted = pool.map((player) => {
    const recentPenalty = recent.has(player.id) ? 0.35 : 1;
    return { player, weight: Math.max(1, Math.round(starHighlightWeight(player) * recentPenalty)) };
  });
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = Math.abs(seed * 37 + 17) % Math.max(1, total);
  for (const entry of weighted) {
    if (cursor < entry.weight) return entry;
    cursor -= entry.weight;
  }
  return weighted[0] ?? { player: roster[0], weight: 1 };
}

function buildHighlightVariables(baseVariables, focus, roleSlots = {}) {
  const player = focus.player;
  const variables = { ...baseVariables };
  variables.star_player_name = player.name;
  variables.star_id = player.id;
  if (player.role === "entry") variables.entry_name = player.name;
  if (player.role === "awp") variables.awper_name = player.name;
  if (player.role === "support") variables.support_name = player.name;
  if (player.role === "lurker") variables.lurker_name = player.name;
  if (player.role === "igl") variables.caller_name = player.name;
  if (player.role === "rifler" || player.traits.includes("disciplined")) variables.anchor_name = player.name;
  return {
    ...variables,
    entry_name: variables.entry_name ?? roleSlots.entry?.name ?? baseVariables.entry_name,
    support_name: variables.support_name ?? roleSlots.support?.name ?? baseVariables.support_name,
    anchor_name: variables.anchor_name ?? roleSlots.anchor?.name ?? baseVariables.anchor_name,
    caller_name: variables.caller_name ?? roleSlots.caller?.name ?? baseVariables.caller_name,
    lurker_name: variables.lurker_name ?? roleSlots.lurker?.name ?? baseVariables.lurker_name,
    awper_name: variables.awper_name ?? roleSlots.awper?.name ?? baseVariables.awper_name,
  };
}

function starHighlightPoolForFocus(player) {
  const pool = combatBeatLibrary.starHighlight;
  if (player.role === "entry" || player.traits.includes("hot_blooded")) return [pool[0], pool[2], pool[4]].filter(Boolean);
  if (player.role === "awp") return [pool[1], pool[6], pool[7]].filter(Boolean);
  if (player.role === "support") return [pool[2], pool[3], pool[4]].filter(Boolean);
  if (player.role === "lurker") return [pool[5], pool[7]].filter(Boolean);
  if (player.role === "igl") return [pool[4], pool[2]].filter(Boolean);
  if (player.traits.includes("calm_clutcher")) return [pool[6], pool[7], pool[5]].filter(Boolean);
  if (player.traits.includes("disciplined")) return [pool[3], pool[4], pool[7]].filter(Boolean);
  return pool;
}

function renderStarHighlightBeat(focus, variables, seed, picker) {
  const pool = starHighlightPoolForFocus(focus.player);
  const picked = picker
    ? picker(`combat:starHighlight:${focus.player.role}`, pool, seed)
    : pickWeighted(pool, seed, 0);
  return fillTemplate(picked, variables);
}

function buildStarHighlightCard(roster, variables, opponentTeam, seed, picker) {
  const hasStar = roster.some((player) => player.name === "donk" || player.name === "m0NESY" || player.price >= 20 || player.traits.includes("streaky_star"));
  if (!hasStar && Math.abs(seed) % 4 !== 0) return undefined;
  const focus = pickStarHighlightFocus(roster, seed + 61);
  const highlightVariables = buildHighlightVariables(variables, focus, {
    entry: roster.find((player) => player.name === variables.player_a),
    support: roster.find((player) => player.name === variables.player_d),
    anchor: roster.find((player) => player.name === variables.anchor_name),
    caller: roster.find((player) => player.name === variables.caller_name),
    lurker: roster.find((player) => player.name === variables.lurker_name),
    awper: roster.find((player) => player.name === variables.player_c),
  });
  const highlightText = renderStarHighlightBeat(focus, highlightVariables, seed + 61, picker);
  return {
    type: "story",
    kind: "star-highlight",
    mapIndex: 2,
    title: "第 3 局 · 个人名场面",
    text: `${highlightText}\n\n这种回合不会每场都出现，但一旦打出来，就会被剪进整届杯赛的回放里。`,
    result: `${focus.player.name} 和队友把这一波打成了真正的名场面，Team gun 的语音瞬间被点燃。`,
    score: [0, 0],
    delta: `名场面 · ${focus.player.name} 个人高光`,
    highlightPlayerId: focus.player.id,
    highlightPlayerName: focus.player.name,
    highlightTeamId: "player-team",
    highlightTeamName: PLAYER_TEAM,
    highlightMoment: highlightText,
    playerDelta: mergePlayerDeltaEntries([[focus.player.id, { kills: 2, impact: 5 }], [variables.support_id, { assists: 1, impact: 2 }]]),
    opponentDelta: mergeNamedDeltaEntries([[(opponentTeam.stars[1] ?? opponentTeam.stars[0]), { deaths: 1 }], [(opponentTeam.stars[2] ?? opponentTeam.stars[0]), { deaths: 1 }]]),
  };
}

const opponentAdvantageHighlightTemplates = [
  "{opponent} 没有急着 peek，而是等烟边脚步停住才横拉出来。{player_a} 刚准备补枪就被点掉，{rival_team} 靠这波反清把前期压力全部打回来了。",
  "{opponent_b} 从小道绕后，先断掉 {player_d} 的补闪，再回头收掉想补枪的 {player_b}。这不是乱摸，是对面提前读到了你们的转点时间。",
  "{opponent} 在残局里没有给假拆反应。第一下不动，第二下才拉出来，刚好把 {player_c} 的拆包动作打断。Team gun 的残局被他一个人按住。",
  "{rival_team} 的道具配合非常干净：火先逼退 {player_a}，闪再白住 {player_d}，最后由 {opponent} 混烟打掉包边。你们不是没开枪，是节奏被对手拆碎了。",
  "对面粉丝区突然炸开，因为 {opponent} 在警家单摸成功，连续摸掉两名回防。那一瞬间，Team gun 的语音明显慢了半拍。",
  "{opponent_b} 没贪枪，先封烟再退二点。等你们以为包点空了，他和 {opponent} 一起从两侧回拉，把进攻压力变成了你们的残局压力。",
];

function opponentPlayerIdByName(name) {
  return players.find((player) => player.name === name)?.id ?? name?.toLowerCase?.().replace(/[^a-z0-9]+/g, "-");
}

function buildOpponentHighlightCard(roster, variables, opponentTeam, seed) {
  if (!opponentTeam?.stars?.length) return undefined;
  const opponentStats = opponentTeam.stats ?? opponentTeam.base ?? {};
  const power = (opponentStats.firepower ?? 75) + (opponentStats.clutch ?? 75) + (opponentStats.tacticalExecution ?? 75);
  const shouldAppear = power >= 235 || Math.abs(seed) % 3 === 0;
  if (!shouldAppear) return undefined;
  const starIndex = Math.abs(seed + Math.round(power)) % Math.min(3, opponentTeam.stars.length);
  const starName = opponentTeam.stars[starIndex] ?? opponentTeam.stars[0];
  const template = opponentAdvantageHighlightTemplates[Math.abs(seed + starName.length * 11) % opponentAdvantageHighlightTemplates.length];
  const text = fillTemplate(template, {
    ...variables,
    opponent: starName,
    opponent_a: starName,
    opponent_b: opponentTeam.stars[(starIndex + 1) % opponentTeam.stars.length] ?? starName,
    opponent_c: opponentTeam.stars[(starIndex + 2) % opponentTeam.stars.length] ?? starName,
  });
  const fallen = roster[Math.abs(seed + 3) % roster.length] ?? roster[0];
  return {
    type: "story",
    kind: "opponent-highlight",
    mapIndex: 3,
    title: `第 4 局 · ${opponentTeam.name} 打出回应`,
    text: `${text}\n\n这种对手优势回合会让场馆气氛瞬间倒向另一边，也会让交易市场重新评估这名选手的价值。`,
    result: `${starName} 用这一波把 Team gun 的节奏打断。比分还没立刻写死，但你能感觉到，对手的信心被点起来了。`,
    score: [0, 0],
    delta: `对手名场面 · ${starName} 打穿一波关键回合`,
    hiddenSwing: -2,
    highlightMoment: `${starName} 面对 Team gun 打出关键回合：${text}`,
    highlightPlayerId: opponentPlayerIdByName(starName),
    highlightPlayerName: starName,
    highlightTeamId: opponentTeam.id,
    highlightTeamName: opponentTeam.name,
    playerDelta: fallen ? mergePlayerDeltaEntries([[fallen.id, { deaths: 1 }]]) : {},
    opponentDelta: mergeNamedDeltaEntries([[starName, { kills: 2, impact: 5 }]]),
  };
}

const openingFailureTemplates = [
  "{opponent} 吃满双闪从 {site} 顶出来，{player_a} 的准星还没收稳就先倒了。首杀给了 {rival_team}，这一局上来就是 4v5。",
  "{player_d} 刚把默认烟补上，{opponent_b} 的燃烧弹就把他从 {site} 烫了出来。{player_a} 想补枪，结果一起被白，Team gun 第一波就先掉两人。",
  "{caller_name} 还在报默认信息，{opponent} 已经从 {site} 干拉拿到了开局主动权。你们不是没准备，只是这波先被对手踩到了 timing。",
  "{player_a} 想用第一身位把节奏抢回来，可 {opponent_b} 没露大身位，只用一颗反清闪逼你们停在入口。第一波对枪没打成，后面全变成补救。",
  "{rival_team} 的第一波前压不是乱赌。{opponent} 拿到脚步后立刻退回二点，等 Team gun 追进来时，补枪位已经全部到齐。",
];

const utilityStallTemplates = [
  "{rival_team} 把烟火一层层铺满 {site}。{player_d} 的灭火烟交慢了一步，{player_a} 只能贴墙干等，时间被白白烧掉 {time} 秒。",
  "{opponent_b} 先用高爆把 {player_a} 炸成大残，后手火又封死了退路。你们这波不是没想打，是根本没拿到出手空间。",
  "{site} 的第一颗闪白得太结实，{player_a} 转头躲闪时，{opponent} 已经从烟边补出来了。枪线刚架好就被道具拆散。",
  "{player_d} 交烟想灭火，可烟落点偏了一点，火线还是把进点节奏切断。Team gun 被迫停在门口，枪线一停，对手回防就舒服了。",
  "{rival_team} 连续用烟和火拖时间，不给你们干拉的机会。等 {caller_name} 终于喊出提速，计时器已经把容错吃得差不多了。",
];

const defaultReadTemplates = [
  "{caller_name} 想继续用默认控图把信息拖出来，但 {rival_team} 明显已经在等这套。中路和边线同时被前压试掉，你们的默认在二十秒内就被读穿。",
  "{rival_team} 没急着接战，而是先用烟把 {site} 封死，再让 {opponent_b} 从另一路前压摸信息。{player_c} 的架点没问题，问题是对手已经知道你们会怎么铺开。",
  "{player_b} 还在慢清角落，{opponent} 的试探枪线已经把 {site} 两边都照了出来。默认没控到图，反而把自己走成了明牌。",
];

const fakeFailTemplates = [
  "脚步和烟都做满了，可 {rival_team} 根本没转。{opponent} 故意把假点声音放给你们听，等你们真正转到 {site} 时，回防枪线已经全部架死。",
  "{caller_name} 这波想假打骗转，但 {rival_team} 的指挥完全没上钩。你们转点的脚步刚落下，{opponent_b} 的回防烟已经从天上砸了下来。",
  "{player_a} 在假点把脚步和道具全交了，结果对面只留下一个人拖时间。等主攻真正落到 {site}，包点里早就站满了人。",
];

const forceBuyFailTemplates = [
  "这把强起本来就得靠第一波枪法翻。{player_a} 拿着弱枪干拉没打过，第一把枪没缴下来，整局就很难再翻。",
  "{player_b} 想用少道具强行抢下首杀，可 {opponent} 的长枪位根本没给近身机会。强起没换到枪，后面的进攻只能硬吃装备差。",
  "你们把钱全砸进这一局，可进点时只剩一颗闪。{rival_team} 顶住第一波以后，强起的后劲立刻见底。",
  "这不是买得起就等于打得动。Team gun 枪械够了，道具却不完整，第一波没打穿后，二次组织缺的正好是那颗关键闪。",
  "半起局要么偷到枪，要么拖成乱战。可 {rival_team} 没给乱战机会，先退距离再抱团补枪，把你们的赌局拆得很干净。",
];

const clutchSetupTemplates = [
  "残局被拖成 1v2。{star_player_name} 只剩 {hp} 血，烟边一边是假拆位，一边是回防交叉火。全场都知道这个残局能不能顶住。",
  "包已经下了，但 {star_player_name} 的位置被逼得很死。{rival_team} 一左一右夹着回防，他只能赌关键一枪先准。",
  "最后二十秒，画面里只剩 {star_player_name} 和两条回防枪线。语音已经安静了，剩下的全是脚步和拆包声。",
  "{star_player_name} 退到包点边缘，先不碰包，也不急着找人。他等的是对手回防第一颗烟交出去后的那两秒空档。",
  "残局进入 1v2 后，{rival_team} 没有急着送枪。一个人封住包边，一个人慢慢清侧翼，逼着 {star_player_name} 自己先做选择。",
  "雷包已经开始急促作响，{star_player_name} 的血量不多，但他还握着唯一的主动权：对面不知道他到底要先假拆，还是先清枪线。",
  "回防两个人站得很开，想用交叉火力把 {star_player_name} 锁死。这个残局能不能活，取决于他能不能把两条枪线拆成两次单挑。",
  "{site} 的烟还剩最后一点边缘，{star_player_name} 就卡在那条灰线后面。再等一秒，拆包时间不够；早动一步，对面就能一起拉。",
];

const bombFailureTemplates = {
  time_ran_out: [
    "{caller_name} 想把假动作做满，可 {rival_team} 用烟和火把入口一层层拖住。等 C4 真正准备进点时，计时器已经掉到最后十秒，你们连包都没能安下去。",
    "{player_a} 还想再确认一个角度，结果时间被 {rival_team} 活活拖没。最后全队冲进 {site} 的时候，回合已经结束了。",
  ],
  defuse_failed: [
    "{player_b} 已经摸到了包边，可 {opponent_b} 的烟后穿射把拆包节奏彻底打断。假拆没骗出来，真拆也没来得及。",
    "{player_d} 顶着烟去碰包，拆包声刚响，对面的补枪就从两侧一起压了过来。回防没踩死点，但拆包还是差了一口气。",
  ],
  killed_on_defuse: [
    "{player_d} 已经把钳子按在包上了，可 {opponent} 就在最后一秒从烟边横拉出来。拆包动画没走完，人先倒了。",
    "回防的路线其实已经清得差不多了，坏就坏在最后这一枪。{player_c} 刚蹲下拆包，就被 {opponent_b} 一发点穿头盔。",
  ],
  fake_defuse_caught: [
    "{star_player_name} 想用假拆把人钓出来，可 {rival_team} 完全不吃这套。等他第二次再去碰包，交叉火力已经把出口全部锁死。",
    "{caller_name} 设计的是假拆反清，但 {opponent} 没急。对手把枪线架到最后一秒，你们既没骗到人，也没抢到拆包时间。",
  ],
};

const preMatchAtmospherePool = [
  "大屏幕上跳出两队阵容的那一刻，观众席炸了一下。这是 CS 杯，不是训练赛，空气都不一样。",
  "场馆的灯光压下来，选手席只剩键盘灯和耳机里的倒计时。对手入场时，前排观众已经开始喊他们的名字。",
  "镜头扫过选手席，每个人都在调鼠标线和耳机位置。你能听见观众席的低鸣，像一波还没砸下来的浪。",
  "裁判确认设备，解说开始介绍首发。屏幕上的头像一个个亮起来，训练室里的东西到这里都要兑现。",
  "第一张地图载入时，场馆突然安静了一秒。那一秒之后，所有声音都涌了回来。",
];

const coachPepTalkPool = [
  "你们练了三个月就为了这一局。你拍了拍 {caller_name} 的肩膀，别浪费。",
  "别想着刚才那一分了。你看着五个人说：先听指挥，补枪到位，剩下交给准星。",
  "你没有讲大道理，只把白板上的路线擦掉重画了一遍：这回合我们只做一件事，把第一波补枪接住。",
  "暂停时间很短，你只说了最重要的那句：他们可以读我们一局，但不能一直读我们。",
  "你把声音压得很低：这不是崩盘，这是给我们一次重新站位的机会。",
  "你看向替补席，又看回首发：先把队伍重新拧到一起，按同一套思路把这一局打完。",
];

const epicMomentPool = [
  "全场起立。解说已经喊破了音，但没人听得清他在说什么，观众席炸开了。",
  "这一枪打完，镜头切到观众席，有人双手抱头，有人已经站到椅子前面。",
  "回放在大屏幕上连放两遍，第二遍响起时，欢呼声比第一遍还大。",
  "这不是常规回合，这是赛后一定会被剪进集锦里的那种回合。",
  "选手席后面的工作人员都站了起来。你知道，这一刻会被他们记很久。",
  "场馆里那股声浪不是庆祝一分，而是在告诉所有人：这场比赛还没完。",
];

const crowdReactionPool = [
  "观众席倒吸了一口气，随后才爆出掌声。每个人都知道刚才那波差一点就崩了。",
  "看台上有人举起横幅，镜头扫过去的一瞬间，队员们也看见了。",
  "对手粉丝开始起哄，声音一层盖过一层。你能看出队员在努力把注意力拉回准星。",
  "解说还在回放上一波，道具已经在新一局飞出去。比赛不会等任何人缓过来。",
  "场馆里突然响起一阵整齐的喊声，像是在提醒你们：这里每一分都会被放大。",
];

const postMatchWinPool = [
  "你走下选手席，场馆的灯光打在脸上。解说在喊：这就是 CS，这就是 {cup_name}。",
  "队员们没有立刻庆祝，只是互相拍了拍肩。那种笑不是轻松，是终于把一口气吐出来。",
  "对手走过来碰拳的时候，你能感觉到这轮 BO5 的重量还挂在每个人手上。",
  "观众席还在喊，队员却已经开始聊刚才那波残局。赢了，但每个人都知道这轮 BO5 是一点点啃下来的。",
  "镜头对准你们的队标，后台工作人员也跟着鼓掌。这一关，至少先过了。",
];

const postMatchLosePool = [
  "通道很长。你走在队伍最后面，听到对面 {rival_team} 的庆祝声从后面传过来。",
  "队员们摘下耳机后没有人立刻说话。失败不是一瞬间砸下来的，是几个细节一点点堆出来的。",
  "你看了一眼比分牌，又看了一眼还没关掉的电脑屏幕。问题很清楚，只是现在没人想先开口。",
  "对手在舞台另一侧庆祝，你们这边只剩键盘声和收线声。下一杯之前，这些回合都要重新拆开。",
  "你没有急着训话。输掉的那几波已经够疼了，真正有用的话要留到复盘室里说。",
];

const inMatchSurprisePool = [
  {
    title: "第 3 局 · 耳机故障",
    text: "{player_b} 摘了一下耳机，皱着眉看向裁判。不是完全听不到，而是左耳一直有电流声。暂停很短，队伍只能先把报点再简化一遍。",
    result: "这一局你们少了很多细碎信息，只能靠最基础的站位和补枪链撑住。",
    delta: "突发情况 · 沟通压力上升",
  },
  {
    title: "第 3 局 · 全场起哄",
    text: "对手拿下一个漂亮回合后，全场开始起哄。声音从看台顶上压下来，像是在逼你们立刻回应。",
    result: "你让队员别急着回嘴，先把下一波默认站稳。观众可以吵，但枪线不能乱。",
    delta: "观众施压 · 纪律接受考验",
  },
  {
    title: "第 3 局 · 对手挑衅",
    text: "{opponent} 打完首杀后站起来喊了一句，镜头正好切到他脸上。你的队员都听见了，也都看见了。",
    result: "{player_a} 想立刻打回去，但 {caller_name} 把他按在了原战术里。回应可以有，不能乱给。",
    delta: "情绪升温 · 首杀欲望变强",
  },
  {
    title: "第 3 局 · 手感爆发",
    text: "{star_player_name} 刚才那波连点之后，坐姿都变了。不是夸张的兴奋，而是手感爆发以后那种准星已经跟手连在一起的状态。",
    result: "队友开始主动给他让关键对枪位置，对手也开始多交一颗闪来限制他。",
    delta: "明星手感升温 · 对手开始针对",
  },
  {
    title: "第 3 局 · 队内摩擦",
    text: "回合结束后，两个人同时开口复盘同一个失误，语音里短暂撞在一起。没人真的吵起来，但节奏确实乱了一下。",
    result: "你把讨论压到赛后，只留下下一局的站位。现在不是追责的时候。",
    delta: "队内摩擦 · 配合压力上升",
  },
  {
    title: "第 3 局 · 看台横幅",
    text: "镜头扫到看台，有人举着写给 Team gun 的横幅。队员们看见了，一瞬间表情都变了一点。",
    result: "这不是直接加枪法的东西，但它让队伍知道，屏幕另一端确实有人在等他们打回来。",
    delta: "看台回应 · 士气回暖",
  },
  {
    title: "第 3 局 · 被反制",
    text: "{rival_team} 明显读到了你们的开局习惯。第一颗反清闪来得太快，{player_a} 还没站稳就被迫退回掩体。",
    result: "这不是单纯枪法输，是战术信息被拿走了。后面再重复同一套，会越来越难打。",
    delta: "开局被读 · 战术压力上升",
  },
  {
    title: "第 3 局 · 技术暂停",
    text: "裁判举手示意技术暂停。屏幕停在冻结时间，选手们不能继续讨论战术，只能坐在原位等。",
    result: "节奏被硬生生切断。对领先方是降温，对落后一方反而像一次喘息。",
    delta: "技术暂停 · 节奏重置",
  },
  {
    title: "第 2 局 · 鼠标临时更换",
    playerType: "star",
    text: "{star_player_name} 点射时突然感觉鼠标微动不跟手。技裁确认后换了备用鼠标，灵敏度虽然调回来了，但手感不可能一秒钟完全接上。",
    result: "{caller_name} 让全队先别把关键对枪窗口全交给他，正面改成双人补枪。明星位还在，但这一局必须有人帮他兜底。",
    delta: "设备故障 · 明星手感波动",
  },
  {
    title: "第 2 局 · 屏幕掉帧",
    text: "{player_a} 的画面卡了一下，再恢复时对手已经贴到近点。裁判没有判重开，比赛继续，Team gun 只能立刻把后续站位补上。",
    result: "这不是战术错误，却会真实打断节奏。队伍如果继续急着找回这分，后面的默认也会变形。",
    delta: "技术插曲 · 状态波动",
  },
  {
    title: "第 2 局 · 道具反弹",
    playerType: "puzzle",
    text: "{player_d} 的烟砸在门框上弹了回来，正好封住了自己人的第一条枪线。{player_a} 已经顶到入口，只能硬退半步等烟散。",
    result: "{player_d} 立刻在语音里认错，{caller_name} 没让队伍纠结这颗烟，直接改成慢清小道。失误没有消失，但至少没有扩散成互相指责。",
    delta: "道具失误 · 节奏被打乱",
  },
  {
    title: "第 3 局 · 语音重叠",
    text: "语音里同时响起三段信息：{caller_name} 在叫转点，{player_d} 在报道具，{player_e} 又在补上一波死亡位置。不是没人报点，是所有信息挤在一起，反而没人听清。",
    result: "{caller_name} 把下一波口令压短：先报人数，再报位置，复盘等回合后。语音终于重新回到同一条线上。",
    delta: "沟通混乱 · 指挥权威接受考验",
  },
  {
    title: "第 3 局 · 红温前压",
    playerType: "volatile",
    text: "{player_a} 连续两次开局对位没打过，声音明显高了起来。下一局冻结时间还没结束，他已经在说要去同一个点把人找回来。",
    result: "{caller_name} 没让他单独去赌，而是给他配了一颗反清闪和第二身位补枪。火气可以用，不能让它自己冲出去送。",
    delta: "情绪升温 · 高风险开局",
  },
  {
    title: "第 3 局 · 沉默的防守者",
    playerType: "puzzle",
    text: "{player_d} 上一波道具失误以后明显少说话了。{caller_name} 问他还有几颗闪，他停了半秒才回答。",
    result: "{star_player_name} 主动接了一句“我帮你架这条线”。这句话不长，但足够让防守者重新把道具丢出去。",
    delta: "拼图位压力 · 需要队友托住",
  },
  {
    title: "第 3 局 · 明星被舆论追着跑",
    playerType: "star",
    text: "大屏幕刚切到 {star_player_name}，解说就提到他最近被社媒反复讨论：有人说他该接管比赛，也有人说 Team gun 太依赖他。",
    result: "聚光灯不一定让人更准，有时只会让每一次空枪都变得更响。你们必须让体系给他空间，而不是把整场都压在他一把枪上。",
    delta: "舆论压力 · 明星状态波动",
  },
  {
    title: "第 4 局 · 私生活被放大",
    playerType: "star",
    text: "赛间短休时，工作人员把手机递给你看了一眼：关于 {star_player_name} 私生活的讨论突然冲上热搜。队员没说破，但训练室外的噪音已经挤进了选手席。",
    result: "你让工作人员收走手机，比赛里只留下一句：先打完这张图。现实就是这样，明星选手的场外声音会比普通队员更容易被放大。",
    delta: "场外噪音 · 明星专属压力",
  },
  {
    title: "第 4 局 · 首发位置焦虑",
    playerType: "puzzle",
    text: "{player_d} 看了一眼替补席，又看了一眼自己的 KDA。作为拼图位，他不是怕输给对手，而是怕自己这场以后失去首发位置。",
    result: "{caller_name} 没给空话，只把下一局道具分工说清楚：你负责第一颗烟，我们全队按这颗烟走。明确责任比安慰更有用。",
    delta: "轮换压力 · 拼图位状态波动",
  },
  {
    title: "第 4 局 · 对手挑衅",
    text: "{opponent} 赢下残局后没有立刻坐下，而是朝镜头摊手。全场起哄，Team gun 这边每个人都看见了。",
    result: "{caller_name} 只说了两个字：打他。下一波不是无脑复仇，而是把对手爱站的位置写进战术板。",
    delta: "对手挑衅 · 心理战升温",
  },
  {
    title: "第 4 局 · 明星对位",
    playerType: "star",
    text: "{star_player_name} 和 {opponent} 在 A 大门对位了十秒。两个人都知道对方在架，也都不愿意先让出那条线。",
    result: "这种顶级对位不是单纯拼枪，背后是队友给不给闪、补枪到不到位、谁先被迫交出身位。聚光灯越亮，体系越不能断。",
    delta: "明星对位 · 聚光灯效应",
  },
  {
    title: "第 4 局 · 对手战术针对",
    text: "{rival_team} 连续三局在你们转点路线上提前埋人。不是巧合，他们已经开始读 Team gun 的默认和第二时间换位。",
    result: "{caller_name} 立刻把下一波改成短默认后提速。对手准备的是旧节奏，你们至少要让他们多想一层。",
    delta: "被针对 · 需要战术调整",
  },
  {
    title: "第 4 局 · 观众干扰",
    text: "{rival_team} 的粉丝团开始有节奏地喊队名，声浪一层一层压下来。耳机能隔掉噪音，隔不掉每个队员都知道自己正在被盯着的感觉。",
    result: "{player_d} 带头说了一句：让他们喊，我们打我们的。队伍没有被声音带走，至少这一波语音还稳。",
    delta: "客场压力 · 心态考验",
  },
  {
    title: "第 4 局 · 规则争议",
    text: "C4 下包位置引发争议，裁判暂停检查。选手不能继续讨论战术，只能坐在原位等裁定，手感被硬生生晾在空气里。",
    result: "裁判维持原判。{caller_name} 第一时间把注意力拉回下一波：别和裁判打比赛，和对面打。",
    delta: "规则争议 · 节奏中断",
  },
  {
    title: "第 4 局 · 点位连续被破",
    playerType: "puzzle",
    text: "{site} 连续两局被对手打穿，{player_e} 的防守压力越来越重。对方不是只靠枪法，而是在专门打你们这条防线的补枪间隔。",
    result: "{caller_name} 没把锅丢给个人，直接把 {player_c} 调过来双架。点位要靠结构守，不是靠一个人硬扛。",
    delta: "点位压力 · 防守结构调整",
  },
  {
    title: "第 4 局 · 混起路线",
    text: "钱不够漂亮，但也不是完全不能打。{caller_name} 看着几把手枪和两把长枪，说了一句：够了，我们把这局打成混战。",
    result: "混起局没有稳定答案。你们靠叠点和穿烟拿到第一把枪，下一步能不能滚起来，全看补枪链有没有接住。",
    delta: "混起博弈 · 容错很低",
  },
  {
    title: "第 5 局 · 极限拆包",
    text: "{star_player_name} 蹲在包边，C4 的声音已经连成一条线。烟外有人在架，烟里看不清钳子到底还差多少。",
    result: "他没有靠喊解决残局，只靠关键一枪和拆包节奏把对手逼出来。这个回合无论输赢，都会进赛后复盘。",
    delta: "极限拆包 · 高压残局",
  },
  {
    title: "第 5 局 · 关键局误判信息",
    text: "{caller_name} 根据脚步判断对手要打 {site}，立刻把三个人调过去。可那套声音是做给你们听的假动作，真正的雷包已经在另一边落地。",
    result: "误判不等于崩盘，但回防时间已经被烧掉。Team gun 只能用更少的人数去补一个已经被下好的包。",
    delta: "信息误判 · 回防被拖慢",
  },
  {
    title: "第 5 局 · 解说声浪",
    text: "上一波团战回放在大屏幕连播两遍，解说的声音已经破了。选手席能听见那股声浪，却不能让它替自己开枪。",
    result: "{star_player_name} 笑了一下，又把耳机压紧。被认可当然好，但下一波仍然要从第一颗烟开始打。",
    delta: "聚光灯效应 · 心态升温",
  },
  {
    title: "第 5 局 · 粉丝应援",
    text: "看台角落有人举着 Team gun 的手绘旗子。画得不算整齐，但那面旗举得很高，连替补席都看见了。",
    result: "这不会直接让准星变稳，却会让人知道这一局不是只打给屏幕里的五个人看。",
    delta: "粉丝力量 · 士气回暖",
  },
  {
    title: "第 2 局 · 键盘断触",
    text: "{player_a} 急停的时候人物多滑了半个身位，整个人直接露在 {site} 的枪线里。他低头看了一眼键盘，W 键像是没有完全弹起来。",
    result: "{caller_name} 立刻让正面改成双人补枪，先别让 {player_a} 再单独拿第一身位。硬件问题不能当借口，但这一局的节奏确实被切了一刀。",
    delta: "键盘断触 · 操作受限",
    hiddenSwing: -1,
    playerDelta: {},
    opponentDelta: { opponent: { kills: 1, impact: 2 } },
  },
  {
    title: "第 2 局 · 网络波动",
    text: "场馆网络突然抖了一下，几个人的画面同时卡住。恢复时 {player_b} 已经错过了补枪窗口，对面也没有立刻前压，双方都在确认到底能不能继续打。",
    result: "裁判没有重开，比赛继续。{caller_name} 让全队先收缩站位，这种回合最怕的不是卡顿本身，而是急着把刚才亏掉的节奏一口气抢回来。",
    delta: "网络波动 · 节奏被迫重置",
    hiddenSwing: 0,
    playerDelta: { player_b: { deaths: 1 } },
  },
  {
    title: "第 3 局 · 关键道具耗尽",
    text: "{player_d} 手里只剩最后一颗烟，{rival_team} 还在慢慢铺火拖时间。你们想等对面先进，可拆包和回防需要的道具已经快不够了。",
    result: "{caller_name} 没再等完美道具，直接把站位缩进包点深处，用交叉火力接第一波。这不是舒服的防守，但比空着手被拖死要好。",
    delta: "关键道具耗尽 · 防守压力上升",
    hiddenSwing: -1,
    playerDelta: { player_d: { impact: 1 } },
  },
  {
    title: "第 3 局 · 误判假打",
    text: "{caller_name} 判断对面是假打，喊全队别急着转。可脚步声停下来的那一刻，真正的雷包已经往另一边落了。",
    result: "{player_e} 一个人拖了十几秒，给回防争出一点空间。可误判已经发生，后面只能靠人数劣势下的补枪把这局救回来。",
    delta: "误判假打 · 回防时间被烧掉",
    hiddenSwing: -2,
    playerDelta: { player_e: { impact: 2, deaths: 1 } },
    opponentDelta: { opponent_b: { impact: 2 } },
  },
  {
    title: "第 3 局 · 教练暂停时机",
    text: "你刚准备把下一波提速画出来，对面的教练先叫了暂停。暂停回来以后，他们的默认明显换了顺序，像是提前猜到 Team gun 会变招。",
    result: "{caller_name} 没硬撞原计划，先用短默认把对面的第一层调整骗出来。暂停不是喊完就赢，真正的难点是猜对方暂停后会改什么。",
    delta: "教练博弈 · 战术预判",
    hiddenSwing: 1,
    playerDelta: { caller_id: { impact: 2 } },
  },
  {
    title: "第 3 局 · 假冒ECO",
    text: "{caller_name} 故意让前两个身位只露手枪，让 {rival_team} 以为你们这把只是 eco。可烟后面，{star_player_name} 的长枪已经架好第一条过点线。",
    result: "对手前压想刷数据，刚踩进 {site} 就被交叉火力收住。这个局不是白捡的，是用经济信息骗出来的一次窗口。",
    delta: "假冒ECO · 经济信息战",
    hiddenSwing: 2,
    playerDelta: { star_id: { kills: 1, impact: 4 }, caller_id: { assists: 1, impact: 2 } },
    opponentDelta: { opponent: { deaths: 1 } },
  },
  {
    title: "第 4 局 · 被刀以后",
    text: "{player_e} 绕后时慢了一秒，反而被对面贴到背身。刀声响起来的时候，观众席先炸了，Team gun 这边的语音安静得吓人。",
    result: "{caller_name} 没让队伍立刻去找人报仇，只把下一波改成抱团清近点。被刀很难看，但更难看的是因为上头再送一局。",
    delta: "被刀羞辱 · 心态接受考验",
    hiddenSwing: -2,
    playerDelta: { player_e: { deaths: 1 } },
    opponentDelta: { opponent_b: { kills: 1, impact: 3 } },
  },
  {
    title: "第 4 局 · 1v3 史诗残局",
    text: "1v3。{star_player_name} 是唯一还站着的人，C4 还剩十秒，对面三个人从三个方向往包点压。解说的声音都压低了。",
    result: "他先假拆骗出第一个人，再借烟边的缝打第二个。最后一枪没有留给运气，准星提前放在了回防位的头线。",
    delta: "史诗残局 · 全场被点燃",
    hiddenSwing: 3,
    playerDelta: { star_id: { kills: 3, impact: 8 } },
    opponentDelta: { opponent: { deaths: 1 }, opponent_b: { deaths: 1 } },
  },
  {
    title: "第 4 局 · 点位连续被破",
    text: "{site} 连续两局被打穿，{player_e} 的防守压力已经摆在脸上。对方不是单纯干拉，而是在专门打你们这条防线的补枪间隔。",
    result: "{caller_name} 没把问题丢给个人，直接把 {player_c} 调过去双架。点位要靠结构守，不是靠一个人把所有入口都堵住。",
    delta: "点位连续被破 · 防守结构调整",
    hiddenSwing: -1,
    playerDelta: { player_e: { impact: 1 }, player_c: { impact: 1 } },
  },
  {
    title: "第 5 局 · 0.1秒拆包",
    text: "{star_player_name} 蹲在包边，C4 的声音已经连成一条线。烟外有人在穿，钳子的进度条几乎贴着爆炸时间往前爬。",
    result: "拆掉了，差不多只剩 0.1秒。{star_player_name} 站起来的时候没有庆祝，只是把耳机重新压紧，因为下一局还要从第一颗烟开始。",
    delta: "0.1秒拆包 · 高压残局",
    hiddenSwing: 2,
    playerDelta: { star_id: { impact: 5 } },
  },
  {
    title: "第 5 局 · 对手 0.1秒拆包",
    text: "你们已经把包下好，{rival_team} 最后一个人摸到烟里。枪线在扫，C4 在响，可他就是没有松开钳子。",
    result: "爆炸声没有来，拆包成功。差不多只差 0.1秒。Team gun 这边没人说话，这种回合不是不努力，是对面把压力吃下去了。",
    delta: "极限被拆 · 情绪被压住",
    hiddenSwing: -2,
    opponentDelta: { opponent: { impact: 5 } },
  },
  {
    title: "第 5 局 · 烟雾意外建功",
    text: "{player_d} 的烟偏了一点，落点不在战术板上。{caller_name} 刚想骂出口，却发现那颗烟刚好切断了 {opponent_b} 的回防路线。",
    result: "Team gun 临时改成非标准进点，利用这颗意外的烟抢出下包空间。不是每个失误都会惩罚你，有时候也会逼出新的解法。",
    delta: "烟雾意外建功 · 临场调整",
    hiddenSwing: 1,
    playerDelta: { player_d: { assists: 1, impact: 2 }, caller_id: { impact: 1 } },
  },
];

function overviewLine(pool, seed, variables = {}) {
  return fillTemplate(pickWeighted(pool, seed, 0), variables);
}

function surprisePlayerType(player = {}) {
  if (player.price >= 21 || player.firepower >= 84 || player.clutch >= 86) return "star";
  if (player.traits?.includes("hot_blooded") || player.traits?.includes("streaky_star")) return "volatile";
  if (player.role === "support" || player.traits?.includes("disciplined") || player.price <= 12) return "puzzle";
  return "core";
}

function sanitizeSurpriseTemplate(template, variables) {
  return fillTemplate(template, {
    ...variables,
    star: variables.star_player_name,
    caller: variables.caller_name,
    entry: variables.player_a,
    support: variables.player_d,
    lurker: variables.player_e,
    anchor: variables.player_e,
    awper: variables.player_c,
    enemy_star: variables.opponent,
    enemy_second: variables.opponent_b,
  });
}

function resolveTemplateDeltaKeys(delta = {}, variables = {}, side = "player") {
  const resolved = {};
  for (const [key, value] of Object.entries(delta)) {
    const target = variables[key] ?? key;
    if (!target) continue;
    const targetKey = side === "player" && !players.some((player) => player.id === target)
      ? (variables[`${key}_id`] ?? target)
      : target;
    if (!targetKey) continue;
    resolved[targetKey] = { ...(resolved[targetKey] ?? {}), ...value };
  }
  return resolved;
}

function eligibleInMatchSurprises(active = [], campaign = {}, variables = {}) {
  const activeTypes = new Set(active.map(surprisePlayerType));
  const includeAll = active.length === 0;
  const hasStar = activeTypes.has("star");
  const hasPuzzle = activeTypes.has("puzzle");
  const hasVolatile = activeTypes.has("volatile");
  return inMatchSurprisePool
    .filter((event) => {
      if (includeAll) return true;
      if (event.playerType === "star") return hasStar;
      if (event.playerType === "puzzle") return hasPuzzle;
      if (event.playerType === "volatile") return hasVolatile;
      return true;
    })
    .map((event) => ({
      ...event,
      text: sanitizeSurpriseTemplate(event.text, variables),
      result: sanitizeSurpriseTemplate(event.result, variables),
    }));
}

function buildInMatchSurpriseCard(seed, variables, active = []) {
  const template = pickWeighted(eligibleInMatchSurprises(active, {}, variables), seed, 0);
  const playerDelta = mergePlayerDeltaEntries([
    [variables.caller_id, { impact: 1 }],
    [variables.star_id, { impact: 1 }],
    ...Object.entries(resolveTemplateDeltaKeys(template.playerDelta, variables, "player")),
  ]);
  const opponentDelta = mergeNamedDeltaEntries(Object.entries(resolveTemplateDeltaKeys(template.opponentDelta, variables, "opponent")));
  return {
    type: "story",
    mapIndex: 2,
    title: template.title,
    text: template.text,
    result: template.result,
    score: [0, 0],
    delta: template.delta,
    playerDelta,
    opponentDelta,
    hiddenSwing: template.hiddenSwing ?? 0,
  };
}

const characterLossLines = {
  hot_blooded: {
    round_lost: ["“别看我了，下把我先进去把人换掉。”", "“这波我的锅，下一局我把首杀打回来。”"],
    match_lost: ["“我送的，怪我。别怪他们。”", "“今天这口气我记住了，先别让他们看见我们乱。”", "“耳机摘了，比分也定了。回去把那几波开局对位一帧一帧看。”"],
  },
  calm_clutcher: {
    round_lost: ["“先别吵，信息记下来，下一局还能修。”", "“残局差最后一枪，别把语音炸了。”"],
    match_lost: ["“这场输在细节，不是输在胆子。回去一局一局复盘。”", "“先把最后几个关键回合剪出来，我们知道问题在哪。”", "“先站起来握手。难受留到后台说。”"],
  },
  system_leader: {
    round_lost: ["“他们已经开始读默认了，下一局必须换开法。”", "“别追上一局的输，先把结构站回来。”"],
    match_lost: ["“这轮被对面抓到习惯了。回去先改中段调用。”", "“比分输了，但思路得带回去。今晚先把默认和回防拆清楚。”", "“我的责任。暂停和转点都慢了，赛后我先复盘。”"],
  },
  streaky_star: {
    round_lost: ["“再给我一把枪，我下一局把对位打穿。”", "“这局手感断了，别急，让我下一局找回来。”"],
    match_lost: ["“今天没把状态顶到最后，我认。”", "“他们今天踩在我头上赢的，我记得很清楚。”", "“别拍我了。让我先把这场输完。”"],
  },
  disciplined: {
    round_lost: ["“补枪断了，下一局按规矩来，别再各打各的。”", "“先把站位修正，别给第二次同样的机会。”"],
    match_lost: ["“细节漏太多了。回去先修补枪和回防。”", "“输得不冤，纪律没顶住。”", "“先把死亡位置记下来，别在采访里找借口。”"],
  },
  crowd_favorite: {
    round_lost: ["“现场越吵越要稳，别把这一波带到下一局。”", "“他们现在起势了，下一局得先把全场静下来。”"],
    match_lost: ["“今天他们把场馆拿走了。我们先从后台走回去。”", "“记住这个嘘声，但别在台上碎掉。”", "“观众已经开始喊他们的名字了，我们只能把耳机摘下来。”"],
  },
  default: {
    round_lost: ["“先稳住语音，别让这一局把后面全带崩。”"],
    match_lost: ["“这场输了，但问题已经露出来了，回去还能改。”", "“BO5 到此结束，先把情绪带回休息室。”"],
  },
};

const timeoutScenarioLibrary = {
  being_read: {
    title: "第 4 局 · 暂停窗口",
    situation: "连续两局默认都被对手前压试出来了。{rival_team} 现在不是在猜你们要打什么，而是在等你们自己把老套路亮出来。",
    atmosphere: "你站到选手身后，先没讲战术。语音里的呼吸声比报点还重，这个暂停首先得把节奏刹住。",
    choices: {
      "tactical-reset": {
        label: "更换战术",
        result: "你把白板上的默认路线直接划掉，改成更快的二段提速。队员需要立刻适应新节奏，但对手也没法继续舒服地读你们。",
        delta: "战术执行 +6 · 火力 +2 · 配合 -1",
      },
      "emotional-reset": {
        label: "安慰队员",
        result: "你没有急着讲战术，先把刚才那波失误从每个人心里摘下来。语音慢慢安静下来，队员终于能重新听见彼此的报点。",
        delta: "士气 +5 · 状态 +3 · 配合 +3",
      },
      "discipline-reset": {
        label: "大骂一通",
        result: "你直接把刚才的白给点名骂出来，要求所有人立刻收起个人想法，下一局谁再乱摸就按替补席处理。火气被压住了，但队内气氛也明显绷紧。",
        delta: "纪律 +6 · 火力 +2 · 士气 -3 · 配合 -2",
      },
    },
  },
  clutch_failure: {
    title: "第 4 局 · 暂停窗口",
    situation: "刚才那波残局没收住，语音里已经开始有人追问‘为什么不先假拆’。这种局最伤的不是比分，是队里会开始怀疑彼此最后判断。",
    atmosphere: "你把水瓶放在桌上，只说了一句‘看我’。五个人都转过头来，这个暂停得先止住互相追责。",
    choices: {
      "tactical-reset": {
        label: "更换战术",
        result: "你把残局分工和回防站位重新改掉：谁碰包、谁架枪、谁负责后续补枪都换成更清楚的安排。新方案不一定顺手，但至少不会继续乱套。",
        delta: "战术执行 +5 · 纪律 +2 · 配合 -1",
      },
      "emotional-reset": {
        label: "安慰队员",
        result: "你没有追谁的锅，只让每个人把上一回合的判断留在上一回合。队内表情还难看，但互相怀疑先停住了，下一次残局至少还能一起打。",
        delta: "士气 +5 · 状态 +4 · 配合 +2",
      },
      "discipline-reset": {
        label: "大骂一通",
        result: "你把残局里每个临场加戏的点全骂了一遍，语气很重。所有人都知道下一局不能再乱来，但这口气也让队内氛围冷了下来。",
        delta: "纪律 +6 · 火力 +1 · 士气 -3 · 配合 -2",
      },
    },
  },
  losing_streak: {
    title: "第 4 局 · 暂停窗口",
    situation: "比分已经开始往坏处滑了。更麻烦的是，{player_a} 刚输完对位就开始提前抢，{player_d} 的道具也变得越来越犹豫。",
    atmosphere: "这个暂停不是为了喊一句‘稳住’，而是为了防止整支队伍在慌里把后面两局一起送掉。",
    choices: {
      "tactical-reset": {
        label: "更换战术",
        result: "你不再等对面先给信息，直接把下一局改成快提速抢节奏。对手没法继续舒服读你们，但队伍也要立刻切到新节奏。",
        delta: "战术执行 +5 · 火力 +2 · 配合 -1",
      },
      "emotional-reset": {
        label: "安慰队员",
        result: "你让所有人离开屏幕十秒，把上一局的失误留在椅子上。再坐回来时表情还是紧，但至少没人继续把自己往崩盘里推。",
        delta: "士气 +5 · 状态 +4 · 配合 +2",
      },
      "discipline-reset": {
        label: "大骂一通",
        result: "你直接把连续白给的问题骂穿：谁再无信息前压，下一图就换人。纪律立刻上来了，但队员的脸色也明显沉了下去。",
        delta: "纪律 +6 · 火力 +2 · 士气 -3 · 配合 -2",
      },
    },
  },
  communication_break: {
    title: "第 4 局 · 暂停窗口",
    situation: "报点开始重叠，语音里有人在讲战术，有人在追上一局失误，还有人在报脚步。不是枪法先掉，而是沟通先碎了。",
    atmosphere: "你没有马上转白板，而是先把互相追责按停，让所有人重新围着 IGL 的下一步指令来打：谁补枪、谁给道具、谁报第二时间信息，都要重新对齐。",
    choices: {
      "tactical-reset": {
        label: "更换战术",
        result: "你把复杂转点先收起来，改成最熟的默认和一套二段提速。新战术更直接，但临时切换会让配合出现一点磨损。",
        delta: "战术执行 +5 · 纪律 +2 · 配合 -1",
      },
      "emotional-reset": {
        label: "安慰队员",
        result: "你把上一局的争论切断：失误赛后再说，现在先把心态稳住。五个人重新把注意力放回补枪、道具和回防站位上。",
        delta: "士气 +5 · 状态 +3 · 配合 +3",
      },
      "discipline-reset": {
        label: "大骂一通",
        result: "你把混乱语音当场骂停，要求所有人只围绕 IGL 的下一步指令行动。报点清楚了，但队伍气氛也被你压得很紧。",
        delta: "纪律 +6 · 火力 +1 · 士气 -3 · 配合 -2",
      },
    },
  },
  internal_conflict: {
    title: "第 4 局 · 暂停窗口",
    situation: "刚才那局打完，{player_a} 和 {player_c} 对主攻位资源有明显分歧。一个想继续前压把对手打停，一个觉得应该等道具和补枪到位。五个人不是不会打，是开始各打各的。",
    atmosphere: "你能听见椅子被往后一推的声音。这个暂停必须先把内讧苗头按住，否则后面每一次默认都会变成临场抢指挥权。",
    choices: {
      "tactical-reset": {
        label: "更换战术",
        result: "你直接重新分工：谁拿第一波对枪、谁补第二身位、谁留后路全写清楚。个人发挥空间少了，但至少下一局不会再抢同一个 timing。",
        delta: "战术执行 +6 · 纪律 +3 · 配合 -1",
      },
      "emotional-reset": {
        label: "安慰队员",
        result: "你没有让争论继续升级，而是把话题拉回比赛：先一起赢下这一局，赛后再拆责任。队内火气降了下来，补枪链也重新连上。",
        delta: "士气 +5 · 配合 +4 · 纪律 +1",
      },
      "discipline-reset": {
        label: "大骂一通",
        result: "你把桌子一拍，要求所有人立刻围绕同一套指令行动。短时间内没人再抢话，但这种处理会让队里气氛变得更硬。",
        delta: "纪律 +7 · 火力 +1 · 士气 -4 · 配合 -3",
      },
    },
  },
  health_pressure: {
    title: "第 4 局 · 暂停窗口",
    situation: "{player_b} 刚才甩了两次手腕，{player_d} 也说耳机里有一点底噪。问题都不算大，但叠在赛点压力里就会变成动作变形。",
    atmosphere: "你没有把这当成借口，只把暂停切成两件事：外设确认、站位降风险。健康和保障做不到位，再好的战术也会被细节拖垮。",
    choices: {
      "tactical-reset": {
        label: "更换战术",
        result: "你把下一局改成更少单人对枪的双人推进，减少手腕不舒服的队员去打极限身位。战术没那么锋利，但更适合现在的状态。",
        delta: "战术执行 +4 · 纪律 +3 · 火力 -1",
      },
      "emotional-reset": {
        label: "安慰队员",
        result: "你告诉他们先别把身体不适放大成恐慌，按能完成的动作打。每个人心里都稳了一点，语音也重新愿意互相补信息。",
        delta: "士气 +5 · 状态 +3 · 配合 +2",
      },
      "discipline-reset": {
        label: "大骂一通",
        result: "你把犹豫骂停，要求所有人照着最简单的口令执行。短期纪律回来了，但队员会觉得你忽略了真实状态。",
        delta: "纪律 +5 · 士气 -3 · 配合 -2",
      },
    },
  },
  media_noise: {
    title: "第 4 局 · 暂停窗口",
    situation: "场馆大屏刚切到替补席，解说又提起直播合约、赞助商拍摄和上一场采访里的争议回答。队员没开手机，但舆论已经跟进了服务器。",
    atmosphere: "这个暂停不是公关课，但你必须让所有人把注意力拉回当下：媒体会问很多事，可这一局只回答补枪和道具。",
    choices: {
      "tactical-reset": {
        label: "更换战术",
        result: "你把下一局改成提前控中路，给队伍一个明确任务，不让他们继续被场外声音牵着走。战术目标清楚后，杂音少了一点。",
        delta: "战术执行 +5 · 纪律 +2 · 配合 -1",
      },
      "emotional-reset": {
        label: "安慰队员",
        result: "你让他们别急着回应镜头和解说，先把比赛打完。被议论的人点了点头，队友也主动把语音接了过去。",
        delta: "士气 +5 · 配合 +3 · 状态 +2",
      },
      "discipline-reset": {
        label: "大骂一通",
        result: "你直接把所有场外话题压掉：采访、直播、赞助全都赛后再说。队伍注意力被拽回来，但气氛也被你压得很硬。",
        delta: "纪律 +6 · 士气 -2 · 配合 -2",
      },
    },
  },
  leaked_strat: {
    title: "第 4 局 · 暂停窗口",
    situation: "{rival_team} 连续两次提前等到你们的第二时间转点，像是看过训练赛泄漏出来的那套默认。继续照旧打，只会把自己送进对方笔记里。",
    atmosphere: "你把白板翻到空白页，没有追问是谁泄漏了训练赛。现在先处理比赛：换开局、换道具顺序、换第一波信息来源。",
    choices: {
      "tactical-reset": {
        label: "更换战术",
        result: "你直接废掉被看穿的默认，改成海外集训时练过但没正式拿出来的二段转点。队伍要临时适应，但对手终于不能照答案打。",
        delta: "战术执行 +7 · 配合 -2 · 纪律 +1",
      },
      "emotional-reset": {
        label: "安慰队员",
        result: "你没有让队员陷进‘我们被看光了’的恐慌，只提醒他们：训练赛泄漏的是路线，不是临场判断。信心被拉回来一点。",
        delta: "士气 +5 · 状态 +2 · 配合 +2",
      },
      "discipline-reset": {
        label: "大骂一通",
        result: "你把继续照本宣科的人骂醒，要求每个人严格听 IGL 的临场改口。执行更硬了，但队员会更怕犯错。",
        delta: "纪律 +7 · 士气 -3 · 配合 -2",
      },
    },
  },
  rookie_under_fire: {
    title: "第 4 局 · 暂停窗口",
    situation: "新人刚被对手连续点名，镜头又扫到替补席。新人试训、青训提拔、首发位置这些话题，全都在这一刻压到他身上。",
    atmosphere: "你蹲到他旁边，说话声音不大。这个暂停要处理的不是枪法，而是让他知道下一局到底该做哪一件事。",
    choices: {
      "tactical-reset": {
        label: "更换战术",
        result: "你把新人从第一接触位撤下来，改成第二身位补枪。责任更清楚以后，他不用再一个人扛完整包点。",
        delta: "战术执行 +4 · 配合 +2 · 火力 -1",
      },
      "emotional-reset": {
        label: "安慰队员",
        result: "你没有讲大道理，只告诉他按训练做完第一颗道具和第一波补枪。新人呼吸慢下来，队友也开始主动给他信息。",
        delta: "士气 +5 · 状态 +4 · 配合 +2",
      },
      "discipline-reset": {
        label: "大骂一通",
        result: "你把失误点讲得很重，让他立刻别再乱动。位置是稳住了，但新人明显更紧，后面会更依赖队友提醒。",
        delta: "纪律 +5 · 士气 -4 · 配合 -1",
      },
    },
  },
  veteran_fatigue: {
    title: "第 4 局 · 暂停窗口",
    situation: "老将这一局明显慢了半拍。不是不会打，而是连续赛程、退役念头和高强度训练一起压上来，经验还在，身体反应却没那么快。",
    atmosphere: "你知道不能靠一句热血把年龄抹掉。这个暂停要做的是重新分配责任，让老将用经验指挥局面，而不是每次都去硬接最快的枪线。",
    choices: {
      "tactical-reset": {
        label: "更换战术",
        result: "你把老将从硬碰枪位调到后点指挥和补道具，让年轻人去吃第一波压力。经验被留住了，正面火力会更依赖队友。",
        delta: "战术执行 +5 · 纪律 +3 · 火力 -1",
      },
      "emotional-reset": {
        label: "安慰队员",
        result: "你告诉老将不用把所有回合都扛在自己肩上。年轻人主动接过第一身位，队伍像是真的重新听同一个指挥。",
        delta: "士气 +4 · 配合 +4 · 纪律 +1",
      },
      "discipline-reset": {
        label: "大骂一通",
        result: "你把慢半拍的问题点出来，要求所有人按重新分配的责任走。纪律提起来了，但老将的表情明显沉下去。",
        delta: "纪律 +6 · 士气 -3 · 配合 -2",
      },
    },
  },
  fan_pressure: {
    title: "第 4 局 · 暂停窗口",
    situation: "看台上 Team gun 的横幅越来越多，粉丝见面会、慈善表演赛带来的好感此刻都变成期待。支持很暖，但也会让队员怕辜负。",
    atmosphere: "你没有让他们看观众席，只让他们互相看一眼。粉丝不会替你拆包，但能提醒你们为什么要一起打完这局。",
    choices: {
      "tactical-reset": {
        label: "更换战术",
        result: "你把下一局改成更稳的控图，不让队员为了回应观众去硬冲。场馆很吵，但战术必须安静地执行。",
        delta: "战术执行 +4 · 纪律 +3 · 火力 -1",
      },
      "emotional-reset": {
        label: "安慰队员",
        result: "你告诉队员：支持不是压力，是有人愿意陪你们把难看的局也看完。几个人笑了一下，语音终于不再发紧。",
        delta: "士气 +6 · 配合 +3 · 状态 +2",
      },
      "discipline-reset": {
        label: "大骂一通",
        result: "你把所有注意力强行拉回屏幕：别看横幅，别听欢呼，只看雷达和补枪。短期有效，但情绪被压得很死。",
        delta: "纪律 +6 · 士气 -2 · 配合 -1",
      },
    },
  },
  international_pressure: {
    title: "第 4 局 · 暂停窗口",
    situation: "跨赛区比赛节奏比训练赛快得多。时差、航班和表演赛邀约留下的疲劳没完全散，{rival_team} 又在用国际赛区常见的快转点压你们。",
    atmosphere: "你把暂停讲得很短：他们快，我们不能乱；他们转，我们先把信息报全。国际赛区情报现在要变成场上的第一颗烟和第一句报点。",
    choices: {
      "tactical-reset": {
        label: "更换战术",
        result: "你把下一局改成更重视反摸和中路信息的默认，先把对方的快转点速度降下来。节奏不华丽，但更能活到后段。",
        delta: "战术执行 +6 · 纪律 +2 · 火力 -1",
      },
      "emotional-reset": {
        label: "安慰队员",
        result: "你提醒他们，跨赛区的不适不是丢人，关键是别因为陌生节奏否定自己的训练。队员心态稳了一点，报点重新完整起来。",
        delta: "士气 +4 · 状态 +3 · 配合 +2",
      },
      "discipline-reset": {
        label: "大骂一通",
        result: "你要求所有人别再被对方节奏牵着跑，按赛前准备执行到最后一秒。纪律回来了，但疲劳没有消失。",
        delta: "纪律 +6 · 士气 -2 · 状态 -1",
      },
    },
  },
};

function pickCharacterLossLine(player, situation, seed = 0) {
  for (const trait of player?.traits ?? []) {
    const pool = characterLossLines[trait]?.[situation];
    if (pool?.length) return pickWeighted(pool, seed, 0);
  }
  return pickWeighted(characterLossLines.default[situation] ?? [""], seed, 0);
}

function chooseTimeoutScenarioForMatch(stats, scoutChoice, readPressure, seed = 0) {
  if (readPressure?.label === "read") return "being_read";
  if (stats.cohesion < 58 || (stats.firepower > stats.cohesion + 20 && stats.discipline < 68)) return "internal_conflict";
  if (stats.firepower > stats.discipline + 8) return seed % 3 === 0 ? "media_noise" : "losing_streak";
  if (scoutChoice === "confidence" || stats.cohesion < 76) return "communication_break";
  const situational = [
    "clutch_failure",
    "health_pressure",
    "leaked_strat",
    "rookie_under_fire",
    "veteran_fatigue",
    "fan_pressure",
    "international_pressure",
  ];
  return situational[Math.abs(seed) % situational.length];
}

function buildTimeoutCard(trigger, variables, seed = 0) {
  const scenario = timeoutScenarioLibrary[trigger] ?? timeoutScenarioLibrary.clutch_failure;
  return {
    type: "choice",
    mapIndex: 3,
    title: scenario.title,
    text: `${fillTemplate(scenario.situation, variables)} ${fillTemplate(scenario.atmosphere, variables)}`,
    prompt: "暂停里先抓什么",
    options: [
      {
        id: "tactical-reset",
        label: scenario.choices["tactical-reset"].label,
        swing: 2,
        result: fillTemplate(scenario.choices["tactical-reset"].result, variables),
        delta: scenario.choices["tactical-reset"].delta,
        playerDelta: mergePlayerDeltaEntries([[variables.caller_id, { assists: 2, impact: 4 }], [variables.lurker_id, { impact: 1 }]]),
      },
      {
        id: "emotional-reset",
        label: scenario.choices["emotional-reset"].label,
        swing: 1,
        result: fillTemplate(scenario.choices["emotional-reset"].result, variables),
        delta: scenario.choices["emotional-reset"].delta,
        playerDelta: mergePlayerDeltaEntries([[variables.star_id, { impact: 2 }], [variables.support_id, { assists: 1, impact: 1 }]]),
      },
      {
        id: "discipline-reset",
        label: scenario.choices["discipline-reset"].label,
        swing: 2,
        result: fillTemplate(scenario.choices["discipline-reset"].result, variables),
        delta: scenario.choices["discipline-reset"].delta,
        playerDelta: mergePlayerDeltaEntries([[variables.anchor_id, { impact: 2 }], [variables.caller_id, { assists: 1, impact: 1 }]]),
      },
    ],
    usesTimeout: true,
    timeoutTrigger: trigger,
  };
}

function latestScoredEvent(match) {
  return [...(match?.resolved ?? [])].reverse().find((entry) => entry?.score?.[0] || entry?.score?.[1]);
}

function shouldOfferTimeout(state, card) {
  if (!card?.usesTimeout || state.match.timeoutUsed) return false;
  const score = state.match.score ?? [0, 0];
  const lastScored = latestScoredEvent(state.match);
  const previousMapLost = (lastScored?.score?.[1] ?? 0) > (lastScored?.score?.[0] ?? 0);
  const trailing = score[0] < score[1];
  const eliminationPressure = score[1] >= 2;
  const badIndividualState = Object.values(state.match.playerStats ?? {})
    .some((row) => (row.formScore ?? 0) <= -2 || ((row.deaths ?? 0) >= (row.kills ?? 0) + 2 && (row.deaths ?? 0) >= 2));
  const seriousTeamIssue = card.timeoutTrigger === "internal_conflict" || card.timeoutTrigger === "being_read";
  return previousMapLost || trailing || eliminationPressure || badIndividualState || seriousTeamIssue;
}

function buildNoTimeoutAdjustmentCard(card) {
  return {
    type: "story",
    mapIndex: card.mapIndex ?? 3,
    title: "第 4 局 · 调整间隙",
    text: "第 4 局开始前，队伍没有急着叫暂停。上一局刚拿下，语音里只把经济、开局站位和补枪距离重新对齐。真正的暂停要留给连败、赛点压力、状态明显下滑或队内沟通出问题的时候。",
    result: "你让队员保持刚才的手感进入下一局，别把节奏切碎。现在更重要的是按既定口径继续打，把暂停留给真正需要止血的时刻。",
    delta: "不交暂停 · 保持手感和节奏",
    playerDelta: {},
    opponentDelta: {},
  };
}

function materializeMatchCard(state, card) {
  if (card?.usesTimeout && !shouldOfferTimeout(state, card)) return buildNoTimeoutAdjustmentCard(card);
  return card;
}

function pickBombFailureLine(type, variables, seed = 0, picker) {
  const pool = bombFailureTemplates[type] ?? bombFailureTemplates.defuse_failed;
  const template = picker
    ? picker(`bomb:${type}`, pool, seed)
    : pickWeighted(pool, seed, 0);
  return fillTemplate(template, variables);
}

function describeOpeningScrap(variables, seed = 0, tone = "trade") {
  const templates = tone === "loss" ? openingFailureTemplates : [
    "{player_c} 在 {site} 先摘掉了 {opponent}，可 {player_a} 补进点时也被 {opponent_b} 立刻换掉。第一波打成一换一，枪线还没分出真正高下。",
    "{player_d} 的补闪把 {opponent_b} 白在掩体后，可 {player_a} 冲进去时还是被补枪带走。你们抢到了空间，但没能把人数完全赚下来。",
    "{player_c} 架住了第一条线，{player_a} 却在补枪时倒在 {site} 边缘。这波不是坏，只是还没到能放心庆祝的程度。",
  ];
  return fillTemplate(pickWeighted(templates, seed, 0), { ...variables, site: pickWeighted(narrativeSites, seed + 1, 0) });
}

function describeUtilityStall(variables, seed = 0, picker) {
  const template = picker
    ? picker("utility-stall", utilityStallTemplates, seed)
    : pickWeighted(utilityStallTemplates, seed, 0);
  return fillTemplate(
    template,
    { ...variables, site: pickWeighted(narrativeSites, seed + 2, 1), time: String(12 + Math.abs(seed % 9)) },
  );
}

function describeReadPressure(variables, seed = 0, tacticChoice = "default", picker) {
  const pool = tacticChoice === "fake" ? fakeFailTemplates : defaultReadTemplates;
  const extra = tacticChoice === "fake"
    ? (picker ? picker("fake-fail", pool, seed + 5) : pickWeighted(fakeFailTemplates, seed + 5, 0))
    : (picker ? picker("default-read", pool, seed + 3) : pickWeighted(defaultReadTemplates, seed + 3, 0));
  return fillTemplate(extra, { ...variables, site: pickWeighted(narrativeSites, seed + 4, 2) });
}

function describeClutchSetup(variables, seed = 0, picker) {
  const template = picker
    ? picker("clutch-setup", clutchSetupTemplates, seed)
    : pickWeighted(clutchSetupTemplates, seed, 0);
  return fillTemplate(
    template,
    { ...variables, hp: String(18 + Math.abs(seed % 17)), time: String(11 + Math.abs(seed % 8)) },
  );
}

const opponentStyleProfiles = {
  vitality: { style: "info-heavy", label: "默认控图", counter: "default", text: "他们喜欢用默认控图慢慢拿信息，等你先露脚步，再让核心选手处理残局。" },
  spirit: { style: "duel-heavy", label: "前压对枪", counter: "lurk", text: "他们很敢在前点要首杀。如果你慢控太久，边线可能被提前撞碎。" },
  falcons: { style: "star-duel", label: "明星强解", counter: "default", text: "他们不一定每回合都最细，但明星位一旦找到单挑窗口，局面会被硬掰回来。" },
  mouz: { style: "stack-heavy", label: "叠点反快", counter: "rush", text: "他们喜欢提前叠点和反清，快攻包点如果被读到，会在入口吃到成套交叉火力。" },
  faze: { style: "late-round", label: "老练后期", counter: "fake", text: "他们不太容易被第一层假动作骗走，越到后期越会考验你转点的真实性。" },
  furia: { style: "aggression", label: "主动前压", counter: "lurk", text: "他们会用主动前压抢信息，慢控单摸如果没有队友牵制，容易被两个人夹掉。" },
  navi: { style: "structure", label: "结构纪律", counter: "default", text: "他们的默认和补防很有秩序，跟他们拼常规控图会被纪律慢慢压住。" },
  mongolz: { style: "tempo", label: "提速冲击", counter: "rush", text: "他们节奏突然加速的能力很强，双方一起提速时，你必须保证第一波补枪不断。" },
};

function opponentStyleForTeam(opponentTeam) {
  return opponentStyleProfiles[opponentTeam.id] ?? { style: "balanced", label: "均衡打法", counter: "", text: "他们没有特别极端的倾向，更多看当天手感和开局信息。" };
}

const opponentFormTemplates = {
  hot: [
    "对方状态：{rival_team} 手感火热，最近几场的首杀和残局都很硬，尤其是 {star} 不太能放他舒服开枪。",
    "对方状态：{rival_team} 连续三场正赛的补枪链没有断过，{star} 的数据更是直线往上拉——这种状态下硬碰对枪不是好选择。",
    "情报组提醒：{rival_team} 最近几场开场节奏极快，常常在前五局就让对手经济变形。你们必须保证第一波站位不出纰漏。",
  ],
  steady: [
    "对方状态：{rival_team} 近期表现平稳，没大起大落。默认控图是他们的舒适区，想打乱他们，得在中段提速或者逼他们提前做判断。",
    "对方状态：{rival_team} 没有明显短板，也没有特别爆发的点。这种队伍最难啃——你不会被一波打死，但会被慢慢磨掉耐心。",
  ],
  slow: [
    "对方状态：{rival_team} 近期表现平平，默认推进能看出犹豫，但强队的底子还在，不能因为他们慢热就乱冲。",
    "情报组提醒：{rival_team} 最近开局数据下滑，手枪局和第三局的经济决策出过几次明显失误。前两局提速打乱他们节奏的窗口还在。",
    "对方状态：{rival_team} 上一杯走得不太顺，{star} 的对位数据有下滑迹象。但饿虎更危险——他们可能会把这场当成重新找回节奏的硬仗。",
  ],
  swing: [
    "对方状态：{rival_team} 状态起伏，强势回合压迫感很足，但一旦被拖进非常规局面，临场处理也会露出破绽。关键在于你能不能把他们带进不舒服的节奏。",
    "对方状态：{rival_team} 的数据像过山车：顺风时摧枯拉朽，逆风时首杀率骤降。这种队伍怕的不是强，是持续性的压力——不能给他们任何喘息窗口。",
  ],
};

const playerStatusTemplates = {
  slump: [
    "Team gun 状态：{player} 手腕有点不舒服，热身时甩了好几次手，今天如果继续让他打关键开局对位，风险会比平时更高。",
    "Team gun 状态：{player} 最近被舆论盯得很紧，社媒上全是关于他状态的讨论。他自己说没事，但你看他训练时的表情比上一杯紧绷了很多。",
    "Team gun 状态：{player} 场外私事被粉丝扒到网上了，训练室里没人明说，但他明显有些分神。老队员已经在帮他挡掉大部分噪音。",
    "Team gun 状态：{player} 的训练数据连续三天往下走，他自己也感觉到了，越急越打不顺。今天如果让他打太多对位，可能会被对面针对。",
  ],
  excited: [
    "Team gun 状态：{player} 最近训练手感很好，队友都愿意给他第一波空间。但状态好不等于能乱打，越热越要守纪律。",
    "Team gun 状态：{player} 这周的训练赛数据是全队最高，几次残局处理也让老队员点头。今天他值得更多的开火权，但也需要有人在旁边拉住他不让他过热。",
    "Team gun 状态：{player} 连续几场都打出正向数据，训练室里的笑声也比上周多了。好消息是信心回来了，坏消息是对面肯定也注意到了。",
  ],
  stable: [
    "Team gun 状态：首发整体平稳，没有明显伤病或舆论爆点。好消息是心态不乱，坏消息是也没人能保证靠个人爆发直接解决比赛。",
    "Team gun 状态：五个人状态都在线上，没有特别亮眼也没有明显拉胯。这种时候比的不是谁更天才，而是谁先把对方的习惯读出来。",
    "Team gun 状态：训练室气氛正常，复盘时没人沉默也没人上头。稳定是好事，但也不能因为稳定就放松了对意外情况的预案。",
  ],
};

const prematchFooterPool = [
  "看完情报后先定赛前口径。真正的验证，会发生在第一局手枪和第二局开局。",
  "赛前能知道的东西就这么多。剩下的——对面站哪、第一步踩哪、谁先开枪——都是进服务器以后的事。",
  "情报卡给你框架，比赛给你答案。现在要做的不是猜，是把该准备的准备好。",
  "你面前的所有信息加起来也只占这场比赛的三成。剩下七成在你们的开局选择、暂停决策和逆风局的处理里。",
];

function opponentFormLine(opponentTeam, seed = 0) {
  const score = (Math.round(teamStrength(opponentTeam)) + seed) % 5;
  const bucket = score >= 3 ? "hot" : score === 2 ? "steady" : score <= 1 ? "slow" : "swing";
  return fillTemplate(pickWeighted(opponentFormTemplates[bucket], seed, 0), {
    rival_team: opponentTeam.name,
    star: opponentTeam.stars?.[0] ?? opponentTeam.name,
  });
}

function playerStatusLine(active, campaign, seed = 0) {
  const formRows = active.map((player) => ({ player, score: activeFormScore(player, campaign.playerForm) }));
  const slumping = formRows.find((row) => row.score <= -1);
  const excited = formRows.find((row) => row.score >= 1);
  if (slumping) {
    return fillTemplate(pickWeighted(playerStatusTemplates.slump, seed, 0), { player: slumping.player.name });
  }
  if (excited) return fillTemplate(pickWeighted(playerStatusTemplates.excited, seed, 0), { player: excited.player.name });
  return pickWeighted(playerStatusTemplates.stable, seed, 0);
}

function forcedBenchPlayer(active, seed = 0) {
  if (!active.length) return undefined;
  return active[Math.abs(seed) % active.length];
}

const prematchStoryPool = [
  {
    id: "analyst-all-nighter",
    title: "分析师把最新数据整理出来了",
    lines: [
      "分析师用了两晚把对手最近所有公开 demo 重新拆了一遍，终于找到了他们在防守端的几个固定习惯。这些东西不保证必胜，但至少你不会在第一张图上被蒙着头打。",
      "他把结论压缩成三条能在语音里喊出来的口令。信息量不大，但每一条都能在关键回合帮你做一次判断。",
    ],
    footer: "情报的价值不在于多少，在于该用的那一步被用到了。",
    effect: { baseEdge: 2 },
  },
  {
    id: "veteran-speech",
    title: "老将赛前开口了",
    lines: [
      "赛前热身的时候，队里资历最老的选手突然把所有人叫到一起，讲了他打职业第一年被人0-13的故事。不是鸡汤，是提醒每个人：最可怕的不是输，是还没打完就先觉得会输。",
      "训练室里安静了几秒，然后有人笑了。不是紧张的笑，是那种“懂了”的笑。这种默契比任何战术布置都值钱。",
    ],
    footer: "有时候一队人只需要一个人开口，其他人就都知道该怎么打。",
    effect: { baseEdge: 2 },
  },
  {
    id: "fan-venue-support",
    title: "场馆外已经有人在等了",
    lines: [
      "你们提前到场馆适应的时候，已经有几十个穿着 Team gun 队服的粉丝在门口排队。有人在喊你们选手的名字，有人在举自制的灯牌。",
      "这种支持不直接加枪法，但在逆风局听到场馆里喊你们队名的时候，人会比平时多一口气。你不是一个人在打。",
    ],
    footer: "被期待是压力，但也是一种武器。",
    effect: { baseEdge: 1 },
  },
  {
    id: "opponent-roster-change",
    title: "对手临时调整首发",
    lines: [
      "赛前确认：对手把一名首发放进替补席，换上了年轻选手。新人枪不软，但和原阵容打正式赛太少，补枪距离和道具顺序都可能慢半拍。",
      "这是机会，也是陷阱。新人的新鲜感可能会打出意外爆发，但他们的连接位一定比老阵容脆弱。前两局如果能针对性地施压，可以提前试出裂缝。",
    ],
    footer: "职业队临时换人也是一把双刃剑，看你怎么逼他们用不熟练的那一面。",
    effect: { baseEdge: 2 },
  },
  {
    id: "map-pool-intel",
    title: "对手的准备被提前发现了",
    lines: [
      "情报组通过训练赛录像猜到了对手会在哪张图上做文章：他们最近反复在弱图上练习，明显是准备了一张秘密武器图。",
      "你可以选择按掉那张图，也可以在 BP 里故意放出来——如果他们真准备了东西，正面接住比躲开更能打击他们的信心。",
    ],
    footer: "知道对手准备什么，是一半的博弈。另外一半是你敢不敢正面应战。",
    effect: { baseEdge: 1 },
  },
  {
    id: "new-tactic-rough",
    title: "新战术还没跑顺",
    lines: [
      "赛前你加入了一套新开局路线，但训练里跑了几次效果都不太稳定。队员没有抱怨，只是眼神里有那种“赛场上能用吗”的犹豫。",
      "你可以选择继续相信这套新东西，也可以把它压到更关键的时候再拿出来。现在不是赌的时候，但也不是完全不敢试的时候。",
    ],
    footer: "好的战术在训练室成型，在比赛里验证。差的战术在训练室就被扼杀——问题是，你怎么知道不是后者。",
    effect: { baseEdge: -1 },
  },
  {
    id: "club-tension",
    title: "后台有点紧绷",
    lines: [
      "俱乐部管理层刚刚开过一个长会，虽然具体内容没透出来，但训练室里的气氛明显紧了几分。老队员在群里发了一句“别管外面，先打好自己的”。",
      "这种背景噪音不会直接出现在服务器里，但它可能会让队员在失误后更容易陷入自责。你需要让全队明白：赛前风声不等于赛场结果。",
    ],
    footer: "职业队的后台从来不平静。能打到最后的，都是在噪音里还把准星稳住的人。",
    effect: { baseEdge: -1, form: -1 },
  },
  {
    id: "opponent-star-injury",
    title: "对手明星选手带伤上场",
    lines: [
      "传闻对面 {star} 的手腕有轻微不适，最近训练赛里减少了对枪时间。你没法确认这是烟幕弹还是事实，但如果他的手感确实打了折扣，开局针对他的路线会有更高回报。",
      "不能完全按这个传闻设计战术——万一是假消息，你们反而会被他们准备好的反制路线吃掉。但当他的手感确实变了，你们的站位应该能第一时间看出来。",
    ],
    footer: "伤病消息在电竞圈常见。真假不重要——你的预案必须同时覆盖两种可能性。",
    effect: { baseEdge: 1 },
  },
  {
    id: "venue-adapt",
    title: "场馆设置不习惯",
    lines: [
      "适应场馆的第一天，几个选手都说桌子高度、椅子靠背和屏幕距离跟训练室不太一样。没人把这当成借口，但职业选手对每一厘米都很敏感。",
      "热身时准星没有完全贴手，你需要把赛前口径收得更稳：少一点花活，多一点能落地的默认和补枪。",
    ],
    footer: "线下赛不是在训练室复刻一遍，谁先适应环境，谁就少掉一层无形消耗。",
    effect: { baseEdge: -1 },
  },
  {
    id: "weather-disruption",
    title: "当地天气影响",
    lines: [
      "比赛城市突然降温，场馆空调还没跟上。热身时有人裹着外套打，手指明显比平常僵。",
      "这不是大新闻，但在需要关键对枪精准度的比赛里，冷手就是额外难度。你们最好减少纯靠瞬间拉枪的路线。",
    ],
    footer: "职业选手应该适应任何环境，但理想和现实之间隔着十几度温差。",
    effect: { baseEdge: -1 },
  },
  {
    id: "language-barrier",
    title: "临时翻译到队",
    lines: [
      "下一站是跨赛区比赛，场馆说明、赛程调整和采访流程全是外语。工作人员临时找来翻译，终于把几条容易误会的规则讲清楚了。",
      "队伍不会因此变强，但少一点场外误会，就多一点把注意力留给服务器的空间。",
    ],
    footer: "语言不通不会直接输比赛，规则和流程搞错却会让人输得很冤。",
    effect: { baseEdge: 1 },
  },
  {
    id: "schedule-crunch",
    title: "赛程密集",
    lines: [
      "两个比赛日之间几乎没有完整训练周期。复盘、调整、准备新战术全部挤在一起，训练室里已经能看到黑眼圈。",
      "硬撑能多练一点东西，但疲劳会在回防、补枪和残局判断里慢慢还回来。",
    ],
    footer: "赛程不等人，要么适应，要么被拖垮。",
    effect: { baseEdge: -2 },
  },
  {
    id: "mental-coach",
    title: "心理教练临时介入",
    lines: [
      "俱乐部安排心理教练在赛前跟队员做了短会。不是喊口号，而是把每个人最容易红温、沉默或急着抢回面子的点摊开说清楚。",
      "有人一开始不自在，但聊完以后，语音里的火气明显没有那么冲。",
    ],
    footer: "心理准备不会替你开枪，但能让队伍在逆风局少做几次错误选择。",
    effect: { baseEdge: 1 },
  },
  {
    id: "sub-roster-question",
    title: "启用替补的争论",
    lines: [
      "分析师提醒你：一名首发最近状态曲线往下走，而替补训练赛一直很稳。轮换不一定是坏事，难的是怎么让训练室接受它。",
      "首发席位的压力已经摆在桌面上。你仍然能选本场替补，但队员会很清楚，今天的表现会影响下一次名单。",
    ],
    footer: "首发和替补之间的平衡，是教练最难把握的线。",
    effect: { baseEdge: -1, form: -1 },
  },
  {
    id: "opponent-coach-late",
    title: "对方主教练行程受阻",
    lines: [
      "对方主教练因为行程问题还没到队。他们不至于完全没人指挥，但暂停和赛前复盘一定会少一点外部视角。",
      "强队的底子还在，只是今天他们在临场纠错上可能没那么快。你们如果能把比赛拖进连续调整，会有机会咬住。",
    ],
    footer: "这不是保送胜利，只是让对手少了一只在场外盯全局的眼睛。",
    effect: { baseEdge: 2 },
  },
  {
    id: "opponent-role-friction",
    title: "对手两名核心有分歧",
    lines: [
      "训练赛后台传出消息：对手两名核心对地图角色有分歧。真假不好判断，但他们最近几张图的补枪距离确实有些脱节。",
      "你不能指望他们自己崩，但如果前两局能反复攻击同一条补枪链，分歧就可能被比赛放大。",
    ],
    footer: "顶级队也会有裂缝，问题是你能不能让裂缝变成回合里的空位。",
    effect: { baseEdge: 2 },
  },
  {
    id: "opponent-hot-run",
    title: "对手近期手感火热",
    lines: [
      "情报组把最近几张图的数据摆到你面前：对方双核心都在升温，尤其是首杀回合，几乎每次都能把对手逼进少打多。",
      "这场不能把正面对枪想得太简单，第一波站位和反清闪必须比平时更细。",
    ],
    footer: "强队手热的时候，最怕你自己先把节奏送到他们手里。",
    effect: { baseEdge: -2 },
  },
  {
    id: "player-milestone",
    title: "选手迎来里程碑",
    lines: [
      "一名首发迎来职业生涯的重要场次，队友在键盘旁边放了一张小卡片。没人把这当成仪式感，但训练室里的气氛确实轻了一点。",
      "这种小温暖不会直接加枪法，却能让逆风局里的语音多一点信任。",
    ],
    footer: "服务器里很残酷，但人不是只靠数据活着。",
    effect: { baseEdge: 1 },
  },
];

function pickPrematchStoryEvent(active, opponentTeam, campaign = {}, seed = 0) {
  if (campaign?.prematchEventOverride !== undefined && campaign.prematchEventOverride !== null && campaign.prematchEventOverride !== "") return undefined;
  const roll = Math.abs(seed) % 5;
  if (roll === 1 || roll === 2) return undefined;
  const pool = prematchStoryPool.filter((event) => {
    if (event.id === "sub-roster-question") return active.length >= 6 || active.length >= 5;
    if (event.id.startsWith("opponent")) return opponentTeam?.id !== "player-team";
    return true;
  });
  return pickWeighted(pool, seed + 41, 0);
}

function renderPrematchStoryLine(line, opponentTeam) {
  return fillTemplate(line, {
    star: opponentTeam?.stars?.[0] ?? opponentTeam?.name ?? "对手明星",
    rival_team: opponentTeam?.name ?? "对手",
  });
}

function buildPrematchIntel({ state, campaign, opponentTeam, stats, seed = 0 }) {
  const roster = selectedPlayers(state);
  const active = activeRoster(roster, state.substitute);
  const style = opponentStyleForTeam(opponentTeam);
  const strengthGap = Math.round(teamStrength({ stats }) - teamStrength(opponentTeam));
  const fireGap = Math.round((stats.firepower ?? 75) - (opponentTeam.stats?.firepower ?? 75));
  const fireNote = fireGap >= 5
    ? "你们正面对枪更有底气"
    : fireGap <= -5
      ? "对方火力点更硬"
      : "双方火力差距不大";
  const gapLine = strengthGap >= 4
    ? `实力差距：Team gun 纸面综合略占上风，${fireNote}，但战术执行、补枪链和纪律必须一起兑现。`
    : strengthGap <= -4
      ? `实力差距：对方整体面板更硬，${fireNote}，Team gun 不能只靠正面对枪，必须用信息、纪律和经济局处理把他们拆开。`
      : `实力差距：双方整体面板接近，${fireNote}，这场更可能由开局选择、经济局处理和临场状态决定。`;
  const base = {
    id: `standard-${opponentTeam.id}-${style.style}`,
    title: `赛前情报室：${opponentTeam.name}`,
    body: [
      opponentFormLine(opponentTeam, seed),
      playerStatusLine(active, campaign, seed + 3),
      `风格判断：${style.label}。${style.text} 克制关系：如果你继续选择他们最擅长处理的开局，后续胜率会被压低。`,
      gapLine,
    ],
    footer: pickWeighted(prematchFooterPool, seed + 7, 0),
    opponentStyle: style,
    controlLocked: false,
    forcedBenchId: undefined,
    effect: { baseEdge: 0, form: 0 },
  };
  const override = campaign?.prematchEventOverride;
  const eventRoll = override ?? (seed % 17 === 0 ? "coach_visa" : seed % 13 === 0 ? "player_absence" : seed % 11 === 0 ? "player_slump" : "");
  if (eventRoll === "coach_visa") {
    return {
      ...base,
      id: `coach-visa-${opponentTeam.id}`,
      title: "教练签证没过：临场指挥缺席",
      body: [
        `赛前两小时，工作人员确认：主教练签证没过，赶不上这场对 ${opponentTeam.name} 的比赛。`,
        "战术板还在酒店电脑里，暂停时也没有那个人把所有人拉回同一条线。队员只能按赛前准备自己做判断，你这场无法临场下达具体决策。",
        opponentFormLine(opponentTeam, seed),
        `风格判断：${style.label}。${style.text}`,
      ],
      footer: "你只能在场边看着，队员会根据局势随机做出选择。",
      controlLocked: true,
      effect: { baseEdge: -6, form: -1 },
    };
  }
  if (eventRoll === "player_absence") {
    const forced = forcedBenchPlayer(active, seed + 5);
    return {
      ...base,
      id: `forced-bench-${forced?.id ?? "player"}-${opponentTeam.id}`,
      title: `${forced?.name ?? "一名首发"} 临时不能上场`,
      body: [
        `赛前突然传来坏消息：${forced?.name ?? "一名首发"} 因为手腕不适、签证或证件流程问题，这场必须坐到替补席。不是战术轮换，是硬性缺席。`,
        "替补必须顶上，队伍契合度会被打断。你仍然可以决定赛前口径，但今天的首发已经不是最熟的一套。",
        opponentFormLine(opponentTeam, seed),
        `风格判断：${style.label}。${style.text}`,
      ],
      footer: "这类事件会直接影响本场首发和团队配合，强队最怕临阵换人。",
      forcedBenchId: forced?.id,
      effect: { baseEdge: -4, form: -1 },
    };
  }
  if (eventRoll === "player_slump") {
    return {
      ...base,
      id: `status-noise-${opponentTeam.id}`,
      title: "场外噪音压到训练室",
      body: [
        playerStatusLine(active, campaign, seed + 1),
        "队友没有把话挑明，但训练室里的沟通明显比前几天短。你需要在赛前决定，是继续相信手感，还是先把节奏降下来。",
        opponentFormLine(opponentTeam, seed),
        `风格判断：${style.label}。${style.text}`,
      ],
      effect: { baseEdge: -2, form: -1 },
    };
  }
  const story = pickPrematchStoryEvent(active, opponentTeam, campaign, seed);
  if (!story) return base;
  return {
    ...base,
    id: `${story.id}-${opponentTeam.id}`,
    title: story.title,
    body: [
      ...story.lines.map((line) => renderPrematchStoryLine(line, opponentTeam)),
      opponentFormLine(opponentTeam, seed),
      playerStatusLine(active, campaign, seed + 3),
      `风格判断：${style.label}。${style.text} 克制关系：如果你继续选择他们最擅长处理的开局，后续胜率会被压低。`,
      gapLine,
    ],
    footer: story.footer,
    effect: { ...base.effect, ...(story.effect ?? {}) },
  };
}

function startingEconomyForTeam(stats, isPlayer = false) {
  const base = 72 + Math.round((stats.discipline - 75) / 4) + Math.round((stats.tacticalExecution - 78) / 5);
  const starTax = isPlayer ? Math.max(0, Math.round((stats.firepower - stats.discipline) / 6)) : 0;
  return createEconomyState(clamp(base - starTax, 58, 82), "loss");
}

function chooseTimeoutScenario(readPressure, stats, scoutChoice) {
  if (readPressure.label === "read") {
    return { trigger: "being_read" };
  }
  if (stats.cohesion < 74 || scoutChoice === "confidence") {
    return { trigger: "communication_break" };
  }
  if (stats.firepower > stats.discipline + 8) {
    return { trigger: "tilt_chain" };
  }
  return { trigger: "opponent_streak" };
}

function chooseOpponentPlan(readPressure, scoutChoice, opponentTeam) {
  if (readPressure.repeated === "default") return "aggression";
  if (readPressure.repeated === "rush") return "stack";
  if (scoutChoice === "hide-looks") return "retake";
  return opponentTeam.stats.tacticalExecution >= 84 ? "info" : "retake";
}

function tacticEdgeForChoice(choice, opponentPlan, readPressure, scoutChoice, continuityBonus, prematchIntel = {}) {
  const tactic = openingTacticFromChoice(choice);
  let edge = 0;
  if (tactic === "rush" && opponentPlan === "stack") edge -= 5;
  if (tactic === "rush" && opponentPlan === "info") edge += 3;
  if (tactic === "default" && opponentPlan === "aggression") edge += 4;
  if (tactic === "default" && opponentPlan === "info") edge -= 2;
  if (tactic === "lurk" && opponentPlan === "retake") edge += 3;
  if (tactic === "lurk" && opponentPlan === "info") edge -= 4;
  if (tactic === "fake" && opponentPlan === "stack") edge += 4;
  if (tactic === "fake" && opponentPlan === "retake") edge -= 2;
  if (readPressure.repeated === tactic) edge += readPressure.penalty;
  if (scoutChoice === "drill" && tactic !== "rush") edge += 3;
  if (scoutChoice === "hide-looks" && (tactic === "fake" || tactic === "lurk")) edge += 2;
  if (prematchIntel?.scoutingPlan?.id === "hide-looks" && (tactic === "fake" || tactic === "lurk")) edge += 1;
  const styleCounter = prematchIntel?.opponentStyle?.counter
    ?? (prematchIntel?.style === "stack-heavy" ? "rush"
      : prematchIntel?.style === "late-round" ? "fake"
        : prematchIntel?.style === "duel-heavy" || prematchIntel?.style === "aggression" ? "lurk"
          : prematchIntel?.style === "info-heavy" || prematchIntel?.style === "structure" ? "default"
            : "");
  if (styleCounter === tactic) edge -= 4;
  return edge + continuityBonus;
}

function buildHubEvent(campaign) {
  const lastRecord = campaign.cupRecords?.[campaign.cupRecords.length - 1];
  const placement = lastRecord?.placement;
  const eligible = betweenCupEventPool.filter((event) => !event.placements || event.placements.includes(placement));
  const pool = eligible.length ? eligible : betweenCupEventPool;
  const seed = campaign.seasonIndex * 11 + campaign.cupIndex * 5 + (campaign.cupRecords?.length ?? 0) - (placement === "八强" ? 3 : 0);
  return pickFreshEvent(pool, seed, campaign.eventHistory, "betweenCup");
}

function betweenCupEventCount(campaign) {
  return 2;
}

function buildHubEvents(campaign) {
  const lastRecord = campaign.cupRecords?.[campaign.cupRecords.length - 1];
  const placement = lastRecord?.placement;
  const count = betweenCupEventCount(campaign);
  const picked = [];
  let history = createEventHistory(campaign.eventHistory);
  for (let index = 0; index < count; index += 1) {
    let eligible = betweenCupEventPool.filter((event) => !event.placements || event.placements.includes(placement));
    if (index > 0 && (placement === "冠军" || placement === "亚军")) {
      eligible = eligible.filter((event) => event.tone === "negative" || event.severity === "severe");
    }
    const pool = eligible.filter((candidate) => !picked.some((entry) => entry.id === candidate.id));
    const event = pickFreshEvent(pool.length ? pool : eligible.length ? eligible : betweenCupEventPool, campaign.seasonIndex * 19 + campaign.cupIndex * 7 + index * 5, history, "betweenCup");
    if (!event) continue;
    picked.push(event);
    history = appendEventHistory(history, "betweenCup", event.id);
  }
  return picked;
}

function buildOffseasonEvents(campaign, records) {
  const seed = campaign.seasonIndex * 17 + records.length * 7 + (campaign.trophies ?? 0);
  const bestPlacement = Math.min(...records.map((record) => (record.placement === "冠军" ? 1 : record.placement === "亚军" ? 2 : record.placement === "四强" ? 4 : 8)));
  const earlyCampaign = (campaign?.seasonIndex ?? 1) <= 2;
  const count = earlyCampaign ? 4 + (bestPlacement <= 2 ? 1 : 0) : 3 + (seed % 2 === 0 ? 1 : 0);
  const picked = [];
  let history = createEventHistory(campaign.eventHistory);
  for (let index = 0; index < count; index += 1) {
    const filteredPool = offseasonEventPool
      .filter((candidate) => !picked.some((entry) => entry.id === candidate.id))
      .filter((candidate) => index === 0 || !earlyCampaign || candidate.tone === "negative" || candidate.severity === "severe" || seed % 2 === 0);
    const event = pickFreshEvent(
      filteredPool.length ? filteredPool : offseasonEventPool.filter((candidate) => !picked.some((entry) => entry.id === candidate.id)),
      seed + index * 5,
      history,
      "offseason",
    );
    if (!event) continue;
    picked.push(event);
    history = appendEventHistory(history, "offseason", event.id);
  }
  return picked.map(materializeOffseasonEvent);
}

function adjustEffect(effect = {}, scale = 1, extra = {}) {
  return {
    firepower: Math.round((effect.firepower ?? 0) * scale + (extra.firepower ?? 0)),
    tacticalExecution: Math.round((effect.tacticalExecution ?? effect.tactics ?? 0) * scale + (extra.tacticalExecution ?? extra.tactics ?? 0)),
    cohesion: Math.round((effect.cohesion ?? 0) * scale + (extra.cohesion ?? 0)),
    discipline: Math.round((effect.discipline ?? 0) * scale + (extra.discipline ?? 0)),
  };
}

function offseasonChoiceTheme(event = {}) {
  const text = `${event.id ?? ""} ${event.title ?? ""} ${event.narrative ?? ""}`;
  if (/教练|助教|技术方案|暂停/.test(text)) return "staff";
  if (/地图|版本|VOD|录像|战术|情报|训练赛|demo|封闭赛|跑图/.test(text)) return "tactics";
  if (/新人|青训|试训|老将|退役|首发|替补|枪位|角色/.test(text)) return "roster";
  if (/赞助|商务|媒体|采访|品牌|直播|粉丝|见面会|表演赛|活动/.test(text)) return "media";
  if (/伤|病|体能|心理|外设|设备|网络|酒店|疲劳|作息|恢复/.test(text)) return "health";
  return event.tone === "negative" ? "stability" : "growth";
}

function themedOffseasonChoices(event = {}, baseEffect = {}) {
  const theme = offseasonChoiceTheme(event);
  const base = richerBalancedOffseasonChoice(event, theme, baseEffect);
  const recipes = {
    staff: [
      base,
      {
        id: `${event.id}-scrim-test`,
        label: "拿两场训练赛验证方案",
        result: "你让助教把新方案压成两套可执行开局，只在训练赛里试。队员能感到变化，但不会突然被要求推翻原来的默认。",
        effect: adjustEffect(baseEffect, 0.75, { tacticalExecution: 2, discipline: 1, cohesion: -1 }),
      },
      {
        id: `${event.id}-review-first`,
        label: "先做录像复盘再决定",
        result: "你没有立刻上新东西，而是让助教把方案和最近三张输图逐段对照。节奏慢一点，但队员更容易理解为什么要改。",
        effect: adjustEffect(baseEffect, 0.55, { tacticalExecution: 1, cohesion: 2, firepower: -1 }),
      },
    ],
    tactics: [
      base,
      {
        id: `${event.id}-deep-drill`,
        label: "封闭训练里重跑细节",
        result: "你把问题拆进封闭训练：默认站位、补枪距离、道具落点逐项重跑。准备更细，但队员的疲劳也会堆起来。",
        effect: adjustEffect(baseEffect, 0.85, { tacticalExecution: 2, discipline: 1, firepower: -1, cohesion: -1 }),
      },
      {
        id: `${event.id}-trim-playbook`,
        label: "只保留三套最稳打法",
        result: "你砍掉花活，只留下三套下一场大赛能稳定调用的打法。战术上限少一点，但临场不会被信息量压垮。",
        effect: adjustEffect(baseEffect, 0.55, { discipline: 2, cohesion: 1, tacticalExecution: -1 }),
      },
    ],
    roster: [
      base,
      {
        id: `${event.id}-role-meeting`,
        label: "单独开角色会议",
        result: "你把受影响的选手单独叫来，讲清首发标准、训练目标和下一场大赛的角色边界。压力没有消失，但至少不再靠猜。",
        effect: adjustEffect(baseEffect, 0.65, { cohesion: 2, discipline: 1, firepower: -1 }),
      },
      {
        id: `${event.id}-competition-block`,
        label: "安排一周位置竞争",
        result: "你把话说得很直：位置靠这一周训练赛表现争。训练强度上来了，火力被逼出来，训练室气氛也会更紧。",
        effect: adjustEffect(baseEffect, 0.8, { firepower: 2, discipline: 1, cohesion: -2 }),
      },
    ],
    media: [
      base,
      {
        id: `${event.id}-compress-schedule`,
        label: "压缩流程，保住训练日",
        result: "你把活动流程压到最短，只保留必须露出。俱乐部交代得过去，队员也没有把整个休赛期耗在镜头前。",
        effect: adjustEffect(baseEffect, 0.65, { discipline: 2, tacticalExecution: 1, cohesion: -1 }),
      },
      {
        id: `${event.id}-let-players-speak`,
        label: "让队员自己讲故事",
        result: "你没有把这件事做成生硬营业，而是让队员用自己的话回应粉丝和镜头。队伍更有归属感，但训练节奏会被切走一点。",
        effect: adjustEffect(baseEffect, 0.6, { cohesion: 3, firepower: -1, discipline: -1 }),
      },
    ],
    health: [
      base,
      {
        id: `${event.id}-recovery-block`,
        label: "先排恢复和低强度跑图",
        result: "你把高强度对枪往后挪，先安排恢复、轻跑图和短复盘。短期锐度少一点，但队伍不会带着疲劳硬撑。",
        effect: adjustEffect(baseEffect, 0.55, { cohesion: 2, discipline: 1, firepower: -2 }),
      },
      {
        id: `${event.id}-controlled-load`,
        label: "保留关键训练，砍掉消耗项",
        result: "你没有完全停训，而是只保留下一场大赛最相关的内容。训练还有强度，但每一段都必须有明确目的。",
        effect: adjustEffect(baseEffect, 0.75, { tacticalExecution: 1, discipline: 2, form: -1 }),
      },
    ],
    stability: [
      base,
      {
        id: `${event.id}-closed-room`,
        label: "关门把问题讲透",
        result: "你把相关人员留在复盘室，把问题拆到能执行的层面。短期气氛不会轻松，但每个人都知道下一步该怎么做。",
        effect: adjustEffect(baseEffect, 0.75, { tacticalExecution: 1, discipline: 2, cohesion: -1 }),
      },
      {
        id: `${event.id}-reduce-noise`,
        label: "先降噪，别让情绪扩散",
        result: "你先切断外部干扰，让队员回到日常流程里。问题没有被戏剧化处理，但训练室重新安静了下来。",
        effect: adjustEffect(baseEffect, 0.55, { cohesion: 2, discipline: 1, firepower: -1 }),
      },
    ],
    growth: [
      base,
      {
        id: `${event.id}-turn-into-drill`,
        label: "转成专项训练主题",
        result: "你把这件好事变成一周专项主题，不让它只停留在情绪上。训练更有目标，但队员也会更累。",
        effect: adjustEffect(baseEffect, 0.75, { tacticalExecution: 2, discipline: 1, cohesion: -1 }),
      },
      {
        id: `${event.id}-keep-light`,
        label: "点到为止，保持新鲜感",
        result: "你没有把积极事件继续加码，只让它自然留在训练室里。队伍心气更稳，状态也不会被额外任务消耗。",
        effect: adjustEffect(baseEffect, 0.55, { cohesion: 2, discipline: 1, firepower: -1 }),
      },
    ],
  };
  return recipes[theme].map((choice) => ({ ...choice, delta: "隐藏" }));
}

function richerBalancedOffseasonChoice(event = {}, theme = "growth", baseEffect = {}) {
  const text = `${event.id ?? ""} ${event.title ?? ""} ${event.narrative ?? ""}`;
  const fallback = {
    id: `${event.id}-balanced`,
    label: event.choice ?? "拆成训练安排",
    result: event.result ?? "你把这件事拆成下一场大赛前能执行的训练安排：谁复盘、谁跑图、谁负责把问题带回训练室。",
    delta: "隐藏",
    effect: baseEffect,
  };
  const choice = (label, result, effect = baseEffect) => ({
    id: `${event.id}-balanced`,
    label,
    result,
    delta: "隐藏",
    effect,
  });
  if (/续约|合同|经纪人/.test(text)) {
    return choice(
      "先开角色会议，再谈报价",
      "你把经纪人和队员都拉回现实：先说下一场大赛的地图位置、枪位分配和训练目标，再谈合同数字。续约没有立刻变轻松，但队员知道自己留下来是为了什么。",
      adjustEffect(baseEffect, 0.75, { cohesion: 2, discipline: 1, firepower: -1 }),
    );
  }
  if (/粉丝|论坛|舆论|旧账/.test(text)) {
    return choice(
      "只谈复盘方向，不下场吵架",
      "你没有让队员去论坛解释，也没有把失利包装成漂亮话。采访只讲下一场大赛前要修的补枪、暂停和地图池，训练室因此少了一些没必要的噪音。",
      adjustEffect(baseEffect, 0.75, { discipline: 2, cohesion: 1, firepower: -1 }),
    );
  }
  if (/训练强度|加练|疲劳|休息/.test(text)) {
    return choice(
      "按状态分组训练",
      "你把队伍拆成两组：疲劳重的人先恢复和轻跑图，手感凉的人补对枪和补枪距离。训练计划更难排，但不会把所有人都按同一种节奏消耗。",
      adjustEffect(baseEffect, 0.75, { firepower: 1, discipline: 2, cohesion: 1 }),
    );
  }
  if (/角色|首发|替补|枪位|位置/.test(text)) {
    return choice(
      "把枪位和首发标准写清楚",
      "你没有用一句“相信大家”糊过去，而是把主攻位、补枪位、防守职责和首发标准写到复盘板上。气氛仍然紧，但每个人至少知道下一场大赛前该争什么。",
      adjustEffect(baseEffect, 0.75, { tacticalExecution: 1, discipline: 2, cohesion: -1 }),
    );
  }
  if (/地图|版本|VOD|录像|情报|训练赛|封闭赛|跑图/.test(text)) {
    return choice(
      "拆成跑图清单逐项解决",
      "你让分析师把问题拆成清单：默认站位、转点路线、保枪判断和经济局预案逐项重跑。进度不会很快，但每一段训练都能对上下一场大赛的具体回合。",
      adjustEffect(baseEffect, 0.75, { tacticalExecution: 2, discipline: 1, firepower: -1 }),
    );
  }
  if (/伤|病|体能|心理|外设|设备|网络|恢复|作息/.test(text)) {
    return choice(
      "先保恢复，再保关键训练",
      "你没有让队员硬顶，也没有把休赛期完全放空。高消耗内容往后挪，保留短复盘、轻跑图和必要热身，让队伍带着更正常的身体状态去下一场大赛。",
      adjustEffect(baseEffect, 0.65, { discipline: 2, cohesion: 1, firepower: -1 }),
    );
  }
  if (/赞助|商务|媒体|采访|品牌|直播|活动|表演赛/.test(text)) {
    return choice(
      "压缩露出，守住训练日",
      "你同意必要的商务安排，但把拍摄、采访和直播窗口压到固定时段。俱乐部有交代，队员也不用把完整训练日拆成一堆碎片。",
      adjustEffect(baseEffect, 0.65, { discipline: 2, tacticalExecution: 1, cohesion: -1 }),
    );
  }
  if (theme === "growth") {
    return choice(
      "把好势头转成训练主题",
      "你没有把积极事件只当成一阵情绪，而是把它落到一周训练主题里。队伍心气被接住，也知道下一场大赛要靠具体回合说话。",
      adjustEffect(baseEffect, 0.75, { tacticalExecution: 1, cohesion: 2, discipline: 1 }),
    );
  }
  return fallback;
}

function materializeOffseasonEvent(event = {}) {
  const baseEffect = event.effect ?? {};
  return {
    ...event,
    options: event.options ?? themedOffseasonChoices(event, baseEffect),
    deltaTone: classifyDeltaTone(event.delta || event.result || event.narrative),
  };
}

function sumEventEffects(events = []) {
  return events.reduce((total, event) => ({
    firepower: total.firepower + (event.effect?.firepower ?? 0),
    tacticalExecution: total.tacticalExecution + (event.effect?.tacticalExecution ?? event.effect?.tactics ?? 0),
    cohesion: total.cohesion + (event.effect?.cohesion ?? 0),
    discipline: total.discipline + (event.effect?.discipline ?? 0),
  }), { firepower: 0, tacticalExecution: 0, cohesion: 0, discipline: 0 });
}

function seriesLabel(score) {
  return `当前比分 ${score[0]}-${score[1]}`;
}

function mapIndexLabel(index) {
  return `第 ${index + 1} 局`;
}

function scoreDeltaToOutcome(score) {
  if (!Array.isArray(score)) return "swing";
  if (score[0] > score[1]) return "win";
  if (score[1] > score[0]) return "loss";
  return "swing";
}

function classifyDeltaTone(delta = "") {
  const plusCount = (delta.match(/\+\d+/g) ?? []).length;
  const minusCount = (delta.match(/-\d+/g) ?? []).length;
  if (plusCount > 0 && minusCount === 0) return "positive";
  if (minusCount > 0 && plusCount === 0) return "negative";
  if (/(失守|失败|流产|吃亏|淘汰|断了|没谈成|不足|崩|被拖死|失败|输掉|没收住)/.test(delta)) return "negative";
  if (/(拿下|守住|成功|入队|到手|回防成功|止血|顶住|更稳|晋级)/.test(delta)) return "positive";
  return "neutral";
}

function visibleFeedbackText(delta = "") {
  const text = String(delta ?? "").trim();
  if (!text) return "暂无";
  const hasRawDelta = /(?:火力|战术执行|执行|纪律|士气|配合|团队配合|状态|战术|预算氛围)\s*[+-]\d/.test(text);
  if (!hasRawDelta && text !== "隐藏") return text;

  const positive = [];
  const negative = [];
  const push = (bucket, value) => {
    if (!bucket.includes(value)) bucket.push(value);
  };
  const positiveRules = [
    [/火力\s*\+|状态\s*\+/, "队员的手感被调动起来了"],
    [/战术执行\s*\+|执行\s*\+|战术\s*\+/, "战术口径变得更清楚"],
    [/纪律\s*\+/, "队伍重新愿意按同一套指令行动"],
    [/士气\s*\+/, "每个人心里的信念感更强了"],
    [/配合\s*\+|团队配合\s*\+/, "彼此之间的默契加深了"],
    [/预算氛围\s*\+/, "俱乐部外部支持带来了一点底气"],
  ];
  const negativeRules = [
    [/火力\s*-|状态\s*-/, "但手感和身体状态被消耗了一些"],
    [/战术执行\s*-|执行\s*-|战术\s*-/, "但战术准备被迫收窄"],
    [/纪律\s*-/, "但纪律边界变得更松"],
    [/士气\s*-/, "但队员心里也压下了一些情绪"],
    [/配合\s*-|团队配合\s*-/, "但队内默契被磨损了一点"],
    [/预算氛围\s*-/, "但场外压力没有完全消失"],
  ];
  for (const [pattern, label] of positiveRules) if (pattern.test(text)) push(positive, label);
  for (const [pattern, label] of negativeRules) if (pattern.test(text)) push(negative, label);

  if (text === "隐藏") return "影响会留在队伍状态里，具体结果要到下一场比赛里看。";
  if (positive.length && negative.length) return `${positive.join("，")}，${negative.join("，")}。`;
  if (positive.length) return `${positive.join("，")}。`;
  if (negative.length) return `${negative.join("，")}。`;
  return "这次选择已经影响了队伍状态，具体变化会在后续比赛里体现。";
}

function classifyResolvedTone(entry = {}) {
  if (Array.isArray(entry.score)) {
    if (entry.score[0] > entry.score[1]) return "positive";
    if (entry.score[1] > entry.score[0]) return "negative";
  }
  return classifyDeltaTone(entry.delta ?? "");
}

function scoreCardText(mapLabel, score, body) {
  return `${mapLabel} · ${seriesLabel(score)}\n\n${body}`;
}

function stripNextRoundPromises(text = "") {
  return text
    .replace(/“[^”]*(?:下一局|下把|下一把|再给我一把枪|找回来|打回来|换开法)[^”]*”/g, "“BO5 到此结束，先把情绪带回休息室。”")
    .replace(/下一局很可能就是赛点图。谁把这局咬下来，谁就能先摸到 BO5 的门把手。/g, "这一局如果没咬下来，BO5 就会在这里结束。")
    .replace(/比分又被对手咬住了/g, "杯赛到此结束")
    .replace(/下一局经济压力变大/g, "没有下一局可等")
    .replace(/下一局/g, "后面")
    .replace(/下把/g, "赛后")
    .replace(/下一把/g, "赛后");
}

function eliminationLossText(card, state, nextScore) {
  const active = activeRoster(selectedPlayers(state), state.substitute);
  const star = active.sort((left, right) => right.firepower - left.firepower)[0] ?? active[0];
  const opponentName = state.match.opponent;
  const line = pickCharacterLossLine(star, "match_lost", (state.match.hidden.seed ?? 0) + card.mapIndex * 53 + nextScore[1]);
  const base = stripNextRoundPromises(card.loseText ?? card.result ?? "最后一波没能收住。");
  return `${base} ${line}\n\n${opponentName} 拿到第 3 张地图，BO5 到此结束。Team gun 被淘汰，后面的复盘只能留到赛后。`;
}

function applyEconomyChoiceContext(cards, choiceId, score) {
  if (!choiceId || !["full_setup", "lean_setup", "force_setup"].includes(choiceId)) return cards;
  const isEliminationRisk = score[0] === 0 && score[1] === 2;
  return cards.map((card) => {
    if (card.mapIndex !== 2) return card;
    if (card.title.includes("架枪拖时")) {
      if (choiceId === "force_setup") {
        return {
          ...card,
          text: `${mapIndexLabel(2)}你们选择 eco，不是因为这局舒服，而是因为装备已经撑不起完整进攻。基础手枪、少量烟闪，目标只有两个：偷一两把枪，尽量别把节奏打得更乱。\n\n对手知道你们枪械劣势，开始主动前压收信息。正面硬碰几乎没有胜算，只有叠点、交叉和偷 timing 还有一点机会。`,
          result: isEliminationRisk
            ? "现在是 0-2，eco 输了就是整场 BO5 结束。这个选择不是为了这局舒服，而是承认正面胜率很低，把最后的希望押在一次偷枪、叠点和混烟奇迹上。"
            : "这一局正面很难打，但经济被保存下来。如果后面还有回合，至少不会因为一次硬赌把买枪节奏彻底拖垮。",
          delta: isEliminationRisk
            ? "eco · 本局胜率很低 · 输掉即出局"
            : "eco · 本局胜率很低 · 后续经济更稳",
          playerDelta: card.playerDelta,
        };
      }
      if (choiceId === "lean_setup") {
        return {
          ...card,
          text: `${mapIndexLabel(2)}你们没有把钱全部砸进去，只补必要护甲、升级手枪和少量关键道具。枪械不完整，但至少每个人都知道这一局不能无脑硬冲。\n\n${card.text}`,
          result: "这波半起没有让你们拥有正面对枪优势，但保住了一部分回旋空间。赢下来血赚，输掉也不是彻底崩盘。",
          delta: "半起 · 容错偏低 · 经济还有回旋",
        };
      }
      return {
        ...card,
        text: `${mapIndexLabel(2)}你们选择梭哈全起，长枪、护甲和关键道具尽量补满。现在这局必须打出结果，因为钱已经被压进了这一轮。\n\n${card.text}`,
        delta: "全起 · 本局战力拉满 · 输掉会很伤",
      };
    }
    if (card.title.includes("转折结算")) {
      if (choiceId === "force_setup") {
        return {
          ...card,
          text: isEliminationRisk
            ? "第 3 局已经是赛点边缘。eco 的现实就是这样：赢了是奇迹，输了比赛直接结束，但它本质上是在省钱，不是在把经济拖坏。"
            : "第 3 局是一次主动省钱。它不漂亮，也很难赢，但如果没有被直接带走，后面的买枪线会更清楚。",
          winText: `${card.winText} 这把 eco 偷成了，比分和情绪都会被重新点燃。`,
          loseText: isEliminationRisk
            ? "对手没有给手枪局奇迹任何空间。第一波道具把入口封死，第二波补枪把退路也收掉。eco 输了，BO5 到此结束，但这不是经济断裂，而是比分已经没有下一局可等。"
            : "对手稳稳收下这局，没有给手枪和少量道具太多机会。你们丢了一分，但保住了后面的买枪节奏。",
          winDelta: "eco 翻成 · 士气大涨",
          loseDelta: isEliminationRisk ? "eco 没偷到 · BO5 结束" : "eco 没偷到 · 后续经济保留",
        };
      }
      if (choiceId === "lean_setup") {
        return {
          ...card,
          loseText: "半起的火力还是差了一截，第一波没换到枪，后面只能被对手慢慢压缩空间。",
          loseDelta: "半起没顶住 · 但经济仍有回旋",
        };
      }
      return {
        ...card,
        loseDelta: "全起没拿下 · 下一局经济压力变大",
      };
    }
    return card;
  });
}

function applyPistolChoiceContext(cards, choiceId) {
  if (!choiceId || !["pistol_armor", "pistol_utility", "pistol_deagle", "pistol_save"].includes(choiceId)) return cards;
  const noUtility = choiceId === "pistol_save" || choiceId === "pistol_armor" || choiceId === "pistol_deagle";
  const saveCall = choiceId === "pistol_save";
  const armorCall = choiceId === "pistol_armor";
  return cards.map((card) => {
    if (card.mapIndex !== 0) return card;
    if (card.title.includes("开局战术")) {
      if (noUtility) {
        return {
          ...card,
          text: saveCall
            ? "你们这把没有烟闪可铺，只有初始手枪和站位。开局不能靠道具掩护，只能靠抱团补枪、静步听信息和第一身位硬换。"
            : armorCall
              ? "你们把钱压在半甲上，能多吃一发身体伤害，但没有烟闪帮忙开路。开局要靠站位、交叉枪线和补枪速度。"
              : "沙鹰抽奖意味着几乎没有道具和护甲容错。开局不能打复杂配合，只能给明星位一个干净对枪窗口。",
          options: card.options.map((option) => {
            if (option.id === "rush") return { ...option, result: "第一身位只能干拉进点，没有闪光帮忙逼退对手。你们赌的是贴近距离后的补枪速度。", delta: "没有烟闪 · 干拉抢点，风险更高" };
            if (option.id === "default") return { ...option, result: "你让全队先架住默认枪线，少做花活，靠脚步和对手露身位来找关键对枪。", delta: "只靠站位 · 信息更慢但更稳" };
            if (option.id === "lurk") return { ...option, result: "边线慢摸不能靠烟雾遮脚步，只能靠静步和队友正面牵制。这个选择更吃耐心。", delta: "初始手枪 · 慢摸找背身" };
            return { ...option, result: "没有烟闪做假动作，只能靠脚步停顿和露身位骗反应。对手如果不动，这波会很难转开。", delta: "假动作简化 · 主要骗站位" };
          }),
        };
      }
      return {
        ...card,
        text: "你们这把牺牲护甲换了少量烟闪，开局可以用道具抢第一波站位，但零甲意味着每次对枪都不能拖太久。",
        options: card.options.map((option) => {
          if (option.id === "rush") return { ...option, result: "第一颗闪先压住近点，烟封回防路，突破位顺着道具空隙往里冲。", delta: "烟闪开路 · 第一波更舒服" };
          if (option.id === "default") return { ...option, result: "你把唯一的烟留给中段，先用默认架枪等对手试探，再靠闪光抢回节奏。", delta: "道具控图 · 零甲容错偏低" };
          if (option.id === "lurk") return { ...option, result: "正面用一颗闪制造压力，边线慢摸等对手回头。道具不多，所以时机必须很准。", delta: "少量道具 · 夹击窗口更短" };
          return { ...option, result: "脚步和烟先做出假点压力，再用最后一颗闪帮转点队员抢入口。", delta: "烟闪假打 · 但零甲怕反清" };
        }),
      };
    }
    if (card.title.includes("首杀交换") && noUtility) {
      return {
        ...card,
        text: saveCall
          ? "第 1 局的第一波交火很朴素：没有烟闪，没有复杂爆弹，只有初始手枪、脚步声和谁先稳住准星。\n\n对手先用道具试入口，Team gun 只能贴墙等烟散，靠站位把第一波交换勉强接住。\n\n观众席倒吸了一口气，随后才爆出掌声。每个人都知道刚才那波差一点就崩了。"
          : "第 1 局的第一波交火没有太多花样。你们没有成套道具，只能靠半甲/沙鹰的正面对枪价值去换空间。\n\n对手先交道具压住入口，Team gun 没有烟闪反制，只能等第一波压迫过去再补枪。\n\n观众席倒吸了一口气，随后才爆出掌声。每个人都知道刚才那波差一点就崩了。",
        result: saveCall
          ? "你们没有靠道具拿到首杀，只是从对手前压里读到了一点站位。信息到手，但人数交换没有赚。"
          : card.result,
        delta: saveCall ? "初始手枪 · 信息到手但没有赚人" : card.delta,
      };
    }
    if (card.title.includes("手枪局结算")) {
      if (noUtility) {
        return {
          ...card,
          winText: saveCall
            ? "Team gun 没有烟闪可以续，只能靠包边交叉枪线硬守。最后一波对手回防踩进近点，关键身位被架住，第二个人也没能把拆包位清出来。手枪局被 Team gun 偷下。"
            : "最后一波没有道具能救场，Team gun 只能靠半甲/沙鹰的正面对枪把回防顶回去。关键一枪打中以后，包边交叉火力才终于站住。",
          loseText: saveCall
            ? "只拿初始手枪的代价很快出现：没有烟闪拖回防，也没有护甲多吃一枪。对手把包边一步步清干净，Team gun 最后只能靠干拉补枪，没能把低成本局偷下来。"
            : "你们没有完整道具可以切断回防，第一波枪没换够以后，包点很快被对手重新围住。正面对枪差最后一口气，手枪局还是被拿走。",
        };
      }
      return {
        ...card,
        winText: "你们把那点烟闪用在最关键的位置：先封回防，再用闪光逼对手转头。零甲很危险，但道具给了 Team gun 足够的进点时间，手枪局被拿下。",
        loseText: "道具手枪的弱点也很明显：烟闪交完以后，零甲对枪太脆。对手顶住第一波后立刻反清，Team gun 没能在道具时间里把人数优势打出来。",
      };
    }
    return card;
  });
}

function openingTacticFollowup(choiceId, hidden = {}, playerStats = {}, opponentTeam = {}) {
  const tactic = openingTacticFromChoice(choiceId);
  if (!["rush", "default", "lurk", "fake"].includes(tactic)) return undefined;
  const rolePhaseEdge = hidden.rolePhaseEdge ?? {};
  const opponentStats = opponentTeam.stats ?? {};
  const fireGap = (playerStats.firepower ?? 75) - (opponentStats.firepower ?? 75);
  const executionGap = (playerStats.tacticalExecution ?? 75) - (opponentStats.tacticalExecution ?? 75);
  const disciplineGap = (playerStats.discipline ?? 75) - (opponentStats.discipline ?? 75);
  const cohesionGap = (playerStats.cohesion ?? 75) - (opponentStats.cohesion ?? 75);
  const baseEdge = hidden.tacticEdge ?? 0;
  const edge = baseEdge
    + Math.round(executionGap / 7)
    + Math.round(disciplineGap / 10)
    + (tactic === "rush" ? Math.round(fireGap / 6) : 0)
    + (tactic === "fake" || tactic === "lurk" ? Math.round(cohesionGap / 8) + Math.round((rolePhaseEdge.lurk ?? 0) * 0.7) : 0);
  const success = edge >= 0;
  const rival = opponentTeam.name ?? "对手";
  const star = opponentTeam.stars?.[0] ?? "对手核心";
  const second = opponentTeam.stars?.[1] ?? "对手补枪位";
  const copy = {
    rush: success
      ? {
        title: "第 1 局 · 快攻落点",
        text: `你们选择快攻包点以后，第一身位没有再犹豫。入口烟一散，Team gun 直接把主攻位资源压到包点门口，靠第一波对枪把 ${second} 逼退。\n\n${rival} 的回防被迫提前启动，警家和连接都慢了一步。快攻成功，但代价是正面交换很硬，每一把枪都要有人补上。`,
        result: `这波快攻打出了开局主动权。火力差距和补枪速度站住以后，对手没法舒服叠点。`,
        delta: "快攻成功 · 开局主动权到手",
      }
      : {
        title: "第 1 局 · 快攻撞墙",
        text: `你们选择快攻包点，但 ${rival} 明显把重心提前压了过来。第一颗反清闪落下时，入口的人还没站稳，主攻位资源直接撞进完整交叉火力。\n\n这不是没人敢冲，而是对手纪律性更好，包点没有被速度冲散。`,
        result: `快攻没打穿。第一波对枪亏了，后续只能靠补枪把局面硬拽回来。`,
        delta: "快攻失败 · 正面交换吃亏",
      },
    default: success
      ? {
        title: "第 1 局 · 默认架枪拿信息",
        text: `你们选择默认架枪，没有急着把人全压到一个方向。中段先架住，小道慢慢清，等 ${star} 自己露出第一条信息。\n\n${rival} 想前压试探，但 Team gun 的补枪距离保持得很好，第一波对枪没有被拆散。`,
        result: `默认架枪成功拿到信息。战术倾斜更清楚，后续转点也有了依据。`,
        delta: "默认成功 · 信息和枪线更清楚",
      }
      : {
        title: "第 1 局 · 默认被前压打断",
        text: `你们选择默认架枪，但 ${rival} 没给你们慢慢铺开的时间。${second} 先从边线试出脚步，${star} 再用反清闪把中段节奏切断。\n\n默认不是错，问题是这一波对手读得更快，战术倾斜还没形成就被迫补救。`,
        result: `默认控图失败。信息没拿全，第一波对位也没有赚到空间。`,
        delta: "默认被断 · 信息不足",
      },
    lurk: success
      ? {
        title: "第 1 局 · 慢控单摸奏效",
        text: `你们选择慢控单摸，正面没有急着爆弹，而是把枪声留在包点外。边线的人静步绕后，等 ${rival} 的回防注意力被正面吸住才拉出来。\n\n自由人没有贪枪，先断后再反摸警家。这波单摸没有变成送首杀，反而切断了回防路线。`,
        result: `慢控成功。团队配合撑住了等待时间，单摸和绕后给转点创造了空间。`,
        delta: "慢控成功 · 绕后切断回防",
      }
      : {
        title: "第 1 局 · 单摸被抓",
        text: `你们选择慢控单摸，但脚步和时间点被 ${rival} 抓得很准。边线还没绕到位，${second} 已经提前回头架住，反摸的人被迫先开枪。\n\n正面等了太久，单摸又没打开缺口，Team gun 的第一波对枪被迫在不舒服的位置开打。`,
        result: `慢控失败。单摸没拿到背身，绕后路线反而被对手提前收掉。`,
        delta: "慢控失败 · 时间和枪位都吃亏",
      },
    fake: success
      ? {
        title: "第 1 局 · 假打转点骗到回防",
        text: `你们选择假打转点，假点脚步和烟都做得很真。${rival} 的第一波回防被晃动，警家烟落下后，连接位慢了半步。\n\n转点成功不是因为对手不会打，而是 Team gun 的纪律性撑住了节奏：假点不恋战，主攻落点时补枪也跟上了。`,
        result: `假打转点成功骗到回防。战术执行站住以后，包点入口终于被撕开。`,
        delta: "假打成功 · 骗回防，转点打开",
      }
      : {
        title: "第 1 局 · 假打没有骗动",
        text: `你们选择假打转点，但 ${rival} 没有被脚步带走。${star} 继续守住原枪线，${second} 也没有提前乱转，警家和连接都保持着完整交叉火力。\n\n这波失败不在想法，而在执行细节：假点声音做出来了，真正落点却没能抢到第一波对枪。`,
        result: `假打转点失败。对手纪律性更好，转点落地时已经撞进回防枪线。`,
        delta: "假打失败 · 没骗动对手回防",
      },
  }[tactic];
  return { ...copy, success, edge };
}

function applyOpeningTacticContext(cards, choiceId, hidden = {}, playerStats = {}, opponentTeam = {}) {
  const followup = openingTacticFollowup(choiceId, hidden, playerStats, opponentTeam);
  if (!followup) return cards;
  return cards.map((card) => {
    if (card.mapIndex !== 0 || !card.title.includes("首杀交换")) return card;
    return {
      ...card,
      title: followup.title,
      text: followup.text,
      result: followup.result,
      delta: followup.delta,
    };
  });
}

function resolveBuyTierForMap(mapIndex, score, previousOutcome) {
  if (mapIndex === 0) return "pistol";
  if (previousOutcome === "loss" && score[0] + score[1] <= 1) return "eco";
  if (previousOutcome === "loss" && score[0] <= score[1]) return "force_buy";
  if (previousOutcome === "win" && score[0] > score[1]) return "bonus";
  return "full_buy";
}

function pickWeighted(list, seed, fallbackIndex = 0) {
  if (!list.length) return undefined;
  return list[Math.abs(seed) % list.length] ?? list[fallbackIndex];
}

function hashChoiceId(choiceId = "") {
  return [...String(choiceId)].reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 3), 0);
}

function makeMatchCards(roster, stats, opponentTeam, scoutChoice, roundName, cupName, seed = 0, textHistory = {}) {
  const matchTextIds = [];
  const localTextIds = new Set();
  const pickMatchTemplate = (prefix, pool, offsetSeed) => {
    const picked = pickFreshTemplate(pool, offsetSeed, textHistory, "match", localTextIds, prefix);
    if (picked?.id) matchTextIds.push(picked.id);
    return picked?.template;
  };
  const {
    star,
    caller,
    entry,
    support,
    lurker,
    anchor,
    awper,
    enemyStar,
    enemySecond,
    templateVars,
  } = buildMatchVariables({ roster, opponentTeam, playerTeamStats: stats, roundName });
  const enemyThird = opponentTeam.stars[2] ?? `${opponentTeam.name} 第三人`;
  const scoutLine = scoutingResultLine(scoutChoice);
  const timeoutTrigger = chooseTimeoutScenarioForMatch(stats, scoutChoice, summarizeReadPressure([openingTacticFromChoice("default"), openingTacticFromChoice("default")]), seed);
  const sites = narrativeSites;
  const map3PressureText = stats.firepower > stats.discipline + 7
    ? fillTemplate(pickMatchTemplate("force-buy-fail", forceBuyFailTemplates, seed + 21), { ...templateVars, site: pickWeighted(sites, seed + 22, 0) })
    : describeUtilityStall(templateVars, seed + 23, pickMatchTemplate);
  const map4ReadText = describeReadPressure(templateVars, seed + 31, "default", pickMatchTemplate);
  const map4ClutchText = describeClutchSetup(templateVars, seed + 37, pickMatchTemplate);
  const map4LoseDetail = `${pickBombFailureLine("fake_defuse_caught", templateVars, seed + 39, pickMatchTemplate)} ${pickCharacterLossLine(star, "round_lost", seed + 40)}`;
  const map5LoseDetail = `${pickBombFailureLine("killed_on_defuse", templateVars, seed + 47, pickMatchTemplate)} ${pickCharacterLossLine(star, "match_lost", seed + 99)}`;
  const atmosphereLine = overviewLine(preMatchAtmospherePool, seed + 2, { ...templateVars, cup_name: cupName });
  const crowdLine = overviewLine(crowdReactionPool, seed + 9, templateVars);
  const epicLine = overviewLine(epicMomentPool, seed + 28, templateVars);
  const finalWinLine = overviewLine(postMatchWinPool, seed + 52, { ...templateVars, cup_name: cupName });
  const finalLoseLine = overviewLine(postMatchLosePool, seed + 53, { ...templateVars, cup_name: cupName });
  const timeoutPepTalk = overviewLine(coachPepTalkPool, seed + 30, templateVars);
  const surpriseCard = buildInMatchSurpriseCard(seed + 33, templateVars, roster);
  const timeoutCard = buildTimeoutCard(timeoutTrigger, templateVars, seed + 29);
  const starHighlightCard = buildStarHighlightCard(roster, templateVars, opponentTeam, seed, pickMatchTemplate);
  const opponentHighlightCard = buildOpponentHighlightCard(roster, templateVars, opponentTeam, seed + 17);

  const cards = [
    {
      type: "choice",
      mapIndex: 0,
      title: "第 1 局 · 手枪局购买",
      text: `${atmosphereLine}\n\n${cupName} 的 ${roundName} 开场就是手枪局。${scoutLine} 每人只有 $800：半甲是 $650，拆弹套是 $400，烟 $300，闪 $200。你要决定的是护甲、道具、拆弹和留钱怎么取舍。`,
      prompt: "手枪局怎么配",
      options: [
        { id: "pistol_armor", label: "半甲手枪", swing: 2, result: `${entry.name} 起半甲加初始手枪，剩下的钱买不了关键道具。这套就是正面对枪，拼第一波对枪谁更敢站住。`, delta: "半甲 + 初始手枪 · 正面对枪更稳", playerDelta: mergePlayerDeltaEntries([[entry.id, { impact: 1 }], [anchor.id, { impact: 1 }]]) },
        { id: "pistol_utility", label: "道具手枪", swing: 1, result: `${support.name} 放弃护甲，改买升级手枪、烟雾和闪光。手枪局的道具很少，但一颗烟封住回防路，第一波进点就能舒服很多。`, delta: "升级手枪 + 烟 + 闪 · 零甲但道具更足", playerDelta: mergePlayerDeltaEntries([[support.id, { assists: 1, impact: 1 }], [caller.id, { impact: 1 }]]) },
        { id: "pistol_deagle", label: "沙鹰抽奖", swing: 0, result: `${star.name} 不买甲，直接掏沙鹰。$700 花出去，只剩 $100。这不是常规选择，是抽奖看关键一枪能不能把 ${enemySecond} 的站位打碎。`, delta: "沙鹰无甲 · 上限高，容错低", playerDelta: mergePlayerDeltaEntries([[star.id, { impact: 1 }]]) },
        { id: "pistol_save", label: "这把不买，留钱", swing: -2, result: "你让队伍只拿初始手枪出门，把这局当成信息局。赢了血赚，输了也能给第二局留下更多经济回旋。", delta: "初始手枪 · 经济保留，正面更难站住", playerDelta: {} },
      ],
    },
    {
      type: "choice",
      mapIndex: 0,
      title: "第 1 局 · 开局战术",
      text: `手枪局里最值钱的是开局站位和后续补枪。你现在只能从对面落下的脚步、道具和交火密度里猜节奏，还看不到完整答案。`,
      prompt: "这局怎么开",
      options: [
        { id: "rush", label: OPENING_TACTICS.rush.label, swing: 1, result: `${entry.name} 顶着第一颗闪往里冲，${support.name} 的补闪直接把 ${enemySecond} 逼退。`, delta: "前十五秒就压住了包点进门位置", playerDelta: mergePlayerDeltaEntries([[entry.id, { kills: 1, deaths: 1, impact: 4 }], [support.id, { assists: 1, impact: 2 }]]), opponentDelta: mergeNamedDeltaEntries([[enemySecond, { deaths: 1 }]]) },
        { id: "default", label: OPENING_TACTICS.default.label, swing: 2, result: `${caller.name} 没让全队一股脑冲进去，而是先把中段默认枪线架住，等 ${enemyStar} 自己来试。`, delta: "信息和枪线都更清楚", playerDelta: mergePlayerDeltaEntries([[caller.id, { assists: 1, impact: 2 }], [awper.id, { kills: 1, impact: 3 }], [entry.id, { deaths: 1 }]]), opponentDelta: mergeNamedDeltaEntries([[enemyStar, { deaths: 1 }]]) },
        { id: "lurk", label: OPENING_TACTICS.lurk.label, swing: 0, result: `${lurker.name} 悄悄摸边线，四个人先留住正面枪口，等后手夹击的信号一到就打。`, delta: "变数更大", playerDelta: mergePlayerDeltaEntries([[lurker.id, { kills: 1, impact: 3 }], [entry.id, { deaths: 1 }]]), opponentDelta: mergeNamedDeltaEntries([[enemyThird, { deaths: 1 }]]) },
        { id: "fake", label: "假打转点", swing: 1, result: `${caller.name} 先把脚步和烟做满，骗 ${enemySecond} 提前换位，再让 ${star.name} 带头转点。`, delta: "骗走对面回防，为转点抢出时间差", playerDelta: mergePlayerDeltaEntries([[caller.id, { assists: 2, impact: 3 }], [star.id, { kills: 1, deaths: 1, impact: 3 }]]), opponentDelta: mergeNamedDeltaEntries([[enemySecond, { deaths: 1 }]]) },
      ],
    },
    {
      type: "story",
      mapIndex: 0,
      title: "第 1 局 · 首杀交换",
      text: `${mapIndexLabel(0)}的第一波交火没有给任何一边留舒服空间。${renderCombatBeat("opening", templateVars, seed + 3, {}, pickMatchTemplate)}\n\n${renderCombatBeat("trade", templateVars, seed + 4, {}, pickMatchTemplate)}\n\n${crowdLine}`,
      result: `${awper.name} 在 ${pickWeighted(sites, seed + 5, 0)} 先收掉了 ${enemyStar}，但 ${entry.name} 也在补枪时被换掉。首杀到手，不代表局面就已经稳了。`,
      score: [0, 0],
      delta: "首杀互换 · 场上回到 4v4",
      playerDelta: mergePlayerDeltaEntries([[awper.id, { kills: 1, impact: 3 }], [entry.id, { deaths: 1 }]]),
      opponentDelta: mergeNamedDeltaEntries([[enemyStar, { deaths: 1 }]]),
    },
    {
      type: "map_result",
      mapIndex: 0,
      title: "第 1 局 · 手枪局结算",
      text: `${mapIndexLabel(0)}快结束了，${opponentTeam.name} 的回防已经贴到了包点边。最后十秒，这局会不会被你们拿住？`,
      winText: `${star.name} 在残局里先点掉了 ${enemySecond}，再等 ${caller.name} 把最后一颗烟续上。${renderCombatBeat("clutch", templateVars, seed + 6, {}, pickMatchTemplate)} 手枪局被 Team gun 拿下。`,
      loseText: `${renderLossBeat("pistol", templateVars, seed + 6, {}, pickMatchTemplate)} ${pickBombFailureLine("defuse_failed", templateVars, seed + 7, pickMatchTemplate)} ${pickCharacterLossLine(star, "round_lost", seed + 8)}`,
      winDelta: "手枪局到手 · 先拿一分",
      loseDelta: "手枪局失守 · 经济先吃亏 · 回防没踩死",
      winPlayerDelta: mergePlayerDeltaEntries([[star.id, { kills: 2, impact: 6 }], [caller.id, { assists: 1, impact: 2 }]]),
      losePlayerDelta: mergePlayerDeltaEntries([[star.id, { kills: 1, deaths: 1, impact: 3 }], [support.id, { deaths: 1 }]]),
      winOpponentDelta: mergeNamedDeltaEntries([[enemySecond, { deaths: 1 }], [enemyThird, { deaths: 1 }]]),
      loseOpponentDelta: mergeNamedDeltaEntries([[enemyStar, { kills: 1, impact: 3 }]]),
    },
    {
      type: "story",
      mapIndex: 1,
      title: "第 2 局 · 经济线抬头",
      text: `${mapIndexLabel(1)}刚开始，最现实的问题已经不是想怎么打，而是有没有资本把这一局打完整。${scoutLine}`,
      result: `${support.name} 一边报点一边提醒大家别乱追，第二局开始，经济线比情绪更重要。手枪局一旦失守，这一局的容错就会立刻变薄。`,
      score: [0, 0],
      delta: "第 2 局先看经济线",
      playerDelta: mergePlayerDeltaEntries([[support.id, { assists: 1, impact: 2 }], [caller.id, { impact: 1 }]]),
    },
    {
      type: "story",
      mapIndex: 1,
      title: "第 2 局 · 中段混战",
      text: `${renderCombatBeat("utility", templateVars, seed + 11, {}, pickMatchTemplate)}\n\n${renderLossBeat("utility", templateVars, seed + 12, {}, pickMatchTemplate)}`,
      result: `${anchor.name} 最后还是补掉了 ${enemySecond}，但 ${entry.name} 已经先被打成大残。你们不是没还手，只是这波道具和补枪都慢了一拍。`,
      score: [0, 0],
      delta: "被道具拖时 · 血量吃亏 · 补枪才勉强跟上",
      playerDelta: mergePlayerDeltaEntries([[anchor.id, { kills: 1, impact: 3 }], [entry.id, { deaths: 1 }]]),
      opponentDelta: mergeNamedDeltaEntries([[enemySecond, { deaths: 1 }]]),
    },
    {
      type: "map_result",
      mapIndex: 1,
      title: "第 2 局 · 局势回摆",
      text: `${mapIndexLabel(1)}会直接决定大比分是拉开还是被追平。${opponentTeam.name} 这波回防已经开始提速。`,
      winText: `${caller.name} 把最后一波默认控图转点掐得很准，${opponentTeam.name} 被拉扯了一整局后还是没回防到位。${renderCombatBeat("highlight", templateVars, seed + 13, {}, pickMatchTemplate)}`,
      loseText: `${renderLossBeat("read", templateVars, seed + 13, {}, pickMatchTemplate)} ${pickBombFailureLine("time_ran_out", templateVars, seed + 14, pickMatchTemplate)} ${pickCharacterLossLine(star, "round_lost", seed + 15)}`,
      winDelta: "第 2 局守住了节奏",
      loseDelta: "第 2 局被拖死时间 · 经济和节奏一起吃瘪",
      winPlayerDelta: mergePlayerDeltaEntries([[caller.id, { assists: 2, impact: 4 }], [lurker.id, { kills: 1, impact: 3 }]]),
      losePlayerDelta: mergePlayerDeltaEntries([[lurker.id, { deaths: 1 }], [anchor.id, { deaths: 1 }]]),
      winOpponentDelta: mergeNamedDeltaEntries([[enemyThird, { deaths: 1 }], [enemyStar, { deaths: 1 }]]),
      loseOpponentDelta: mergeNamedDeltaEntries([[enemyStar, { kills: 2, impact: 4 }]]),
    },
    {
      type: "choice",
      mapIndex: 2,
      title: "第 3 局 · 怎么花钱",
      text: `${mapIndexLabel(2)}开始，经济已经不太宽裕。现在不是简单微调，而是决定这把要梭哈全起、谨慎半起，还是干脆 eco 不起，把钱留给下一局。`,
      prompt: "第 3 局怎么买",
      options: [
        { id: "full_setup", label: "梭哈全起", swing: 2, result: `你让 ${support.name} 把钱全砸进去：长枪、全甲、拆弹套和关键烟闪全部补齐。这把执行最完整，但一旦没拿下，下一局经济会很难受。`, delta: "全起 · 当前战力最满，后续经济压力变大", playerDelta: mergePlayerDeltaEntries([[support.id, { impact: 1 }], [caller.id, { impact: 1 }]]) },
        { id: "lean_setup", label: "谨慎半起", swing: 1, result: `${caller.name} 没让全队把钱花光，保留一部分经济，只补必要护甲、升级手枪和少量道具。这把火力不满，但下一局还有回旋空间。`, delta: "半起 · 这局容错降低，下一局经济更稳", playerDelta: mergePlayerDeltaEntries([[caller.id, { assists: 1, impact: 1 }]]) },
        { id: "force_setup", label: "eco不起", swing: -1, result: `你选择这把不硬赌，只拿基础手枪出门，把钱留给下一局。正面几乎没有优势，但至少不会把整轮经济一起拖死。`, delta: "eco · 这局更难打，下一局能完整起枪", playerDelta: mergePlayerDeltaEntries([[entry.id, { impact: 1 }], [star.id, { impact: 1 }]]) },
      ],
    },
    {
      type: "story",
      mapIndex: 2,
      title: "第 3 局 · 架枪拖时",
      text: `${map3PressureText}\n\n${surpriseCard.text}\n\n${renderCombatBeat("highlight", templateVars, seed + 16, {}, pickMatchTemplate)}\n\n这一局只要第一波没打穿，后面很可能直接掉进强起失败或回防被拖死的节奏里。`,
      result: `${awper.name} 在 ${pickWeighted(sites, seed + 17, 2)} 顶住了一波前压，但你们自己也被打得很疼。${surpriseCard.result} 场面像是稳住了，实际上每个人都知道这一局已经没有多余容错。`,
      score: [0, 0],
      delta: `中段拉扯变重 · ${surpriseCard.delta}`,
      playerDelta: mergePlayerDeltaEntries([[awper.id, { kills: 1, impact: 3 }], [support.id, { assists: 1, impact: 1 }]]),
      opponentDelta: mergeNamedDeltaEntries([[enemyStar, { deaths: 1 }]]),
    },
    {
      type: "map_result",
      mapIndex: 2,
      title: "第 3 局 · 转折结算",
      text: `${mapIndexLabel(2)}往往是这轮 BO5 的转折点。拿下来，后面的经济和节奏才有周旋空间；丢掉的话，下一张图每个选择都会更紧。`,
      winText: `${star.name} 在最后 1v2 里硬把残局接住。${renderCombatBeat("clutch", templateVars, seed + 18, {}, pickMatchTemplate)} 第 3 局成了你们的转折图。`,
      loseText: `${renderLossBeat("economy", templateVars, seed + 18, {}, pickMatchTemplate)} ${fillTemplate(pickMatchTemplate("force-buy-fail", forceBuyFailTemplates, seed + 19), { ...templateVars, site: pickWeighted(sites, seed + 20, 0) })} ${pickCharacterLossLine(star, "round_lost", seed + 20)}`,
      winDelta: `第 3 局打成转折点 · ${epicLine}`,
      loseDelta: "第 3 局没拿下 · 经济选择影响下一局",
      winPlayerDelta: mergePlayerDeltaEntries([[star.id, { kills: 2, impact: 6 }], [awper.id, { assists: 1, impact: 2 }]]),
      losePlayerDelta: mergePlayerDeltaEntries([[star.id, { deaths: 1, impact: 2 }], [entry.id, { deaths: 1 }]]),
      winOpponentDelta: mergeNamedDeltaEntries([[enemySecond, { deaths: 1 }], [enemyThird, { deaths: 1 }]]),
      loseOpponentDelta: mergeNamedDeltaEntries([[enemySecond, { kills: 2, impact: 4 }]]),
    },
    { ...timeoutCard, text: `${timeoutCard.text} ${timeoutPepTalk}` },
    {
      type: "story",
      mapIndex: 3,
      title: "第 4 局 · 残局前夜",
      text: `${map4ReadText}\n\n${renderCombatBeat("clutch", templateVars, seed + 35, {}, pickMatchTemplate)}\n\n${map4ClutchText}`,
      result: `${lurker.name} 在边线拖了整整二十秒，等 ${support.name} 的最后一颗闪弹飞进点里，残局才真正开始。可这一次，全队都知道你们已经被读得很深了。`,
      score: [0, 0],
      delta: "默认被读 · 残局压力抬满",
      playerDelta: mergePlayerDeltaEntries([[lurker.id, { impact: 2 }], [support.id, { assists: 1, impact: 1 }]]),
    },
    {
      type: "map_result",
      mapIndex: 3,
      title: "第 4 局 · 赛点边缘",
      text: `${mapIndexLabel(3)}结束后，下一局很可能就是赛点图。谁把这局咬下来，谁就能先摸到 BO5 的门把手。`,
      winText: `${entry.name} 在最后一波强顶里撕开了 ${pickWeighted(sites, seed + 23, 0)}，${opponentTeam.name} 想补枪都来不及。${renderCombatBeat("highlight", templateVars, seed + 24, {}, pickMatchTemplate)}`,
      loseText: `${renderLossBeat("clutch", templateVars, seed + 25, {}, pickMatchTemplate)} ${map4LoseDetail}`,
      winDelta: "第 4 局顶住了压力",
      loseDelta: "第 4 局残局没打成 · 比分又被对手咬住了",
      winPlayerDelta: mergePlayerDeltaEntries([[entry.id, { kills: 2, impact: 5 }], [support.id, { assists: 1, impact: 2 }]]),
      losePlayerDelta: mergePlayerDeltaEntries([[entry.id, { deaths: 1 }], [support.id, { deaths: 1 }]]),
      winOpponentDelta: mergeNamedDeltaEntries([[enemySecond, { deaths: 1 }], [enemyThird, { deaths: 1 }]]),
      loseOpponentDelta: mergeNamedDeltaEntries([[enemyStar, { kills: 2, impact: 5 }]]),
    },
    {
      type: "story",
      mapIndex: 4,
      title: "第 5 局 · 决胜图压下来",
      text: `如果真的被拖到 ${mapIndexLabel(4)}，场馆里剩下的就不只是枪声了。${renderCombatBeat("clutch", templateVars, seed + 41, {}, pickMatchTemplate)}\n\n${renderCombatBeat("utility", templateVars, seed + 42, {}, pickMatchTemplate)}\n\n${renderCombatBeat("trade", templateVars, seed + 43, {}, pickMatchTemplate)}`,
      result: `${caller.name} 没再说长句，只丢了两句话：“先拿信息。别送。” 到这一步，大家都知道再多的挣扎也无济于事，只能靠纪律、回合思路和细节处理把局面打回来。`,
      score: [0, 0],
      delta: "决胜图只看执行",
      playerDelta: mergePlayerDeltaEntries([[caller.id, { impact: 2 }], [star.id, { impact: 1 }]]),
    },
    {
      type: "map_result",
      mapIndex: 4,
      title: "第 5 局 · BO5 终局",
      text: `${mapIndexLabel(4)}已经没有回头路。最后一局，最后一波，最后一次拆包和保枪，都会被记进这届杯赛的回放里。`,
      winText: `${star.name} 在最后一波先点掉了 ${enemyStar}，再和 ${awper.name} 完成交叉火力。${renderCombatBeat("clutch", templateVars, seed + 46, {}, pickMatchTemplate)} 决胜图被 Team gun 拿下，整轮 BO5 到此为止。\n\n${finalWinLine}`,
      loseText: `${renderLossBeat("clutch", templateVars, seed + 48, {}, pickMatchTemplate)} ${map5LoseDetail}\n\n${finalLoseLine}`,
      winDelta: "第 5 局赢下整轮 BO5",
      loseDelta: "第 5 局拆包/残局失败 · BO5 到此结束",
      winPlayerDelta: mergePlayerDeltaEntries([[star.id, { kills: 2, impact: 7 }], [awper.id, { assists: 1, impact: 2 }]]),
      losePlayerDelta: mergePlayerDeltaEntries([[star.id, { deaths: 1, impact: 2 }], [anchor.id, { deaths: 1 }]]),
      winOpponentDelta: mergeNamedDeltaEntries([[enemyStar, { deaths: 1 }], [enemySecond, { deaths: 1 }]]),
      loseOpponentDelta: mergeNamedDeltaEntries([[enemyStar, { kills: 2, impact: 6 }]]),
    },
  ];

  let finalCards = starHighlightCard
    ? cards.map((card) => (card.mapIndex === 2 && card.type === "story" && card.title.includes("架枪拖时") ? {
      ...starHighlightCard,
      text: `${starHighlightCard.text}\n\n${card.text}`,
      result: `${starHighlightCard.result} ${card.result}`,
      delta: `${starHighlightCard.delta} · ${card.delta}`,
      playerDelta: mergePlayerDeltaEntries([
        ...Object.entries(starHighlightCard.playerDelta ?? {}),
        ...Object.entries(card.playerDelta ?? {}),
      ]),
      opponentDelta: mergeNamedDeltaEntries([
        ...Object.entries(starHighlightCard.opponentDelta ?? {}),
        ...Object.entries(card.opponentDelta ?? {}),
      ]),
    } : card))
    : cards;
  if (opponentHighlightCard) {
    finalCards = finalCards.map((card) => (card.mapIndex === 3 && card.type === "story" && card.title.includes("残局前夜") ? {
      ...opponentHighlightCard,
      text: `${opponentHighlightCard.text}\n\n${card.text}`,
      result: `${opponentHighlightCard.result} ${card.result}`,
      delta: `${opponentHighlightCard.delta} · ${card.delta}`,
      hiddenSwing: (opponentHighlightCard.hiddenSwing ?? 0) + (card.hiddenSwing ?? 0),
      playerDelta: mergePlayerDeltaEntries([
        ...Object.entries(opponentHighlightCard.playerDelta ?? {}),
        ...Object.entries(card.playerDelta ?? {}),
      ]),
      opponentDelta: mergeNamedDeltaEntries([
        ...Object.entries(opponentHighlightCard.opponentDelta ?? {}),
        ...Object.entries(card.opponentDelta ?? {}),
      ]),
    } : card));
  }

  return { cards: finalCards, textIds: [...new Set(matchTextIds)] };
}

function resolveMapResultCard(state, card) {
  const hidden = { ...state.match.hidden };
  const mapBonuses = { ...(hidden.mapBonuses ?? {}) };
  const mapBonus = mapBonuses[card.mapIndex] ?? 0;
  const rolePhaseEdge = hidden.rolePhaseEdge ?? {};
  const rolePhaseBonus = card.mapIndex === 0
    ? (rolePhaseEdge.attack ?? 0) + Math.round((rolePhaseEdge.execution ?? 0) * 0.5)
    : card.mapIndex === 1
      ? (rolePhaseEdge.defense ?? 0)
      : card.mapIndex === 2
        ? Math.round((rolePhaseEdge.attack ?? 0) * 0.7) + Math.round((rolePhaseEdge.lurk ?? 0) * 0.5)
        : card.mapIndex === 3
          ? Math.round((rolePhaseEdge.defense ?? 0) * 0.6) + Math.round((rolePhaseEdge.clutch ?? 0) * 0.7) + Math.round((rolePhaseEdge.lurk ?? 0) * 0.5)
          : (rolePhaseEdge.clutch ?? 0) + Math.round((rolePhaseEdge.execution ?? 0) * 0.5);
  const pistolBonus = card.mapIndex === 0
    ? hidden.pistolChoice === "pistol_armor"
      ? 2
      : hidden.pistolChoice === "pistol_utility"
        ? 1
        : hidden.pistolChoice === "pistol_save"
          ? -2
          : 0
    : 0;
  const choiceSalt = hidden.choiceSalt ?? 0;
  const noiseSeed = (hidden.seed ?? 0) + card.mapIndex * 97 + state.match.score[0] * 41 + state.match.score[1] * 53 + choiceSalt * 23;
  const scoreDelta = state.match.score[0] - state.match.score[1];
  const difficultyDrag = Math.min(0, hidden.difficultyAdjustment ?? 0);
  const pressureTax = scoreDelta > 0
    ? -Math.min(4, scoreDelta * 2)
    : scoreDelta < 0
      ? Math.min(3, Math.abs(scoreDelta) * 1.25)
      : 0;
  const comebackWindow = scoreDelta < 0
    ? (difficultyDrag < 0 ? 0 : Math.min(2, Math.abs(scoreDelta)))
    : scoreDelta > 0
      ? -2
      : 0;
  const eliminationPressure = scoreDelta <= -2
    ? (difficultyDrag < 0 ? -3 : -1)
    : scoreDelta < 0 && difficultyDrag <= -12
      ? -1
      : 0;
  const tacticBonus = card.mapIndex === 0 ? Math.round((hidden.tacticEdge ?? 0) * 0.7) : 0;
  const lurkTacticBonus = (hidden.tacticChoice === "lurk" || hidden.tacticChoice === "fake")
    ? Math.round((rolePhaseEdge.lurk ?? 0) * (card.mapIndex >= 2 ? 0.55 : 0.3))
    : 0;
  const timeoutBonus = card.mapIndex >= 3 ? Math.round((hidden.timeoutBonus ?? 0) * 0.45) : 0;
  const planBonus = card.mapIndex === 3
    ? Math.round((hidden.seriesPlan?.closeBonus ?? 0) * 0.45)
    : card.mapIndex === 4
      ? Math.round((hidden.seriesPlan?.deciderBonus ?? 0) * 0.45)
      : 0;
  const choiceRisk = (hidden.pistolChoice === "pistol_deagle" ? 2 : 0)
    + (hidden.tacticChoice === "rush" ? 2 : hidden.tacticChoice === "fake" ? 1 : 0)
    + (hidden.economyChoice === "full_setup" ? 2 : 0)
    + (hidden.timeoutChoice === "discipline-reset" ? 1 : 0);
  const riskTax = card.mapIndex >= 2 ? Math.min(5, choiceRisk) : Math.max(0, choiceRisk - 2);
  const allInVariance = hidden.economyChoice === "full_setup" && card.mapIndex >= 2 ? seededNoise(noiseSeed + 19, -7, 4) : 0;
  const forceVariance = hidden.economyChoice === "force_setup" && card.mapIndex >= 2 ? seededNoise(noiseSeed + 23, -5, 6) : 0;
  const swing = seededNoise(noiseSeed, -12, 12);
  const earlyMapRelief = difficultyDrag < 0 ? Math.max(0, Math.min(2, card.mapIndex - 2)) : 0;
  const edge = Math.round((hidden.baseEdge ?? 0) * 0.55)
    + Math.round((hidden.formEdge ?? 0) * 0.6)
    + earlyMapRelief
    + rolePhaseBonus
    + lurkTacticBonus
    + pistolBonus
    + Math.round(mapBonus * 0.65)
    + tacticBonus
    + timeoutBonus
    + planBonus
    + pressureTax
    + comebackWindow
    + eliminationPressure
    + allInVariance
    + forceVariance
    - riskTax
    + swing;
  const playerWin = edge >= 0;
  const nextScore = playerWin
    ? [state.match.score[0] + 1, state.match.score[1]]
    : [state.match.score[0], state.match.score[1] + 1];
  const isPlayerEliminated = !playerWin && nextScore[1] >= 3;
  const loseText = isPlayerEliminated ? eliminationLossText(card, state, nextScore) : card.loseText;
  const loseDelta = isPlayerEliminated ? `${mapIndexLabel(card.mapIndex)}失守 · BO5 到此结束` : card.loseDelta;
  const cardText = isPlayerEliminated ? stripNextRoundPromises(card.text) : card.text;
  return {
    mapIndex: card.mapIndex,
    title: card.title,
    text: cardText,
    result: `${playerWin ? card.winText : loseText} ${seriesLabel(nextScore)}。`,
    delta: `${playerWin ? card.winDelta : loseDelta} · ${seriesLabel(nextScore)}`,
    score: playerWin ? [1, 0] : [0, 1],
    playerDelta: playerWin ? (card.winPlayerDelta ?? {}) : (card.losePlayerDelta ?? {}),
    opponentDelta: playerWin ? (card.winOpponentDelta ?? {}) : (card.loseOpponentDelta ?? {}),
  };
}

function createCampaign(state) {
  const roster = selectedPlayers(state);
  const lineupKey = lineupKeyFromRoster(roster, state.substitute ?? state.selected[5]);
  const initialForm = normalizePlayerForm();
  const campaign = {
    seasonIndex: 1,
    cupIndex: 0,
    selected: [...state.selected],
    trophies: 0,
    budget: 0,
    modifiers: { firepower: 0, tacticalExecution: 0, cohesion: 0, discipline: 0 },
    rosterFriction: 0,
    playerForm: initialForm,
    lineupMatches: { [lineupKey]: 0 },
    strategyMemory: { recentOpenings: [], byOpponent: {} },
    eventHistory: createEventHistory(),
    textHistory: createTextHistory(),
    transferHistory: [],
    cupRecords: [],
    seasonRecords: [],
    currentBracket: undefined,
    highlightLog: [],
  };
  campaign.currentBracket = createCupBracket(state, campaign);
  return campaign;
}

function createMatchSeed(campaign, extra) {
  return campaign.seasonIndex * 1000 + campaign.cupIndex * 100 + extra;
}

function appendHighlightLog(campaign = {}, resolved = {}, match = {}) {
  if (!resolved.highlightMoment || !resolved.highlightPlayerName) return campaign;
  const log = campaign.highlightLog ?? [];
  const entry = {
    id: `hl-${campaign.seasonIndex ?? 1}-${campaign.cupIndex ?? 0}-${log.length}`,
    seasonIndex: campaign.seasonIndex,
    cupIndex: campaign.cupIndex,
    cupName: match.cupName,
    roundLabel: match.roundLabel,
    mapIndex: resolved.mapIndex,
    playerId: resolved.highlightPlayerId,
    playerName: resolved.highlightPlayerName,
    teamId: resolved.highlightTeamId ?? "player-team",
    teamName: resolved.highlightTeamName ?? PLAYER_TEAM,
    kind: (resolved.highlightTeamId ?? "player-team") === "player-team" ? "player" : "opponent",
    text: resolved.highlightMoment,
  };
  return {
    ...campaign,
    highlightLog: [...log, entry].slice(-36),
  };
}

function getPlayerCurrentMatch(campaign) {
  return findMatch(campaign.currentBracket.rounds, campaign.currentBracket.currentMatchId);
}

function createPrematchState(state, scoutingChoice) {
  const campaign = { ...state.campaign };
  const roster = selectedPlayers(state);
  let active = activeRoster(roster, state.substitute);
  const match = getPlayerCurrentMatch(campaign);
  const opponentTeam = match.teamA.id === "player-team" ? match.teamB : match.teamA;
  const seed = createMatchSeed(campaign, match.round === "quarterfinal" ? 101 : match.round === "semifinal" ? 201 : 301);
  let stats = teamStats(roster, state.substitute, { ...campaign.modifiers, rosterFriction: campaign.rosterFriction ?? 0 });
  const prematchIntel = buildPrematchIntel({ state, campaign, opponentTeam, stats, seed });
  let substitute = state.substitute;
  if (prematchIntel.forcedBenchId && roster.some((player) => player.id === prematchIntel.forcedBenchId)) {
    substitute = prematchIntel.forcedBenchId;
    campaign.forcedSubstitute = prematchIntel.forcedBenchId;
  }
  active = activeRoster(roster, substitute);
  if (prematchIntel.effect?.form) {
    campaign.playerForm = applyEventFormEffect(campaign.playerForm, active.map((player) => player.id), { form: prematchIntel.effect.form }, seed);
  }
  const lineupKey = lineupKeyFromRoster(roster, substitute);
  const continuityBonus = continuityBonusForMatches(campaign?.lineupMatches?.[lineupKey] ?? 0);
  stats = teamStats(roster, substitute, { ...campaign.modifiers, continuityBonus, playerForm: campaign.playerForm, rosterFriction: campaign.rosterFriction ?? 0 });
  const readPressure = summarizeReadPressure(buildOpeningHistory(campaign));
  const opponentPlan = chooseOpponentPlan(readPressure, scoutingChoice, opponentTeam);
  const scoutingPlan = scoutingPlanForChoice(scoutingChoice);
  const prematchNarrative = prematchCopy(scoutingChoice, opponentTeam, opponentTeam.stars[0] ?? opponentTeam.name);
  const difficultyAdjustment = seasonDifficultyAdjustment(campaign, continuityBonus);
  const formEdge = formEffectForRoster(active, campaign.playerForm).edge;
  const rolePhaseEdge = rolePhaseEdgeForRoster(roster, substitute);
  const baseEdge = Math.round((teamStrength(buildPlayerTeamSnapshot({ ...state, substitute, campaign }, { ...campaign.modifiers, playerForm: campaign.playerForm, rosterFriction: campaign.rosterFriction ?? 0 })) - teamStrength(opponentTeam)) * 0.38) + difficultyAdjustment + (prematchIntel.effect?.baseEdge ?? 0);
  const generatedMatch = makeMatchCards(active, stats, opponentTeam, scoutingChoice, roundLabel(match.round), campaign.currentBracket.cupName, seed, campaign.textHistory);
  for (const textId of generatedMatch.textIds) {
    campaign.textHistory = appendTextHistory(campaign.textHistory, "match", textId, 240);
  }
  return {
    ...state,
    substitute,
    campaign,
    screen: "match",
    match: {
      opponent: opponentTeam.name,
      roundLabel: roundLabel(match.round),
      cupName: campaign.currentBracket.cupName,
      eventIndex: 0,
      score: [0, 0],
      timeoutUsed: false,
      scoutingChoice,
      cards: generatedMatch.cards,
      resolved: [],
      playerStats: Object.fromEntries(Object.entries(createPlayerStats(active)).map(([id, row]) => {
        const formScore = activeFormScore(playerById(id), campaign.playerForm);
        return [id, { ...row, formScore, formLabel: formLabel(formScore) }];
      })),
      opponentStats: createNamedStats(opponentTeam.stars.slice(0, 5)),
      prematchNarrative,
      prematchIntel,
      opponentTeam,
      playerEconomy: startingEconomyForTeam(stats, true),
      opponentEconomy: startingEconomyForTeam(opponentTeam.stats, false),
      readPressure,
      hidden: {
        seed,
        pistolChoice: undefined,
        continuityBonus,
        baseEdge,
        formEdge,
        rolePhaseEdge,
        difficultyAdjustment,
        controlLocked: Boolean(prematchIntel.controlLocked),
        prematchIntel,
        choiceSalt: 0,
        openingChoice: undefined,
        tacticChoice: undefined,
        tacticEdge: 0,
        timeoutBonus: 0,
        eventSwing: 0,
        opponentPlan,
        scoutingPlan,
        mapBonuses: { ...scoutingPlan.mapBonuses },
        seriesPlan: {
          closeBonus: scoutingPlan.seriesPlan.closeBonus,
          deciderBonus: scoutingPlan.seriesPlan.deciderBonus,
        },
      },
    },
  };
}

function normalizeSeriesScore(rawScore, winnerIsPlayer) {
  const playerMaps = clamp(rawScore[0], 0, 2);
  const enemyMaps = clamp(rawScore[1], 0, 2);
  return winnerIsPlayer ? [3, enemyMaps] : [playerMaps, 3];
}

function matchWinnerFromFinishedScore(score) {
  if (!Array.isArray(score)) return undefined;
  if (score[0] >= 3 && score[0] > score[1]) return "player";
  if (score[1] >= 3 && score[1] > score[0]) return "opponent";
  return undefined;
}

function resolveFeaturedMatch(state) {
  const campaign = state.campaign;
  const match = getPlayerCurrentMatch(campaign);
  const playerTeam = match.teamA.id === "player-team" ? match.teamA : match.teamB;
  const opponentTeam = match.teamA.id === "player-team" ? match.teamB : match.teamA;
  const finishedWinner = matchWinnerFromFinishedScore(state.match.score);
  if (finishedWinner) {
    const playerWon = finishedWinner === "player";
    const seriesScore = [...state.match.score];
    return {
      resolvedMatch: {
        ...match,
        winnerId: playerWon ? "player-team" : opponentTeam.id,
        score: match.teamA.id === "player-team" ? seriesScore : [seriesScore[1], seriesScore[0]],
        headline: playerWon
          ? `${PLAYER_TEAM} 在 ${roundLabel(match.round)} 顶住了 ${opponentTeam.name}。`
          : `${opponentTeam.name} 在 ${roundLabel(match.round)} 把 Team gun 挡了下来。`,
      },
      playerWon,
      opponentTeam,
    };
  }
  const powerDelta = teamStrength(playerTeam) - teamStrength(opponentTeam);
  const momentumDelta = state.match.score[0] - state.match.score[1];
  const statDelta = Object.values(state.match.playerStats).reduce((sum, row) => sum + row.impact, 0);
  const scoredOutcomes = state.match.resolved
    .map((entry) => entry.score)
    .filter((score) => Array.isArray(score) && (score[0] !== 0 || score[1] !== 0))
    .map((score) => (score[0] > score[1] ? "win" : "loss"));
  const openingBuy = state.match.hidden.pistolChoice === "pistol_save" ? "eco" : state.match.hidden.pistolChoice === "pistol_utility" ? "half_buy" : "force_buy";
  const economyPath = describeEconomyPath({ openingBuy, outcomes: scoredOutcomes });
  const finalEconomyTier = economyPath.at(-1)?.tier ?? "full_buy";
  const economySwing = finalEconomyTier === "full_buy" || finalEconomyTier === "bonus"
    ? 2
    : finalEconomyTier === "force_buy"
      ? -1
      : finalEconomyTier === "eco"
        ? -4
        : -2;
  const tacticEdge = state.match.hidden.tacticEdge ?? 0;
  const timeoutBonus = state.match.hidden.timeoutBonus ?? 0;
  const continuityBonus = state.match.hidden.continuityBonus ?? 0;
  const difficultyAdjustment = state.match.hidden.difficultyAdjustment ?? 0;
  const eventSwing = state.match.hidden.eventSwing ?? 0;
  const rosterTax = budgetPressurePenalty(state.selected);
  const edge = powerDelta * 0.58
    + momentumDelta * 4.2
    + statDelta * 0.06
    + tacticEdge
    + timeoutBonus * 0.8
    + continuityBonus * 1.2
    + difficultyAdjustment * 0.7
    + economySwing
    + eventSwing
    + (state.match.hidden.formEdge ?? 0)
    - rosterTax * 2.4;
  const playerWon = edge >= 4;
  const seriesScore = state.match.score[0] === 3 || state.match.score[1] === 3
    ? [...state.match.score]
    : normalizeSeriesScore(state.match.score, playerWon);
  const resolvedMatch = {
    ...match,
    winnerId: playerWon ? "player-team" : opponentTeam.id,
    score: match.teamA.id === "player-team" ? seriesScore : [seriesScore[1], seriesScore[0]],
    headline: playerWon
      ? `${PLAYER_TEAM} 在 ${roundLabel(match.round)} 顶住了 ${opponentTeam.name}。`
      : `${opponentTeam.name} 在 ${roundLabel(match.round)} 把 Team gun 挡了下来。`,
  };
  return { resolvedMatch, playerWon, opponentTeam };
}

function updateBracketAfterRound(state) {
  const campaign = { ...state.campaign, currentBracket: { ...state.campaign.currentBracket, rounds: { ...state.campaign.currentBracket.rounds } } };
  campaign.currentBracket.rounds.quarterfinal = [...campaign.currentBracket.rounds.quarterfinal];
  campaign.currentBracket.rounds.semifinal = [...campaign.currentBracket.rounds.semifinal];
  campaign.currentBracket.rounds.final = [...campaign.currentBracket.rounds.final];
  campaign.lineupMatches = { ...campaign.lineupMatches };
  campaign.strategyMemory = {
    recentOpenings: [...(campaign.strategyMemory?.recentOpenings ?? [])],
    byOpponent: { ...(campaign.strategyMemory?.byOpponent ?? {}) },
  };

  const { resolvedMatch, playerWon, opponentTeam } = resolveFeaturedMatch(state);
  const lineupKey = lineupKeyFromRoster(selectedPlayers(state), state.substitute);
  campaign.lineupMatches[lineupKey] = (campaign.lineupMatches[lineupKey] ?? 0) + 1;
  campaign.rosterFriction = recoverRosterFriction(campaign.rosterFriction, 1);
  campaign.playerForm = updatePlayerFormAfterMatch(campaign, state);
  const chosenOpening = openingTacticFromChoice(state.match.hidden.tacticChoice);
  campaign.strategyMemory.recentOpenings = [...campaign.strategyMemory.recentOpenings, chosenOpening].slice(-3);
  const opponentHistory = [...(campaign.strategyMemory.byOpponent[opponentTeam.id] ?? []), chosenOpening].slice(-3);
  campaign.strategyMemory.byOpponent[opponentTeam.id] = opponentHistory;
  const roundName = resolvedMatch.round;
  const roundList = campaign.currentBracket.rounds[roundName];
  const matchIndex = roundList.findIndex((entry) => entry.id === resolvedMatch.id);
  roundList[matchIndex] = resolvedMatch;

  const seedBase = createMatchSeed(campaign, roundName === "quarterfinal" ? 11 : roundName === "semifinal" ? 31 : 51);

  if (roundName === "quarterfinal") {
    for (let index = 1; index < campaign.currentBracket.rounds.quarterfinal.length; index += 1) {
      const existing = campaign.currentBracket.rounds.quarterfinal[index];
      if (!existing.winnerId) campaign.currentBracket.rounds.quarterfinal[index] = resolveOffscreenMatch(existing, seedBase + index);
    }
    const q = campaign.currentBracket.rounds.quarterfinal;
    const qWinners = q.map((entry) => (entry.winnerId === entry.teamA.id ? entry.teamA : entry.teamB));
    campaign.currentBracket.rounds.semifinal = [
      createBracketMatch("semi-0", "semifinal", qWinners[0], qWinners[1]),
      createBracketMatch("semi-1", "semifinal", qWinners[2], qWinners[3]),
    ];
    campaign.currentBracket.semifinalists = qWinners.filter((team) => team.id !== qWinners[0].id || qWinners[1].id === "player-team");
    if (playerWon) {
      campaign.currentBracket.currentRound = "semifinal";
      campaign.currentBracket.currentMatchId = "semi-0";
      campaign.currentBracket.lastRoundSummary = `${PLAYER_TEAM} 先过了 ${opponentTeam.name} 这一关，晋级半决赛。`;
      return { campaign, cupFinished: false, playerWon };
    }
  }

  if (roundName === "semifinal") {
    const otherSemiIndex = resolvedMatch.id === "semi-0" ? 1 : 0;
    const otherSemi = campaign.currentBracket.rounds.semifinal[otherSemiIndex];
    if (otherSemi && !otherSemi.winnerId) {
      campaign.currentBracket.rounds.semifinal[otherSemiIndex] = resolveOffscreenMatch(otherSemi, seedBase + otherSemiIndex + 7);
    }
    const semiWinners = campaign.currentBracket.rounds.semifinal.map((entry) => (entry.winnerId === entry.teamA.id ? entry.teamA : entry.teamB));
    campaign.currentBracket.rounds.final = [
      createBracketMatch("final-0", "final", semiWinners[0], semiWinners[1]),
    ];
    if (playerWon) {
      campaign.currentBracket.currentRound = "final";
      campaign.currentBracket.currentMatchId = "final-0";
      campaign.currentBracket.lastRoundSummary = `${PLAYER_TEAM} 打进决赛，下一场就是整杯赛最重的一局。`;
      return { campaign, cupFinished: false, playerWon };
    }
  }

  if (!playerWon || roundName === "final") {
    if (roundName !== "final") {
      if (campaign.currentBracket.rounds.semifinal.length === 0) {
        const q = campaign.currentBracket.rounds.quarterfinal;
        const qWinners = q.map((entry) => (entry.winnerId === entry.teamA.id ? entry.teamA : entry.teamB));
        campaign.currentBracket.rounds.semifinal = [
          resolveOffscreenMatch(createBracketMatch("semi-0", "semifinal", qWinners[0], qWinners[1]), seedBase + 17),
          resolveOffscreenMatch(createBracketMatch("semi-1", "semifinal", qWinners[2], qWinners[3]), seedBase + 18),
        ];
      } else {
        campaign.currentBracket.rounds.semifinal = campaign.currentBracket.rounds.semifinal.map((entry, index) => entry.winnerId ? entry : resolveOffscreenMatch(entry, seedBase + 21 + index));
      }
      const semiWinners = campaign.currentBracket.rounds.semifinal.map((entry) => (entry.winnerId === entry.teamA.id ? entry.teamA : entry.teamB));
      campaign.currentBracket.rounds.final = [
        resolveOffscreenMatch(createBracketMatch("final-0", "final", semiWinners[0], semiWinners[1]), seedBase + 41),
      ];
    } else if (!campaign.currentBracket.rounds.final[0].winnerId) {
      campaign.currentBracket.rounds.final[0] = resolvedMatch;
    }
    const finalMatch = campaign.currentBracket.rounds.final[0];
    const champion = finalMatch.winnerId === finalMatch.teamA.id ? finalMatch.teamA : finalMatch.teamB;
    const runnerUp = champion.id === finalMatch.teamA.id ? finalMatch.teamB : finalMatch.teamA;
    const semifinalists = campaign.currentBracket.rounds.semifinal.map((entry) => {
      const winner = entry.winnerId === entry.teamA.id ? entry.teamA : entry.teamB;
      return winner.id === entry.teamA.id ? entry.teamB : entry.teamA;
    });
    campaign.currentBracket.champion = champion;
    campaign.currentBracket.runnerUp = runnerUp;
    campaign.currentBracket.semifinalists = semifinalists;
    campaign.currentBracket.completed = true;
    campaign.currentBracket.playerEliminated = !playerWon && resolvedMatch.winnerId !== "player-team";
    campaign.currentBracket.currentMatchId = undefined;
    campaign.currentBracket.lastRoundSummary = playerWon
      ? `${PLAYER_TEAM} 在 ${campaign.currentBracket.cupName} 捧杯了。`
      : `${PLAYER_TEAM} 在 ${roundLabel(resolvedMatch.round)} 被 ${opponentTeam.name} 淘汰，杯赛后半程快速结算完成。`;
    return { campaign, cupFinished: true, playerWon };
  }

  return { campaign, cupFinished: false, playerWon };
}

function determinePlacement(campaign) {
  if (campaign.currentBracket.champion?.id === "player-team") return "冠军";
  const final = campaign.currentBracket.rounds.final[0];
  const playerMadeFinal = final && (final.teamA.id === "player-team" || final.teamB.id === "player-team");
  if (playerMadeFinal) return "亚军";
  const playerMadeSemi = campaign.currentBracket.rounds.semifinal.some((match) => match.teamA.id === "player-team" || match.teamB.id === "player-team");
  return playerMadeSemi ? "四强" : "八强";
}

const mvpProfileTemplates = [
  "{name} 在 {champion} 最需要有人站出来的时候接住了比赛。",
  "{name} 没把每个回合都打成集锦，但关键分几乎都落在他手里。",
  "{champion} 能走到最后，很大一部分原因是 {name} 把最难处理的残局吃了下来。",
  "{name} 的数据不是空刷出来的，都是淘汰赛里能改变局势的分。",
  "这届杯赛属于 {champion}，而 {name} 是他们最稳定的那根钉子。",
  "{name} 把自己的名字钉在了这届杯赛的关键回放里。",
  "{champion} 的体系给了 {name} 空间，他也把这些空间变成了胜势。",
  "{name} 没有浪费队友给他的每一次补枪和道具。",
  "{name} 这一站的价值不只在高光，而是在对手开始针对以后仍然能找到回合入口。",
  "{champion} 最乱的几张图里，{name} 让队伍始终有一个可以相信的点。",
  "{name} 把数据、压力和淘汰赛后半段的判断连在了一起，这才配得上 MVP。",
  "当比赛从拼枪变成拼细节时，{name} 仍然能把 {champion} 往前推。",
  "{name} 不是唯一的答案，但他是 {champion} 这届杯赛最清楚的答案。",
];

const mvpLineTemplates = [
  "{name} 在关键图里把首杀、补枪和残局串成了一条线。",
  "比分咬住的时候，{name} 总能把最麻烦的一分接回来。",
  "{name} 的价值不只在击杀数，更在那些让队伍喘过气的关键回合。",
  "这不是单张图的爆发，而是整段淘汰赛持续给答案。",
  "{name} 把压力局打得很安静，越到后面越稳。",
  "他没有每回合都站在镜头中央，但每次镜头找过去，局面都已经被他改过了。",
  "这份 MVP 更像一份证明：强队要夺冠，必须有人能把硬仗收干净。",
  "淘汰赛后段，{name} 让对手很难找到能放心放掉的位置。",
  "{name} 的很多贡献发生在回合前半段：站位、牵制、补枪路线，都让队伍更容易活到残局。",
  "这届杯赛最难的几次压力测试，{name} 没有躲开，反而把局面一点点压回来了。",
  "对手不是没准备他，而是准备过以后，仍然没能完全限制住他。",
  "{name} 的 MVP 不靠单一名场面支撑，而是靠一整段稳定输出堆出来。",
  "当比分来到最容易变形的时刻，{name} 让队伍的选择看起来更简单。",
];

function fillMvpTemplate(template, values) {
  return template
    .replaceAll("{name}", values.name)
    .replaceAll("{champion}", values.championName)
    .replaceAll("{cup}", values.cupName ?? "这届杯赛")
    .replaceAll("{impact}", String(values.impact ?? 0));
}

function stableTextHash(value = "") {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mvpAwardText({ name, championName, impact = 0, cupName = "", seed = 0 }) {
  const base = stableTextHash(`${name}-${championName}-${cupName}-${impact}-${seed}`);
  const profileIndex = (base >>> 8) % mvpProfileTemplates.length;
  const lineIndex = (base >>> 16) % mvpLineTemplates.length;
  return {
    profile: fillMvpTemplate(mvpProfileTemplates[profileIndex], { name, championName, impact, cupName }),
    line: fillMvpTemplate(mvpLineTemplates[lineIndex], { name, championName, impact, cupName }),
  };
}

function calculateCupMvp(state, champion) {
  const playerStats = Object.values(state.match.playerStats);
  const playerBest = [...playerStats].sort((left, right) => right.impact - left.impact)[0];
  const cupName = state.campaign?.currentBracket?.cupName ?? "这届杯赛";
  if (champion.id === "player-team" && playerBest) {
    const player = playerById(playerBest.id);
    const text = mvpAwardText({
      name: player.name,
      championName: champion.name,
      impact: playerBest.impact,
      cupName,
      seed: createMatchSeed(state.campaign ?? { seasonIndex: 1, cupIndex: 0 }, playerBest.impact),
    });
    return {
      id: player.id,
      name: player.name,
      profile: text.profile,
      firepower: player.firepower,
      tactics: player.tactics,
      personality: player.personality,
      personalityLabel: personalityLabel(player),
      line: text.line,
    };
  }
  const fallbackName = champion.stars[0];
  const text = mvpAwardText({
    name: fallbackName,
    championName: champion.name,
    impact: champion.stats.firepower,
    cupName,
    seed: createMatchSeed(state.campaign ?? { seasonIndex: 1, cupIndex: 0 }, champion.stats.firepower),
  });
  return {
    id: champion.id,
    name: fallbackName,
    profile: text.profile,
    firepower: champion.stats.firepower,
    tactics: champion.stats.tacticalExecution,
    personality: champion.stats.cohesion,
    personalityLabel: champion.stats.tacticalExecution >= 86 ? "团队大脑" : champion.stats.firepower >= 88 ? "强点核心" : "冠军拼图",
    line: text.line,
  };
}

const cupEncouragementPool = [
  { id: "cup-champion-first-light", placements: ["冠军"], text: "奖杯被举起来的时候，镜头会记住选手的脸，但真正改变队伍命运的是你在赛前、暂停和转会窗口里做过的每一次取舍。今晚可以庆祝，明天开始，所有对手都会把 Team gun 当成重点研究对象。" },
  { id: "cup-champion-weight", placements: ["冠军"], text: "冠军不是一句口号，是五个人在最乱的回合里还愿意相信同一个指令。你们把这座杯赛打成了自己的名字，接下来要学会承受冠军带来的重量。" },
  { id: "cup-champion-major-flame", placements: ["冠军"], tags: ["major"], text: "Major 的灯光不会轻易偏爱任何人。你们能站到最后，说明这支队伍已经不只是靠手感活着。满堂花醉三千客，一剑霜寒十四州，今晚的舞台属于 Team gun。" },
  { id: "cup-champion-repeat", placements: ["冠军"], minTrophies: 2, text: "第二次、第三次捧杯和第一次完全不同。第一次可以说是爆冷，之后每一次都要经得起复盘。现在没人会再把你们当故事里的黑马，你们已经成了别人故事里的大山。" },
  { id: "cup-champion-hard-route", placements: ["冠军"], text: "这座奖杯不是顺手捡来的。它经过了手枪局的取舍、经济局的忍耐、暂停后的重新排布，也经过了几次差点被对手追回来的夜晚。" },
  { id: "cup-champion-training-proof", placements: ["冠军"], text: "训练室里那些看起来枯燥的跑图、补闪和复盘，在今晚都变成了比分板上的答案。冠军会被拍照留念，但真正该被记住的是这些细节终于兑现了。" },
  { id: "cup-champion-new-target", placements: ["冠军"], text: "从下一场大赛开始，Team gun 不再只是挑战者。对手会剪你们的默认，会盯你们的明星位，也会研究你每一次暂停后的习惯。" },
  { id: "cup-champion-roster-belief", placements: ["冠军"], text: "这场冠军证明了阵容不是一堆名字的简单相加。有人开路，有人补枪，有人守住纪律，最终才让奖杯有了落点。" },
  { id: "cup-champion-quiet-room", placements: ["冠军"], text: "赢下最后一图以后，训练室里的很多争论都会暂时安静。但真正的冠军队不会让奖杯替自己思考，明天开始还要继续找问题。" },
  { id: "cup-runnerup-knife-edge", placements: ["亚军"], text: "亚军最难受，因为你已经看见奖杯了。可正因为看见过，下一次训练才会更具体：哪一次回防慢了，哪一次残局急了，哪一个暂停没叫到点上，都能变成下一场大赛的答案。" },
  { id: "cup-runnerup-one-step", placements: ["亚军"], text: "离冠军只差最后一步，这种疼不会立刻过去。别急着把它包装成励志故事，先把它留在训练室里，让每个人都记住：山顶就在那儿，你们已经摸到边了。" },
  { id: "cup-runnerup-final-table", placements: ["亚军"], text: "能坐上决赛席，说明 Team gun 已经有争冠骨架。真正的强队不是从不输决赛，而是输过以后还能把下一次决赛打得更稳、更狠、更像自己。" },
  { id: "cup-runnerup-major", placements: ["亚军"], tags: ["major"], text: "Major 亚军不是安慰奖。那是把自己放进历史讨论的入场券。可入场券不是奖杯，回去以后该拆的录像一秒都别省，该补的地图一张都别逃。" },
  { id: "cup-runnerup-map-five", placements: ["亚军"], text: "如果系列赛拖到最后几张图才分出胜负，那这次失利就更有价值。它告诉你们，Team gun 已经有能力把强队拖进泥潭，只是还没学会最后怎么收干净。" },
  { id: "cup-runnerup-pressure-note", placements: ["亚军"], text: "决赛输掉以后，最危险的是只记得遗憾。真正该带回去的是压力下的细节：谁急了，谁慢了，哪套默认在关键局被提前读到。" },
  { id: "cup-runnerup-core-found", placements: ["亚军"], text: "亚军会让人难受，但它也筛出了核心。谁能打决赛，谁需要被保护，谁在最吵的时候还能听指挥，这些答案比奖牌更实用。" },
  { id: "cup-runnerup-no-shortcut", placements: ["亚军"], text: "离奖杯只差一步，不代表下一次自然就会赢。强队会调整，你们也必须调整。把这场决赛当成地图，而不是当成伤口。" },
  { id: "cup-runnerup-future-seat", placements: ["亚军"], text: "能走到决赛，说明这支队伍已经坐上了争冠席。现在要做的是让下一次坐在那里时，队员不再觉得陌生。" },
  { id: "cup-semi-table", placements: ["四强"], text: "四强不是山顶，但已经不是山脚。你们和强队坐到了同一张桌上，也被对手认真对待了。下一步要解决的不是有没有天赋，而是关键局里谁能把纪律守到最后。" },
  { id: "cup-semi-threshold", placements: ["四强"], text: "半决赛的门槛很硬，撞上去会疼，但疼说明你们真的撞到了那扇门。休赛日别只看比分，去看那些输掉的首杀、回防和补枪，那里藏着下一次晋级的钥匙。" },
  { id: "cup-semi-respect", placements: ["四强"], text: "这届杯赛没有奖杯，但对手赛后握手的眼神已经变了。Team gun 还不是冠军队，却已经不再是赛程表上的软柿子。" },
  { id: "cup-semi-build-floor", placements: ["四强"], text: "四强不能让粉丝满足，却能让管理层看见方向。阵容里谁适合打硬仗，谁会在压力下变形，这一杯都说得很清楚。" },
  { id: "cup-semi-system-test", placements: ["四强"], text: "半决赛像一次体系体检：能赢弱队的打法，在强队面前会被拆到只剩细节。今天暴露出来的每个问题，都比普通训练赛更值钱。" },
  { id: "cup-semi-almost-final", placements: ["四强"], text: "离决赛只差一轮，最容易让人陷入自我安慰。别停在“差一点”里，去看哪张图最先漏风，哪名选手最需要明确的角色边界。" },
  { id: "cup-semi-respect-cost", placements: ["四强"], text: "你们赢得了尊重，也付出了尊重的代价：下一场大赛开始，对手不会再用普通准备面对 Team gun。" },
  { id: "cup-semi-young-core", placements: ["四强"], text: "如果队里有年轻人第一次打到这里，这一站会改变他对强队的理解。半决赛的压力，比任何口头教学都更真实。" },
  { id: "cup-semi-transfer-map", placements: ["四强"], text: "四强成绩足够让管理层继续投入，但也足够暴露短板。转会窗口别只看名字，先看这场半决赛到底输在什么位置。" },
  { id: "cup-quarter-honest", placements: ["八强"], text: "八强出局很刺耳，但它至少诚实。火力、纪律、配合、地图池，问题已经摊在桌上。真正的经理不会在淘汰那晚结束工作，恰恰会从那晚开始工作。" },
  { id: "cup-quarter-noise", placements: ["八强"], text: "第一轮出局之后，外面的声音大多会变成质疑。别急着回应论坛，先回应录像。每一个被打穿的默认、每一次慢半拍的补防，都比热搜更值得你盯着。" },
  { id: "cup-quarter-reset", placements: ["八强"], text: "这不是能被一句“下次加油”带过去的失利。你需要决定是稳住阵容继续磨，还是承认某些位置并不合拍。输掉杯赛不等于输掉项目，但拖着问题不动会。" },
  { id: "cup-quarter-beginning", placements: ["八强"], text: "灯光熄得很早，训练室也安静得很早。可三年模式的残酷和温柔都在这里：今天暴露的问题，下一杯还有机会修；今天扛住的年轻人，下一场大赛可能就是答案。" },
  { id: "cup-quarter-first-wall", placements: ["八强"], text: "八强像第一堵墙。撞上去不体面，但它会告诉你这支队伍哪里还只是纸面强，哪里真正经得住正赛检验。" },
  { id: "cup-quarter-no-excuse", placements: ["八强"], text: "这场失利不需要漂亮解释。对手准备得更清楚，你们的开局和中段处理都被迫提前交卷。下一场大赛前，训练室必须给出更硬的答案。" },
  { id: "cup-quarter-budget-lesson", placements: ["八强"], text: "早早出局会让每一笔预算都显得刺眼。不是贵的选手一定错，而是阵容价格、位置功能和团队默契必须重新对齐。" },
  { id: "cup-quarter-roster-truth", placements: ["八强"], text: "第一轮回家最残酷的地方，是它不给故事加滤镜。谁适合首发，谁需要替补，谁只是数据好看，这一杯都给了样本。" },
  { id: "cup-quarter-next-answer", placements: ["八强"], text: "别让八强变成一句标签。把它拆成训练表、转会优先级和赛前情报清单，下一场大赛才有机会给出不同答案。" },
];

const seasonQuotePool = {
  champion: [
    "满堂花醉三千客，一剑霜寒十四州。",
    "黄沙百战穿金甲，不破楼兰终不还。",
    "会当凌绝顶，一览众山小。",
    "奖杯举起来的那一刻，所有凌晨三点的训练都有了回声。",
    "大风起兮云飞扬，冠军不是终点，是被所有人研究的开始。",
    "欲穷千里目，更上一层楼。捧杯以后，下一场大赛只会更难。",
    "千淘万漉虽辛苦，吹尽狂沙始到金。",
    "真正的强队不是只赢一晚，而是能把胜利变成下一次训练的标准。",
    "鲜衣怒马少年时，不负韶华行且知。",
  ],
  finalist: [
    "江东子弟多才俊，卷土重来未可知。",
    "长风破浪会有时，直挂云帆济沧海。",
    "雄关漫道真如铁，而今迈步从头越。",
    "亚军不是失败，是离山顶最近的那一级台阶。",
    "行到水穷处，坐看云起时。差一步的痛，也能变成下一次的路。",
    "不畏浮云遮望眼，只缘身在最高层。",
    "少年辛苦终身事，莫向光阴惰寸功。",
    "决赛输掉的那几分，会在训练室里变成最具体的答案。",
    "山顶没有远离你们，只是要求你们下一次更冷静地走完最后几步。",
  ],
  contender: [
    "千磨万击还坚劲，任尔东西南北风。",
    "宝剑锋从磨砺出，梅花香自苦寒来。",
    "路漫漫其修远兮，吾将上下而求索。",
    "四强不是上限，是下一场大赛继续往上盖的地基。",
    "莫听穿林打叶声，何妨吟啸且徐行。",
    "积土而为山，积水而为海。",
    "不积跬步，无以至千里。",
    "能被强队认真准备，已经说明你们走到了新的牌桌。",
    "半山腰的风也很硬，但它会告诉你山顶从哪里上去。",
  ],
  struggle: [
    "沉舟侧畔千帆过，病树前头万木春。",
    "山重水复疑无路，柳暗花明又一村。",
    "夜阑卧听风吹雨，铁马冰河入梦来。",
    "输不可怕，可怕的是输了以后不再走进训练室。",
    "天生我材必有用，千金散尽还复来。",
    "千锤万凿出深山，烈火焚烧若等闲。",
    "回首向来萧瑟处，也无风雨也无晴。",
    "低谷不会自动过去，除非有人愿意把问题逐条写下来。",
    "没有奖杯的年份，也可以成为后来翻身时最重要的注脚。",
  ],
};

const annualMessagePool = [
  { id: "annual-champion-crown", tiers: ["champion"], text: "这一年 Team gun 不是偶然亮了一枪，而是真的把自己打进了争冠名单。冠军会抬高预算，也会抬高所有人的预期。下一站大赛要做的不是证明你们会赢，而是证明你们能持续赢。" },
  { id: "annual-champion-hunted", tiers: ["champion"], text: "拿过冠军之后，世界会变得更难。对手会研究你的默认，粉丝会要求更多，明星选手也会想要更大的舞台。管理冠军队，比带黑马更考验手腕。" },
  { id: "annual-champion-foundation", tiers: ["champion"], text: "这一冠给了队伍底气，但底气不是护身符。保留真正有效的羁绊，处理那些被奖杯暂时掩盖的矛盾，才是下个赛季继续争冠的关键。" },
  { id: "annual-champion-review", tiers: ["champion"], text: "冠军赛季最容易让人忽略裂缝。你需要把赢下来的图也拆开看：哪些回合靠个人硬救，哪些暂停真的有效，哪些地图只是暂时没被对手抓住。" },
  { id: "annual-champion-roster-window", tiers: ["champion"], text: "奖杯会让转会窗口变得诱人，也会让阵容关系变得敏感。补强当然重要，但别把刚形成的信任轻易拆掉。" },
  { id: "annual-champion-pressure", tiers: ["champion"], text: "这一年你们学会了赢，下一年要学会被研究以后继续赢。强队的日子不是更轻松，而是每一张图都有人提前写好针对方案。" },
  { id: "annual-champion-core", tiers: ["champion"], text: "如果说冠军给了 Team gun 名字，那么训练室里的秩序才让这个名字站得住。继续围绕真正能打硬仗的人建队，而不是围绕一时的热度建队。" },
  { id: "annual-champion-economy", tiers: ["champion"], text: "奖金到账以后，最考验经理的不是敢不敢花钱，而是知道哪些问题能用转会解决，哪些问题只能靠时间和纪律解决。" },
  { id: "annual-champion-next-cup", tiers: ["champion"], text: "这一年足够漂亮，但下一场大赛不会给卫冕队额外善意。把庆祝留在今晚，把预案留给明天。" },
  { id: "annual-finalist-ache", tiers: ["finalist"], text: "这一年最痛的是决赛没能收住。可痛也有价值，它把短板照得很亮：谁能扛压力，谁需要保护，哪张图一到关键局就会漏风。" },
  { id: "annual-finalist-near", tiers: ["finalist"], text: "你们已经能把赛季拖进最后的舞台，只是还没学会在那里完成收尾。别把亚军当成安慰，它应该变成训练室墙上最刺眼的提醒。" },
  { id: "annual-finalist-return", tiers: ["finalist"], text: "决赛席不会永远等人。这个休赛期要做的，是把“差一点”拆成能训练、能交易、能调整的具体问题。下一次进决赛，不能只靠热血。" },
  { id: "annual-finalist-map-pool", tiers: ["finalist"], text: "这一年已经证明 Team gun 能打到最后。现在要问的是：哪张图在决赛里不够硬，哪套开局一被研究就失效，哪名选手需要更清楚的保护。" },
  { id: "annual-finalist-budget", tiers: ["finalist"], text: "亚军会带来信心，也会带来错觉。别以为只差一个明星就能解决全部问题，决赛输掉的往往是体系里最细的地方。" },
  { id: "annual-finalist-voice", tiers: ["finalist"], text: "强队决赛里最贵的东西不是火力，而是统一。下一场大赛前，你要让队伍在压力最高的时候仍然听得见同一个方向。" },
  { id: "annual-finalist-rival", tiers: ["finalist"], text: "这一年你们有了真正的对手，也有了真正的参照物。研究他们为什么能收杯，比沉浸在差一步里更有价值。" },
  { id: "annual-finalist-lineup", tiers: ["finalist"], text: "决赛会放大阵容里的每个小问题。谁能留，谁该轮换，谁需要更适合的位置，休赛期不能再只凭感觉判断。" },
  { id: "annual-finalist-tempo", tiers: ["finalist"], text: "你们已经能追分，也能顶住很多硬仗。下一步是学会在领先时不乱，在被追时不慌，把节奏真正握在自己手里。" },
  { id: "annual-contender-shape", tiers: ["contender"], text: "这一年还没摸到奖杯，不过体系已经有轮廓了。四强说明你们能打硬仗，没进决赛说明硬仗里还有一段距离。别急着推翻全部，先把最稳定的部分留下。" },
  { id: "annual-contender-floor", tiers: ["contender"], text: "四强赛季最宝贵的不是掌声，是样本。哪套开局能赢强队，哪名选手会在高压下变形，哪段沟通最容易出问题，这些都比一句“可惜”更重要。" },
  { id: "annual-contender-grow", tiers: ["contender"], text: "你们还不是冠军队，但已经有了被冠军队认真准备的资格。这个阶段最怕自我感动，也最怕全盘否定。稳住方向，再补最后那几块短板。" },
  { id: "annual-contender-roles", tiers: ["contender"], text: "四强之后，阵容问题会变得更具体：突破手够不够硬，防守者能不能撑住，指挥在逆风局有没有足够话语权。这些都要在下一场大赛前回答。" },
  { id: "annual-contender-patience", tiers: ["contender"], text: "不要因为没拿冠军就急着拆队，也不要因为四强就觉得一切顺利。这个阶段最需要的是耐心地补短板，而不是赌一次大换血。" },
  { id: "annual-contender-scout", tiers: ["contender"], text: "对手开始研究你们，说明 Team gun 已经不是无名队。接下来要升级的不是口号，而是赛前情报、地图准备和临场暂停的质量。" },
  { id: "annual-contender-pressure", tiers: ["contender"], text: "四强赛季会让粉丝想要更多，也会让队员开始相信自己。信心是好事，但要让它落到纪律里，而不是变成每个人都想多拿资源。" },
  { id: "annual-contender-core", tiers: ["contender"], text: "这一年最重要的收获，是你大概知道该围绕谁继续建队了。接下来所有交易和训练，都应该服务于这个核心判断。" },
  { id: "annual-contender-next-step", tiers: ["contender"], text: "从八强到四强是成长，从四强到决赛是门槛。下一场大赛要解决的不是能不能打强队，而是能不能连续打赢强队。" },
  { id: "annual-struggle-honest", tiers: ["struggle"], text: "这一年起伏很大，甚至有些杯赛结束得太早。好处是问题没有藏起来：预算怎么花、指挥听不听、明星位怎么让，下一场大赛前必须给出答案。" },
  { id: "annual-struggle-room", tiers: ["struggle"], text: "没有冠军，没有决赛，也不该有虚假的豪言。把这一年当成第一本战术笔记吧，难看但有用。真正能翻身的队伍，往往先学会诚实地承认自己哪里不够好。" },
  { id: "annual-struggle-stay", tiers: ["struggle"], text: "输多了以后，队伍最先坏掉的通常不是枪法，而是彼此的信任。休赛期的任务不只是买人，也包括让还留下的人重新相信这套项目值得继续。" },
  { id: "annual-struggle-budget", tiers: ["struggle"], text: "低谷赛季会让每一笔花费都显得沉重。别急着追逐最贵的名字，先确认队伍到底缺什么位置、什么声音、什么样的纪律。" },
  { id: "annual-struggle-truth", tiers: ["struggle"], text: "成绩不好看，但这不是空白。你已经看见了哪些选择会让队伍崩，哪些选手能在逆风里留下价值。下一场大赛前，先把这些真相用起来。" },
  { id: "annual-struggle-reset", tiers: ["struggle"], text: "这一年像一次漫长的试错。试错不丢人，丢人的是明知道问题在哪还继续装作没看见。训练室必须重新变得诚实。" },
  { id: "annual-struggle-form", tiers: ["struggle"], text: "如果队伍总在第一轮就被打乱，问题往往不只在火力。状态管理、赛前准备、替补使用和暂停选择，都要重新排优先级。" },
  { id: "annual-struggle-hope", tiers: ["struggle"], text: "三年模式不会因为一年低谷就结束。今天难看的成绩，可能正是下一次阵容升级和战术重建的起点。" },
  { id: "annual-struggle-noise", tiers: ["struggle"], text: "论坛会嘲笑，粉丝会失望，赞助商也会问成绩。但经理最该听见的，还是训练室里那些具体的问题：谁不适合，哪张图不会打，哪次沟通断了。" },
];

const playerOfYearLinePool = [
  { id: "poy-carry-finals", tiers: ["champion", "finalist"], text: "{player} 这一年最值钱的地方，不只是数据好看，而是在决赛和赛点局里总能把队伍往前拽一步。" },
  { id: "poy-trophy-proof", tiers: ["champion"], text: "奖杯会被写进俱乐部荣誉室，但 {player} 的名字会留在那些让对手沉默的关键回放里。" },
  { id: "poy-hunted", tiers: ["champion"], text: "{player} 已经不是偶尔爆发的火力点了。下一场大赛开始，对手会专门为他准备烟、闪和反清。" },
  { id: "poy-champion-spine", tiers: ["champion"], text: "冠军队需要有人把压力顶住。{player} 做到的不是一两次天秀，而是整年都能在队伍需要答案时给出回应。" },
  { id: "poy-champion-target", tiers: ["champion"], text: "{player} 的赛季像一份公开战书：你可以研究他、针对他、封锁他的路线，但不能假装他不存在。" },
  { id: "poy-champion-map-control", tiers: ["champion"], text: "这一年的 {player} 不只会收割，他会改变对手的站位、道具分配和回防选择。这才是年度第一真正可怕的地方。" },
  { id: "poy-champion-training-room", tiers: ["champion"], text: "训练室里的录像会记录很多细节：谁在版本变化后最快适应，谁在被研究后还能拿出新解法。{player} 这一年把这些答案都打在了服务器里。" },
  { id: "poy-champion-media-proof", tiers: ["champion"], text: "舆论会放大冠军队的一切，采访、剪辑、质疑都会跟着来。{player} 没有被这些声音带跑，他用整年的表现把讨论留在了比赛里。" },
  { id: "poy-near-summit", tiers: ["finalist"], text: "{player} 把队伍带到了离山顶很近的地方。差一步没有让他的赛季失色，反而让每个强队都看见了他的威胁。" },
  { id: "poy-hard-series", tiers: ["finalist", "contender"], text: "这一年的硬仗里，{player} 不只是在刷击杀，他承担的是 Team gun 最需要有人站出来的那些回合。" },
  { id: "poy-finalist-bruise", tiers: ["finalist"], text: "决赛的失落不会抹掉 {player} 的全年表现。越是接近奖杯，越能看出谁真的有资格被放在准备清单最前面。" },
  { id: "poy-finalist-standard", tiers: ["finalist"], text: "{player} 给 Team gun 立起了一个很高的标准：想继续争冠，队伍其他位置也要跟上他的节奏和强度。" },
  { id: "poy-finalist-edge", tiers: ["finalist"], text: "这一年很多回合都走在刀口上，{player} 是少数能让队伍在混乱里保持威胁的人。亚军遗憾，但他的分量够重。" },
  { id: "poy-finalist-window", tiers: ["finalist"], text: "窗口期最怕看不清该围绕谁建队。{player} 这一年已经把答案摆出来了：补强可以讨论，但核心不能再摇摆。" },
  { id: "poy-finalist-review", tiers: ["finalist"], text: "亚军会留下很多难受的复盘，但 {player} 不是问题本身。他更像那条基准线，提醒队伍其他环节还差多少才能真正收杯。" },
  { id: "poy-system-light", tiers: ["contender"], text: "{player} 是这套体系里最稳定的光源。四强也好，硬仗也好，他让队伍始终有一条能继续打下去的路。" },
  { id: "poy-respect-earned", tiers: ["contender"], text: "对手开始尊重 Team gun，很大一部分原因是 {player}。他让每一张图都多了一个必须被研究的变量。" },
  { id: "poy-contender-foundation", tiers: ["contender"], text: "{player} 还没有把年度变成奖杯，但他已经把队伍的下限撑了起来。接下来要补的，是能陪他打到最后的结构。" },
  { id: "poy-contender-warning", tiers: ["contender"], text: "{player} 的名字出现在年度第一，不是装点门面的奖励，而是在提醒管理层：这套阵容已经有核心，不能再随便浪费窗口期。" },
  { id: "poy-contender-grind", tiers: ["contender"], text: "四强赛季最容易被一句“差一点”概括，但 {player} 的价值在于，他把每个差一点都变成了下一次可训练的方向。" },
  { id: "poy-contender-analyst", tiers: ["contender"], text: "分析师能拆出对手习惯，教练能安排针对训练，但最后要有人把准备变成回合里的执行。{player} 这一年承担的就是这份重量。" },
  { id: "poy-contender-role-map", tiers: ["contender"], text: "角色分配、地图池短板、临场沟通，这些问题还没完全解决。{player} 的年度第一更像一张路线图：先稳住核心，再修体系。" },
  { id: "poy-struggle-anchor", tiers: ["struggle"], text: "这一年不算顺，但 {player} 至少把几场濒临散掉的比赛拉回了正常轨道。低谷里能站住的人，才真正值得记住。" },
  { id: "poy-room-to-grow", tiers: ["struggle", "contender"], text: "{player} 的年度第一不是完美答案，而是一条清楚的线索：围绕他补齐结构，Team gun 才有机会走得更远。" },
  { id: "poy-struggle-candle", tiers: ["struggle"], text: "成绩单不好看时，{player} 的表现更像一盏灯：它不能照亮整座训练室，但至少让队伍知道哪里还值得继续打磨。" },
  { id: "poy-struggle-honest", tiers: ["struggle"], text: "{player} 不是低谷的遮羞布。恰恰相反，他让问题变得更清楚：有些回合有人能站出来，但队伍还没学会一起赢。" },
  { id: "poy-struggle-seed", tiers: ["struggle"], text: "如果这一年只能留下一件资产，那就是 {player} 证明了 Team gun 还有可围绕建设的核心。剩下的，要靠转会和磨合补上。" },
  { id: "poy-struggle-noise", tiers: ["struggle"], text: "输得多的时候，论坛会翻旧账，队内也会有人怀疑方向。{player} 这一年最难得的地方，是在这些杂音里还保住了自己的比赛质量。" },
  { id: "poy-struggle-rebuild", tiers: ["struggle"], text: "低谷赛季的年度第一并不浪漫。它意味着 {player} 既是亮点，也是重建起点；接下来每一笔预算和每一次试训，都要围绕这个现实来做。" },
  { id: "poy-all-year-thread", tiers: ["champion", "finalist", "contender", "struggle"], text: "{player} 贯穿了这一年的关键片段：有高光，有失误后的回应，也有那些不被集锦剪进去的稳定回合。" },
  { id: "poy-pressure-tested", tiers: ["champion", "finalist", "contender"], text: "真正的年度第一不是只在顺风局好看。{player} 经历过被针对、被反清、被拖进残局，仍然把自己的影响力打了出来。" },
  { id: "poy-next-target", tiers: ["champion", "finalist", "contender", "struggle"], text: "{player} 是今年最亮的名字，也会是下一场大赛最先被对手写进准备清单的人。" },
  { id: "poy-long-season", tiers: ["champion", "finalist", "contender", "struggle"], text: "一个赛季很长，状态会起伏，舆论会变脸，对手也会更新打法。{player} 能站到年度第一，靠的是把这些压力一段段扛过去。" },
  { id: "poy-replay-room", tiers: ["champion", "finalist", "contender", "struggle"], text: "复盘室里最容易被反复暂停的，不一定是最夸张的击杀，而是 {player} 那些改变回合走向的细节处理。" },
  { id: "poy-bigger-than-stats", tiers: ["champion", "finalist", "contender", "struggle"], text: "{player} 的年度第一不只是个人数据堆出来的。它还包括牵制、补位、残局判断，以及强队不得不尊重他的那部分影响力。" },
];

function pickPlayerOfYearLine(playerName, tier, campaign, records) {
  const pool = playerOfYearLinePool.filter((entry) => entry.tiers.includes(tier));
  const seed = (campaign.seasonIndex ?? 1) * 31 + playerName.length * 7 + records.length;
  const picked = pickFreshText(pool.length ? pool : playerOfYearLinePool, seed, campaign.textHistory, "annual");
  return {
    id: picked.id,
    text: fillSummaryVariables(picked.text, { player: playerName }),
  };
}

const annualCollapseReviewPool = [
  {
    id: "collapse-quarter-cold-water",
    placements: ["八强"],
    text: "S{seasonIndex} 的 {cupName} 是一盆冷水。八强出局不是输一张图那么简单，而是开局准备、临场暂停和队员状态一起露了底。夜阑卧听风吹雨，训练室里最该听见的不是借口，是下一次怎么把默认重新打扎实。",
  },
  {
    id: "collapse-quarter-demo-room",
    placements: ["八强"],
    text: "{cupName} 需要被完整拆开：哪一次前顶没有补枪，哪一次转点慢了半拍，哪一次残局没人敢做决定。所谓低谷，不是成绩难看，而是你终于看清这支队伍还有多少细节没练到肌肉记忆里。",
  },
  {
    id: "collapse-quarter-honest",
    placements: ["八强"],
    text: "这一年的低处落在 {cupName}。早早离场会让人难受，但也让问题变得诚实：枪法救不了所有回合，明星也不能替全队沟通。沉舟侧畔千帆过，复盘要从最刺眼的那几回合开始。",
  },
  {
    id: "collapse-quarter-roster-cost",
    placements: ["八强"],
    text: "{cupName} 的八强出局要和阵容一起复盘。钱花在哪里，谁承担了不适合的位置，哪名选手状态被连续消耗，这些问题比比分更值得留下。",
  },
  {
    id: "collapse-quarter-first-map",
    placements: ["八强"],
    text: "低谷不一定来自最后一图，有时从第一张图的手枪局和经济局就开始了。{cupName} 要提醒你：前期压力处理不好，BO5 还没进入后段就会变形。",
  },
  {
    id: "collapse-quarter-no-answer",
    placements: ["八强"],
    text: "{cupName} 输得早，也输得直接。对手问了几个很基础的问题：你们怎么破默认，怎么防转点，怎么在落后时不急。Team gun 当时没有给出足够好的答案。",
  },
  {
    id: "collapse-semi-pressure",
    placements: ["四强"],
    text: "{cupName} 的四强战最值得复盘。你们已经能走到强队面前，却还没学会在高压下把优势局收干净。千磨万击还坚劲，这种失利不该变成遗憾收藏，应该变成下一场大赛每一次暂停时的底气。",
  },
  {
    id: "collapse-semi-last-step",
    placements: ["四强"],
    text: "最该回看的不是失败本身，而是 {cupName} 离决赛只差的那几段处理：默认是否太慢，补枪是否脱节，关键先生有没有被保护到舒服位置。四强不是羞耻，但它会提醒你，体系还差最后一层硬度。",
  },
  {
    id: "collapse-semi-map-pool",
    placements: ["四强"],
    text: "{cupName} 的半决赛暴露了地图池的边界。你们能赢熟悉的图，但一旦被拖进不舒服的节奏，沟通、补防和道具细节就开始松动。",
  },
  {
    id: "collapse-semi-identity",
    placements: ["四强"],
    text: "四强不是失败的全部，却是身份变化的节点。{cupName} 之后，Team gun 不能再只用黑马心态要求自己，强队会按强队标准审视你们。",
  },
  {
    id: "collapse-semi-pressure-room",
    placements: ["四强"],
    text: "{cupName} 最值得留下的不是遗憾，而是压力样本。把那些语音变急、补枪变慢、站位变散的回合逐个拆开，下一次才不会在同一个地方倒下。",
  },
  {
    id: "collapse-final-closeout",
    placements: ["亚军"],
    text: "{cupName} 的决赛会在休赛期反复出现。差一步的痛最容易骗人，让人以为只要运气好一点就够了。江东子弟多才俊，卷土重来未可知，但卷土重来之前，先把收官局、经济局和暂停后的第一波重新写明白。",
  },
  {
    id: "collapse-final-silence",
    placements: ["亚军"],
    text: "亚军最难复盘，因为它看起来离成功很近。{cupName} 这一站要提醒 Team gun：能进决赛说明方向没错，没能捧杯说明临门一脚还不够狠。长风破浪会有时，但风来之前，船得先修好。",
  },
  {
    id: "collapse-final-resource",
    placements: ["亚军"],
    text: "{cupName} 的决赛像一面镜子：多核心资源怎么分，指挥能不能压住节奏，替补席有没有真正方案。差一步，不是只差运气。",
  },
  {
    id: "collapse-final-decider",
    placements: ["亚军"],
    text: "如果 {cupName} 打到最后才输，那复盘就更不能粗糙。决胜图之前的每一次经济选择、每一次藏战术、每一次暂停，都要重新串起来看。",
  },
  {
    id: "collapse-final-future",
    placements: ["亚军"],
    text: "{cupName} 的亚军会疼很久，但它也给未来留下坐标。Team gun 已经知道山顶在哪，接下来要解决的是怎么带着更完整的体系走上去。",
  },
  {
    id: "collapse-champion-hidden-cracks",
    placements: ["冠军"],
    text: "{cupName} 夺冠当然值得庆祝，但年度复盘不能只看奖杯。赢下来的回合里也有隐患：有人靠个人能力硬补，有些默认被对手摸到边。会当凌绝顶之后，下一件事是看看脚下哪块石头已经松了。",
  },
  {
    id: "collapse-champion-pressure",
    placements: ["冠军"],
    text: "这一年没有真正的崩盘站，{cupName} 反而最值得回看。冠军会让掌声变大，也会让对手的研究更细。满堂花醉三千客之后，经理最该做的不是沉醉，而是把下一次被针对的预案先写出来。",
  },
  {
    id: "collapse-champion-repeat-risk",
    placements: ["冠军"],
    text: "{cupName} 赢了，但赢法不能不复盘。如果每一次关键局都靠同一个人硬解，下一场大赛对手一定会先从那里下手。",
  },
  {
    id: "collapse-champion-comfort-zone",
    placements: ["冠军"],
    text: "冠军最危险的副作用，是让人误以为舒适区也会一直赢。{cupName} 之后，Team gun 要主动更新地图池和暂停方案，而不是等对手先动刀。",
  },
  {
    id: "collapse-champion-burden",
    placements: ["冠军"],
    text: "{cupName} 的奖杯不是复盘豁免权。它只说明你们这次做对了更多选择，不说明所有选择都正确。强队要学会在胜利里找问题。",
  },
];

function placementRank(placement) {
  if (placement === "冠军") return 1;
  if (placement === "亚军") return 2;
  if (placement === "四强") return 4;
  return 8;
}

function seasonTierFromPlacement(bestPlacement) {
  if (bestPlacement === 1) return "champion";
  if (bestPlacement === 2) return "finalist";
  if (bestPlacement <= 4) return "contender";
  return "struggle";
}

function fillSummaryVariables(text, vars) {
  return Object.entries(vars).reduce((output, [key, value]) => output.replaceAll(`{${key}}`, value ?? "未知"), text);
}

function pickAnnualCollapseReview(records, campaign) {
  const fallbackRecord = records[0] ?? { cupName: "这一年", placement: "冠军" };
  const lowestRank = Math.max(...records.map((record) => placementRank(record.placement)));
  const collapseRecord = records.find((record) => placementRank(record.placement) === lowestRank) ?? fallbackRecord;
  const eligible = annualCollapseReviewPool.filter((entry) => entry.placements.includes(collapseRecord.placement));
  const pool = eligible.length ? eligible : annualCollapseReviewPool.filter((entry) => entry.placements.includes("冠军"));
  const picked = pickFreshText(pool, campaign.seasonIndex * 23 + lowestRank + collapseRecord.cupName.length, campaign.textHistory, "annual");
  return {
    cupName: collapseRecord.cupName,
    placement: collapseRecord.placement,
    id: picked.id,
    text: fillSummaryVariables(picked.text, {
      seasonIndex: String(campaign.seasonIndex),
      cupName: collapseRecord.cupName,
      placement: collapseRecord.placement,
    }),
  };
}

function pickCupEncouragement(cupName, placement, championName, mvpName, trophyCount, options = {}) {
  const tags = [cupName.toLowerCase().includes("major") ? "major" : ""].filter(Boolean);
  const eligible = cupEncouragementPool.filter((entry) =>
    entry.placements.includes(placement)
    && (!entry.minTrophies || trophyCount >= entry.minTrophies)
    && (!entry.tags || entry.tags.some((tag) => tags.includes(tag)))
  );
  const fallback = cupEncouragementPool.filter((entry) => entry.placements.includes(placement));
  const picked = pickFreshText(eligible.length ? eligible : fallback, options.seed ?? trophyCount + cupName.length, options.textHistory, "cup");
  const crownNote = trophyCount > 0 ? ` 当前总冠军数：${trophyCount}。` : "";
  return {
    id: picked.id,
    message: `${cupName} 结束：${championName} 夺冠，${mvpName} 获得杯赛 MVP。\n${picked.text}${crownNote}`,
  };
}

function tacticalStyleFromChoices({ scoutingChoice, pistolChoice, tacticChoice, economyChoice, timeoutChoice } = {}) {
  const score = { 激进: 0, 保守: 0, 稳定: 0 };
  const add = (style, value = 1) => {
    score[style] += value;
  };

  if (scoutingChoice === "drill") add("激进", 2);
  if (scoutingChoice === "confidence") add("稳定", 2);
  if (scoutingChoice === "hide-looks") add("保守", 2);

  if (pistolChoice === "pistol_deagle") add("激进", 2);
  if (pistolChoice === "pistol_utility") add("稳定", 1);
  if (pistolChoice === "pistol_armor") add("稳定", 1);
  if (pistolChoice === "pistol_save") add("保守", 2);

  if (tacticChoice === "rush") add("激进", 3);
  if (tacticChoice === "fake") add("激进", 1);
  if (tacticChoice === "default") add("稳定", 3);
  if (tacticChoice === "lurk") add("保守", 2);

  if (economyChoice === "full_setup") add("激进", 2);
  if (economyChoice === "lean_setup") add("稳定", 2);
  if (economyChoice === "force_setup") add("保守", 2);

  if (timeoutChoice === "tactical-reset") add("稳定", 1);
  if (timeoutChoice === "emotional-reset") add("保守", 1);
  if (timeoutChoice === "discipline-reset") add("激进", 1);

  return Object.entries(score).sort((left, right) => right[1] - left[1])[0][0];
}

function summarizeSeasonTacticalStyle(records = []) {
  const score = records.reduce((map, record) => {
    const style = record.tacticalStyle ?? "稳定";
    map[style] = (map[style] ?? 0) + 1;
    return map;
  }, { 激进: 0, 保守: 0, 稳定: 0 });
  return Object.entries(score).sort((left, right) => right[1] - left[1])[0][0];
}

function createCupResult(state, campaign) {
  const champion = campaign.currentBracket.champion;
  const placement = determinePlacement(campaign);
  const mvp = calculateCupMvp(state, champion);
  const trophyCount = campaign.cupRecords.filter((record) => record.champion === PLAYER_TEAM).length + (champion.id === "player-team" ? 1 : 0);
  const prize = placementPrize(placement);
  const encouragement = pickCupEncouragement(campaign.currentBracket.cupName, placement, champion.name, mvp.name, trophyCount, {
    seed: campaign.seasonIndex * 37 + campaign.cupIndex * 11 + placementRank(placement),
    textHistory: campaign.textHistory,
  });
  return {
    cupName: campaign.currentBracket.cupName,
    champion: champion.name,
    championId: champion.id,
    runnerUp: campaign.currentBracket.runnerUp.name,
    placement,
    mvp,
    encouragement: encouragement.message,
    encouragementId: encouragement.id,
    headline: campaign.currentBracket.lastRoundSummary,
    bracket: campaign.currentBracket,
    matchReplay: [...state.match.resolved],
    highlightMoment: state.match.resolved.find((entry) => (entry.kind === "star-highlight" || entry.kind === "opponent-highlight") && entry.highlightMoment)?.highlightMoment,
    playerStats: Object.values(state.match.playerStats),
    year: campaign.currentBracket.year,
    prize,
    roundReached: campaign.currentBracket.currentRound,
    signatureCall: state.match.resolved.find((entry) => entry.choice)?.choice ?? "默认架枪",
    tacticalStyle: tacticalStyleFromChoices({
      scoutingChoice: state.match.scoutingChoice,
      pistolChoice: state.match.hidden.pistolChoice,
      tacticChoice: state.match.hidden.tacticChoice,
      economyChoice: state.match.hidden.economyChoice,
      timeoutChoice: state.match.hidden.timeoutChoice,
    }),
  };
}

function accumulateSeasonTopPlayers(records) {
  const scoreMap = new Map();
  const playerAppearanceMap = new Map();
  const playerOutputMap = new Map();
  const playerTeamNames = new Set();
  const addScore = (name, points) => {
    if (!name) return;
    scoreMap.set(name, (scoreMap.get(name) ?? 0) + points);
  };
  const normalized = (value = "") => String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
  const playerByName = (name) => players.find((player) => normalized(player.name) === normalized(name) || normalized(player.id) === normalized(name));
  const personalRating = (name) => {
    const player = playerByName(name);
    if (!player) return 72;
    return player.firepower * 0.38 + player.clutch * 0.28 + player.tactics * 0.18 + player.discipline * 0.12 + traitUtilityScore(player) * 0.35;
  };
  const teamNamesByRecord = (record) => new Set((record.playerStats ?? []).map((row) => row.name));
  const compressedCupOutput = (row, placement, rank = 0) => {
    const rawOutput = Math.max(0,
      (row.impact ?? 0) * 0.65
      + (row.kills ?? 0) * 0.35
      + (row.assists ?? 0) * 0.12
      - (row.deaths ?? 0) * 0.12,
    );
    const finishBonus = placement === "冠军" ? 2.5 : placement === "亚军" ? 1.5 : placement === "四强" ? 0.5 : 0;
    const roleShare = rank === 0 ? 1 : rank === 1 ? 0.72 : rank === 2 ? 0.58 : 0.44;
    return Math.min(22, (Math.sqrt(rawOutput) * 2.25 + finishBonus) * roleShare);
  };
  const aiCoreExposure = (name, record, index) => {
    const finishWeight = record.championId && AI_TEAM_PROFILES[record.championId]?.stars.includes(name)
      ? record.championId === "player-team"
        ? 0
        : 1
      : record.runnerUp ? 0.62 : 0;
    const roleWeight = index === 0 ? 1 : index === 1 ? 0.75 : 0.52;
    return finishWeight * roleWeight * (12 + personalRating(name) * 0.1);
  };
  const aiSeasonBaseline = (name, team, record, index, playerRosterNames) => {
    if (playerRosterNames.has(name)) return 0;
    const rating = personalRating(name);
    const finish = record.championId === team.id
      ? 1
      : record.runnerUp === team.name
        ? 0.72
        : 0.28;
    const roleWeight = index === 0 ? 1 : index === 1 ? 0.82 : index === 2 ? 0.64 : 0.45;
    const styleWeight = team.base.firepower >= 91 && index <= 1
      ? 1.12
      : team.base.tacticalExecution >= 87 && index <= 2
        ? 1.06
        : 1;
    return (6 + rating * 0.055) * finish * roleWeight * styleWeight;
  };
  for (const record of records) {
    const playerRosterNames = teamNamesByRecord(record);
    playerRosterNames.forEach((name) => playerTeamNames.add(name));
    addScore(record.mvp.name, 12 + personalRating(record.mvp.name) * 0.06);
    const rows = [...(record.playerStats ?? [])].sort((left, right) => (right.impact ?? 0) - (left.impact ?? 0));
    for (const [index, row] of rows.entries()) {
      const output = compressedCupOutput(row, record.placement, index);
      playerAppearanceMap.set(row.name, (playerAppearanceMap.get(row.name) ?? 0) + 1);
      playerOutputMap.set(row.name, (playerOutputMap.get(row.name) ?? 0) + output);
      addScore(row.name, output + personalRating(row.name) * (index === 0 ? 0.03 : 0.018));
    }
    for (const teamId of AI_TEAM_ORDER) {
      const team = AI_TEAM_PROFILES[teamId];
      const teamFinished = record.championId === teamId || record.runnerUp === team.name;
      team.stars.slice(0, 4).forEach((name, index) => {
        addScore(name, aiSeasonBaseline(name, team, record, index, playerRosterNames));
      });
      if (teamFinished) {
        team.stars.slice(0, 3).forEach((name, index) => {
          const runnerRecord = record.runnerUp === team.name && record.championId !== teamId
            ? { ...record, championId: undefined, runnerUp: team.name }
            : record;
          addScore(name, aiCoreExposure(name, runnerRecord, index));
        });
      }
    }
  }
  const protectedPlayerNames = new Set(
    [...playerOutputMap.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 2)
      .map(([name]) => name),
  );
  for (const [name, appearances] of playerAppearanceMap.entries()) {
    if (appearances < 2 || protectedPlayerNames.has(name)) continue;
    scoreMap.set(name, (scoreMap.get(name) ?? 0) * 0.62);
  }
  const playerTeamRanked = [...scoreMap.entries()]
    .filter(([name]) => playerTeamNames.has(name))
    .sort((left, right) => right[1] - left[1]);
  playerTeamRanked.forEach(([name, points], index) => {
    const output = playerOutputMap.get(name) ?? 0;
    const highCarry = output >= 55 || protectedPlayerNames.has(name);
    const multiplier = index <= 1
      ? 1
      : index === 2
        ? highCarry ? 0.82 : 0.68
        : highCarry ? 0.64 : 0.48;
    scoreMap.set(name, points * multiplier);
  });
  const displayPoints = (points) => Math.min(90, Math.round(Math.log1p(Math.max(0, points)) * 16));
  return [...scoreMap.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)
    .map(([name, points], index) => ({ rank: index + 1, name, points: displayPoints(points) }));
}

function createAnnualSummary(campaign) {
  const records = campaign.cupRecords.filter((record) => record.seasonIndex === campaign.seasonIndex);
  const clubPoints = new Map();
  for (const record of records) {
    clubPoints.set(record.champion, (clubPoints.get(record.champion) ?? 0) + 100);
    clubPoints.set(record.runnerUp, (clubPoints.get(record.runnerUp) ?? 0) + 60);
    clubPoints.set(PLAYER_TEAM, (clubPoints.get(PLAYER_TEAM) ?? 0) + (record.placement === "冠军" ? 100 : record.placement === "亚军" ? 60 : record.placement === "四强" ? 35 : 15));
  }
  const bestClub = [...clubPoints.entries()].sort((left, right) => right[1] - left[1])[0] ?? [PLAYER_TEAM, 0];
  const top10 = accumulateSeasonTopPlayers(records);
  const bestPlacement = Math.min(...records.map((record) => (record.placement === "冠军" ? 1 : record.placement === "亚军" ? 2 : record.placement === "四强" ? 4 : 8)));
  const playerOfYear = top10[0]?.name ?? records[0]?.mvp.name ?? "待定";
  const collapseReview = pickAnnualCollapseReview(records, campaign);
  const biggestCollapse = collapseReview.cupName;
  const signatureCall = records.map((record) => record.signatureCall).filter(Boolean)[0] ?? "默认慢控反清";
  const tacticalStyle = summarizeSeasonTacticalStyle(records);
  const isFinalSeason = campaign.seasonIndex >= CAMPAIGN_SEASONS;
  const offseasonEvents = isFinalSeason ? [] : buildOffseasonEvents(campaign, records);
  const tier = seasonTierFromPlacement(bestPlacement);
  const quotePool = seasonQuotePool[tier].map((text, index) => ({ id: `quote-${tier}-${index}`, text }));
  const messagePool = annualMessagePool.filter((entry) => entry.tiers.includes(tier));
  const quote = pickFreshText(quotePool, campaign.seasonIndex * 5 + bestPlacement, campaign.textHistory, "annual");
  const message = pickFreshText(messagePool, campaign.seasonIndex * 17 + bestPlacement, campaign.textHistory, "annual");
  const playerOfYearLine = pickPlayerOfYearLine(playerOfYear, tier, campaign, records);
  const managerMessage = message.text;
  const seasonQuote = quote.text;
  const seasonMessage = `${managerMessage} ${seasonQuote}`;
  return {
    seasonIndex: campaign.seasonIndex,
    bestClub: bestClub[0],
    bestClubPoints: bestClub[1],
    playerOfYear,
    playerOfYearLine: playerOfYearLine.text,
    playerOfYearLineId: playerOfYearLine.id,
    top10,
    biggestCollapse,
    collapseReview: collapseReview.text,
    collapseReviewId: collapseReview.id,
    collapsePlacement: collapseReview.placement,
    signatureCall,
    tacticalStyle,
    seasonMessage,
    seasonQuote,
    managerMessage,
    managerMessageId: message.id,
    seasonQuoteId: quote.id,
    offseasonEvents,
    offseasonEventIndex: 0,
    resolvedOffseasonEvents: [],
    allOffseasonResolved: isFinalSeason || offseasonEvents.length === 0,
    nextSeasonModifiers: { firepower: 0, tacticalExecution: 0, cohesion: 0, discipline: 0 },
    eventHistory: createEventHistory(campaign.eventHistory),
    records,
  };
}

const chronicleEpiloguePool = [
  {
    id: "chronicle-legend-major",
    tier: "legendary",
    title: "王朝",
    text:
      "后来的人们谈起这三年，总会先说 Team gun。不是因为他们赢过，而是因为他们在不同的杯赛、不同的版本、不同的压力下反复赢下来了。\n\n" +
      "从 {first_cup_name} 的 {first_cup_result} 到 {best_cup_name} 的 {best_cup_result}，这支队伍经历过质疑、伤病、舆论和转会窗口里的摇摆。可每一次回到服务器，最终说话的仍然是纪律、补枪和那几次不讲道理的关键枪。\n\n" +
      "满堂花醉三千客，一剑霜寒十四州。{total_cups_won} 个冠军不是一串数字，而是一条从新队伍磨合期走到强队时代的路。{star_player_name} 是这段路上最亮的名字，但真正让故事成立的，是五个人在最吵的场馆里仍然愿意听同一个指挥。\n\n" +
      "这三年会散场，阵容会变化，状态会起落。但当后来的人讨论这段时期最难被击倒的队伍时，Team gun 会被郑重写进那一页。"
  },
  {
    id: "chronicle-legend-domination",
    tier: "legendary",
    title: "统治力",
    text:
      "王朝不是靠一座奖杯喊出来的。它需要连续的决赛席，需要 Major 的重量，也需要对手明知道你会怎么打，仍然没办法把你从冠军路线里挤出去。\n\n" +
      "Team gun 做到的正是这一点。从 {first_cup_name} 的 {first_cup_result} 到 {best_cup_name} 的 {best_cup_result}，他们不是偶尔爆冷，而是在三年里反复把强队拖进自己的规则。\n\n" +
      "所谓统治力，不是每张图都轻松赢，而是落后时能追回来，被针对时能换方案，换人后还能重新磨出秩序。{star_player_name} 是最亮的名字之一，但王朝成立靠的是整支队伍都学会了怎样持续赢。\n\n" +
      "后来再谈这三年，人们不会只记得某一个夜晚。他们会记得 Team gun 长时间压在赛区上方，像一座每支队伍都必须翻过去的山。"
  },
  {
    id: "chronicle-legend-standard",
    tier: "legendary",
    title: "时代标准",
    text:
      "有些冠军属于一晚，有些冠军会改变后来者的标准。Team gun 的三年属于后者：他们把预算、磨合、暂停、转会和地图池选择都压成了一套可以被后来队伍模仿的答案。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 只是最亮的一页。真正让这段旅程接近王朝的，是他们在不同杯赛里不断证明同一件事：只靠手感赢不了他们，只靠反制也拖不死他们。\n\n" +
      "王朝从来不是没有失误，而是失误后仍然能站回最高处。Team gun 这三年有过低谷，也有过被追分的夜晚，但他们最终把这些夜晚都写成了统治力的一部分。\n\n" +
      "这段故事结束时，奖杯不是唯一证据。对手研究他们的方式、粉丝期待他们的语气、选手被评价的标准，都已经被 Team gun 改过了。"
  },
  {
    id: "chronicle-legend-map-pool",
    tier: "legendary",
    title: "地图答案",
    text:
      "统治力最难伪装的地方，是地图池。偶尔爆种的队伍可以靠一两张图冲上去，但 Team gun 这三年真正可怕的，是他们能在不同地图、不同对手和不同版本里反复找到答案。\n\n" +
      "从 {first_cup_name} 的 {first_cup_result} 到 {best_cup_name} 的 {best_cup_result}，你们不是只靠一套默认吃遍天下。有人研究你们的开局，你们就调整中段；有人针对明星位，你们就把辅助和补枪做得更细。\n\n" +
      "会当凌绝顶，一览众山小。站在高处不是因为从不失误，而是因为每次失误之后，训练室都能把它拆成下一场能用的东西。\n\n" +
      "多年以后再看这三年，人们会发现 Team gun 留下的不只是奖杯，还有一套强队该怎样长期活下去的样板。"
  },
  {
    id: "chronicle-legend-pressure",
    tier: "legendary",
    title: "压力之上",
    text:
      "有些队伍会在掌声里变轻，有些队伍会在压力里变硬。Team gun 属于后者。冠军越多，对手越会研究，粉丝越会苛刻，媒体越会把每一次失误放大。\n\n" +
      "可这三年里，他们没有被这些声音拖散。{best_cup_name} 的 {best_cup_result} 是代表作，{star_player_name} 的高光只是门面，真正撑住门面的，是全队在逆风时仍然愿意按同一套思路走。\n\n" +
      "千淘万漉虽辛苦，吹尽狂沙始到金。长期赢下去，需要的不只是枪法，还有耐心、纪律、替补深度和管理层不被热度牵着走的判断。\n\n" +
      "Team gun 把这些东西都留下来了，所以这段三年不只是成绩单，更像一段被后来者反复研究的时代样本。"
  },
  {
    id: "chronicle-legend-rivals",
    tier: "legendary",
    title: "宿敌退潮",
    text:
      "真正的强队不会缺少宿敌。Team gun 这三年遇到过火力更凶的队、纪律更稳的队、残局更冷的队，也遇到过专门为他们准备战术包的对手。\n\n" +
      "但故事最终没有停在被针对那里。{best_cup_name} 的 {best_cup_result} 证明，他们能把宿敌战打成自己的节奏：该保枪时不硬送，该转点时不犹豫，该暂停时敢把上一张图彻底放下。\n\n" +
      "大风起兮云飞扬。每个强敌都曾让这条路变窄，可 Team gun 一次次从窄路里走出来，最终让那些宿敌也成了他们履历的一部分。\n\n" +
      "这就是统治最真实的样子：不是没有人能挑战你，而是挑战过你的人，最后也必须承认你站得更久。"
  },
  {
    id: "chronicle-legend-roster",
    tier: "legendary",
    title: "阵容秩序",
    text:
      "豪华阵容不一定会赢，贵的名字堆在一起也可能互相抢资源。Team gun 这三年最难得的地方，是他们把明星、指挥、老将、年轻人和角色位磨成了真正能一起打硬仗的秩序。\n\n" +
      "{first_cup_name} 的 {first_cup_result} 还带着新队伍的生涩，到了 {best_cup_name} 的 {best_cup_result}，很多细节已经变成习惯：谁先拿信息，谁补第二枪，谁在逆风时把话说清楚。\n\n" +
      "所谓强队，不是每个人都拿最多资源，而是每个人都知道什么时候该把资源让出来。{star_player_name} 可以成为高光中心，是因为身边有人把脏活做到位。\n\n" +
      "这段三年最终留下的，是一支队伍从纸面强度走向真实强度的完整过程。"
  },
  {
    id: "chronicle-legend-major-weight",
    tier: "legendary",
    title: "Major 重量",
    text:
      "杯赛可以让人兴奋，Major 会让人闭嘴。Team gun 能把 Major 的重量放进三年履历里，说明这段成功不是只发生在普通夜晚的短暂燃烧。\n\n" +
      "从早期的跌撞，到 {best_cup_name} 的 {best_cup_result}，这支队伍逐渐学会了在最高压力下处理每一个小选择：经济怎么花，暂停叫给谁，落后时先稳哪张图。\n\n" +
      "黄沙百战穿金甲，不破楼兰终不还。Major 不会因为故事好听就把奖杯递过来，它只认服务器里的执行、纪律和关键回合的冷静。\n\n" +
      "Team gun 把这些都打出来了。所以三年结束时，他们不是被记住为某次爆冷，而是被记住为真正能承受大赛重量的队伍。"
  },
  {
    id: "chronicle-legend-afterglow",
    tier: "legendary",
    title: "余火不灭",
    text:
      "三年会结束，版本会变化，选手状态也会起伏。但有些队伍留下的东西不会随着赛程表翻页就消失。Team gun 的余火，就留在那些后来被反复模仿的暂停、转点和阵容选择里。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 是最亮的火光，可真正的燃料来自整个周期：低谷后的复盘，转会后的磨合，连胜时仍然不偷懒的训练室。\n\n" +
      "长风破浪会有时，直挂云帆济沧海。你把一支队伍带过了怀疑、膨胀、疲劳和针对，也让他们在最难的阶段依然保住了方向。\n\n" +
      "后来人们再谈起 Team gun，不会只谈某一张图。他们会谈这支队伍怎样把三年打成一段真正有统治力的历史。"
  },
  {
    id: "chronicle-crowned",
    tier: "crowned",
    title: "加冕",
    text:
      "每一个冠军都有自己的来路。Team gun 的来路并不平整：第一站 {first_cup_name} 是 {first_cup_result}，中途有过失控的经济局，也有过被对手读穿的默认。\n\n" +
      "但有一个夜晚，奖杯确实被举了起来。灯光打在金属表面，映出选手们疲惫又不敢相信的脸。黄沙百战穿金甲，不破楼兰终不还，这句狠话在那一刻不再像口号，而像一段真实的赛季回放。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 是三年里最重的一笔。{star_player_name} 把自己的名字留在关键局里，你则把一支预算有限、矛盾不少的队伍带到了能说“我们赢过”的位置。\n\n" +
      "这是一段真正的加冕。电竞圈记得冠军，也记得那些终于把门撞开的人。Team gun 做到了，而且是从不被看好、被质疑阵容太散的地方，一步步把奖杯拿回来的。"
  },
  {
    id: "chronicle-crowned-breakthrough",
    tier: "crowned",
    title: "破门",
    text:
      "Team gun 的三年不算长期统治，但他们至少把门撞开过。冠军不会自动证明一切，却能证明这支队伍在某个版本、某个夜晚、某条艰难路线里真的站到了最后。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 是最重要的证据。那一站之前，很多评价还停留在“有潜力”；那一站之后，所有人都必须承认 Team gun 真的赢过硬仗。\n\n" +
      "这段旅程里也有不稳定，有被读穿的默认，有转会后的磨合期，也有第一年艰难起步的现实压力。正因为如此，那座奖杯才不是空洞的装饰，而是一次真正的突破。\n\n" +
      "它足够改变队伍命运。以后再回看这三年，人们会知道 Team gun 至少有一次把所有质疑都留在了身后；那一晚不是幻觉，而是一支队伍把训练、胆量和临场选择全部兑现的时刻。"
  },
  {
    id: "chronicle-crowned-not-dynasty",
    tier: "crowned",
    title: "冠军之路",
    text:
      "有冠军，不等于已经长期统治。Team gun 这三年最真实的地方，恰恰在于他们赢过，也摔过；捧杯过，也在别的杯赛里被强队按回训练室。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 让这段征途有了奖杯作为锚点。可锚点之外，仍然有很多没有解决的问题：阵容稳定性、对手反制、状态起伏和关键局里的资源分配。\n\n" +
      "这不是贬低冠军，而是尊重冠军。真正的奖杯不需要被包装成时代神话才有价值。它已经足够说明 Team gun 能赢，只是还没持续赢到让整个赛区都围着他们转。\n\n" +
      "因此这段结语更像一条路标：你们到过山顶，也知道山顶有多冷。下一次要追问的，是能不能留在那里更久。"
  },
  {
    id: "chronicle-crowned-major-night",
    tier: "crowned",
    title: "冠军夜",
    text:
      "三年里最亮的那一晚，Team gun 终于没有让机会从手里滑走。那不是一路顺风的胜利，而是在被针对、被追分、被质疑阵容合理性之后，仍然把奖杯抢了回来。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 给这段旅程定了调：你们不是只能制造悬念的队伍，而是有能力把悬念收成结果的队伍。\n\n" +
      "满堂花醉三千客，一剑霜寒十四州。冠军的分量不只在照片里，也在那些平时没人愿意看的训练细节里：补闪、回防、残局分工、暂停后的第一套调整。\n\n" +
      "这段三年还谈不上长期压制所有对手，但它已经足够让 Team gun 的名字留在冠军名单上。对一支从零开始的队伍来说，这就是最硬的答案。"
  },
  {
    id: "chronicle-crowned-cost",
    tier: "crowned",
    title: "奖杯代价",
    text:
      "奖杯从来不是白来的。Team gun 这三年为了那一次登顶，付出的不只是预算，还有阵容取舍、替补轮换、状态波动和一次次被对手打醒后的复盘。\n\n" +
      "{first_cup_name} 的 {first_cup_result} 曾经提醒你们，纸面强度不能替代团队秩序。后来到了 {best_cup_name}，队伍终于把那些零散的经验接在一起，打出了真正够硬的 {best_cup_result}。\n\n" +
      "宝剑锋从磨砺出，梅花香自苦寒来。这个冠军的价值，正在于它不是从顺境里滑出来的，而是从很多麻烦、争论和难看的失利里磨出来的。\n\n" +
      "所以三年结束时，不必把它说得过分夸张。奖杯本身已经足够沉，Team gun 真的赢过，这件事就已经改变了他们的历史。"
  },
  {
    id: "chronicle-crowned-hard-bracket",
    tier: "crowned",
    title: "硬签夺冠",
    text:
      "有些冠军靠顺风签表，有些冠军必须一路撞开强队。Team gun 的三年里，那座最重要的奖杯显然不是轻松捡来的。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 里有很多能被反复暂停的画面：落后时的保枪，经济紧张时的半起，关键图里把对手默认读回来的那几次调整。{star_player_name} 的名字会被提到，但冠军不是一个人打出来的。\n\n" +
      "山重水复疑无路，柳暗花明又一村。一路上每一次被逼到墙边，最后都变成了队伍更清楚的答案。\n\n" +
      "这段征途的意义不在于它完美，而在于它真实。Team gun 确实站上过最高领奖台，也确实知道下一次再想站上去会更难。"
  },
  {
    id: "chronicle-crowned-young-core",
    tier: "crowned",
    title: "奖杯核心",
    text:
      "如果说 Team gun 这三年有什么最值得继续投资，那不是某一次漂亮比分，而是队伍里终于有人在大赛压力下长出来了。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 像一道分水岭。年轻人不再只是天赋，老将不再只是经验，指挥也不再只是赛前纸面上的角色。到了最后几张图，大家开始知道谁该冒险，谁该兜底，谁该把节奏拉回来。\n\n" +
      "少年辛苦终身事，莫向光阴惰寸功。冠军给了这批人一次证明，也给了你一个更难的问题：接下来是围绕这套骨架继续打磨，还是趁热补强去追更高的上限。\n\n" +
      "最重要的是，冠军记忆会改变队伍内部的语言。那些曾经需要反复解释的补枪、保枪和暂停选择，会因为一座奖杯变得更容易被相信；那些真正有效的羁绊，也不该被一时的转会冲动轻易拆掉。\n\n" +
      "无论如何，这三年已经让 Team gun 从一支拼凑出来的新队，变成了一支拥有冠军记忆的队伍。它还没有把胜利变成习惯，但已经知道胜利长什么样。"
  },
  {
    id: "chronicle-crowned-one-light",
    tier: "crowned",
    title: "一束光",
    text:
      "Team gun 的三年并不总是明亮。很多时候，训练室里的白板比舞台灯光更真实；很多时候，失败后的安静比胜利后的欢呼更接近这支队伍的日常。\n\n" +
      "可正因为如此，{best_cup_name} 的 {best_cup_result} 才显得更亮。那一站像一束光，把前面的混乱、争论、低迷和伤病都照出意义：它们没有白白发生，至少最后把队伍推到了一次冠军门前，并且推了进去。\n\n" +
      "千磨万击还坚劲，任尔东西南北风。冠军不是把所有问题抹掉，而是证明这支队伍在问题里仍然能赢。\n\n" +
      "这段结局不需要被拔得太高。它已经足够珍贵：Team gun 在三年里真正抓住过属于自己的光。"
  },
  {
    id: "chronicle-crowned-next-question",
    tier: "crowned",
    title: "下一问",
    text:
      "冠军会回答很多质疑，也会制造新的问题。Team gun 这三年最重要的收获，是他们终于从“能不能赢”走到了“怎样继续赢”。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 让队伍有了底气，可底气不是免死金牌。对手会剪你们的录像，年轻选手会被更多舆论包围，转会市场也会因为冠军而变得更贵、更复杂。\n\n" +
      "欲穷千里目，更上一层楼。站上去之后，才知道更高的地方风更硬。你已经把 Team gun 带到冠军线上，接下来所有选择都必须更谨慎。\n\n" +
      "三年结尾不是句号，更像一个问题：当所有人都知道你们赢过以后，你们还能不能把那份胜利变成更稳定的队伍气质。"
  },
  {
    id: "chronicle-contender",
    tier: "contender",
    title: "征途",
    text:
      "差一点，是竞技体育里最折磨人的词。Team gun 在这三年里不止一次站到山顶附近，却总在最后几级台阶上被迫停下。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 证明你们不是陪跑。对手会研究你们的开局，会尊重你们的明星位，也会在赛后承认这是一场硬仗。可奖杯没有因为尊重而落到你们手里，这也是比赛最冷的一面。\n\n" +
      "雄关漫道真如铁，而今迈步从头越。没有冠军不代表没有价值。你们留下的是一条清楚的成长曲线：从 {first_cup_name} 的 {first_cup_result}，到后来能和顶级队伍打到最后几张图。\n\n" +
      "这段征途没有加冕，但它不空。它证明 Team gun 有资格继续追问那个问题：下一次，能不能再往前一步。"
  },
  {
    id: "chronicle-contender-window",
    tier: "contender",
    title: "窗口期",
    text:
      "Team gun 没有捧杯，但这三年没有白走。能把强队拖进决赛或者最后几张图，本身就说明这支队伍已经拥有窗口期。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 是那扇窗开得最亮的一次。你们看见了奖杯，也看见了自己为什么还差一点：也许是地图池，也许是替补深度，也许是明星位和角色位还没有完全咬合。\n\n" +
      "窗口期最怕浪费。不是每支队伍都有机会反复接近山顶，也不是每个核心都能等到体系慢慢成熟。下一次选择转会、训练和首发时，必须记住这三年的机会成本。\n\n" +
      "没有冠军不等于失败，但它会逼你诚实：Team gun 已经接近过答案，接下来要做的是别让答案从手边溜走。"
  },
  {
    id: "chronicle-contender-rivalry",
    tier: "contender",
    title: "宿敌线",
    text:
      "三年里，Team gun 也许没有成为冠军队，却成为了很多强队必须认真准备的对手。这个身份来得不轻，它来自一次次四强、决赛和被对手研究后的反击。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 让这条宿敌线变得清楚。那不是单纯的好成绩，而是 Team gun 第一次真正逼迫强队拿出全部准备的时刻。\n\n" +
      "冠军没有到来，遗憾当然存在。但如果一支队伍能让对手在赛前会议里反复提到它的默认、它的明星位、它的暂停习惯，这段旅程就已经有重量。\n\n" +
      "下一次再相遇时，Team gun 不该只带着复仇心上场。更重要的是带着这三年积累下来的样本，去把宿敌线改写成冠军线。"
  },
  {
    id: "chronicle-contender-final-step",
    tier: "contender",
    title: "最后一级台阶",
    text:
      "三年里，Team gun 已经不止一次看见奖杯的轮廓。可竞技最折磨人的地方就在这里：看见，不等于拿到；接近，不等于完成。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 说明这支队伍有冲冠能力。你们能打进强队的舒适区，能逼出对手的暂停，也能让场馆相信这场比赛还有后文。\n\n" +
      "江东子弟多才俊，卷土重来未可知。没有捧杯会疼，但这份疼比空泛的掌声更有用。它会逼你回去看每一次回防、每一次保枪、每一次领先后没收住的地图。\n\n" +
      "这三年没有给出最终答案，却把问题问得足够清楚：Team gun 已经站在最后一级台阶前，下一次要学会把脚真正踩上去。"
  },
  {
    id: "chronicle-contender-map-gap",
    tier: "contender",
    title: "地图差距",
    text:
      "Team gun 不是没有天赋，也不是没有赢强队的办法。真正让奖杯溜走的，往往是地图池里那一两处不够硬的地方。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 把这件事照得很清楚：你们能在舒服图里打出压制，也能在某些回合靠个人能力续命，但系列赛越往后，短板越难藏。\n\n" +
      "不积跬步，无以至千里。三年的价值就在于，它给了你足够多的样本去判断下一步该补哪里。不是所有问题都需要换人，有些问题需要更细的地图准备和更稳定的默认。\n\n" +
      "没有奖杯的结尾不够圆满，但它不是空白。Team gun 已经知道自己离冠军差在哪里，这比盲目乐观更接近答案。"
  },
  {
    id: "chronicle-contender-core-proof",
    tier: "contender",
    title: "核心已成",
    text:
      "一支队伍最怕三年打完还不知道该围绕谁建队。Team gun 至少没有落到那一步。你们有过决赛线附近的硬仗，也有过让强队认真准备的夜晚。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 像一次核心筛选。谁能扛压力，谁需要被保护，谁在逆风里还愿意听指挥，这些答案都比单场比分更重要。\n\n" +
      "长风破浪会有时，直挂云帆济沧海。冠军还没到，但队伍骨架已经不是空的。下一次转会和训练，都应该围绕这套骨架继续打磨。\n\n" +
      "这段三年最遗憾的是没能捧杯，最值得庆幸的是它没有把方向打散。Team gun 还在路上，而且已经知道该往哪里走。"
  },
  {
    id: "chronicle-contender-pressure-lessons",
    tier: "contender",
    title: "压力教材",
    text:
      "强队比赛不会温柔地教人。它会在你最想赢的时候，把阵容、经济、地图池和临场判断全部摊开检查。\n\n" +
      "Team gun 这三年接受了很多这样的检查。{best_cup_name} 的 {best_cup_result} 是其中最重要的一次：它证明你们能承受压力，也证明压力下还有几处会变形。\n\n" +
      "雄关漫道真如铁，而今迈步从头越。没有冠军的三年也可以成为教材，只要你愿意把那些难看的失误留下来，而不是急着把它们删掉。\n\n" +
      "结尾不完美，但有分量。Team gun 没有拿走奖杯，却拿走了足够多能通往奖杯的经验。"
  },
  {
    id: "chronicle-contender-fan-memory",
    tier: "contender",
    title: "被记住的挑战者",
    text:
      "不是每支被记住的队伍都必须捧杯。有些队伍会因为他们怎样挑战强者、怎样在落后时追分、怎样把系列赛拖进最后几张图而被记住。\n\n" +
      "Team gun 这三年就是这样的挑战者。{best_cup_name} 的 {best_cup_result} 让观众记住了他们不是来陪跑的；即使最后没能把奖杯带走，也没人能把那几场硬仗说成侥幸。\n\n" +
      "莫听穿林打叶声，何妨吟啸且徐行。外界会用结果给你们下判断，但真正懂比赛的人会看见过程里的进步。\n\n" +
      "这段故事还差一个冠军结尾。可它已经足够让 Team gun 从普通名字变成强队赛前会议里必须被认真提到的对象。"
  },
  {
    id: "chronicle-contender-transfer-crossroad",
    tier: "contender",
    title: "十字路口",
    text:
      "三年接近过冠军，却没真正捧起奖杯，这种结局最容易把管理层推到十字路口。是继续相信原来的骨架，还是冒险换人追更高上限？\n\n" +
      "{best_cup_name} 的 {best_cup_result} 给不了简单答案，却给了足够多的线索。哪些位置在强队面前不够稳，哪些羁绊值得保留，哪些明星位需要更清楚的资源边界，都写在那一站里。\n\n" +
      "行到水穷处，坐看云起时。没有奖杯的遗憾会让人焦躁，但焦躁不是判断。真正的判断来自复盘和样本。\n\n" +
      "Team gun 这三年证明了自己有争冠窗口。下一步的每一个选择，都必须尊重这个窗口的重量。"
  },
  {
    id: "chronicle-grinder",
    tier: "grinder",
    title: "磨砺",
    text:
      "没有聚光灯，没有香槟，也没有被反复播放的捧杯镜头。Team gun 的三年更像一本训练日记：有涂改，有撕掉的战术页，也有几场让人舍不得关掉回放的硬仗。\n\n" +
      "{first_cup_name} 的 {first_cup_result} 给了这支新队伍第一记现实提醒。后来你们在 {best_cup_name} 打到 {best_cup_result}，那不是冠军，却足够证明这套项目并非没有方向。\n\n" +
      "千磨万击还坚劲，任尔东西南北风。磨砺最难的地方在于，它不一定立刻变成奖杯。它只会让你在下一次暂停时更冷静，在下一次转会时更谨慎，在下一次选择首发时更懂得代价。\n\n" +
      "这三年不是传奇，却值得保留。因为不是所有有价值的队伍，都必须以冠军作为唯一结尾。"
  },
  {
    id: "chronicle-grinder-notes",
    tier: "grinder",
    title: "训练笔记",
    text:
      "Team gun 的三年更像一本厚厚的训练笔记，而不是一本冠军相册。里面有被强队打穿的默认，有差点追上的系列赛，也有几次让人相信未来还没关门的回合。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 是其中最值得折角的一页。它不够圆满，却足够具体：你能从那里看见哪些位置能打硬仗，哪些决策还太嫩，哪些羁绊值得继续投资。\n\n" +
      "磨砺的价值不在于立刻变成奖杯，而在于它让下一次选择更清楚。预算怎么花，替补怎么用，休赛期事件怎么处理，都会因为这些失败变得更有依据。\n\n" +
      "这不是辉煌结局，但它不是空白。Team gun 至少留下了一条可以继续走的路。"
  },
  {
    id: "chronicle-grinder-respect",
    tier: "grinder",
    title: "被尊重的硬仗",
    text:
      "没有奖杯的三年也可能留下尊重。Team gun 没能把故事写成加冕，却在几次硬仗里证明自己不是随便被碾过去的队伍。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 最能说明这一点。那一站里，你们至少让对手感到麻烦，让观众看到抵抗，也让训练室拥有了能继续复盘的真实材料。\n\n" +
      "当然，尊重不能代替冠军。它只是说明这支队伍还有可打磨的骨架，而不是彻底失败的项目。下一次要做的，是把被尊重变成被畏惧。\n\n" +
      "三年结束时，Team gun 还没有站到最高处，但它已经不再只是名单上的名字。"
  },
  {
    id: "chronicle-grinder-seed",
    tier: "grinder",
    title: "种子",
    text:
      "有些三年不会立刻开花，只会把种子埋下去。Team gun 没有拿到奖杯，也没有稳定坐进决赛席，但这段路并不是白走。\n\n" +
      "{first_cup_name} 的 {first_cup_result} 像第一场冷雨，{best_cup_name} 的 {best_cup_result} 则像后来终于冒出来的一点绿。它们都不够圆满，却都说明队伍还在生长。\n\n" +
      "积土而为山，积水而为海。四强、硬仗、惜败、被研究后的调整，这些东西不会马上变成冠军，却会改变下一次建队时的眼光。\n\n" +
      "这段结尾不耀眼，但它有根。Team gun 至少留下了一批知道大赛压力是什么样的人。"
  },
  {
    id: "chronicle-grinder-role-lesson",
    tier: "grinder",
    title: "角色课",
    text:
      "Team gun 这三年最大的收获，可能不是某个名次，而是终于明白阵容不是五个高分选手的加法。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 把角色问题照得很清楚：缺突破手时进攻会钝，缺防守者时回防会乱，缺指挥时逆风局容易各打各的。输掉的那些图，都在提醒你阵容功能比纸面分更重要。\n\n" +
      "路漫漫其修远兮，吾将上下而求索。磨砺期的队伍最需要学会的是承认复杂，而不是用一句“换个明星”解决全部问题。\n\n" +
      "三年结束，奖杯没来，但 Team gun 至少学会了怎样更像一支队伍。"
  },
  {
    id: "chronicle-grinder-close-maps",
    tier: "grinder",
    title: "几张近图",
    text:
      "如果只看最终名次，这三年可能不够漂亮。但比赛不是只由名次组成的。Team gun 留下过几张很近的图，几次差点把强队拖进泥潭的夜晚。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 就属于这样的记忆。它没有变成冠军新闻，却让训练室有了很清楚的素材：哪里差一颗闪，哪里慢一次补防，哪里该保枪而不是硬送。\n\n" +
      "沉舟侧畔千帆过，病树前头万木春。近图输掉会疼，但它比被碾过去更能说明问题，也更能让下一次准备变得具体。\n\n" +
      "这不是成功故事，却是能继续写下去的故事。"
  },
  {
    id: "chronicle-grinder-budget-memory",
    tier: "grinder",
    title: "预算记忆",
    text:
      "三年经理生涯最现实的部分，往往藏在预算里。不是每次想补强都能买到答案，也不是每个贵选手都能让队伍马上变好。\n\n" +
      "Team gun 在 {best_cup_name} 打到 {best_cup_result}，已经说明这套阵容有过亮点。可那些早早出局的杯赛也提醒你：钱花在哪里，谁来替补，什么时候忍住不换人，都会决定队伍能不能继续往上爬。\n\n" +
      "千锤万凿出深山，烈火焚烧若等闲。磨队伍有时比买队伍更难，也更慢。\n\n" +
      "这三年没有给你完美回报，但它把经营的代价讲清楚了。下一次再建队，你会比第一天更懂得取舍。"
  },
  {
    id: "chronicle-grinder-training-room",
    tier: "grinder",
    title: "训练室灯光",
    text:
      "没有奖杯的三年，最常亮的不是舞台灯，而是训练室的灯。Team gun 的故事更多发生在复盘、跑图、争论和一次次重新分配角色的夜里。\n\n" +
      "{first_cup_name} 的 {first_cup_result} 让你们知道这条路不轻松，{best_cup_name} 的 {best_cup_result} 又让你们知道这条路并非走不通。\n\n" +
      "回首向来萧瑟处，也无风雨也无晴。等热度过去，真正留下来的往往是那些枯燥但有效的东西：更清楚的暂停，更少的无谓送人，更稳定的补枪路线。\n\n" +
      "这段三年没有被奖杯点亮，却被训练室一点点照亮。"
  },
  {
    id: "chronicle-grinder-honest-progress",
    tier: "grinder",
    title: "诚实进步",
    text:
      "Team gun 的三年不是一条直线上升的曲线。它有反复，有退步，有状态突然掉下去的杯赛，也有几次让人觉得终于找到方向的突破。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 是这条曲线上比较亮的一段。它说明队伍的努力不是完全没有回报，只是还不足以稳定换成奖杯。\n\n" +
      "不畏浮云遮望眼，只缘身在最高层。你们还没到最高层，但已经看见了云从哪里来，也知道哪些问题会在强队面前被放大。\n\n" +
      "这是一段诚实的进步史。它不够传奇，却很适合成为下一次重建的底稿。"
  },
  {
    id: "chronicle-heartbreak",
    tier: "heartbreak",
    title: "遗憾",
    text:
      "有些故事没有圆满结局。Team gun 的三年不是关于胜利的故事，而是关于一支队伍反复追问“为什么还没赢”的故事。\n\n" +
      "从 {first_cup_name} 的 {first_cup_result} 开始，很多问题就没有真正离开过训练室：默认慢半拍，残局太急，明星位和辅助位有时不在同一条线上。{best_cup_name} 的 {best_cup_result} 是这段旅程里最接近光的一次，可它仍然没能变成奖杯。\n\n" +
      "沉舟侧畔千帆过，病树前头万木春。竞技体育不会安慰失败者，但故事可以给努力留下位置。没有奖杯不等于没有意义，至少这些失利让你知道，一支队伍要赢，不只是买到更贵的名字。\n\n" +
      "这段结局有遗憾，也有尊严。Team gun 来过，打过，输过，然后一次次重新坐回训练室。对一支还在寻找答案的队伍来说，这已经不是空白。"
  },
  {
    id: "chronicle-heartbreak-rebuild",
    tier: "heartbreak",
    title: "重建前夜",
    text:
      "这三年没有给 Team gun 一个漂亮结尾。太多杯赛结束得很早，太多问题在下一站大赛前还没完全修好，太多希望最终只停在训练室的白板上。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 已经是这段旅程里最接近光的一次。它说明项目不是完全没有方向，也说明距离真正争冠还有很长一段路。\n\n" +
      "遗憾不是结论，它更像重建前夜的清单：哪些人值得留下，哪些位置必须补，哪些战术只是看起来热闹，哪些决策在压力下根本站不住。\n\n" +
      "如果未来还有下一轮，Team gun 不该从豪言开始，而该从这份清单开始。"
  },
  {
    id: "chronicle-heartbreak-honest",
    tier: "heartbreak",
    title: "诚实的失败",
    text:
      "有些失败不需要被修饰。Team gun 这三年没有走到预想中的高度，甚至很多时候连自己最想打出的样子都没有稳定打出来。\n\n" +
      "但诚实的失败仍然有价值。{first_cup_name} 的 {first_cup_result} 到 {best_cup_name} 的 {best_cup_result}，每一站都把问题照得更清楚：阵容、纪律、状态、经济和临场判断，没有哪一块可以靠口号绕过去。\n\n" +
      "竞技体育不会因为努力就发奖杯。可如果一支队伍能在失败后继续复盘、继续调整、继续承认问题，那么这段路至少没有浪费。\n\n" +
      "这不是加冕，也不是漂亮结尾。它是一段诚实的失败史，而诚实有时正是下一次重来的起点。"
  },
  {
    id: "chronicle-heartbreak-empty-bracket",
    tier: "heartbreak",
    title: "空白赛程",
    text:
      "三年结束，赛程表上没有属于 Team gun 的高光名次。八强出局太多，硬仗太少，很多准备还没来得及兑现，就已经被对手拆在第一轮。\n\n" +
      "{first_cup_name} 的 {first_cup_result} 像一个不太体面的开头，{best_cup_name} 的 {best_cup_result} 也没能把故事彻底扭回来。现实有时候就是这样：努力不一定马上换来奖杯，昂贵阵容也不一定自动变成强队。\n\n" +
      "山重水复疑无路，柳暗花明又一村。现在说希望会显得轻，但把失败记清楚并不轻。它会告诉你下一次不能再怎样建队。\n\n" +
      "这段结尾很冷，不过它至少留下了真实的错误清单。"
  },
  {
    id: "chronicle-heartbreak-fan-silence",
    tier: "heartbreak",
    title: "看台安静",
    text:
      "失败最刺耳的地方，有时不是嘘声，而是看台忽然安静下来。Team gun 这三年没能给粉丝足够多可以站起来的夜晚。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 是少数还能被拿出来回看的片段。除此之外，更多时候是开局被压、经济断档、残局处理太急，以及赛前准备被对手读到。\n\n" +
      "夜阑卧听风吹雨，铁马冰河入梦来。输掉的比赛不会自己变好看，但它们会在之后的每一次复盘里提醒你：职业赛场不接受想当然。\n\n" +
      "这三年没有圆满，可它并非毫无意义。至少下一次，Team gun 不能再用同样的方式沉默。"
  },
  {
    id: "chronicle-heartbreak-roster-warning",
    tier: "heartbreak",
    title: "阵容警讯",
    text:
      "Team gun 这三年给出的最明确提醒，是阵容不能只看价格和名气。有人数据好看，却不适合当前体系；有人需要时间，却一直被迫在错误位置上补洞。\n\n" +
      "从 {first_cup_name} 的 {first_cup_result} 到 {best_cup_name} 的 {best_cup_result}，问题反复出现：突破打不开，防守补不上，指挥声音不够稳，明星位和拼图位没有真正互相成全。\n\n" +
      "天生我材必有用，千金散尽还复来。每个选手都有价值，但经理的工作是把价值放在对的位置上。\n\n" +
      "这段三年很遗憾，却把一个道理讲得很清楚：没有结构的天赋，只会在强队面前散开。"
  },
  {
    id: "chronicle-heartbreak-bad-luck",
    tier: "heartbreak",
    title: "逆风年",
    text:
      "有些三年像一路逆风。状态起伏、伤病、舆论、签证、战术被读，Team gun 似乎总在还没站稳时就被迫处理新的麻烦。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 是这段逆风里相对能喘口气的一站，但它没能彻底改变走向。大多数时候，你们仍然在追赶，在补课，在为前一场失利收拾后果。\n\n" +
      "千锤万凿出深山，烈火焚烧若等闲。逆风不会自动把队伍打成强队，除非有人愿意把每一次不顺拆成具体改动。\n\n" +
      "三年结束，Team gun 没能翻过风口。可至少这段路让你知道，下一次不能只靠运气等风停。"
  },
  {
    id: "chronicle-heartbreak-lost-identity",
    tier: "heartbreak",
    title: "失去形状",
    text:
      "最让人难受的失败，不是输给强队，而是三年打完仍然说不清自己到底是什么队。Team gun 有时想打快，有时想打稳，有时又把希望全压在某个选手的临场手感上。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 是少数有形状的片段。可这还不够。真正稳定的强队需要清楚的风格、明确的角色和能在逆风局坚持下去的纪律。\n\n" +
      "路漫漫其修远兮，吾将上下而求索。失败不是终点，模糊才危险。只要还愿意重新定义队伍，就还有重建的可能。\n\n" +
      "这段三年没有给出身份答案，却把身份问题摆到了桌面中央。"
  },
  {
    id: "chronicle-heartbreak-small-fire",
    tier: "heartbreak",
    title: "遗憾火种",
    text:
      "即使是糟糕的三年，也不代表所有东西都熄灭了。Team gun 仍然有过几个能让人停下来的回合，几次年轻人不服输的反扑，几段看起来像未来雏形的配合。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 就是那点小火。它没有烧成奖杯，却说明队伍里并非只有失败和沉默。\n\n" +
      "沉舟侧畔千帆过，病树前头万木春。现在谈翻身还太早，但保留火种本身就是一种工作：留下该留下的人，承认该承认的问题，别再让错误重复发生。\n\n" +
      "这三年很痛，但小火未灭。只要它还在，故事就没有彻底写死。"
  },
  {
    id: "chronicle-heartbreak-cold-review",
    tier: "heartbreak",
    title: "冷复盘",
    text:
      "三年结束后，最需要的不是热血，而是冷复盘。Team gun 没有打出足够多的代表作，很多杯赛甚至还没进入真正的故事阶段就结束了。\n\n" +
      "{first_cup_name} 的 {first_cup_result} 和 {best_cup_name} 的 {best_cup_result} 摆在一起，能看见一些进步，也能看见更多没解决的问题：经济决策、地图池、位置功能、选手状态和临场判断。\n\n" +
      "竞技不会因为你认真就给你让路。可认真至少能让失败变得有用。把这三年当作冷复盘的材料，而不是当作自我安慰的故事，才是对队伍最负责的处理。\n\n" +
      "结尾不好看，但它足够清楚。清楚，有时就是重建的第一步。"
  },
  {
    id: "chronicle-heartbreak-unfinished",
    tier: "heartbreak",
    title: "未完成",
    text:
      "Team gun 的三年像一份没有写完的战术本。开头有想法，中间有涂改，最后却没有把任何一页真正写成冠军路线。\n\n" +
      "{best_cup_name} 的 {best_cup_result} 是其中比较完整的一页。那一站说明你们不是完全没有机会，可机会出现以后，队伍还缺少把它连续兑现的稳定性。\n\n" +
      "宝剑锋从磨砺出，梅花香自苦寒来。遗憾的是，这段磨砺还没磨到开刃的时刻。它留下了经验，也留下了很多未完成的工作。\n\n" +
      "这份战术本可以合上，但不该被丢掉。下一次重来，它会提醒你哪些地方不能再空着。"
  },
  {
    id: "chronicle-heartbreak-last-light",
    tier: "heartbreak",
    title: "最后灯光",
    text:
      "最后一场大赛结束时，灯光照在 Team gun 身上，却没有照出预想中的结局。三年过去，奖杯依然在别人手里，很多承诺也只停在了赛前采访里。\n\n" +
      "{first_cup_name} 的 {first_cup_result} 到 {best_cup_name} 的 {best_cup_result}，这条线并不漂亮，但它真实。真实意味着你能看见队伍在哪里被击穿，也能看见少数几个值得继续保留的片段。\n\n" +
      "回首向来萧瑟处，也无风雨也无晴。失败不会因为被写进总结就变轻，可总结能让它不白白发生。\n\n" +
      "这段三年没有圆满，只有最后灯光下的一次停顿。停顿之后，才有可能重新决定怎么走。"
  },
];

function hasDynastyDominance(campaign, { cupWins, majorWon, finalsCount }) {
  const records = campaign.cupRecords ?? [];
  if (cupWins < 4 || !majorWon || finalsCount < 6) return false;
  const seasons = new Map();
  for (const record of records) {
    const key = record.seasonIndex ?? 1;
    const current = seasons.get(key) ?? { wins: 0, finals: 0 };
    if (record.champion === PLAYER_TEAM) current.wins += 1;
    if (record.placement === "冠军" || record.placement === "亚军") current.finals += 1;
    seasons.set(key, current);
  }
  const dominantSeasons = [...seasons.values()].filter((season) => season.wins >= 2 || season.finals >= 3).length;
  return dominantSeasons >= 2;
}

function chronicleTier(campaign, { cupWins, majorWon, bestPlacement, finalsCount }) {
  if (hasDynastyDominance(campaign, { cupWins, majorWon, finalsCount })) return "legendary";
  if (cupWins >= 1) return "crowned";
  if (finalsCount >= 1 || bestPlacement <= 2) return "contender";
  if (bestPlacement <= 4) return "grinder";
  return "heartbreak";
}

function createChronicleVars(campaign, definingCup, bestPlacement) {
  const firstCup = campaign.cupRecords[0];
  const roster = (campaign.selected ?? []).map(playerById).filter(Boolean);
  const star = roster.sort((left, right) => right.firepower + right.clutch - (left.firepower + left.clutch))[0];
  const highlightMoment = campaign.cupRecords.find((record) => record.highlightMoment)?.highlightMoment;
  return {
    first_cup_name: firstCup?.cupName ?? "第一站杯赛",
    first_cup_result: firstCup?.placement ?? "未定",
    best_cup_name: definingCup?.cupName ?? "最接近突破的一站",
    best_cup_result: definingCup?.placement ?? (bestPlacement === 1 ? "冠军" : bestPlacement === 2 ? "亚军" : bestPlacement === 4 ? "四强" : "八强"),
    total_cups_won: String(campaign.cupRecords.filter((record) => record.champion === PLAYER_TEAM).length),
    star_player_name: star?.name ?? definingCup?.mvp?.name ?? "队内核心",
    highlight_moment: highlightMoment ?? "有些回合没有被写成数据，但队员会记得那些混烟、补闪和残局里活下来的几秒。",
  };
}

function chronicleCupYear(record) {
  const cupMeta = CUPS[record.cupIndex] ?? CUPS.find((cup) => cup.name === record.cupName);
  return (cupMeta?.yearBase ?? 2027) + (record.seasonIndex ?? 1) - 1;
}

function chronicleMomentTitle(record, isDynasty) {
  if (record.placement === "冠军" && isDynasty) return "王朝落成";
  if (record.placement === "冠军") return "第一座奖杯";
  if (record.placement === "亚军") return "绝地追分";
  if (record.placement === "四强") return "硬仗留痕";
  return "低谷里的亮点";
}

function chronicleFallbackMoment(record, index) {
  const mvpName = record.mvp?.name ?? "队内核心";
  const fallbackPool = {
    "冠军": [
      `${mvpName} 没把这一站打成单纯的个人秀。真正被记住的是决赛后半段，Team gun 在被对手追分时还能把默认控图、补枪和残局处理连在一起，奖杯就是从这些细节里抢回来的。`,
      `${record.cupName} 的最后一张图没有靠运气收尾。Team gun 把前面暴露过的问题一段段补上，暂停后的节奏更清楚，道具也终于砸在对手最难受的位置。`,
    ],
    "亚军": [
      `${mvpName} 把 Team gun 一路拖进决赛。虽然最后没能捧杯，但那几张图让对手明白：这不是一支只会靠明星位爆种的队伍，他们已经能把强队逼到必须认真回应。`,
      `这站最难忘的不是失利，而是 Team gun 在落后时仍然能追回比分。每一次转点、每一次保枪后的再起，都像在告诉观众：他们还没有被打散。`,
    ],
    "四强": [
      `${record.cupName} 留下的是一份很硬的训练笔记。Team gun 还没走到决赛，但他们已经在强队面前打出几段能反复复盘的回合：哪里该补闪，哪里该收缩，哪里该相信指挥。`,
      `四强不是终点，却是 Team gun 第一次真正坐上强队牌桌。那一站以后，对手开始研究他们的默认，粉丝也开始相信这支新队伍不是短暂热闹。`,
    ],
    "八强": [
      `${record.cupName} 的出局很痛，但低谷里也有能留下来的东西。至少有几次残局和保枪后的反扑说明，这支队伍不是没有火种，只是还没学会把火烧完整。`,
      `这站没有漂亮名次，只有一堆必须面对的问题。可正因为输得够清楚，Team gun 后来才知道该从哪里改：阵容、节奏、语音和关键局的耐心。`,
    ],
  };
  const pool = fallbackPool[record.placement] ?? fallbackPool["八强"];
  return pool[index % pool.length];
}

function buildChronicleHighlightMoments(campaign, isDynasty, limit = 3) {
  const records = campaign.cupRecords ?? [];
  const moments = [];
  const usedKeys = new Set();
  const addMoment = (record, text, sourceIndex) => {
    if (!record || !text || moments.length >= limit) return;
    const key = `${record.seasonIndex}-${record.cupName}-${text}`;
    if (usedKeys.has(key)) return;
    usedKeys.add(key);
    moments.push({
      id: `moment-${record.seasonIndex}-${record.cupName}-${sourceIndex}`.replaceAll(/\s+/g, "-").toLowerCase(),
      label: `S${record.seasonIndex ?? 1} / ${chronicleCupYear(record)} · ${record.cupName}`,
      title: chronicleMomentTitle(record, isDynasty),
      text,
      placement: record.placement,
    });
  };

  records.forEach((record, index) => addMoment(record, record.highlightMoment, index));
  const rankedRecords = [...records].sort((left, right) => {
    const rankGap = placementRank(left.placement) - placementRank(right.placement);
    if (rankGap) return rankGap;
    return (right.seasonIndex ?? 1) - (left.seasonIndex ?? 1);
  });
  rankedRecords.forEach((record, index) => addMoment(record, chronicleFallbackMoment(record, index), `fallback-${index}`));
  if (!moments.length) {
    addMoment(
      { seasonIndex: 1, cupIndex: 0, cupName: "第一站杯赛", placement: "八强", mvp: { name: "队内核心" } },
      "三年里没有某一个回合能概括全部，但那些混烟、补闪、绕后和残局里的选择，仍然组成了 Team gun 的真实履历。",
      "empty",
    );
  }
  return moments;
}

const definingCupWhyPool = [
  {
    id: "defining-dynasty",
    placements: ["冠军"],
    dynastyOnly: true,
    title: "王朝落成",
    text: "{cup_label} 是 Team gun 王朝落成的一站。在这之前，人们说他们有上限；在这之后，人们开始讨论他们的统治力。关键不只是赢了，而是他们在不同版本、不同对手和不同压力下仍然能把比赛带进自己的节奏。",
  },
  {
    id: "defining-first-cup",
    placements: ["冠军"],
    maxCupWins: 1,
    title: "第一座奖杯",
    text: "{cup_label} 之所以关键，是因为它把“有潜力”变成了“真的赢过”。这座奖杯让 Team gun 第一次拥有被强队正视的资格，也让后面的转会、磨合和信任都有了落脚点。",
  },
  {
    id: "defining-breakthrough",
    placements: ["冠军", "亚军"],
    title: "首次突破",
    text: "{cup_label} 是 Team gun 从黑马走向竞争者的转折点。那一站之后，没人还能只把他们当成一支拼枪队，因为他们已经证明自己能在长局、暂停和残局压力里跟顶级队伍拉扯。",
  },
  {
    id: "defining-comeback",
    placements: ["亚军"],
    title: "绝地翻盘",
    text: "{cup_label} 最值得记住的不是最后差一步，而是 Team gun 曾经从落后里把系列赛重新打回来。那种追分能力说明队伍没有一逆风就散，后来的每一次冲冠都能从这里找到起点。",
  },
  {
    id: "defining-rivalry",
    placements: ["冠军", "亚军", "四强"],
    title: "宿敌成形",
    text: "{cup_label} 让 Team gun 真正有了被针对的身份。对手开始研究他们的开局，解说开始讨论他们的地图池，粉丝也开始把这场硬仗当成三年故事里最有分量的参照物。",
  },
  {
    id: "defining-grind",
    placements: ["四强", "八强"],
    title: "磨砺之路",
    text: "{cup_label} 没有给 Team gun 奖杯，却给了他们最清楚的问题清单。哪张图守不住，哪种节奏会被读，哪名选手需要保护到舒服位置，这些答案比一场漂亮但空泛的胜利更关键。",
  },
];

function pickDefiningCupWhy(campaign, definingCup, cupWins, isDynasty) {
  if (!definingCup) {
    return {
      id: "defining-none",
      title: "继续寻找答案",
      text: "这三年没有某一站能单独概括全部。真正关键的是 Team gun 一次次被打回训练室，又一次次把问题带回下一场大赛。",
    };
  }
  const eligible = definingCupWhyPool.filter((entry) => {
    if (!entry.placements.includes(definingCup.placement)) return false;
    if (entry.dynastyOnly && !isDynasty) return false;
    if (entry.minCupWins && cupWins < entry.minCupWins) return false;
    if (entry.maxCupWins && cupWins > entry.maxCupWins) return false;
    return true;
  });
  const pool = eligible.length ? eligible : definingCupWhyPool.filter((entry) => entry.placements.includes(definingCup.placement));
  const picked = pickFreshText(pool.length ? pool : definingCupWhyPool, cupWins * 29 + placementRank(definingCup.placement) + (definingCup.seasonIndex ?? 1), campaign.textHistory, "chronicle");
  const cupLabel = `S${definingCup.seasonIndex ?? 1} / ${chronicleCupYear(definingCup)} · ${definingCup.cupName}`;
  return {
    id: picked.id,
    title: picked.title,
    text: fillSummaryVariables(picked.text, {
      cup_label: cupLabel,
      cupName: definingCup.cupName,
      placement_name: definingCup.placement,
      star_name: definingCup.mvp?.name ?? "队内核心",
    }),
  };
}

function createChronicle(campaign) {
  const cupWins = campaign.cupRecords.filter((record) => record.champion === PLAYER_TEAM).length;
  const finalsCount = campaign.cupRecords.filter((record) => record.placement === "冠军" || record.placement === "亚军").length;
  const bestPlacement = Math.min(...campaign.cupRecords.map((record) => placementRank(record.placement)));
  const definingCup = [...campaign.cupRecords].sort((left, right) => {
    const rankValue = (entry) => (entry.placement === "冠军" ? 4 : entry.placement === "亚军" ? 3 : entry.placement === "四强" ? 2 : 1);
    return rankValue(right) - rankValue(left);
  })[0];
  const majorWon = campaign.cupRecords.some((record) => record.cupName.toLowerCase().includes("major") && record.champion === PLAYER_TEAM);
  const isDynasty = hasDynastyDominance(campaign, { cupWins, majorWon, finalsCount });
  const tier = chronicleTier(campaign, { cupWins, majorWon, bestPlacement, finalsCount });
  const epilogueEntry = pickFreshText(
    chronicleEpiloguePool.filter((entry) => entry.tier === tier),
    cupWins * 13 + finalsCount * 5 + bestPlacement,
    campaign.textHistory,
    "chronicle",
  );
  const epilogue = fillSummaryVariables(epilogueEntry.text, createChronicleVars(campaign, definingCup, bestPlacement));
  const highlightMoments = buildChronicleHighlightMoments(campaign, isDynasty);
  const highlightMoment = highlightMoments[0]?.text
    ?? "三年里没有某一个回合能概括全部，但那些混烟、补闪、绕后和残局里的选择，仍然组成了 Team gun 的真实履历。";
  const definingCupWhy = pickDefiningCupWhy(campaign, definingCup, cupWins, isDynasty);
  const tone = isDynasty
    ? "三年打完，Team gun 已经用 Major、连续决赛和多座奖杯证明了自己的统治力。"
    : cupWins >= 1
      ? "你们最后还是把奖杯拿到了。哪怕只有一次，这三年也算真正打出了结果。"
      : bestPlacement <= 2
        ? "你们离冠军真的只差过最后几步。虽然没能捧杯，但这支队伍已经有能力跟顶级强队掰手腕。"
        : "三年走完，奖杯还没来，不过这一路的坑你都踩过、也都扛过了。队没白修，路也没白走。";
  return {
    cupWins,
    finalsCount,
    bestPlacement,
    definingCup,
    tone,
    epilogueTitle: epilogueEntry.title,
    epilogue,
    epilogueId: epilogueEntry.id,
    highlightMoment,
    highlightMoments,
    definingCupWhy,
    cups: campaign.cupRecords,
    seasons: campaign.seasonRecords,
  };
}

function createBetweenCupEvent(campaign) {
  const event = buildHubEvent(campaign);
  const nextCupName = currentCupMeta(campaign).name === "CS Major" ? "年度结算" : CUPS[campaign.cupIndex + 1].name;
  return {
    ...event,
    passive: `${event.passive ?? ""} 下一站：${nextCupName}。`.trim(),
  };
}

function createBetweenCupEvents(campaign) {
  const nextCupName = currentCupMeta(campaign).name === "CS Major" ? "年度结算" : CUPS[campaign.cupIndex + 1].name;
  return buildHubEvents(campaign).map((event) => ({
    ...event,
    passive: `${event.passive ?? ""} 下一站：${nextCupName}。`.trim(),
  }));
}

function createHubFromEvents(baseHub, events, tradeOffers) {
  const current = events[0];
  return {
    ...createEmptyHub(),
    ...baseHub,
    events,
    eventIndex: 0,
    event: current,
    passive: current?.passive ?? "",
    choice: undefined,
    result: "",
    delta: "",
    resolvedEvents: [],
    allEventsResolved: events.length === 0,
    tradeOffers,
    tradeAttemptUsed: false,
    tradeResult: undefined,
    tradeSelection: {
      outgoingId: undefined,
      targetId: undefined,
    },
  };
}

function advanceAfterCup(state) {
  const campaign = { ...state.campaign };
  const justFinishedMajor = campaign.cupIndex === CUPS.length - 1;
  if (!justFinishedMajor) {
    const events = createBetweenCupEvents(campaign);
    const tradeOffers = createTradeCandidates(state, campaign);
    return {
      ...state,
      screen: "between-cups",
      annualSummary: undefined,
      campaign,
      hub: createHubFromEvents(state.hub, events, tradeOffers),
    };
  }
  const annualSummary = createAnnualSummary(campaign);
  campaign.nextSeasonModifiers = { ...annualSummary.nextSeasonModifiers };
  campaign.textHistory = appendTextHistory(
    appendTextHistory(
      appendTextHistory(
        appendTextHistory(campaign.textHistory, "annual", annualSummary.managerMessageId),
        "annual",
        annualSummary.playerOfYearLineId,
      ),
      "annual",
      annualSummary.collapseReviewId,
    ),
    "annual",
    annualSummary.seasonQuoteId,
  );
  campaign.seasonRecords = [...campaign.seasonRecords, annualSummary];
  return {
    ...state,
    screen: "annual-awards",
    annualSummary,
    campaign,
  };
}

function startNextCup(state) {
  const campaign = { ...state.campaign };
  campaign.cupIndex += 1;
  campaign.currentBracket = createCupBracket(state, campaign);
  return {
    ...state,
    screen: "bracket",
    result: undefined,
    annualSummary: undefined,
    hub: createEmptyHub(),
    campaign,
    match: createEmptyMatch(),
  };
}

function startNextSeason(state) {
  const campaign = { ...state.campaign };
  if (campaign.seasonIndex >= CAMPAIGN_SEASONS) {
    const chronicle = createChronicle(campaign);
    campaign.textHistory = appendTextHistory(campaign.textHistory, "chronicle", chronicle.epilogueId);
    return {
      ...state,
      screen: "chronicle",
      chronicle,
      annualSummary: undefined,
      campaign,
    };
  }
  campaign.seasonIndex += 1;
  campaign.cupIndex = 0;
  campaign.modifiers = {
    firepower: campaign.nextSeasonModifiers?.firepower ?? 0,
    tacticalExecution: campaign.nextSeasonModifiers?.tacticalExecution ?? 0,
    cohesion: campaign.nextSeasonModifiers?.cohesion ?? 0,
    discipline: campaign.nextSeasonModifiers?.discipline ?? 0,
  };
  campaign.nextSeasonModifiers = undefined;
  campaign.currentBracket = createCupBracket(state, campaign);
  return {
    ...state,
    screen: "bracket",
    annualSummary: undefined,
    result: undefined,
    hub: createEmptyHub(),
    match: createEmptyMatch(),
    campaign,
  };
}

function resolveCurrentCard(state, choiceId) {
  const card = materializeMatchCard(state, state.match.cards[state.match.eventIndex]);
  if (!card) return state;
  const autoChoiceId = state.match.hidden?.controlLocked && card.options?.length && !choiceId
    ? card.options[(state.match.eventIndex + (state.match.hidden.seed ?? 0)) % card.options.length].id
    : choiceId;
  const option = card.options?.find((entry) => entry.id === autoChoiceId);
  let rawResolved = card.type === "map_result"
    ? resolveMapResultCard(state, card)
    : {
      mapIndex: card.mapIndex,
      title: card.title,
      text: card.text,
      prompt: card.prompt,
      choice: option?.label,
      result: option?.result ?? card.result,
      delta: option?.delta ?? card.delta,
      score: option?.score ?? card.score ?? [0, 0],
      playerDelta: option?.playerDelta ?? card.playerDelta ?? {},
      opponentDelta: option?.opponentDelta ?? card.opponentDelta ?? {},
      kind: card.kind,
      highlightMoment: card.highlightMoment,
      highlightPlayerId: card.highlightPlayerId,
      highlightPlayerName: card.highlightPlayerName,
      highlightTeamId: card.highlightTeamId,
      highlightTeamName: card.highlightTeamName,
      hiddenSwing: option?.hiddenSwing ?? card.hiddenSwing ?? 0,
    };
  const isEconomyChoice = (card.title.includes("经济微调") || card.title.includes("怎么花钱")) && autoChoiceId;
  const ecoAtEliminationRisk = isEconomyChoice && autoChoiceId === "force_setup" && state.match.score[0] === 0 && state.match.score[1] === 2;
  if (ecoAtEliminationRisk) {
    rawResolved = {
      ...rawResolved,
      text: "第 3 局开始时，你们已经 0-2 落后。钱不够打完整长枪局，强行硬拼会把正面胜率想得太乐观；eco 不起，就是承认装备差距，把这一局变成偷枪、叠点和混烟的低概率求生。",
      result: "你选择不硬赌，只拿基础手枪和少量道具出门。0-2 赛点下这不是为了下一局铺路，而是承认本局火力劣势，赌一次偷枪、叠点和混烟的低概率翻盘。",
      delta: "eco · 本局胜率很低 · 输掉即出局",
    };
  }
  const resolved = normalizeRoundDeathDeltas(state.match, enrichExchangeDeltas(state.match, rawResolved));
  const score = [
    clamp(state.match.score[0] + resolved.score[0], 0, 3),
    clamp(state.match.score[1] + resolved.score[1], 0, 3),
  ];
  const hidden = { ...state.match.hidden };
  hidden.mapBonuses = { ...(hidden.mapBonuses ?? {}) };
  hidden.seriesPlan = { ...(hidden.seriesPlan ?? { closeBonus: 0, deciderBonus: 0 }) };
  if (autoChoiceId) hidden.choiceSalt = (hidden.choiceSalt ?? 0) + hashChoiceId(autoChoiceId);
  const playerEconomy = { ...state.match.playerEconomy };
  const opponentEconomy = { ...state.match.opponentEconomy };
  if (card.title.includes("手枪局购买") && autoChoiceId) {
    hidden.pistolChoice = autoChoiceId;
    hidden.openingChoice = autoChoiceId;
    playerEconomy.tier = "pistol";
    if (autoChoiceId === "pistol_deagle") hidden.mapBonuses[1] = (hidden.mapBonuses[1] ?? 0) - 1;
    if (autoChoiceId === "pistol_save") hidden.mapBonuses[1] = (hidden.mapBonuses[1] ?? 0) + 2;
    if (autoChoiceId === "pistol_deagle") hidden.seriesPlan.deciderBonus -= 2;
    if (autoChoiceId === "pistol_utility") hidden.seriesPlan.closeBonus += 1;
  }
  if (card.title.includes("开局战术") && autoChoiceId) {
    hidden.tacticChoice = autoChoiceId;
    hidden.tacticEdge = tacticEdgeForChoice(
      autoChoiceId,
      hidden.opponentPlan,
      state.match.readPressure,
      state.match.scoutingChoice,
      hidden.continuityBonus,
      { ...(hidden.prematchIntel ?? {}), scoutingPlan: hidden.scoutingPlan },
    );
    if (autoChoiceId === "rush") hidden.mapBonuses[2] = (hidden.mapBonuses[2] ?? 0) - 2;
    if (autoChoiceId === "default") {
      hidden.mapBonuses[2] = (hidden.mapBonuses[2] ?? 0) + 1;
      hidden.mapBonuses[3] = (hidden.mapBonuses[3] ?? 0) + 2;
    }
    if (autoChoiceId === "lurk") hidden.mapBonuses[3] = (hidden.mapBonuses[3] ?? 0) + 2;
    if (autoChoiceId === "fake") hidden.mapBonuses[3] = (hidden.mapBonuses[3] ?? 0) - 1;
    if (autoChoiceId === "default") hidden.seriesPlan.closeBonus += 2;
    if (autoChoiceId === "rush") hidden.seriesPlan.deciderBonus -= 1;
    if (autoChoiceId === "lurk") hidden.seriesPlan.deciderBonus += 1;
  }
  if (isEconomyChoice) {
    hidden.economyChoice = autoChoiceId;
    hidden.mapBonuses[card.mapIndex] = autoChoiceId === "full_setup" ? 1 : autoChoiceId === "lean_setup" ? 0 : ecoAtEliminationRisk ? -8 : -5;
    if (autoChoiceId === "force_setup") hidden.mapBonuses[3] = (hidden.mapBonuses[3] ?? 0) + 2;
    if (autoChoiceId === "full_setup") hidden.mapBonuses[3] = (hidden.mapBonuses[3] ?? 0) - 1;
    if (autoChoiceId === "lean_setup") hidden.mapBonuses[4] = (hidden.mapBonuses[4] ?? 0) + 1;
    if (autoChoiceId === "full_setup") hidden.seriesPlan.closeBonus -= 1;
    if (autoChoiceId === "force_setup") {
      hidden.seriesPlan.closeBonus -= ecoAtEliminationRisk ? 5 : 2;
      hidden.seriesPlan.deciderBonus += 2;
    }
    if (autoChoiceId === "lean_setup") hidden.seriesPlan.deciderBonus += 1;
    playerEconomy.tier = autoChoiceId === "force_setup" ? "eco" : autoChoiceId === "lean_setup" ? "half_buy" : "full_buy";
  }
  if (card.usesTimeout && autoChoiceId) {
    hidden.timeoutChoice = autoChoiceId;
    hidden.timeoutBonus = autoChoiceId === "tactical-reset" ? 6 : autoChoiceId === "discipline-reset" ? 5 : 4;
    if (autoChoiceId === "tactical-reset") hidden.mapBonuses[3] = (hidden.mapBonuses[3] ?? 0) + 1;
    if (autoChoiceId === "emotional-reset") hidden.mapBonuses[4] = (hidden.mapBonuses[4] ?? 0) + 2;
    if (autoChoiceId === "discipline-reset") hidden.mapBonuses[4] = (hidden.mapBonuses[4] ?? 0) + 1;
    if (autoChoiceId === "tactical-reset") hidden.seriesPlan.closeBonus += 1;
    if (autoChoiceId === "emotional-reset") hidden.seriesPlan.deciderBonus += 1;
    if (autoChoiceId === "discipline-reset") hidden.seriesPlan.deciderBonus += 2;
  }
  hidden.eventSwing += (resolved.score[0] - resolved.score[1]) * 2 + (resolved.hiddenSwing ?? 0);
  const nextCards = applyEconomyChoiceContext(
    applyOpeningTacticContext(
      applyPistolChoiceContext(state.match.cards, autoChoiceId),
      autoChoiceId,
      hidden,
      teamStats(selectedPlayers(state), state.substitute, {
        ...(state.campaign.modifiers ?? {}),
        continuityBonus: hidden.continuityBonus ?? 0,
        playerForm: state.campaign.playerForm ?? {},
        rosterFriction: state.campaign.rosterFriction ?? 0,
      }),
      state.match.opponentTeam,
    ),
    autoChoiceId,
    state.match.score,
  );
  const nextMatch = {
    ...state.match,
    score,
    timeoutUsed: state.match.timeoutUsed || Boolean(card.usesTimeout),
    eventIndex: state.match.eventIndex + 1,
    cards: nextCards,
    resolved: [...state.match.resolved, resolved],
    playerStats: applyPlayerDelta(state.match.playerStats, formAdjustedDelta(state.match.playerStats, resolved.playerDelta)),
    opponentStats: applyNamedDelta(state.match.opponentStats, resolved.opponentDelta),
    hidden,
    playerEconomy,
    opponentEconomy,
  };
  const campaignAfterHighlight = appendHighlightLog(state.campaign, resolved, nextMatch);
  const seriesFinished = nextMatch.score[0] === 3 || nextMatch.score[1] === 3;
  if (seriesFinished) {
    const afterRound = updateBracketAfterRound({ ...state, campaign: campaignAfterHighlight, match: nextMatch });
    const cupFinished = afterRound.cupFinished;
    const campaign = afterRound.campaign;
    if (!cupFinished) {
      return {
        ...state,
        screen: "bracket",
        campaign,
        match: createEmptyMatch(),
        error: "",
      };
    }
    const result = createCupResult({ ...state, campaign, match: nextMatch }, campaign);
    const updatedCampaign = {
      ...campaign,
      trophies: campaign.trophies + (result.champion === PLAYER_TEAM ? 1 : 0),
      budget: (campaign.budget ?? 0) + result.prize,
      textHistory: appendTextHistory(campaign.textHistory, "cup", result.encouragementId),
      cupRecords: [...campaign.cupRecords, { ...result, seasonIndex: campaign.seasonIndex, cupIndex: campaign.cupIndex }],
    };
    return {
      ...state,
      screen: "awards",
      campaign: updatedCampaign,
      result,
      match: createEmptyMatch(),
      error: "",
    };
  }
  if (nextMatch.eventIndex < nextMatch.cards.length) return { ...state, campaign: campaignAfterHighlight, match: nextMatch, error: "" };

  const afterRound = updateBracketAfterRound({ ...state, campaign: campaignAfterHighlight, match: nextMatch });
  const cupFinished = afterRound.cupFinished;
  const campaign = afterRound.campaign;
  if (!cupFinished) {
    return {
      ...state,
      screen: "bracket",
      campaign,
      match: createEmptyMatch(),
      error: "",
    };
  }

  const result = createCupResult({ ...state, match: nextMatch }, campaign);
  campaign.textHistory = appendTextHistory(campaign.textHistory, "cup", result.encouragementId);
  campaign.cupRecords = [...campaign.cupRecords, {
    ...result,
    seasonIndex: campaign.seasonIndex,
    cupIndex: campaign.cupIndex,
  }];
  campaign.trophies = campaign.cupRecords.filter((record) => record.champion === PLAYER_TEAM).length;
  return {
    ...state,
    screen: "awards",
    campaign,
    match: nextMatch,
    result,
    error: "",
  };
}

function applyAction(state, action) {
  if (action.type === "toggle") {
    const selected = state.selected.includes(action.player)
      ? state.selected.filter((id) => id !== action.player)
      : state.selected.length < 6 ? [...state.selected, action.player] : state.selected;
    const substitute = selected.includes(state.substitute) ? state.substitute : selected[5];
    return { ...state, selected, substitute, error: "" };
  }
  if (action.type === "draftRoleFilter") {
    const validRoles = new Set(draftRoleFilters.map((filter) => filter.id));
    const role = validRoles.has(action.role) ? action.role : "all";
    return { ...state, draftRoleFilter: role, error: "" };
  }
  if (action.type === "substitute") {
    if (!state.selected.includes(action.player)) return state;
    if (state.campaign?.forcedSubstitute && action.player !== state.campaign.forcedSubstitute) {
      return { ...state, error: "本场有选手受伤或硬性缺席，无法把他切回首发。" };
    }
    return { ...state, substitute: action.player, error: "" };
  }
  if (action.type === "confirm") {
    if (state.selected.length !== 6) return { ...state, error: "请选择 6 名选手，其中 5 名首发、1 名替补。" };
    if (new Set(state.selected).size !== 6) return { ...state, error: "阵容中不能有重复选手。" };
    if (rosterPrice(state.selected) > STARTING_BUDGET) return { ...state, error: "阵容已超出预算，请降低身价后再确认。" };
    const baseState = { ...state, substitute: state.substitute ?? state.selected[5], error: "" };
    const campaign = createCampaign(baseState);
    return { ...baseState, campaign, screen: "bracket" };
  }
  if (action.type === "play") {
    if (state.screen !== "bracket") return { ...state, error: "请先确认阵容。" };
    return { ...state, screen: "prematch", error: "" };
  }
  if (action.type === "prematchChoice") return createPrematchState(state, action.choice);
  if (action.type === "decision") return resolveCurrentCard(state, action.choice);
  if (action.type === "nextEvent") return resolveCurrentCard(state);
  if (action.type === "hubChoice") {
    if (!state.hub.event) return state;
    const choice = state.hub.event.options.find((entry) => entry.id === action.choice);
    if (!choice) return state;
    const currentEvent = state.hub.event;
    const campaign = {
      ...state.campaign,
      modifiers: { ...state.campaign.modifiers },
      eventHistory: appendEventHistory(state.campaign.eventHistory, "betweenCup", currentEvent.id),
    };
    campaign.modifiers.firepower += choice.effect.firepower ?? 0;
    campaign.modifiers.tacticalExecution += choice.effect.tacticalExecution ?? 0;
    campaign.modifiers.cohesion += choice.effect.cohesion ?? 0;
    campaign.modifiers.discipline += choice.effect.discipline ?? 0;
    campaign.rosterFriction = recoverRosterFriction(campaign.rosterFriction, choice.effect.cohesion >= 2 || choice.effect.tacticalExecution >= 2 ? 2 : 1);
    campaign.playerForm = applyEventFormEffect(
      campaign.playerForm,
      state.selected,
      choice.effect,
      createMatchSeed(campaign, currentEvent.id.length + (state.hub.eventIndex ?? 0) * 31),
    );
    const resolvedEntry = {
      eventId: currentEvent.id,
      title: currentEvent.title,
      choice: choice.label,
      result: choice.result,
      delta: choice.delta,
      tone: classifyDeltaTone(choice.delta || choice.result),
    };
    const events = state.hub.events?.length ? state.hub.events : [currentEvent];
    const nextIndex = (state.hub.eventIndex ?? 0) + 1;
    const nextEvent = events[nextIndex];
    return {
      ...state,
      campaign,
      hub: {
        ...state.hub,
        events,
        eventIndex: nextEvent ? nextIndex : state.hub.eventIndex ?? 0,
        event: nextEvent ?? currentEvent,
        passive: nextEvent?.passive ?? state.hub.passive,
        choice: nextEvent ? undefined : choice.label,
        result: nextEvent ? "" : choice.result,
        delta: nextEvent ? "" : choice.delta,
        resolvedEvents: [...(state.hub.resolvedEvents ?? []), resolvedEntry],
        allEventsResolved: !nextEvent,
      },
    };
  }
  if (action.type === "tradePickOutgoing") {
    const offer = getTradePackage(state, state.campaign, action.playerId, state.hub.tradeSelection?.targetId);
    const range = offer ? tradeBidRange(state, offer) : undefined;
    return {
      ...state,
      hub: {
        ...state.hub,
        tradeSelection: {
          ...state.hub.tradeSelection,
          outgoingId: action.playerId,
          targetId: state.hub.tradeSelection?.targetId,
          cashOffer: range?.current,
        },
      },
      error: "",
    };
  }
  if (action.type === "tradePickTarget") {
    const offer = getTradePackage(state, state.campaign, state.hub.tradeSelection?.outgoingId, action.playerId);
    const range = offer ? tradeBidRange(state, offer) : undefined;
    return {
      ...state,
      hub: {
        ...state.hub,
        tradeSelection: {
          ...state.hub.tradeSelection,
          outgoingId: state.hub.tradeSelection?.outgoingId,
          targetId: action.playerId,
          cashOffer: range?.current,
        },
      },
      error: "",
    };
  }
  if (action.type === "tradeFilterOutgoing" || action.type === "tradeFilterTarget") {
    const validRoles = new Set(draftRoleFilters.map((filter) => filter.id));
    const role = validRoles.has(action.role) ? action.role : "all";
    return {
      ...state,
      hub: {
        ...state.hub,
        tradeSelection: {
          ...state.hub.tradeSelection,
          ...(action.type === "tradeFilterOutgoing" ? { outgoingRoleFilter: role } : { targetRoleFilter: role }),
        },
      },
      error: "",
    };
  }
  if (action.type === "tradeBid") {
    const offer = getTradePackage(state, state.campaign, state.hub.tradeSelection?.outgoingId, state.hub.tradeSelection?.targetId);
    const range = offer ? tradeBidRange(state, offer) : { min: 0, max: state.campaign?.budget ?? 0 };
    return {
      ...state,
      hub: {
        ...state.hub,
        tradeSelection: {
          ...state.hub.tradeSelection,
          cashOffer: clamp(Number(action.cash ?? 0), range.min, range.max),
        },
      },
      error: "",
    };
  }
  if (action.type === "tradeAttempt") {
    return applyTradeAttempt(state, state.hub.tradeSelection?.outgoingId, state.hub.tradeSelection?.targetId);
  }
  if (action.type === "offseasonChoice") {
    if (state.screen !== "annual-awards" || !state.annualSummary) return state;
    const summary = state.annualSummary;
    const events = summary.offseasonEvents ?? [];
    const currentIndex = summary.offseasonEventIndex ?? 0;
    const event = events[currentIndex];
    const choice = event?.options?.find((entry) => entry.id === action.choice);
    if (!event || !choice) return state;
    const resolvedEntry = {
      eventId: event.id,
      title: event.title,
      narrative: event.narrative,
      choice: choice.label,
      result: choice.result,
      delta: choice.delta,
      tone: classifyDeltaTone(choice.delta || choice.result),
      effect: choice.effect,
    };
    const nextIndex = currentIndex + 1;
    const nextModifiers = sumEventEffects([...(summary.resolvedOffseasonEvents ?? []), resolvedEntry]);
    const nextSummary = {
      ...summary,
      offseasonEventIndex: nextIndex,
      resolvedOffseasonEvents: [...(summary.resolvedOffseasonEvents ?? []), resolvedEntry],
      allOffseasonResolved: nextIndex >= events.length,
      nextSeasonModifiers: nextModifiers,
    };
    const campaign = {
      ...state.campaign,
      nextSeasonModifiers: nextModifiers,
      rosterFriction: recoverRosterFriction(state.campaign.rosterFriction, choice.effect?.cohesion >= 2 || choice.effect?.discipline >= 2 ? 2 : 1),
      eventHistory: appendEventHistory(state.campaign.eventHistory, "offseason", event.id),
      seasonRecords: (state.campaign.seasonRecords ?? []).map((record, index, list) => (
        index === list.length - 1 && record.seasonIndex === summary.seasonIndex ? nextSummary : record
      )),
    };
    return { ...state, annualSummary: nextSummary, campaign, error: "" };
  }
  if (action.type === "advance") {
    if (state.screen === "awards") return advanceAfterCup(state);
    if (state.screen === "between-cups") {
      if (!state.hub.allEventsResolved) return { ...state, error: "先处理完杯间事件，再进入下一站。" };
      return startNextCup(state);
    }
    if (state.screen === "annual-awards") {
      if (!state.annualSummary?.allOffseasonResolved) return { ...state, error: "先处理完休赛期事件，再进入下一赛季。" };
      return startNextSeason(state);
    }
    if (state.screen === "chronicle") return createInitialState();
    return state;
  }
  if (action.type === "restart") return createInitialState();
  return state;
}

function statBar(label, value) {
  return `<span class="metric"><span>${label}</span><strong>${value}</strong><i><b style="width:${value}%"></b></i></span>`;
}

function butterflyStatRow(label, playerValue, opponentValue) {
  const left = clamp(Math.round(playerValue), 0, 100);
  const right = clamp(Math.round(opponentValue), 0, 100);
  const leftTone = left >= right ? "ahead" : "";
  const rightTone = right >= left ? "ahead" : "";
  return `<div class="butterfly-row">
    <span class="butterfly-value left-value ${leftTone}">${left}</span>
    <span class="butterfly-track left"><b style="width:${left}%"></b></span>
    <span class="butterfly-label">${label}</span>
    <span class="butterfly-track right"><b style="width:${right}%"></b></span>
    <span class="butterfly-value right-value ${rightTone}">${right}</span>
  </div>`;
}

function renderButterflyStats(playerStats, opponentStats, opponentName) {
  return `<div class="stat-butterfly">
    <div class="butterfly-head">
      <span>Team gun</span>
      <strong>双方数值对比</strong>
      <span>${opponentName}</span>
    </div>
    ${butterflyStatRow("火力", playerStats.firepower, opponentStats.firepower)}
    ${butterflyStatRow("战术执行", playerStats.tacticalExecution, opponentStats.tacticalExecution)}
    ${butterflyStatRow("团队配合", playerStats.cohesion, opponentStats.cohesion)}
    ${butterflyStatRow("纪律", playerStats.discipline, opponentStats.discipline)}
  </div>`;
}

function formatSigned(value) {
  return `${value > 0 ? "+" : ""}${value}`;
}

function compactPlayerMeta(player) {
  return `${teamNames[player.team]} · ${roleLabel[player.role]} · ${playerArchetype(player)}`;
}

function placementTone(placement) {
  if (placement === "冠军") return "gold";
  if (placement === "亚军") return "silver";
  if (placement === "四强") return "blue";
  return "muted";
}

function renderPlacementTag(placement) {
  return `<span class="placement-tag ${placementTone(placement)}">${placement}</span>`;
}

function renderInfoChip(label, value, tone = "") {
  return `<span class="info-chip ${tone}"><small>${label}</small><strong>${value}</strong></span>`;
}

function renderDeltaList(effect = {}) {
  const entries = [
    effect.firepower ? `火力 ${formatSigned(effect.firepower)}` : undefined,
    effect.tacticalExecution ? `执行 ${formatSigned(effect.tacticalExecution)}` : undefined,
    effect.cohesion ? `配合 ${formatSigned(effect.cohesion)}` : undefined,
    effect.discipline ? `纪律 ${formatSigned(effect.discipline)}` : undefined,
  ].filter(Boolean);
  return entries.length ? entries.join(" · ") : "状态平稳";
}

function renderSeasonTrack(campaign, upcomingLabel) {
  const currentSeasonRecords = campaign.cupRecords.filter((record) => record.seasonIndex === campaign.seasonIndex);
  return `<div class="season-track">
    ${CUPS.map((cup, index) => {
      const record = currentSeasonRecords.find((entry) => entry.cupName === cup.name);
      const isCurrent = !record && index === campaign.cupIndex + 1 && Boolean(upcomingLabel);
      return `<article class="season-stop ${record ? "done" : isCurrent ? "current" : ""}">
        <span>${cup.short}</span>
        <strong>${cup.name}</strong>
        <small>${record ? `${record.champion} / ${record.placement}` : isCurrent ? upcomingLabel : "待开打"}</small>
      </article>`;
    }).join("")}
  </div>`;
}

function renderNav(state, title) {
  const campaign = state.campaign;
  if (!campaign) {
    return `<nav class="flowbar">
      <span>新项目</span>
      <strong>${title}</strong>
      <span class="step-dots"><i class="current"></i><i></i><i></i><i></i><i></i></span>
    </nav>`;
  }
  const steps = ["draft", "bracket", "prematch", "match", "awards", "between-cups", "annual-awards", "chronicle"];
  const activeIndex = Math.max(0, steps.indexOf(state.screen));
  const cupMeta = currentCupMeta(campaign);
  return `<nav class="flowbar">
    <span>S${campaign.seasonIndex} / ${CAMPAIGN_SEASONS} · ${state.screen === "annual-awards" ? "年度总结" : state.screen === "chronicle" ? "编年史" : cupMeta.short}</span>
    <strong>${title}</strong>
    <span class="flowbar-right">奖杯 ${campaign.trophies}<span class="step-dots">${steps.map((_, dotIndex) => `<i class="${dotIndex < activeIndex ? "done" : dotIndex === activeIndex ? "current" : ""}"></i>`).join("")}</span></span>
  </nav>`;
}

function renderDraft(state) {
  const roster = selectedPlayers(state);
  const active = roster.length ? activeRoster(roster, state.substitute) : [];
  const remaining = STARTING_BUDGET - rosterPrice(state.selected);
  const spent = STARTING_BUDGET - remaining;
  const valid = state.selected.length === 6 && remaining >= 0;
  const stats = roster.length >= 5 ? teamStats(roster, state.substitute) : undefined;
  const chemistry = roster.length >= 5 ? chemistryNotes(roster, state.substitute) : { notes: [], risks: [] };
  const roleSpread = roster.reduce((map, player) => {
    map.set(roleLabel[player.role], (map.get(roleLabel[player.role]) ?? 0) + 1);
    return map;
  }, new Map());
  const activeFilter = state.draftRoleFilter ?? "all";
  const visiblePlayers = activeFilter === "all" ? players : players.filter((player) => player.role === activeFilter);
  const activeFilterLabel = draftRoleFilters.find((filter) => filter.id === activeFilter)?.label ?? "全部";
  return `<section class="screen draft">
    ${renderNav(state, "征召室")}
    <header class="topbar">
      <div>
        <p class="eyebrow">01 / DRAFT ROOM</p>
        <h1>Team gun · 征召室</h1>
        <p class="subcopy">选 6 人，定 5 首发 1 替补。预算只有 100，既要有枪，也得有语音和补枪链。</p>
        <div class="inline-strip">
          ${renderInfoChip("已选", `${state.selected.length}/6`, state.selected.length === 6 ? "accent" : "")}
          ${renderInfoChip("已花费", `${spent}/${STARTING_BUDGET}`, remaining < 0 ? "danger" : "gold")}
          ${renderInfoChip("首发", active.length ? active.map((player) => player.name).join(" / ") : "待确认", "soft")}
        </div>
      </div>
    </header>
    <main class="draft-grid">
      <section class="panel player-list">
        <div class="panel-title"><span>选手池 · ${activeFilterLabel} · ${visiblePlayers.length} 人</span><span>火力 / 战术 / 纪律 / 身价</span></div>
        <div class="role-tabs">
          ${draftRoleFilters.map((filter) => `<button class="role-tab ${activeFilter === filter.id ? "active" : ""}" data-action="draft-role-filter" data-role="${filter.id}">${filter.label}<small>${filter.id === "all" ? players.length : players.filter((player) => player.role === filter.id).length}</small></button>`).join("")}
        </div>
        ${visiblePlayers.map((player) => {
          const selected = state.selected.includes(player.id);
          const selectedIndex = state.selected.indexOf(player.id);
          const disabled = !selected && state.selected.length >= 6;
          return `<button class="player-row ${selected ? "selected" : ""}" data-action="toggle" data-player="${player.id}" ${disabled ? "disabled" : ""} style="--team-color: var(--team-${player.team})">
            <span class="pick-order ${selected ? "active" : ""}">${selected ? selectedIndex + 1 : ""}</span>
            <span class="player-main"><strong>${player.name}</strong><small>${teamNames[player.team]} · ${roleLabel[player.role]} · ${personalityLabel(player)}</small></span>
            <span class="stat-stack">${statBar("火", player.firepower)}${statBar("术", player.tactics)}${statBar("律", player.discipline)}</span>
            <span class="price-wrap"><span class="price">$${player.price}</span>${selected ? `<small class="row-tag">已锁定</small>` : ""}</span>
            <span class="traits">${player.traits.map((trait) => `<em title="${traitInfo[trait].text}">${traitInfo[trait].label}</em>`).join("")}</span>
            <small class="profile">${player.profile}</small>
          </button>`;
        }).join("")}
      </section>
      <aside class="panel roster-panel">
        <div class="budget ${remaining < 0 ? "bad" : ""}"><span>剩余预算</span><strong>${remaining}</strong><p class="hint">已投入 ${spent} / ${STARTING_BUDGET}。替补也会影响训练氛围和事件文本。</p><div><span style="width:${Math.max(0, Math.min(100, remaining))}%"></span></div></div>
        <div class="slots">
          ${Array.from({ length: 6 }).map((_, index) => {
            const player = players.find((entry) => entry.id === state.selected[index]);
            const starterNumber = player
              ? state.selected.slice(0, index + 1).filter((id) => id !== state.substitute).length
              : index + 1;
            return `<div class="slot-wrap">
              <button class="slot ${player ? "filled" : ""} ${state.substitute === player?.id ? "substitute" : ""}" ${player ? `data-action="toggle" data-player="${player.id}" title="点击取消选择"` : ""}>
                <small>${state.substitute === player?.id ? "替补" : player ? `首发 ${starterNumber}` : index < 5 ? `首发 ${starterNumber}` : "替补位"}</small><strong>${player?.name ?? "+"}</strong><span>${player ? `${roleLabel[player.role]} · $${player.price} · 点击取消` : "选择选手"}</span>
              </button>
              ${player ? `<button class="slot-substitute-action ${state.substitute === player.id ? "active" : ""}" data-action="substitute" data-player="${player.id}" ${state.substitute === player.id ? "disabled" : ""}>${state.substitute === player.id ? "当前替补" : "设为替补"}</button>` : ""}
            </div>`;
          }).join("")}
        </div>
        ${roster.length ? `<div class="micro-panel">
          <div class="panel-title"><span>阵容构成</span><span>${roleSpread.size} 角色组</span></div>
          <div class="info-grid">
            ${[...roleSpread.entries()].map(([role, count]) => renderInfoChip(role, `${count} 人`, "soft")).join("")}
          </div>
          <p class="hint">当前替补：${state.substitute ? playerById(state.substitute).name : roster[5]?.name ?? "未指定"}。点选已选球员可切换替补位。</p>
        </div>` : ""}
        ${stats ? `<div class="team-summary">
          <p>阵容数值</p>
          ${statBar("火力", stats.firepower)}${statBar("执行", stats.tacticalExecution)}${statBar("配合", stats.cohesion)}${statBar("纪律", stats.discipline)}
          <p>化学反应：${chemistry.notes.join("，") || "暂无明显加成"}</p>
          <p class="${chemistry.risks.length ? "risk" : ""}">风险：${chemistry.risks.join("，") || "结构稳定"}</p>
        </div>` : `<p class="hint">再选择 ${Math.max(0, 6 - state.selected.length)} 名选手后显示阵容数值。</p>`}
        ${state.error ? `<p class="error">${state.error}</p>` : ""}
        <button class="primary" data-action="confirm" ${valid ? "" : "disabled"}>${valid ? "确认阵容并进入三年赛程" : "需要 6 人且不超预算"}</button>
      </aside>
    </main>
  </section>`;
}

function renderBracket(state) {
  const campaign = state.campaign;
  const bracket = campaign.currentBracket;
  const roster = selectedPlayers(state);
  const stats = teamStats(roster, state.substitute, { ...campaign.modifiers, rosterFriction: campaign.rosterFriction ?? 0 });
  const currentMatch = getPlayerCurrentMatch(campaign);
  const nextOpponent = currentMatch ? (currentMatch.teamA.id === "player-team" ? currentMatch.teamB : currentMatch.teamA) : undefined;

  const bracketTeam = (team, match) => {
    const isWinner = match?.winnerId === team.id;
    const isLoser = Boolean(match?.winnerId) && match.winnerId !== team.id;
    return `<div class="bracket-team ${team.id === "player-team" ? "player-team" : ""} ${isWinner ? "winner" : ""} ${isLoser ? "loser" : ""}">
      <span>${team.short}</span>
      <strong>${team.name}</strong>
      <small>${team.id === "player-team" ? `火力 ${stats.firepower} · 执行 ${stats.tacticalExecution}` : `${team.stars[0]} 领衔`}</small>
    </div>`;
  };
  const bracketMatch = (match, round, slotClass = "") => `<article class="bracket-match ${round} ${slotClass} ${match.id === bracket.currentMatchId ? "focus" : ""}">
    ${bracketTeam(match.teamA, match)}
    ${bracketTeam(match.teamB, match)}
    <span class="bracket-score">${match.score ? `${match.score[0]}-${match.score[1]}` : "待开打"}</span>
  </article>`;

  const semifinalMatches = bracket.rounds.semifinal.length
    ? bracket.rounds.semifinal
    : [
      createBracketMatch("semi-tbd-0", "semifinal", { id: "tbd-0", name: "待定", short: "TBD", stars: ["待定"], stats: {} }, { id: "tbd-1", name: "待定", short: "TBD", stars: ["待定"], stats: {} }),
      createBracketMatch("semi-tbd-1", "semifinal", { id: "tbd-2", name: "待定", short: "TBD", stars: ["待定"], stats: {} }, { id: "tbd-3", name: "待定", short: "TBD", stars: ["待定"], stats: {} }),
    ];
  const finalMatches = bracket.rounds.final.length
    ? bracket.rounds.final
    : [
      createBracketMatch("final-tbd-0", "final", { id: "tbd-final-a", name: "待定", short: "TBD", stars: ["待定"], stats: {} }, { id: "tbd-final-b", name: "待定", short: "TBD", stars: ["待定"], stats: {} }),
    ];

  return `<section class="screen bracket-screen">
    ${renderNav(state, "淘汰赛赛程")}
    <header class="topbar">
      <div>
        <p class="eyebrow">${bracket.cupName.toUpperCase()} ${bracket.year}</p>
        <h1>${bracket.cupName} · 八队单败</h1>
        <p class="subcopy">${bracket.atmosphere ?? bracket.intro} ${bracket.motto ?? "长风破浪会有时，直挂云帆济沧海。"}</p>
      </div>
      <button class="primary compact match-entry" data-action="play">${nextOpponent ? `进入 ${roundLabel(currentMatch.round)}` : "查看结果"}</button>
    </header>
    <main class="campaign-grid">
      <section class="bracket-tree panel">
        <div class="bracket-board">
          <div class="bracket-heading qf-heading">四分之一决赛</div>
          <div class="bracket-heading sf-heading">半决赛</div>
          <div class="bracket-heading final-heading">决赛</div>
          <div class="bracket-heading champion-heading">冠军</div>
          ${bracketMatch(bracket.rounds.quarterfinal[0], "quarter", "qf slot-qf-1")}
          ${bracketMatch(bracket.rounds.quarterfinal[1], "quarter", "qf slot-qf-2")}
          ${bracketMatch(bracket.rounds.quarterfinal[2], "quarter", "qf slot-qf-3")}
          ${bracketMatch(bracket.rounds.quarterfinal[3], "quarter", "qf slot-qf-4")}
          ${bracketMatch(semifinalMatches[0], "semi", "semi slot-sf-1")}
          ${bracketMatch(semifinalMatches[1], "semi", "semi slot-sf-2")}
          ${bracketMatch(finalMatches[0], "final", "final slot-final")}
          <section class="connector connector-qf pair-top"></section>
          <section class="connector connector-qf pair-bottom"></section>
          <section class="connector connector-sf main"></section>
          <section class="connector connector-final main"></section>
          <section class="champion-podium slot-champion">
            <p class="eyebrow">CHAMPION</p>
            <h2>冠军席位</h2>
            <strong>${bracket.champion?.name ?? "待决出"}</strong>
            <small>${bracket.champion ? `${bracket.champion.stars[0]} 成为这杯赛最响的一把枪。` : "完成本杯全部轮次后公布冠军与 MVP"}</small>
          </section>
        </div>
      </section>
      <aside class="panel side-panel">
        <div class="panel-title"><span>赛季控制台</span><span>S${campaign.seasonIndex} · 第 ${campaign.cupIndex + 1} 杯</span></div>
        <div class="status-strip">
          <div><small>当前奖杯</small><strong>${campaign.trophies}</strong></div>
          <div><small>下一对手</small><strong>${nextOpponent?.name ?? "杯赛完成"}</strong></div>
        </div>
        <div class="team-summary compact">
          <p>Team gun 当前面板</p>
          ${statBar("火力", stats.firepower)}${statBar("执行", stats.tacticalExecution)}${statBar("配合", stats.cohesion)}${statBar("纪律", stats.discipline)}
        </div>
        <div class="bulletin">
          <h3>杯赛口径</h3>
          <p>${bracket.lastRoundSummary || "完整比赛只播放 Team gun 所在的 BO5，其余比赛快速结算。每轮结算后，对阵图会实时更新。"}</p>
        </div>
        ${campaign.cupRecords.length ? `<div class="history-mini">
          <h3>已结束杯赛</h3>
          ${campaign.cupRecords.slice(-3).map((record) => `<article><strong>${record.cupName} ${record.year}</strong><span>${record.champion} / ${record.placement}</span></article>`).join("")}
        </div>` : `<p class="hint">第一杯还没有历史记录。现在直接开始第一轮。</p>`}
      </aside>
    </main>
  </section>`;
}

function renderPrematch(state) {
  const campaign = state.campaign;
  const roster = selectedPlayers(state);
  const stats = teamStats(roster, state.substitute, { ...campaign.modifiers, rosterFriction: campaign.rosterFriction ?? 0 });
  const currentSubstitute = state.substitute ?? state.selected[5];
  const currentMatch = getPlayerCurrentMatch(campaign);
  const opponent = currentMatch.teamA.id === "player-team" ? currentMatch.teamB : currentMatch.teamA;
  const opponentStats = opponent.stats ?? AI_TEAM_PROFILES[opponent.id]?.base ?? stats;
  const seed = createMatchSeed(campaign, currentMatch.round === "quarterfinal" ? 101 : currentMatch.round === "semifinal" ? 201 : 301);
  const narrative = buildPrematchIntel({ state, campaign, opponentTeam: opponent, stats, seed });
  const starterNames = activeRoster(roster, currentSubstitute).map((player) => player.name).join(" / ");
  return `<section class="screen">
    ${renderNav(state, "赛前情报")}
    <main class="prematch-shell panel">
      <section class="prematch-head">
        <div>
          <p class="eyebrow">PRE-MATCH EVENT · ${campaign.currentBracket.cupShort}</p>
          <h1>${roundLabel(currentMatch.round)}前：${opponent.name}</h1>
          <p class="subcopy">${campaign.currentBracket.tone} 这一轮对上的是 ${opponent.name}。赛前你只能先看公开样本和最近走势，真正的战术倾向要靠这张情报卡和比赛里的前几波交火慢慢读出来。</p>
        </div>
        <div class="prematch-score-mini">
          ${renderInfoChip("对手核心", opponent.stars[0] ?? "待定", "accent")}
          ${renderInfoChip("重点风险", narrative.opponentStyle?.label ?? "信息还不完整", "soft")}
          ${renderInfoChip("口径", "赛前情报", "gold")}
        </div>
      </section>
      <section class="prematch-body">
        <div class="prematch-copy">
          <article class="event-card featured">
            <h3>${narrative.title}</h3>
            ${narrative.body.map((line) => `<p>${line}</p>`).join("")}
            <footer>${narrative.footer}</footer>
          </article>
          <div class="choice-row prematch-choices">
            <button class="ghost prematch-choice" data-action="prematch" data-choice="drill">激进冒险</button>
            <button class="ghost prematch-choice" data-action="prematch" data-choice="confidence">小心试探</button>
            <button class="ghost prematch-choice" data-action="prematch" data-choice="hide-looks">隐藏战术</button>
          </div>
        </div>
        <aside class="prematch-sidebar">
          <section class="prematch-lineup">
            <div class="panel-title"><span>本场首发</span><span>点谁替补</span></div>
            <div class="prematch-lineup-grid">
              ${roster.map((player) => {
                const isBench = currentSubstitute === player.id;
                const score = activeFormScore(player, campaign.playerForm);
                return `<button class="lineup-pill ${isBench ? "bench" : "starter"}" data-action="substitute" data-player="${player.id}" aria-pressed="${isBench ? "true" : "false"}">
                  <strong>${player.name}</strong>
                  <small>${roleLabel[player.role]} · ${isBench ? "本场替补" : "首发"} · ${formLabel(score)}</small>
                  <span class="lineup-action">${isBench ? "当前替补" : "设为本场替补"}</span>
                </button>`;
              }).join("")}
            </div>
            <p class="hint">当前替补：${playerById(currentSubstitute)?.name ?? "未指定"}。当前首发：${starterNames}</p>
          </section>
          ${renderButterflyStats(stats, opponentStats, opponent.name)}
        </aside>
      </section>
    </main>
  </section>`;
}

function renderMatch(state) {
  const card = materializeMatchCard(state, state.match.cards[state.match.eventIndex]);
  const resolved = state.match.resolved;
  const playerStats = Object.values(state.match.playerStats);
  const opponentStats = Object.values(state.match.opponentStats);
  const fallenIds = latestFallenIds(state.match);
  const opponentFallen = latestOpponentFallen(state.match);
  const active = activeRoster(selectedPlayers(state), state.substitute);
  const roleByName = new Map(active.map((player) => [player.name, roleLabel[player.role]]));
  const currentMapLabel = card?.mapIndex !== undefined ? mapIndexLabel(card.mapIndex) : "等待结算";
  return `<section class="screen">
    ${renderNav(state, "比赛室")}
    <header class="topbar">
      <div>
        <p class="eyebrow">MATCH ROOM · ${state.match.cupName}</p>
        <h1>${state.match.roundLabel} · ${PLAYER_TEAM} vs ${state.match.opponent}</h1>
        <p class="subcopy">BO5 文本赛事台。你只在关键窗口发指令，其余都交给队伍把枪线打出来。</p>
        <div class="inline-strip">
          ${renderInfoChip("当前局", currentMapLabel, "accent")}
          ${renderInfoChip("事件进度", `${resolved.length + 1}/${state.match.cards.length}`, "soft")}
          ${renderInfoChip("侦察口径", scoutingResultLine(state.match.scoutingChoice), "soft")}
          ${renderInfoChip("暂停", state.match.timeoutUsed ? "已交" : "可用", state.match.timeoutUsed ? "danger" : "success")}
        </div>
      </div>
      <div class="scoreboard">
        <span><small>MANAGER SIDE</small>${PLAYER_TEAM}</span>
        <strong>${state.match.score[0]}-${state.match.score[1]}</strong>
        <span><small>OPPONENT</small>${state.match.opponent}</span>
      </div>
    </header>
    <main class="match-stage">
      <aside class="panel team-side player-side">
        <div class="panel-title"><span>${PLAYER_TEAM}</span><span>K / D / A / IMP</span></div>
        <div class="team-side-scroll">
          ${playerStats.map((player) => {
            const isDead = fallenIds.has(player.id);
            return `<div class="kda-row${isDead ? " is-dead" : ""}"><strong class="kda-player">${player.name}<small>${roleByName.get(player.name) ?? "首发"}</small></strong><span class="kda-score">${player.kills}/${player.deaths}/${player.assists}</span><em class="kda-impact">${player.impact}</em><span class="kda-tags"><small class="form-tag ${formClass(player.formScore)}">状态：${player.formLabel}</small>${isDead ? `<small class="status-tag">阵亡</small>` : `<small class="status-tag live">存活</small>`}</span></div>`;
          }).join("")}
        </div>
      </aside>
      <section class="panel match-center">
        <div class="panel-title"><span>赛事时间线</span><span>${resolved.length} / ${state.match.cards.length}</span></div>
        <div class="match-center-scroll">
          ${resolved.length ? resolved.map((entry) => `<article class="event-card resolved ${classifyResolvedTone(entry)}"><h3>${entry.title}</h3>${entry.choice ? `<div class="decision">${entry.prompt}：${entry.choice}</div>` : ""}${entry.text ? `<p>${entry.text}</p>` : ""}<p>${entry.result}</p><footer>${visibleFeedbackText(entry.delta)}</footer></article>`).join("") : `<p class="empty">比赛即将开始，等待第 1 局手枪局。</p>`}
          <article class="event-card live-event">
            <p class="eyebrow">LIVE CONTROL</p>
            <h3>${card.title}</h3>
            <p>${card.text}</p>
            <div class="console-strip compact-console">
              ${renderInfoChip("系列赛比分", `${state.match.score[0]}-${state.match.score[1]}`, state.match.score[0] === state.match.score[1] ? "soft" : state.match.score[0] > state.match.score[1] ? "success" : "danger")}
              ${renderInfoChip("局数", currentMapLabel, "soft")}
              ${renderInfoChip("最新反馈", visibleFeedbackText(resolved.at(-1)?.delta ?? "暂无"), "soft")}
            </div>
            ${state.match.hidden?.controlLocked
              ? `<button class="primary" data-action="next">队员自行处理</button>`
              : card.options ? `<div class="choice-list match-choices">${card.options.map((option) => `<button class="primary${option.id === "tactical-reset" || option.id === "discipline-reset" || option.id === "emotional-reset" ? " secondary" : ""}" data-action="decision" data-choice="${option.id}">${option.label}</button>`).join("")}</div>` : `<button class="primary" data-action="next">推进事件</button>`}
            <p class="hint">${state.match.timeoutUsed ? "暂停已经交了，后面更考验队伍自己把语音和补枪接住。" : "暂停还捏在手里，别轻易白交。"} 当前侦察：${scoutingResultLine(state.match.scoutingChoice)}</p>
            ${state.match.hidden?.controlLocked ? `<p class="hint">教练无法临场指挥，你只能在场边看着，所有关键选择由队员根据局势自行处理。</p>` : ""}
          </article>
        </div>
      </section>
      <aside class="panel team-side opponent-side">
        <div class="panel-title"><span>${state.match.opponent}</span><span>K / D / A / IMP</span></div>
        <div class="team-side-scroll">
          ${opponentStats.map((player) => {
            const isDead = opponentFallen.has(player.name);
            return `<div class="kda-row${isDead ? " is-dead" : ""}"><strong class="kda-player">${player.name}<small>对手首发</small></strong><span class="kda-score">${player.kills}/${player.deaths}/${player.assists}</span><em class="kda-impact">${player.impact}</em><span class="kda-tags">${isDead ? `<small class="status-tag">阵亡</small>` : `<small class="status-tag live">存活</small>`}</span></div>`;
          }).join("")}
        </div>
      </aside>
    </main>
  </section>`;
}

function renderAwards(state) {
  const result = state.result;
  const playerWon = result.champion === PLAYER_TEAM;
  return `<section class="screen awards-screen">
    ${renderNav(state, "杯赛颁奖")}
    <header class="topbar"><div><p class="eyebrow">CUP COMPLETE</p><h1>${result.cupName} 颁奖</h1><p class="subcopy">${result.headline}</p><div class="inline-strip">${renderInfoChip("赛季年份", String(result.year), "soft")}${renderInfoChip("Team gun 名次", result.placement, playerWon ? "gold" : "soft")}${renderInfoChip("战术风格", result.tacticalStyle ?? "稳定", "accent")}</div></div><button class="ghost" data-action="restart">重新开始</button></header>
    <main class="awards-grid">
      <section class="panel trophy ${playerWon ? "player-win" : ""}"><p>冠军</p><h2>${result.champion}</h2><p>Team gun 名次：${renderPlacementTag(result.placement)}</p><strong>${result.runnerUp} 获得亚军</strong></section>
      <section class="panel mvp"><p>杯赛 MVP</p><h2>${result.mvp.name}</h2><p>${result.mvp.profile}</p><strong>火力 ${result.mvp.firepower} · 战术 ${result.mvp.tactics} · 性格 ${result.mvp.personalityLabel ?? "团队拼图"}</strong><small>${result.mvp.line}</small></section>
      <section class="panel trophy"><p>给经理的话</p><h2>赛后评语</h2><p>${result.encouragement}</p><div class="info-grid compact">${renderInfoChip("冠军", result.champion, playerWon ? "gold" : "soft")}${renderInfoChip("亚军", result.runnerUp, "soft")}${renderInfoChip("MVP", result.mvp.name, "accent")}</div><button class="primary" data-action="advance">进入下一阶段</button></section>
      <section class="panel match-log"><div class="panel-title"><span>本场比赛回顾</span><span>事件 ${result.matchReplay.length}</span></div>
        ${result.matchReplay.map((entry) => `<article class="event-card resolved ${classifyResolvedTone(entry)}"><h3>${entry.title}</h3>${entry.choice ? `<div class="decision">${entry.prompt}: ${entry.choice}</div>` : ""}${entry.text ? `<p>${entry.text}</p>` : ""}<p>${entry.result}</p><footer>${visibleFeedbackText(entry.delta)}</footer></article>`).join("")}
      </section>
      <section class="panel kda-panel awards-kda"><div class="panel-title"><span>系列赛数据</span><span>K / D / A / IMP</span></div>
        ${result.playerStats.map((player) => `<div class="kda-row awards-kda-row"><strong class="kda-player">${player.name}</strong><span class="kda-score">${player.kills}/${player.deaths}/${player.assists}</span><em class="kda-impact">${player.impact}</em></div>`).join("")}
      </section>
    </main>
  </section>`;
}

function renderBetweenCups(state) {
  const event = state.hub.event;
  const lastCup = state.campaign.cupRecords.at(-1);
  const nextStop = state.campaign.cupIndex >= CUPS.length - 1 ? "年度结算" : `${CUPS[state.campaign.cupIndex + 1].name} ${currentCupYear(state.campaign)}`;
  const roster = selectedPlayers(state);
  const tradeSelection = state.hub.tradeSelection ?? {};
  const outgoingId = tradeSelection.outgoingId;
  const targetId = tradeSelection.targetId;
  const tradePreview = getTradePackage(state, state.campaign, outgoingId, targetId);
  const bidRange = tradePreview ? tradeBidRange(state, tradePreview) : undefined;
  const bidOdds = tradePreview ? tradeSuccessWindow(state, outgoingId, targetId, bidRange.current) : undefined;
  const candidatePool = state.hub.tradeOffers ?? [];
  const outgoingRoleFilter = tradeSelection.outgoingRoleFilter ?? "all";
  const targetRoleFilter = tradeSelection.targetRoleFilter ?? "all";
  const outgoingPool = outgoingRoleFilter === "all" ? roster : roster.filter((player) => player.role === outgoingRoleFilter);
  const visibleCandidatePool = targetRoleFilter === "all" ? candidatePool : candidatePool.filter((player) => player.role === targetRoleFilter);
  const tradeRoleTabs = (activeRole, action, pool) => `<div class="role-tabs trade-role-tabs">
    ${draftRoleFilters.map((filter) => {
      const count = filter.id === "all" ? pool.length : pool.filter((player) => player.role === filter.id).length;
      return `<button class="role-tab ${activeRole === filter.id ? "active" : ""}" data-action="${action}" data-role="${filter.id}" ${count === 0 ? "disabled" : ""}>${filter.label}<small>${count}</small></button>`;
    }).join("")}
  </div>`;
  const outgoingFilterLabel = draftRoleFilters.find((filter) => filter.id === outgoingRoleFilter)?.label ?? "全部";
  const targetFilterLabel = draftRoleFilters.find((filter) => filter.id === targetRoleFilter)?.label ?? "全部";
  const eventCount = state.hub.events?.length ?? 1;
  const eventProgress = `${Math.min((state.hub.resolvedEvents?.length ?? 0) + 1, eventCount)} / ${eventCount}`;
  return `<section class="screen">
    ${renderNav(state, "杯间整备")}
    <header class="topbar"><div><p class="eyebrow">BETWEEN CUPS</p><h1>杯间整备</h1><p class="subcopy">这一页像比赛日之间的战情简报。做一个决定，然后把队伍带去下一站。</p><div class="inline-strip">${renderInfoChip("下一站", nextStop, "accent")}${renderInfoChip("奖杯数", String(state.campaign.trophies), "gold")}${renderInfoChip("最近成绩", lastCup?.placement ?? "待定", "soft")}${renderInfoChip("可用预算", `$${state.campaign.budget ?? 0}`, "success")}</div></div><button class="ghost" data-action="restart">重新开始</button></header>
    <main class="hub-layout">
      <section class="panel event-focus">
        <p class="eyebrow">杯间事件 ${eventProgress}</p>
        <h2>${event.title}</h2>
        <p>${event.narrative}</p>
        ${state.hub.allEventsResolved ? `<p class="hint">杯间事件已处理完。下面保留本次整备记录，你可以继续处理转会窗口或进入下一站。</p>` : `<div class="choice-list">${event.options.map((option) => `<button class="primary choice-extended" data-action="hub-decision" data-choice="${option.id}"><strong>${option.label}</strong></button>`).join("")}</div>`}
        ${(state.hub.resolvedEvents ?? []).length ? `<div class="resolved-stack">${state.hub.resolvedEvents.map((entry) => `<article class="event-card resolved ${entry.tone}"><h3>${entry.title}</h3><div class="decision">${entry.choice}</div><p>${entry.result}</p></article>`).join("")}</div>` : ""}
      </section>
      <section class="panel hub-transfer-panel">
        <div class="transfer-heading">
          <div>
            <p class="eyebrow">TRANSFER WINDOW</p>
            <h3>转会窗口</h3>
            <p>每个杯间最多尝试 1 次交易。先选你准备送走的人，再选想换来的目标。高价明星更难撬，低价补强和角色位微调也都能谈。</p>
          </div>
          <div class="transfer-status">
            ${renderInfoChip("预算", `$${state.campaign.budget ?? 0}`, "success")}
            ${renderInfoChip("机会", state.hub.tradeAttemptUsed ? "已用完" : "1 次", state.hub.tradeAttemptUsed ? "danger" : "accent")}
          </div>
        </div>
        <div class="bulletin transfer-bulletin">
          ${state.hub.tradeResult ? `<article class="event-card resolved ${classifyDeltaTone(state.hub.tradeResult.delta)}"><h3>${state.hub.tradeResult.title}</h3><p>${state.hub.tradeResult.text}</p><footer>${visibleFeedbackText(state.hub.tradeResult.delta)}</footer></article>` : candidatePool.length ? `<div class="trade-room">
            <div class="trade-columns">
              <section class="trade-column">
                <h4>先选送出谁 · ${outgoingFilterLabel}</h4>
                ${tradeRoleTabs(outgoingRoleFilter, "trade-filter-outgoing", roster)}
                <div class="trade-list" data-scroll-key="tradeOutgoing">
                  ${outgoingPool.map((player) => `<button class="ghost trade-player trade-player-card ${outgoingId === player.id ? "selected" : ""}" data-action="trade-pick-outgoing" data-player="${player.id}" ${state.hub.tradeAttemptUsed ? "disabled" : ""}>
                    ${outgoingId === player.id ? `<span class="selection-mark">已选送出</span>` : ""}
                    <strong>${player.name}</strong>
                    <small>${compactPlayerMeta(player)}</small>
                    <small>火力 ${player.firepower} · 战术 ${player.tactics} · 纪律 ${player.discipline} · ${marketPriceNote(player, state.campaign)}</small>
                    <span class="traits">${player.traits.map((trait) => `<em title="${traitInfo[trait].text}">${traitInfo[trait].label}</em>`).join("")}</span>
                  </button>`).join("")}
                </div>
              </section>
              <section class="trade-column">
                <h4>再选想换来谁 · ${targetFilterLabel}</h4>
                ${tradeRoleTabs(targetRoleFilter, "trade-filter-target", candidatePool)}
                <div class="trade-list" data-scroll-key="tradeTarget">
                  ${visibleCandidatePool.map((player) => `<button class="ghost trade-player trade-player-card ${targetId === player.id ? "selected" : ""}" data-action="trade-pick-target" data-player="${player.id}" ${state.hub.tradeAttemptUsed ? "disabled" : ""}>
                    ${targetId === player.id ? `<span class="selection-mark">已选目标</span>` : ""}
                    <strong>${player.name}</strong>
                    <small>${compactPlayerMeta(player)}</small>
                    <small>火力 ${player.firepower} · 战术 ${player.tactics} · 纪律 ${player.discipline} · ${marketPriceNote(player, state.campaign)}</small>
                    <span class="traits">${player.traits.map((trait) => `<em title="${traitInfo[trait].text}">${traitInfo[trait].label}</em>`).join("")}</span>
                  </button>`).join("")}
                </div>
              </section>
            </div>
            ${tradePreview ? `<article class="event-card resolved trade-preview">
              <h3>${tradePreview.summary}</h3>
              <p>${tradePreview.cash < 0 ? "这是一笔降薪换深度的交易。对方想要更高身价的即战力，所以会补给你现金。" : tradePreview.sameRole ? "这是同位置对换，队内结构最稳定。" : "这笔交易会直接改动你的角色分配和轮转。"} ${tradePreview.angle}。</p>
              <div class="trade-bid-panel">
                <div class="trade-bid-stats">
                  ${renderInfoChip(tradePreview.cash < 0 ? "预计回收" : "预计合理补价", tradePreview.cash < 0 ? `$${Math.abs(tradePreview.cash)}` : `$${tradePreview.cash}`, tradePreview.cash < 0 ? "success" : "soft")}
                  ${tradePreview.cash < 0 ? renderInfoChip("预算回收", `+$${Math.abs(tradePreview.cash)}`, "accent") : renderInfoChip("你的报价", `$${bidRange.current}`, bidOdds.label === "溢价强推" ? "gold" : bidOdds.label === "试探报价" ? "danger" : "accent")}
                  ${renderInfoChip("预估成功率", `${formatPercent(bidOdds.low)}-${formatPercent(bidOdds.high)}`, "success")}
                  ${renderInfoChip("报价评价", bidOdds.label, "soft")}
                </div>
                ${tradePreview.cash < 0 ? `<p class="hint">如果谈成，对方补给你 $${Math.abs(tradePreview.cash)}，预算回收后可以留给后面的交易窗口。</p>` : `<label class="trade-bid-slider">
                  <span>现金报价</span>
                  <input type="range" min="${bidRange.min}" max="${bidRange.max}" step="1" value="${bidRange.current}" data-action="trade-bid" ${state.hub.tradeAttemptUsed ? "disabled" : ""} />
                </label>`}
              </div>
              <footer>送出 ${tradePreview.outgoing.name}（市场价 $${tradePreview.outgoingMarketPrice}）· 换入 ${tradePreview.target.name}（市场价 $${tradePreview.targetMarketPrice}） · 角色收益 ${formatSigned(tradePreview.fit)}</footer>
            </article><button class="primary trade-submit" data-action="trade" ${state.hub.tradeAttemptUsed ? "disabled" : ""}>确认发起这笔交易</button>` : `<p class="hint">先从左边选一名你愿意送走的选手，再从右边点一个目标，下面会出现补价和交易预览。</p>`}
          </div>` : `<p class="hint">这段窗口没有值得出手的目标，先把钱留给下一杯。</p>`}
        </div>
        <div class="hub-footer-actions">
          <p>${state.hub.allEventsResolved ? "杯间事件已处理。确认是否完成转会窗口，然后再进入下一站。" : "先处理完上方杯间事件，再决定是否动转会窗口。"}</p>
          <button class="primary next-cup-action" data-action="advance" ${state.hub.allEventsResolved ? "" : "disabled"}>${state.campaign.cupIndex >= CUPS.length - 1 ? "进入年度结算" : "进入下一杯"}</button>
        </div>
      </section>
      <aside class="panel side-panel">
        <div class="panel-title"><span>战情简报</span><span>LOW NOISE</span></div>
        <div class="bulletin"><h3>外部环境</h3><p>${state.hub.passive}</p></div>
        ${lastCup ? `<div class="bulletin"><h3>上一杯落点</h3><p>${lastCup.cupName}：${lastCup.champion} 夺冠，Team gun 拿到 ${lastCup.placement}。MVP 是 ${lastCup.mvp.name}。</p></div>` : ""}
        <div class="team-summary compact">
          <p>当前赛季修正</p>
          ${statBar("火力", clamp(50 + state.campaign.modifiers.firepower * 5, 0, 100))}
          ${statBar("执行", clamp(50 + state.campaign.modifiers.tacticalExecution * 5, 0, 100))}
          ${statBar("配合", clamp(50 + state.campaign.modifiers.cohesion * 5, 0, 100))}
          ${statBar("纪律", clamp(50 + state.campaign.modifiers.discipline * 5, 0, 100))}
          ${state.campaign.rosterFriction ? `${statBar("阵容磨合", clamp(100 - state.campaign.rosterFriction * 14, 10, 100))}<p class="hint">新阵容还在磨合期，后续比赛和杯间处理会逐步把默契找回来。</p>` : `<p class="hint">阵容磨合稳定，队伍更容易把训练内容带进下一场大赛。</p>`}
        </div>
        <div class="bulletin">
          <h3>经营状态</h3>
          <p>预算：$${state.campaign.budget ?? 0}。${state.hub.tradeAttemptUsed ? "本窗口交易机会已用完。" : "本窗口仍可尝试 1 次交易。"} 频繁换人会影响默契和纪律的体感。</p>
        </div>
        <div class="bulletin"><h3>赛季进度</h3>${renderSeasonTrack(state.campaign, nextStop)}</div>
      </aside>
    </main>
  </section>`;
}

function renderAnnualAwards(state) {
  const summary = state.annualSummary;
  const titles = summary.records.filter((record) => record.placement === "冠军").length;
  const finals = summary.records.filter((record) => record.placement === "冠军" || record.placement === "亚军").length;
  const currentOffseasonEvent = summary.offseasonEvents?.[summary.offseasonEventIndex ?? 0];
  const resolvedOffseason = summary.resolvedOffseasonEvents ?? [];
  const isFinalSeason = summary.seasonIndex >= CAMPAIGN_SEASONS;
  const offseasonPanelTitle = isFinalSeason ? "年度收官" : "休赛期决策";
  const offseasonDoneTitle = isFinalSeason ? "这一年的总结已经写完" : "休赛期处理完毕";
  const offseasonDoneText = isFinalSeason
    ? "最后一年的比赛已经结束，年度奖项、Top 10、低谷复盘和三杯回顾都保留在这里。因为没有下一场大赛，休赛期事件不再触发；读完这一年的总结后，再进入三年编年史。"
    : "所有休赛期决策都已经落地，队伍带着这些选择进入下一场大赛。";
  return `<section class="screen awards-screen annual-screen">
    ${renderNav(state, "年度总结")}
    <header class="topbar"><div><p class="eyebrow">SEASON WRAP · S${summary.seasonIndex}</p><h1>年度奖项</h1><p class="subcopy">${summary.seasonMessage}</p><div class="inline-strip">${renderInfoChip("年度冠军数", String(titles), titles ? "gold" : "soft")}${renderInfoChip("决赛次数", String(finals), finals ? "accent" : "soft")}${renderInfoChip("年度第一选手", summary.playerOfYear, "accent")}</div></div><button class="ghost" data-action="restart">重新开始</button></header>
    <main class="annual-grid">
      <section class="panel trophy"><p>年度最佳俱乐部</p><h2>${summary.bestClub}</h2><strong>积分 ${summary.bestClubPoints}</strong><p>${summary.bestClub === PLAYER_TEAM ? "这一年，Team gun 终于成了所有人都会重点研究的队伍。" : "这一年的标杆队伍不是你们，但差距已经摆在明面上了。"} </p></section>
      <section class="panel mvp"><p>年度第一选手</p><h2>${summary.playerOfYear}</h2><p>${summary.playerOfYearLine ?? "这个名字在这一年的关键回合里留下了足够清楚的痕迹。"}</p><strong>战术风格：${summary.tacticalStyle ?? "稳定"}</strong></section>
      <section class="panel trophy"><p>年度复盘点</p><h2>最需要复盘的一站</h2><strong>${summary.biggestCollapse}${summary.collapsePlacement ? ` · ${summary.collapsePlacement}` : ""}</strong><p>${summary.collapseReview ?? "这一年没有明显的崩盘杯赛，但真正的强队也会复盘赢下来的回合。别只记得奖杯，记住那些差一点被对手读穿的细节。"}</p>${state.error ? `<p class="error">${state.error}</p>` : ""}</section>
      <section class="panel season-recap"><div class="panel-title"><span>年度寄语</span><span>经理室</span></div><article class="event-card resolved"><h3>写给 Team gun 的话</h3><p>${summary.managerMessage}</p><footer>${summary.seasonQuote}</footer></article></section>
      <section class="panel ranking-board">
        <div class="panel-title"><span>年度 Top 10</span><span>个人评分</span></div>
        ${summary.top10.map((entry) => `<article class="ranking-row"><strong>#${entry.rank} ${entry.name}</strong><span>${entry.points}</span></article>`).join("")}
      </section>
      <section class="panel season-recap">
        <div class="panel-title"><span>${offseasonPanelTitle}</span><span>${resolvedOffseason.length}/${summary.offseasonEvents.length} Events</span></div>
        ${currentOffseasonEvent ? `<article class="event-card active ${currentOffseasonEvent.deltaTone}"><h3>${currentOffseasonEvent.title}</h3><p>${currentOffseasonEvent.narrative}</p><div class="choice-list">${currentOffseasonEvent.options.map((option) => `<button class="primary choice-extended" data-action="offseason-decision" data-choice="${option.id}"><strong>${option.label}</strong></button>`).join("")}</div></article>` : `<article class="event-card resolved"><h3>${offseasonDoneTitle}</h3><p>${offseasonDoneText}</p><button class="primary" data-action="advance">${summary.seasonIndex >= CAMPAIGN_SEASONS ? "看完年度总结，进入三年编年史" : "进入下一赛季"}</button></article>`}
        ${resolvedOffseason.map((event) => `<article class="event-card resolved ${event.tone}"><h3>已处理：${event.title}</h3><p>${event.narrative}</p><div class="decision">${event.choice}</div><p>${event.result}</p></article>`).join("")}
      </section>
      <section class="panel season-recap">
        <div class="panel-title"><span>本赛季三杯回顾</span><span>${summary.records.length} Cups</span></div>
        ${summary.records.map((record) => `<article class="event-card"><h3>${record.cupName} ${renderPlacementTag(record.placement)}</h3><p>${record.champion} 夺冠，Team gun 获得 ${record.placement}。</p><footer>战术风格：${record.tacticalStyle ?? "稳定"}</footer></article>`).join("")}
      </section>
    </main>
  </section>`;
}

function renderChronicle(state) {
  const chronicle = state.chronicle;
  const definingCupLabel = chronicle.definingCup
    ? `S${chronicle.definingCup.seasonIndex ?? 1} / ${chronicleCupYear(chronicle.definingCup)} · ${chronicle.definingCup.cupName}`
    : "待定";
  return `<section class="screen awards-screen chronicle-screen">
    ${renderNav(state, "三年编年史")}
    <header class="topbar"><div><p class="eyebrow">FINAL CHRONICLE</p><h1>Team gun · 三年征途</h1><p class="subcopy">${chronicle.tone}</p><div class="inline-strip">${renderInfoChip("冠军数", String(chronicle.cupWins), chronicle.cupWins ? "gold" : "soft")}${renderInfoChip("决赛次数", String(chronicle.finalsCount), chronicle.finalsCount ? "accent" : "soft")}${renderInfoChip("最佳落点", chronicle.bestPlacement === 1 ? "冠军" : chronicle.bestPlacement === 2 ? "亚军" : chronicle.bestPlacement === 4 ? "四强" : "八强", "soft")}</div></div><button class="ghost" data-action="restart">重新开始</button></header>
    <main class="chronicle-grid">
      <section class="panel trophy player-win"><p>最终冠军数</p><h2>${chronicle.cupWins}</h2><strong>决赛次数 ${chronicle.finalsCount}</strong><p>${chronicle.definingCupWhy?.text ?? "这三年没有奖杯，但每一季都留下了能继续往前走的东西。"}</p></section>
      <section class="panel mvp"><p>定义性杯赛</p><h2>${definingCupLabel}</h2><p><strong>为什么关键：${chronicle.definingCupWhy?.title ?? "继续寻找答案"}</strong></p><p>${chronicle.definingCup?.encouragement ?? "没有某一杯能概括全部，但整段旅程都有清楚的痕迹。"} </p><strong>代表选手：${chronicle.definingCup?.mvp.name ?? "待定"}</strong></section>
      <section class="panel trophy"><p>三年名场面</p><h2>被记住的两三个瞬间</h2>${(chronicle.highlightMoments ?? [{ label: "三年回顾", title: "被记住的一回合", text: chronicle.highlightMoment }]).map((moment) => `<article class="event-card chronicle-moment"><h3>${moment.label}</h3><strong>${moment.title}</strong><p>${moment.text}</p></article>`).join("")}</section>
      <section class="panel trophy"><p>三年结语</p><h2>${chronicle.epilogueTitle}</h2><p>${chronicle.epilogue}</p><button class="primary" data-action="advance">回到征召室</button></section>
      <section class="panel ranking-board">
        <div class="panel-title"><span>九杯冠军簿</span><span>Champion / MVP</span></div>
        ${chronicle.cups.map((record) => `<article class="ranking-row"><strong>S${record.seasonIndex} · ${record.cupName}</strong><span>${record.champion} / ${record.mvp.name} / ${record.placement}</span></article>`).join("")}
      </section>
      <section class="panel season-recap">
        <div class="panel-title"><span>年度总结簿</span><span>${chronicle.seasons.length} Seasons</span></div>
        ${chronicle.seasons.map((season) => `<article class="event-card"><h3>S${season.seasonIndex}</h3><p>最佳俱乐部：${season.bestClub}，年度第一选手：${season.playerOfYear}。</p><footer>战术风格：${season.tacticalStyle ?? "稳定"}</footer></article>`).join("")}
      </section>
    </main>
  </section>`;
}

function render(state) {
  if (state.screen === "chronicle") return renderChronicle(state);
  if (state.screen === "annual-awards") return renderAnnualAwards(state);
  if (state.screen === "between-cups") return renderBetweenCups(state);
  if (state.screen === "awards") return renderAwards(state);
  if (state.screen === "match") return renderMatch(state);
  if (state.screen === "prematch") return renderPrematch(state);
  if (state.screen === "bracket") return renderBracket(state);
  return renderDraft(state);
}

globalThis.__renderBrowserForTest = render;
globalThis.__browserGameTestHooks = {
  buildHubEvent,
  buildHubEvents,
  createCupBracket,
  updateBracketAfterRound,
  createCupResult,
  createEventHistory,
  appendEventHistory,
  pickFreshEvent,
  createTextHistory,
  appendTextHistory,
  pickCupEncouragement,
  seasonDifficultyAdjustment,
  marketPrice,
  tradeSuccessWindow,
  getTradePackage,
  createChronicle,
  chronicleEpiloguePool,
  createAnnualSummary,
  aiTeamProfiles: Object.values(AI_TEAM_PROFILES),
  getPlayerCurrentMatch,
  buildAiTeamSnapshot,
  buildPrematchIntel,
  buildInMatchSurpriseCard,
  mvpAwardText,
  combatBeatLibrary,
  fillTemplate,
  pickStarHighlightFocus,
  makeMatchCards,
  tacticEdgeForChoice,
  summarizeReadPressure,
  traitUtilityScore,
  visibleFeedbackText,
  timeoutScenarioLibrary,
  inMatchSurprisePool: eligibleInMatchSurprises([], {}, {
    team: PLAYER_TEAM,
    rival_team: "Team Vitality",
    player: "ZywOo",
    player_a: "donk",
    player_b: "chopper",
    player_c: "sh1ro",
    player_d: "magixx",
    player_e: "s1ren",
    opponent: "ZywOo",
    opponent_b: "ropz",
    star_player_name: "donk",
    caller_name: "chopper",
    site: "A 点",
  }),
  eligibleInMatchSurprises,
  betweenCupEventPool,
  offseasonEventPool: offseasonEventPool.map(materializeOffseasonEvent),
  players,
  findPlayer: playerById,
  personalityLabel,
  teamStats,
  teamStrength,
  rolePhaseEdgeForRoster,
  chemistryNotes,
};

if (typeof document !== "undefined") {
  let state = createInitialState();
  const root = document.querySelector("#app");
  const uiMemory = {
    matchTimelineTop: 0,
    leftRosterTop: 0,
    rightRosterTop: 0,
    draftListTop: 0,
    tradeOutgoingTop: 0,
    tradeTargetTop: 0,
    windowScrollTop: 0,
    autoScrollTimeline: false,
    documentScrollWired: false,
  };

  function captureScrollPositions() {
    const timeline = root.querySelector(".match-center-scroll");
    const teamPanels = root.querySelectorAll(".team-side-scroll");
    const draftList = root.querySelector(".player-list");
    const tradeOutgoing = root.querySelector('.trade-list[data-scroll-key="tradeOutgoing"]');
    const tradeTarget = root.querySelector('.trade-list[data-scroll-key="tradeTarget"]');
    if (timeline) uiMemory.matchTimelineTop = timeline.scrollTop;
    if (teamPanels[0]) uiMemory.leftRosterTop = teamPanels[0].scrollTop;
    if (teamPanels[1]) uiMemory.rightRosterTop = teamPanels[1].scrollTop;
    if (draftList) uiMemory.draftListTop = draftList.scrollTop;
    if (tradeOutgoing) uiMemory.tradeOutgoingTop = tradeOutgoing.scrollTop;
    if (tradeTarget) uiMemory.tradeTargetTop = tradeTarget.scrollTop;
    if (document.scrollingElement) uiMemory.windowScrollTop = document.scrollingElement.scrollTop;
  }

  function restoreScrollPositions() {
    const timeline = root.querySelector(".match-center-scroll");
    const teamPanels = root.querySelectorAll(".team-side-scroll");
    const draftList = root.querySelector(".player-list");
    const tradeOutgoing = root.querySelector('.trade-list[data-scroll-key="tradeOutgoing"]');
    const tradeTarget = root.querySelector('.trade-list[data-scroll-key="tradeTarget"]');

    if (timeline) {
      if (uiMemory.autoScrollTimeline) {
        const liveCard = timeline.querySelector(".live-event");
        const targetTop = liveCard ? Math.max(0, liveCard.offsetTop - 12) : timeline.scrollHeight;
        requestAnimationFrame(() => {
          timeline.scrollTop = targetTop;
        });
      } else {
        requestAnimationFrame(() => {
          timeline.scrollTop = uiMemory.matchTimelineTop;
        });
      }
    }

    if (draftList) {
      requestAnimationFrame(() => {
        draftList.scrollTop = uiMemory.draftListTop;
      });
    }
    if (tradeOutgoing) {
      requestAnimationFrame(() => {
        tradeOutgoing.scrollTop = uiMemory.tradeOutgoingTop;
      });
    }
    if (tradeTarget) {
      requestAnimationFrame(() => {
        tradeTarget.scrollTop = uiMemory.tradeTargetTop;
      });
    }
    if (teamPanels[0]) {
      requestAnimationFrame(() => {
        teamPanels[0].scrollTop = uiMemory.leftRosterTop;
      });
    }
    if (teamPanels[1]) {
      requestAnimationFrame(() => {
        teamPanels[1].scrollTop = uiMemory.rightRosterTop;
      });
    }
    if (document.scrollingElement) {
      requestAnimationFrame(() => {
        document.scrollingElement.scrollTop = uiMemory.windowScrollTop;
      });
    }
    uiMemory.autoScrollTimeline = false;
  }

  function wireScrollTracking() {
    const timeline = root.querySelector(".match-center-scroll");
    const teamPanels = root.querySelectorAll(".team-side-scroll");
    const draftList = root.querySelector(".player-list");
    const tradeOutgoing = root.querySelector('.trade-list[data-scroll-key="tradeOutgoing"]');
    const tradeTarget = root.querySelector('.trade-list[data-scroll-key="tradeTarget"]');

    if (timeline) {
      timeline.addEventListener("scroll", () => {
        uiMemory.matchTimelineTop = timeline.scrollTop;
      }, { passive: true });
    }
    if (teamPanels[0]) {
      teamPanels[0].addEventListener("scroll", () => {
        uiMemory.leftRosterTop = teamPanels[0].scrollTop;
      }, { passive: true });
    }
    if (teamPanels[1]) {
      teamPanels[1].addEventListener("scroll", () => {
        uiMemory.rightRosterTop = teamPanels[1].scrollTop;
      }, { passive: true });
    }
    if (draftList) {
      draftList.addEventListener("scroll", () => {
        uiMemory.draftListTop = draftList.scrollTop;
      }, { passive: true });
    }
    if (tradeOutgoing) {
      tradeOutgoing.addEventListener("scroll", () => {
        uiMemory.tradeOutgoingTop = tradeOutgoing.scrollTop;
      }, { passive: true });
    }
    if (tradeTarget) {
      tradeTarget.addEventListener("scroll", () => {
        uiMemory.tradeTargetTop = tradeTarget.scrollTop;
      }, { passive: true });
    }
    if (!uiMemory.documentScrollWired) {
      document.addEventListener("scroll", () => {
        if (document.scrollingElement) uiMemory.windowScrollTop = document.scrollingElement.scrollTop;
      }, { passive: true });
      uiMemory.documentScrollWired = true;
    }
  }

  function mount() {
    root.innerHTML = render(state);
    restoreScrollPositions();
    wireScrollTracking();
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    captureScrollPositions();
    uiMemory.autoScrollTimeline = action === "decision" || action === "next";
    if (action === "toggle") state = applyAction(state, { type: "toggle", player: target.dataset.player });
    if (action === "draft-role-filter") state = applyAction(state, { type: "draftRoleFilter", role: target.dataset.role });
    if (action === "substitute") state = applyAction(state, { type: "substitute", player: target.dataset.player });
    if (action === "confirm") state = applyAction(state, { type: "confirm" });
    if (action === "play") state = applyAction(state, { type: "play" });
    if (action === "prematch") state = applyAction(state, { type: "prematchChoice", choice: target.dataset.choice });
    if (action === "decision") state = applyAction(state, { type: "decision", choice: target.dataset.choice });
    if (action === "next") state = applyAction(state, { type: "nextEvent" });
    if (action === "hub-decision") state = applyAction(state, { type: "hubChoice", choice: target.dataset.choice });
    if (action === "trade-filter-outgoing") state = applyAction(state, { type: "tradeFilterOutgoing", role: target.dataset.role });
    if (action === "trade-filter-target") state = applyAction(state, { type: "tradeFilterTarget", role: target.dataset.role });
    if (action === "trade-pick-outgoing") state = applyAction(state, { type: "tradePickOutgoing", playerId: target.dataset.player });
    if (action === "trade-pick-target") state = applyAction(state, { type: "tradePickTarget", playerId: target.dataset.player });
    if (action === "trade-bid") state = applyAction(state, { type: "tradeBid", cash: target.value });
    if (action === "trade") state = applyAction(state, { type: "tradeAttempt" });
    if (action === "offseason-decision") state = applyAction(state, { type: "offseasonChoice", choice: target.dataset.choice });
    if (action === "advance") state = applyAction(state, { type: "advance" });
    if (action === "restart") state = applyAction(state, { type: "restart" });
    mount();
  });

  mount();
}
