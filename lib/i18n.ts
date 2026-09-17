/**
 * Hand-rolled i18n. Two languages and a few hundred strings do not justify a
 * dependency, and this way every key is type-checked: a missing Nepali string
 * is a compile error, not a blank label at runtime.
 *
 * Placeholders use `{name}` syntax. Keys ending in `_one` / `_other` are
 * plural pairs, picked by `translatePlural`.
 */

export type Language = 'en' | 'ne';

export const LANGUAGES: Array<{ code: Language; label: string; english: string }> = [
  { code: 'en', label: 'English', english: 'English' },
  { code: 'ne', label: 'नेपाली', english: 'Nepali' },
];

type Vars = Record<string, string | number>;

const en = {
  // ── Common ──────────────────────────────────────────────────────────────
  appName: 'Len Den',
  tagline: 'your money khata',
  /** Sits under the wordmark on the home screen. */
  homeSubtitle: 'लेनदेन · your money khata',
  seeAll: 'See all',
  cancel: 'Cancel',
  delete: 'Delete',
  gotIt: 'Got it',
  close: 'Close',
  goBack: 'Go back',
  youllGet: "You'll get",
  youllGive: "You'll give",
  youGave: 'You gave',
  youGot: 'You got',
  /** Compact forms for buttons and chips, where Nepali needs fewer syllables. */
  youGaveShort: 'You gave',
  youGotShort: 'You got',
  moneyOut: 'Money out',
  moneyIn: 'Money in',
  settled: 'Settled',
  balanceShort: 'Bal',
  settledUpNote: 'Settled up',

  // ── Tabs ────────────────────────────────────────────────────────────────
  tabHome: 'Home',
  tabPeople: 'People',
  tabActivity: 'Activity',
  tabSettings: 'Settings',

  // ── Dates ───────────────────────────────────────────────────────────────
  today: 'Today',
  yesterday: 'Yesterday',
  tomorrow: 'Tomorrow',
  daysAgo_one: '1 day ago',
  daysAgo_other: '{count} days ago',
  inDays_one: 'In 1 day',
  inDays_other: 'In {count} days',
  dueToday: 'Due today',
  dueTomorrow: 'Due tomorrow',
  dueInDays_one: 'Due in 1 day',
  dueInDays_other: 'Due in {count} days',
  overdueByDays_one: 'Overdue by 1 day',
  overdueByDays_other: 'Overdue by {count} days',

  // ── Counts ──────────────────────────────────────────────────────────────
  entryCount_one: '1 entry',
  entryCount_other: '{count} entries',
  peopleCount_one: '1 person in your khata',
  peopleCount_other: '{count} people in your khata',
  overdueCount_one: '1 overdue',
  overdueCount_other: '{count} overdue',
  entriesRecorded_one: '1 entry recorded',
  entriesRecorded_other: '{count} entries recorded',

  // ── Home ────────────────────────────────────────────────────────────────
  greetingMorning: 'Good morning',
  greetingAfternoon: 'Good afternoon',
  greetingEvening: 'Good evening',
  greetingMorningNamed: 'Good morning, {name}',
  greetingAfternoonNamed: 'Good afternoon, {name}',
  greetingEveningNamed: 'Good evening, {name}',
  heroSettled: 'All settled — nothing pending',
  heroReceive: "Overall, you'll receive",
  heroPay: "Overall, you'll pay",
  expectedReturns: 'Expected returns',
  whoOwesWhat: 'Who owes what',
  recentActivity: 'Recent activity',
  homeEmptyTitle: 'Start your khata',
  homeEmptyBody:
    'Add the people you lend to or borrow from, then record every rupee that changes hands.',
  homeEmptyAction: 'Add your first person',
  allSettledTitle: 'Everyone is settled',
  allSettledBody: 'No pending len den with anyone right now.',
  addPersonLabel: 'Add a person',
  addEntryLabel: 'Add a new entry',

  // ── People ──────────────────────────────────────────────────────────────
  peopleTitle: 'People',
  searchPlaceholder: 'Search by name or phone',
  sortRecent: 'Recent',
  sortHighest: 'Highest',
  sortName: 'A–Z',
  noPeopleTitle: 'No people yet',
  noPeopleBody:
    'Add someone you lend to or borrow from and Len Den will keep the running balance for you.',
  noMatchTitle: 'No match',
  noMatchBody: 'Nobody in your khata matches “{query}”.',
  noEntriesYet: 'No entries yet',

  // ── Activity ────────────────────────────────────────────────────────────
  activityTitle: 'Activity',
  activityMoved: '{amount} moved',
  filterAll: 'All',
  activityEmptyTitle: 'Nothing here yet',
  activityEmptyAll: 'Every rupee you record will show up here, newest first.',
  activityEmptyFiltered: 'No entries match this filter yet.',

  // ── Settings ────────────────────────────────────────────────────────────
  settingsTitle: 'Settings',
  yourKhata: 'Your khata',
  statPeople: 'People',
  statEntries: 'Entries',
  statNet: 'Net',
  yourName: 'Your name',
  yourNamePlaceholder: 'Add your name for the greeting',
  languageSection: 'Language',
  currencySection: 'Currency symbol',
  dataSection: 'Data',
  loadSample: 'Load sample khata',
  loadSampleCaption: 'See how the app looks with data',
  exportBackup: 'Export a backup',
  exportBackupCaption: 'Share your ledger as JSON',
  clearAllData: 'Clear all data',
  clearAllCaption: 'Delete every person and entry',
  privacyTitle: 'Everything stays on this device',
  privacyBody:
    'Len Den saves your khata in the phone’s local storage. Nothing is uploaded anywhere.',
  version: 'Version {version}',
  confirmClearTitle: 'Clear everything?',
  confirmClearBody:
    'All people and entries will be deleted from this device. This cannot be undone.',
  confirmClearAction: 'Delete all',
  confirmSampleTitle: 'Load sample khata?',
  confirmSampleBody: 'This replaces your current people and entries with demo data.',
  confirmSampleAction: 'Load sample',
  exportWebTitle: 'Export on device',
  exportWebBody:
    'Sharing a backup file works in the installed app. Your data stays on the device.',
  shareTitle: 'Len Den backup',

  // ── Person detail ───────────────────────────────────────────────────────
  allSettledShort: 'All settled',
  settleUp: 'Settle up',
  call: 'Call',
  remind: 'Remind',
  history: 'History',
  personNotFound: 'Person not found',
  personNotFoundBody: 'This entry may have been deleted.',
  personEmptyBody: 'Record the first len den with {name} using the buttons above.',
  editPersonLabel: 'Edit person',
  deletePersonLabel: 'Delete person',
  confirmDeletePersonTitle: 'Delete {name}?',
  confirmDeletePersonBody: 'Their entire history will be removed from this device.',
  confirmDeleteEntryTitle: 'Delete this entry?',
  confirmDeleteEntryBody: '{amount} will be removed from the balance.',
  confirmSettleTitle: 'Settle up?',
  confirmSettleReceive: 'Record {amount} received from {name}.',
  confirmSettlePay: 'Record {amount} paid to {name}.',
  confirmSettleAction: 'Settle',
  reminderMessage:
    'Namaste {name}, a gentle reminder about our pending {amount}. Thank you!',

  // ── New entry ───────────────────────────────────────────────────────────
  newEntry: 'New entry',
  amount: 'Amount',
  withWhom: 'With whom',
  tapToChange: 'Tap to change',
  searchOrType: 'Search or type a new name',
  addAsNewPerson: 'Add “{name}” as a new person',
  noPeopleTypeName: 'No people yet — type a name above to create one.',
  details: 'Details',
  notePlaceholder: 'What was it for? (optional)',
  previousDay: 'Previous day',
  nextDay: 'Next day',
  expectedReturn: 'Expected return',
  dueNone: 'None',
  dueOneWeek: '1 week',
  dueFifteenDays: '15 days',
  dueOneMonth: '1 month',
  dueHelper:
    'Optional. Set a date and this loan shows up under “Expected returns” on the home screen.',
  dayEarlier: 'One day earlier',
  dayLater: 'One day later',
  saveGiven: 'Save given {amount}',
  saveReceived: 'Save received {amount}',
  errorChoosePerson: 'Choose who this entry is with.',
  errorAmount: 'Enter an amount greater than zero.',

  // ── New / edit person ───────────────────────────────────────────────────
  newPerson: 'New person',
  editPerson: 'Edit person',
  avatarHintEmpty: 'Their initials become the avatar',
  avatarHintFilled: 'Looking good',
  fieldName: 'Name',
  fieldNamePlaceholder: 'e.g. Sita Gurung',
  fieldPhone: 'Phone',
  fieldPhonePlaceholder: 'Optional — enables call & reminder',
  fieldNote: 'Note',
  fieldNotePlaceholder: 'Optional — e.g. neighbour, office',
  addToKhata: 'Add to khata',
  saveChanges: 'Save changes',
  errorNameRequired: 'A name is required.',
  errorDuplicateName: 'Someone with this name is already in your khata.',

  // ── Currencies ──────────────────────────────────────────────────────────
  currencyNPR: 'Nepali Rupee',
  currencyINR: 'Indian Rupee',
  currencyUSD: 'US Dollar',
  currencyEUR: 'Euro',
  currencyGBP: 'British Pound',

  // ── Welcome ─────────────────────────────────────────────────────────────
  welcomeTitle: 'Namaste 👋',
  welcomeSubtitle: 'Len Den keeps track of every rupee you lend and borrow.',
  chooseLanguage: 'Choose your language',
  chooseCurrency: 'Choose your currency',
  getStarted: 'Get started',
  changeLaterHint: 'You can change both of these later in Settings.',

  // ── Not found ───────────────────────────────────────────────────────────
  notFoundTitle: 'Page not found',
  notFoundBody: 'That screen does not exist in Len Den.',
  backToHome: 'Back to home',
} as const;

export type TKey = keyof typeof en;

const ne: Record<TKey, string> = {
  // ── Common ──────────────────────────────────────────────────────────────
  appName: 'लेनदेन',
  tagline: 'तपाईंको पैसाको खाता',
  homeSubtitle: 'लेनदेन · तपाईंको पैसाको खाता',
  seeAll: 'सबै हेर्नुहोस्',
  cancel: 'रद्द गर्नुहोस्',
  delete: 'मेट्नुहोस्',
  gotIt: 'बुझेँ',
  close: 'बन्द गर्नुहोस्',
  goBack: 'पछाडि जानुहोस्',
  youllGet: 'पाउनु पर्ने',
  youllGive: 'दिनु पर्ने',
  youGave: 'तपाईंले दिनुभयो',
  youGot: 'तपाईंले पाउनुभयो',
  youGaveShort: 'दिनुभयो',
  youGotShort: 'पाउनुभयो',
  moneyOut: 'रकम बाहिर',
  moneyIn: 'रकम भित्र',
  settled: 'मिलेको',
  balanceShort: 'बाँकी',
  settledUpNote: 'हिसाब मिलाइयो',

  // ── Tabs ────────────────────────────────────────────────────────────────
  tabHome: 'गृह',
  tabPeople: 'मान्छे',
  tabActivity: 'गतिविधि',
  tabSettings: 'सेटिङ',

  // ── Dates ───────────────────────────────────────────────────────────────
  today: 'आज',
  yesterday: 'हिजो',
  tomorrow: 'भोलि',
  daysAgo_one: '१ दिन अघि',
  daysAgo_other: '{count} दिन अघि',
  inDays_one: '१ दिनमा',
  inDays_other: '{count} दिनमा',
  dueToday: 'आज नै फिर्ता',
  dueTomorrow: 'भोलि फिर्ता',
  dueInDays_one: '१ दिनमा फिर्ता',
  dueInDays_other: '{count} दिनमा फिर्ता',
  overdueByDays_one: '१ दिन ढिलो',
  overdueByDays_other: '{count} दिन ढिलो',

  // ── Counts ──────────────────────────────────────────────────────────────
  entryCount_one: '१ प्रविष्टि',
  entryCount_other: '{count} प्रविष्टि',
  peopleCount_one: 'तपाईंको खातामा १ जना',
  peopleCount_other: 'तपाईंको खातामा {count} जना',
  overdueCount_one: '१ ढिलो',
  overdueCount_other: '{count} ढिलो',
  entriesRecorded_one: '१ प्रविष्टि राखिएको',
  entriesRecorded_other: '{count} प्रविष्टि राखिएको',

  // ── Home ────────────────────────────────────────────────────────────────
  greetingMorning: 'शुभ प्रभात',
  greetingAfternoon: 'शुभ दिन',
  greetingEvening: 'शुभ सन्ध्या',
  greetingMorningNamed: 'शुभ प्रभात, {name}',
  greetingAfternoonNamed: 'शुभ दिन, {name}',
  greetingEveningNamed: 'शुभ सन्ध्या, {name}',
  heroSettled: 'सबै मिलेको — केही बाँकी छैन',
  heroReceive: 'कुल मिलाएर तपाईंले पाउनुहुन्छ',
  heroPay: 'कुल मिलाएर तपाईंले दिनुपर्छ',
  expectedReturns: 'फिर्ता आउने रकम',
  whoOwesWhat: 'कसको कति बाँकी',
  recentActivity: 'हालैका कारोबार',
  homeEmptyTitle: 'आफ्नो खाता सुरु गर्नुहोस्',
  homeEmptyBody:
    'तपाईंले ऋण दिने वा लिने मान्छे थप्नुहोस्, अनि हरेक रुपैयाँको हिसाब राख्नुहोस्।',
  homeEmptyAction: 'पहिलो व्यक्ति थप्नुहोस्',
  allSettledTitle: 'सबैको हिसाब मिलेको छ',
  allSettledBody: 'अहिले कसैसँग पनि लेनदेन बाँकी छैन।',
  addPersonLabel: 'व्यक्ति थप्नुहोस्',
  addEntryLabel: 'नयाँ प्रविष्टि थप्नुहोस्',

  // ── People ──────────────────────────────────────────────────────────────
  peopleTitle: 'मान्छेहरू',
  searchPlaceholder: 'नाम वा फोनबाट खोज्नुहोस्',
  sortRecent: 'हालैको',
  sortHighest: 'बढी रकम',
  sortName: 'नाम अनुसार',
  noPeopleTitle: 'अहिलेसम्म कोही छैन',
  noPeopleBody:
    'तपाईंले ऋण दिने वा लिने कसैलाई थप्नुहोस्, लेनदेनले बाँकी रकमको हिसाब राखिदिन्छ।',
  noMatchTitle: 'भेटिएन',
  noMatchBody: 'तपाईंको खातामा “{query}” सँग मिल्ने कोही छैन।',
  noEntriesYet: 'अहिलेसम्म कुनै प्रविष्टि छैन',

  // ── Activity ────────────────────────────────────────────────────────────
  activityTitle: 'गतिविधि',
  activityMoved: '{amount} को कारोबार',
  filterAll: 'सबै',
  activityEmptyTitle: 'यहाँ अहिले केही छैन',
  activityEmptyAll: 'तपाईंले राखेको हरेक रुपैयाँ यहाँ, नयाँ पहिले देखिन्छ।',
  activityEmptyFiltered: 'यो छनोटसँग मिल्ने प्रविष्टि छैन।',

  // ── Settings ────────────────────────────────────────────────────────────
  settingsTitle: 'सेटिङ',
  yourKhata: 'तपाईंको खाता',
  statPeople: 'मान्छे',
  statEntries: 'प्रविष्टि',
  statNet: 'कुल',
  yourName: 'तपाईंको नाम',
  yourNamePlaceholder: 'अभिवादनका लागि नाम राख्नुहोस्',
  languageSection: 'भाषा',
  currencySection: 'मुद्रा चिन्ह',
  dataSection: 'डाटा',
  loadSample: 'नमुना खाता लोड गर्नुहोस्',
  loadSampleCaption: 'डाटासहित एप कस्तो देखिन्छ हेर्नुहोस्',
  exportBackup: 'ब्याकअप निकाल्नुहोस्',
  exportBackupCaption: 'आफ्नो खाता JSON मा साझा गर्नुहोस्',
  clearAllData: 'सबै डाटा मेट्नुहोस्',
  clearAllCaption: 'हरेक व्यक्ति र प्रविष्टि मेटिन्छ',
  privacyTitle: 'सबै कुरा यही यन्त्रमा रहन्छ',
  privacyBody:
    'लेनदेनले तपाईंको खाता फोनकै भण्डारणमा राख्छ। कुनै पनि डाटा कतै पठाइँदैन।',
  version: 'संस्करण {version}',
  confirmClearTitle: 'सबै मेट्ने?',
  confirmClearBody:
    'सबै मान्छे र प्रविष्टि यो यन्त्रबाट मेटिनेछन्। यो फिर्ता गर्न सकिँदैन।',
  confirmClearAction: 'सबै मेट्नुहोस्',
  confirmSampleTitle: 'नमुना खाता लोड गर्ने?',
  confirmSampleBody: 'यसले अहिलेको मान्छे र प्रविष्टिलाई नमुना डाटाले बदल्छ।',
  confirmSampleAction: 'लोड गर्नुहोस्',
  exportWebTitle: 'यन्त्रमा निकाल्नुहोस्',
  exportWebBody:
    'ब्याकअप साझा गर्ने सुविधा इन्स्टल गरिएको एपमा चल्छ। तपाईंको डाटा यन्त्रमै रहन्छ।',
  shareTitle: 'लेनदेन ब्याकअप',

  // ── Person detail ───────────────────────────────────────────────────────
  allSettledShort: 'हिसाब मिलेको',
  settleUp: 'हिसाब मिलाउनुहोस्',
  call: 'कल',
  remind: 'सम्झाउनुहोस्',
  history: 'इतिहास',
  personNotFound: 'व्यक्ति भेटिएन',
  personNotFoundBody: 'यो प्रविष्टि मेटिएको हुन सक्छ।',
  personEmptyBody: 'माथिका बटन प्रयोग गरेर {name} सँगको पहिलो लेनदेन राख्नुहोस्।',
  editPersonLabel: 'व्यक्ति सम्पादन',
  deletePersonLabel: 'व्यक्ति मेट्नुहोस्',
  confirmDeletePersonTitle: '{name} लाई मेट्ने?',
  confirmDeletePersonBody: 'उहाँको सम्पूर्ण इतिहास यो यन्त्रबाट हट्नेछ।',
  confirmDeleteEntryTitle: 'यो प्रविष्टि मेट्ने?',
  confirmDeleteEntryBody: '{amount} बाँकी रकमबाट हट्नेछ।',
  confirmSettleTitle: 'हिसाब मिलाउने?',
  confirmSettleReceive: '{name} बाट {amount} पाएको राख्नुहोस्।',
  confirmSettlePay: '{name} लाई {amount} दिएको राख्नुहोस्।',
  confirmSettleAction: 'मिलाउनुहोस्',
  reminderMessage:
    'नमस्ते {name}, हाम्रो बाँकी {amount} बारे सम्झाउन खोजेको। धन्यवाद!',

  // ── New entry ───────────────────────────────────────────────────────────
  newEntry: 'नयाँ प्रविष्टि',
  amount: 'रकम',
  withWhom: 'कोसँग',
  tapToChange: 'बदल्न थिच्नुहोस्',
  searchOrType: 'खोज्नुहोस् वा नयाँ नाम लेख्नुहोस्',
  addAsNewPerson: '“{name}” लाई नयाँ व्यक्तिका रूपमा थप्नुहोस्',
  noPeopleTypeName: 'अहिलेसम्म कोही छैन — माथि नाम लेखेर थप्नुहोस्।',
  details: 'विवरण',
  notePlaceholder: 'केका लागि थियो? (वैकल्पिक)',
  previousDay: 'अघिल्लो दिन',
  nextDay: 'अर्को दिन',
  expectedReturn: 'फिर्ता आउने मिति',
  dueNone: 'छैन',
  dueOneWeek: '१ हप्ता',
  dueFifteenDays: '१५ दिन',
  dueOneMonth: '१ महिना',
  dueHelper:
    'वैकल्पिक। मिति राख्नुभयो भने यो ऋण गृह पृष्ठको “फिर्ता आउने रकम” मा देखिन्छ।',
  dayEarlier: 'एक दिन अघि',
  dayLater: 'एक दिन पछि',
  saveGiven: '{amount} दिएको राख्नुहोस्',
  saveReceived: '{amount} पाएको राख्नुहोस्',
  errorChoosePerson: 'यो प्रविष्टि कोसँगको हो छान्नुहोस्।',
  errorAmount: 'शून्यभन्दा बढी रकम राख्नुहोस्।',

  // ── New / edit person ───────────────────────────────────────────────────
  newPerson: 'नयाँ व्यक्ति',
  editPerson: 'व्यक्ति सम्पादन',
  avatarHintEmpty: 'नामका अक्षरहरू नै अवतार बन्छन्',
  avatarHintFilled: 'राम्रो देखियो',
  fieldName: 'नाम',
  fieldNamePlaceholder: 'जस्तै: सीता गुरुङ',
  fieldPhone: 'फोन',
  fieldPhonePlaceholder: 'वैकल्पिक — कल र सम्झना पठाउन मिल्छ',
  fieldNote: 'टिप्पणी',
  fieldNotePlaceholder: 'वैकल्पिक — जस्तै: छिमेकी, अफिस',
  addToKhata: 'खातामा थप्नुहोस्',
  saveChanges: 'परिवर्तन सुरक्षित गर्नुहोस्',
  errorNameRequired: 'नाम अनिवार्य छ।',
  errorDuplicateName: 'यो नामको व्यक्ति पहिले नै खातामा हुनुहुन्छ।',

  // ── Currencies ──────────────────────────────────────────────────────────
  currencyNPR: 'नेपाली रुपैयाँ',
  currencyINR: 'भारतीय रुपैयाँ',
  currencyUSD: 'अमेरिकी डलर',
  currencyEUR: 'युरो',
  currencyGBP: 'बेलायती पाउन्ड',

  // ── Welcome ─────────────────────────────────────────────────────────────
  welcomeTitle: 'नमस्ते 👋',
  welcomeSubtitle: 'लेनदेनले तपाईंले दिने र लिने हरेक रुपैयाँको हिसाब राख्छ।',
  chooseLanguage: 'आफ्नो भाषा छान्नुहोस्',
  chooseCurrency: 'आफ्नो मुद्रा छान्नुहोस्',
  getStarted: 'सुरु गरौं',
  changeLaterHint: 'यी दुवै पछि सेटिङमा गएर बदल्न सकिन्छ।',

  // ── Not found ───────────────────────────────────────────────────────────
  notFoundTitle: 'पृष्ठ भेटिएन',
  notFoundBody: 'लेनदेनमा त्यस्तो पृष्ठ छैन।',
  backToHome: 'गृह पृष्ठमा फर्कनुहोस्',
};

const dictionaries: Record<Language, Record<TKey, string>> = { en, ne };

/** Month abbreviations used by `formatDate`. */
export const MONTHS: Record<Language, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ne: ['जन', 'फेब', 'मार्च', 'अप्रिल', 'मे', 'जुन', 'जुलाई', 'अग', 'सेप', 'अक्टो', 'नोभ', 'डिस'],
};

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function translate(lang: Language, key: TKey, vars?: Vars): string {
  // `lang` can arrive undefined from a ledger saved before languages existed.
  const dictionary = dictionaries[lang] ?? en;
  const template = dictionary[key] ?? en[key];
  return interpolate(template, vars);
}

/** Bases that have `_one` / `_other` variants in the dictionaries. */
export type PluralBase =
  | 'daysAgo'
  | 'inDays'
  | 'dueInDays'
  | 'overdueByDays'
  | 'entryCount'
  | 'peopleCount'
  | 'overdueCount'
  | 'entriesRecorded';

export function translatePlural(
  lang: Language,
  base: PluralBase,
  count: number,
  vars?: Vars,
): string {
  const key = `${base}_${count === 1 ? 'one' : 'other'}` as TKey;
  return translate(lang, key, { ...vars, count });
}
