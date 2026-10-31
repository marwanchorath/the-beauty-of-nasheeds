// The wider collection: instrument-free voices beside Ahmed Bukhatir.
// Each artist here is either documented as voice-only, or the tracks chosen are
// documented as vocals-only. Lyrics are not reproduced; themes are written for
// this site, and `known` marks the ones taken from published descriptions.
import { BUKHATIR, BUKHATIR_ALBUMS, type Nasheed } from "./data"

export type Artist = {
  id: string
  name: string
  ar: string | null
  origin: string
  years: string
  line: string
  facts: string[]
}

export const ARTISTS: Artist[] = [
  { id: "bukhatir", name: "Ahmed Bukhatir", ar: "أحمد بوخاطر", origin: "Sharjah, UAE", years: "b. 1975",
    line: "A voice trained on tajwid, singing without instruments by conviction.",
    facts: ["Studied Qur'anic recitation as a child at an Islamic centre in Sharjah", "Released seven albums between 2000 and 2010", "Last Breath carried his voice far beyond the Arab world", "Named among the 500 Most Influential Muslims in 2009"] },
  { id: "alafasy", name: "Mishary Rashid Alafasy", ar: "مشاري راشد العفاسي", origin: "Kuwait", years: "b. 1976",
    line: "An imam and reciter whose nasheeds build rhythm from layered voices alone.",
    facts: ["Imam of the Grand Mosque in Kuwait City", "Studied the ten qira'at and tafsir at the Islamic University of Madinah", "Has recorded nasheeds in Japanese, Turkish, English and French", "Also recorded the classical pre-Islamic Mu'allaqat odes"] },
  { id: "muqit", name: "Muhammad al-Muqit", ar: "محمد المقيط", origin: "Riyadh, Saudi Arabia", years: "b. 1989",
    line: "Quiet, intimate nasheeds that became some of the most-streamed in the Gulf.",
    facts: ["Releases his work in a numbered series, Anasheeds Vol. 1 to Vol. 10", "Writes many of his own lyrics", "The Way of the Tears and I Rise are his best known", "One of the most-listened-to Saudi artists on Spotify"] },
  { id: "arada", name: "Mishary Al-Arada", ar: "مشاري العرادة", origin: "Kuwait", years: "1982 – 2018",
    line: "Remembered for one nasheed about the grave that the whole region knows.",
    facts: ["Farshi Al-Turab (2004) became his signature", "Performed in the UK, Indonesia and Australia", "Died in a road accident in Saudi Arabia, aged 35", "Fellow reciters, Alafasy among them, mourned him publicly"] },
  { id: "tarek", name: "Mohamed Tarek", ar: "محمد طارق", origin: "", years: "",
    line: "Voices that stand in for drums and synths: a nasheed with no instruments that sounds full.",
    facts: ["Best known for Tawakkaltu Fi Rizqi 'Ala Allah (2019)", "His backing vocals imitate percussion and synthesizers"] },
  { id: "omar-esa", name: "Omar Esa", ar: null, origin: "London, UK", years: "Since 2011",
    line: "“My voice is my instrument”: a former R&B singer who turned to voice-only nasheeds.",
    facts: ["Sang his first nasheed in late 2011; debut album in 2012", "Sings in English, Urdu and Arabic, using only his voice", "Allah and His Beloved reached No. 3 on the iTunes UK chart", "An outspoken advocate of voice-only nasheeds"] },
  { id: "muad", name: "Muad", ar: null, origin: "", years: "",
    line: "Soft, layered vocals: many of his releases come as official vocals-only versions.",
    facts: ["Jannah, with Zain Bhikha, is among his best known", "Releases Al-Quran, Ramadan and others as vocals-only versions"] },
]

const V = (ar: string, en: string, ref: string) => ({ ar, en, ref })
type N = Nasheed & { artist: string }

const OTHERS: N[] = [
  // ── Mishary Rashid Alafasy
  { artist: "alafasy", id: "alafasy-tawhid", title: "La Ilaha Illallah", ar: "لا إله إلا الله", meaning: "There Is No God but Allah", album: "Single", year: 2011, lang: "Arabic",
    theme: "Praise and the testimony of faith. There are no instruments at all: the rhythm and melody are built from his own backing vocals, layered and shaped.", known: true,
    verse: V("اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", "Allah: there is no god but Him, the Ever-Living, the Sustainer of all.", "Al-Baqarah 2:255"),
    scene: "star", tags: ["Tawhid", "Worship"] },
  { artist: "alafasy", id: "alafasy-sirr", title: "Hal Laka Sirrun 'Inda Allah", ar: "هل لك سر عند الله", meaning: "Do You Have a Secret with Allah?", album: "Nasheed", year: null, lang: "Arabic",
    theme: "A question to keep: is there a good deed only Allah knows about? He has also recorded it in other languages, including Japanese.", known: false,
    verse: V("إِن تُبْدُوا الصَّدَقَاتِ فَنِعِمَّا هِيَ ۖ وَإِن تُخْفُوهَا وَتُؤْتُوهَا الْفُقَرَاءَ فَهُوَ خَيْرٌ لَّكُمْ", "If you give charity openly, that is good; but if you conceal it and give it to the poor, that is better for you.", "Al-Baqarah 2:271"),
    scene: "night", tags: ["Ihsan", "Good Deeds"] },
  { artist: "alafasy", id: "alafasy-fahm", title: "Aya Man Yadda'i Al-Fahm", ar: "أيا من يدعي الفهم", meaning: "O You Who Claim to Understand", album: "Nasheed", year: null, lang: "Arabic",
    theme: "Addressed to the one who thinks he has understood it all: a call to humility before what we do not know.", known: false,
    verse: V("وَمَا أُوتِيتُم مِّنَ الْعِلْمِ إِلَّا قَلِيلًا", "You have been given only a little of knowledge.", "Al-Isra 17:85"),
    scene: "book", tags: ["Knowledge", "Reflection"] },
  { artist: "alafasy", id: "alafasy-lataif", title: "Allah Dhul-Lata'if", ar: "الله ذو اللطائف", meaning: "Allah, the One of Gentle Kindnesses", album: "Nasheed", year: null, lang: "Arabic",
    theme: "The quiet ways Allah takes care of His servant: mercies too subtle to notice until later.", known: false,
    verse: V("اللَّهُ لَطِيفٌ بِعِبَادِهِ", "Allah is subtly kind to His servants.", "Ash-Shura 42:19"),
    scene: "lantern", tags: ["Allah", "Gratitude"] },
  { artist: "alafasy", id: "alafasy-abd", title: "Ana Al-'Abd", ar: "أنا العبد", meaning: "I Am the Servant", album: "Nasheed", year: null, lang: "Arabic",
    theme: "Standing before Allah as a servant: weak, in need, and honoured by that very servanthood.", known: false,
    verse: V("وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ", "I did not create jinn and mankind except to worship Me.", "Adh-Dhariyat 51:56"),
    scene: "hands", tags: ["Worship", "Repentance"] },
  { artist: "alafasy", id: "alafasy-rahman", title: "Rahman Ya Rahman", ar: "رحمن يا رحمن", meaning: "O Most Merciful", album: "Nasheed", year: null, lang: "Arabic",
    theme: "Calling on Allah by His name of mercy, again and again.", known: false,
    verse: V("الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ", "The Most Merciful, who taught the Qur'an.", "Ar-Rahman 55:1–2"),
    scene: "oasis", tags: ["Allah", "Du'a"] },

  // ── Muhammad al-Muqit
  { artist: "muqit", id: "muqit-tears", title: "The Way of the Tears", ar: "سبيل الدموع", meaning: "The Way of the Tears", album: "Anasheeds, Vol. 3", year: null, lang: "Arabic",
    theme: "Minimal and ruminative: it asks you to be vulnerable in private prayer, and finds comfort on the far side of tears. He wrote the words himself.", known: true,
    verse: V("أَمَّن يُجِيبُ الْمُضْطَرَّ إِذَا دَعَاهُ وَيَكْشِفُ السُّوءَ", "Who answers the one in distress when he calls, and lifts the harm?", "An-Naml 27:62"),
    scene: "rain", tags: ["Du'a", "Patience"] },
  { artist: "muqit", id: "muqit-asmu", title: "I Rise", ar: "أسمو", meaning: "I Rise", album: "Anasheeds, Vol. 3", year: null, lang: "Arabic",
    theme: "His most popular track: waking up to a new day and counting what you are grateful for, then carrying that joy to others.", known: true,
    verse: V("لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", "If you are grateful, I will surely give you more.", "Ibrahim 14:7"),
    scene: "dawn", tags: ["Gratitude", "Joy"] },
  { artist: "muqit", id: "muqit-lugha", title: "My Arabic Language", ar: null, meaning: "My Arabic Language", album: "Anasheeds, Vol. 3", year: null, lang: "Arabic",
    theme: "Love for Arabic, the language the Qur'an chose.", known: false,
    verse: V("إِنَّا أَنزَلْنَاهُ قُرْآنًا عَرَبِيًّا لَّعَلَّكُمْ تَعْقِلُونَ", "We sent it down as an Arabic Qur'an so that you may understand.", "Yusuf 12:2"),
    scene: "book", tags: ["Qur'an", "Knowledge"] },
  { artist: "muqit", id: "muqit-hope", title: "My Hope (Allah)", ar: null, meaning: "My Hope Is Allah", album: "Anasheeds", year: null, lang: "Arabic",
    theme: "Placing every hope in one place, the only place it cannot be lost.", known: false,
    verse: V("وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "Whoever relies on Allah, He is enough for him.", "At-Talaq 65:3"),
    scene: "mountain", tags: ["Tawakkul", "Hope"] },
  { artist: "muqit", id: "muqit-tabsirah", title: "Tabsirah", ar: "تبصرة", meaning: "Insight", album: "Anasheeds", year: null, lang: "Arabic",
    theme: "Tabsirah is a Qur'anic word: something that opens the eyes. The title invites you to see more clearly.", known: false,
    verse: V("تَبْصِرَةً وَذِكْرَىٰ لِكُلِّ عَبْدٍ مُّنِيبٍ", "As insight and a reminder for every servant who turns back to Allah.", "Qaf 50:8"),
    scene: "star", tags: ["Reflection"] },
  { artist: "muqit", id: "muqit-bride", title: "Bride of Light (Wedding Nasheed)", ar: "عروسة النور", meaning: "Bride of Light", album: "Anasheeds", year: null, lang: "Arabic",
    theme: "A wedding nasheed, released music-free: blessings and joy for a new home.", known: true,
    verse: V("وَأَنكِحُوا الْأَيَامَىٰ مِنكُمْ", "Marry off the single among you.", "An-Nur 24:32"),
    scene: "lantern", tags: ["Marriage", "Joy"] },
  { artist: "muqit", id: "muqit-uns", title: "Mountains of Friendship", ar: "ربى الأنس", meaning: "Hills of Companionship", album: "Single", year: 2023, lang: "Arabic",
    theme: "The comfort of good company, the kind that brings you closer to Allah.", known: false,
    verse: V("وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا", "Hold firmly together to the rope of Allah and do not be divided.", "Al Imran 3:103"),
    scene: "mountain", tags: ["Brotherhood"] },
  { artist: "muqit", id: "muqit-wujud", title: "The Beauty of Existence", ar: null, meaning: "The Beauty of Existence", album: "with Hamoud Al-Qahtani", year: null, lang: "Arabic",
    theme: "Wonder at creation, and at the One behind it.", known: false,
    verse: V("إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِّأُولِي الْأَلْبَابِ", "In the creation of the heavens and the earth and the alternation of night and day are signs for people of understanding.", "Al Imran 3:190"),
    scene: "oasis", tags: ["Reflection", "Gratitude"] },
  { artist: "muqit", id: "muqit-shakwa", title: "My Complaint Is to Allah", ar: null, meaning: "My Complaint Is to Allah", album: "Anasheeds", year: null, lang: "Arabic",
    theme: "Taking the weight of the heart to the One who can lift it, rather than to people.", known: false,
    verse: V("أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ", "Harm has touched me, and You are the Most Merciful of the merciful.", "Al-Anbiya 21:83"),
    scene: "rain", tags: ["Patience", "Du'a"] },
  { artist: "muqit", id: "muqit-qabas", title: "Qabas", ar: "قبس", meaning: "A Burning Brand", album: "Anasheeds", year: null, lang: "Arabic",
    theme: "A qabas is a flame carried from a fire. It is the word Musa used when he saw the fire that led him to his Lord.", known: false,
    verse: V("لَّعَلِّي آتِيكُم مِّنْهَا بِقَبَسٍ أَوْ أَجِدُ عَلَى النَّارِ هُدًى", "Perhaps I will bring you a burning brand from it, or find guidance at the fire.", "Ta-Ha 20:10"),
    scene: "lantern", tags: ["Prophets", "Guidance"] },
  { artist: "muqit", id: "muqit-caliphs", title: "Rightly Guided Caliphs", ar: null, meaning: "The Rightly Guided Caliphs", album: "Anasheeds, Vol. 10", year: 2024, lang: "Arabic",
    theme: "Abu Bakr, Umar, Uthman and Ali: the four who led after the Prophet ﷺ.", known: false,
    verse: V("عَلَيْكُمْ بِسُنَّتِي وَسُنَّةِ الْخُلَفَاءِ الرَّاشِدِينَ الْمَهْدِيِّينَ", "Hold to my Sunnah and the Sunnah of the rightly guided caliphs.", "Hadith · Abu Dawud, Tirmidhi"),
    scene: "dome", tags: ["History", "Prophet ﷺ"] },
  { artist: "muqit", id: "muqit-shafi", title: "Master of Intercessors", ar: null, meaning: "Master of Intercessors", album: "Anasheeds, Vol. 10", year: 2024, lang: "Arabic",
    theme: "The Prophet ﷺ as the one who will intercede for his Ummah on the Day of Judgement.", known: false,
    verse: V("عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا", "It may be that your Lord will raise you to a praised station.", "Al-Isra 17:79"),
    scene: "dome", tags: ["Prophet ﷺ"] },
  { artist: "muqit", id: "muqit-umm", title: "My Mother, How Much I Love Her", ar: null, meaning: "My Mother, How Much I Love Her", album: "Anasheeds", year: null, lang: "Arabic",
    theme: "A son's love for his mother, said plainly.", known: false,
    verse: V("أُمُّكَ، ثُمَّ أُمُّكَ، ثُمَّ أُمُّكَ، ثُمَّ أَبُوكَ", "Your mother, then your mother, then your mother, then your father.", "Hadith · Bukhari & Muslim"),
    scene: "hands", tags: ["Family", "Parents"] },
  { artist: "muqit", id: "muqit-muslim", title: "I Am a Muslim", ar: null, meaning: "I Am a Muslim", album: "Anasheeds, Vol. 1", year: null, lang: "Arabic",
    theme: "Identity, stated with pride and without apology.", known: false,
    verse: V("وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ وَعَمِلَ صَالِحًا وَقَالَ إِنَّنِي مِنَ الْمُسْلِمِينَ", "Who is better in speech than one who calls to Allah, does good, and says: I am of the Muslims?", "Fussilat 41:33"),
    scene: "city", tags: ["Identity"] },
  { artist: "muqit", id: "muqit-qaleel", title: "Tabalagh Bil-Qaleel", ar: "تبلّغ بالقليل", meaning: "Make Do with Little", album: "Anasheeds", year: null, lang: "Arabic",
    theme: "Contentment: a little, with peace of heart, is more than a lot without it.", known: false,
    verse: V("لَيْسَ الْغِنَى عَنْ كَثْرَةِ الْعَرَضِ، وَلَكِنَّ الْغِنَى غِنَى النَّفْسِ", "Richness is not having many possessions; true richness is the richness of the soul.", "Hadith · Bukhari & Muslim"),
    scene: "path", tags: ["Dunya", "Gratitude"] },
  { artist: "muqit", id: "muqit-rest", title: "Where I Find Rest", ar: null, meaning: "Where I Find Rest", album: "Anasheeds", year: null, lang: "Arabic",
    theme: "The search for a place where the heart can finally settle.", known: false,
    verse: V("هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ", "It is He who sent down tranquillity into the hearts of the believers.", "Al-Fath 48:4"),
    scene: "night", tags: ["Longing", "Peace"] },

  // ── Mishary Al-Arada
  { artist: "arada", id: "arada-turab", title: "Farshi Al-Turab", ar: "فرشي التراب", meaning: "The Dust Is My Bed", album: "Single", year: 2004, lang: "Arabic",
    theme: "The grave, and how briefly we are given this life. He said himself that it is about death, not about the one carried on shoulders. After his own death at 35, it took on a haunting weight.", known: true,
    verse: V("مِنْهَا خَلَقْنَاكُمْ وَفِيهَا نُعِيدُكُمْ وَمِنْهَا نُخْرِجُكُمْ تَارَةً أُخْرَىٰ", "From it We created you, to it We will return you, and from it We will bring you out once more.", "Ta-Ha 20:55"),
    scene: "path", tags: ["Death", "Reflection"] },
  { artist: "arada", id: "arada-sadiqi", title: "Sadiqi", ar: "صديقي", meaning: "My Friend", album: "Nasheed", year: null, lang: "Arabic",
    theme: "Friendship, and the friend who still stands by you on the Last Day.", known: false,
    verse: V("الْأَخِلَّاءُ يَوْمَئِذٍ بَعْضُهُمْ لِبَعْضٍ عَدُوٌّ إِلَّا الْمُتَّقِينَ", "Close friends will be enemies to one another that Day, except the God-conscious.", "Az-Zukhruf 43:67"),
    scene: "mountain", tags: ["Brotherhood"] },

  // ── Mohamed Tarek
  { artist: "tarek", id: "tarek-rizq", title: "Tawakkaltu Fi Rizqi 'Ala Allah", ar: "توكلت في رزقي على الله", meaning: "I Rely on Allah for My Provision", album: "Single", year: 2019, lang: "Arabic",
    theme: "Seeking comfort and protection from Allah, and trusting Him for your provision. The backing voices stand in for percussion and synths.", known: true,
    verse: V("وَمَا مِن دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا", "There is no creature on earth whose provision is not upon Allah.", "Hud 11:6"),
    scene: "oasis", tags: ["Tawakkul"] },

  // ── Omar Esa
  { artist: "omar-esa", id: "esa-ramadan", title: "Welcome Ramadan", ar: null, meaning: "Welcome Ramadan", album: "Single", year: 2017, lang: "English",
    theme: "A tender welcome to the holy month, and to the chance it brings to change.", known: true,
    verse: V("شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ", "The month of Ramadan, in which the Qur'an was sent down as guidance for mankind.", "Al-Baqarah 2:185"),
    scene: "lantern", tags: ["Ramadan"] },
  { artist: "omar-esa", id: "esa-99", title: "99 Names of Allah", ar: null, meaning: "99 Names of Allah", album: "Single", year: 2014, lang: "English",
    theme: "A reflective walk through the names of Allah.", known: true,
    verse: V("وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا", "To Allah belong the most beautiful names, so call on Him by them.", "Al-A'raf 7:180"),
    scene: "star", tags: ["Allah", "Tawhid"] },
  { artist: "omar-esa", id: "esa-beloved", title: "Allah and His Beloved", ar: null, meaning: "Allah and His Beloved", album: "Allah and His Beloved", year: null, lang: "English",
    theme: "Love for Allah and His Messenger ﷺ. It reached No. 3 on the iTunes UK chart.", known: true,
    verse: V("إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ", "Allah and His angels send blessings upon the Prophet.", "Al-Ahzab 33:56"),
    scene: "dome", tags: ["Prophet ﷺ", "Allah"] },
  { artist: "omar-esa", id: "esa-wudu", title: "The Wudu Nasheed", ar: null, meaning: "The Wudu Nasheed", album: "My Muslim Family", year: null, lang: "English",
    theme: "The steps of wudu, the purification before prayer.", known: false,
    verse: V("إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ", "Allah loves those who turn back to Him, and loves those who purify themselves.", "Al-Baqarah 2:222"),
    scene: "rain", tags: ["Worship", "Children"] },
  { artist: "omar-esa", id: "esa-father", title: "A Father", ar: null, meaning: "A Father", album: "Single", year: 2025, lang: "English",
    theme: "What a father gives, often without saying it.", known: false,
    verse: V("رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", "My Lord, have mercy on them as they raised me when I was small.", "Al-Isra 17:24"),
    scene: "hands", tags: ["Family", "Parents"] },
  { artist: "omar-esa", id: "esa-prophet", title: "My Prophet", ar: null, meaning: "My Prophet", album: "Single", year: 2025, lang: "English",
    theme: "Love for the Prophet Muhammad ﷺ, and following his example.", known: false,
    verse: V("لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ", "In the Messenger of Allah you have an excellent example.", "Al-Ahzab 33:21"),
    scene: "dome", tags: ["Prophet ﷺ"] },

  // ── Muad
  { artist: "muad", id: "muad-jannah", title: "Jannah (with Zain Bhikha)", ar: null, meaning: "Paradise", album: "Vocals-only version", year: 2020, lang: "English",
    theme: "The reward of prayer, and keeping perspective on how temporary this life is.", known: true,
    verse: V("فَلَا تَعْلَمُ نَفْسٌ مَّا أُخْفِيَ لَهُم مِّن قُرَّةِ أَعْيُنٍ", "No soul knows what delights have been hidden away for them.", "As-Sajdah 32:17"),
    scene: "oasis", tags: ["Jannah", "Longing"] },
  { artist: "muad", id: "muad-quran", title: "Al-Quran", ar: "القرآن", meaning: "The Qur'an", album: "Vocals-only version", year: null, lang: "English",
    theme: "Love for the Book of Allah and what it does to a heart that listens.", known: false,
    verse: V("لَوْ أَنزَلْنَا هَٰذَا الْقُرْآنَ عَلَىٰ جَبَلٍ لَّرَأَيْتَهُ خَاشِعًا مُّتَصَدِّعًا مِّنْ خَشْيَةِ اللَّهِ", "Had We sent this Qur'an down upon a mountain, you would have seen it humbled and split apart in awe of Allah.", "Al-Hashr 59:21"),
    scene: "book", tags: ["Qur'an"] },
  { artist: "muad", id: "muad-ramadan", title: "Ramadan", ar: "رمضان", meaning: "Ramadan", album: "Vocals-only version", year: null, lang: "English",
    theme: "The month of fasting and forgiveness.", known: false,
    verse: V("مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ", "Whoever fasts Ramadan with faith and hope of reward will have his past sins forgiven.", "Hadith · Bukhari & Muslim"),
    scene: "lantern", tags: ["Ramadan"] },
  { artist: "muad", id: "muad-eid", title: "Ahlan Ya Eid", ar: "أهلًا يا عيد", meaning: "Welcome, O Eid", album: "Vocals-only version", year: null, lang: "Arabic",
    theme: "Greeting the day of Eid with joy.", known: false,
    verse: V("قُلْ بِفَضْلِ اللَّهِ وَبِرَحْمَتِهِ فَبِذَٰلِكَ فَلْيَفْرَحُوا", "Say: in the grace of Allah and His mercy, in that let them rejoice.", "Yunus 10:58"),
    scene: "city", tags: ["Eid", "Joy"] },
]

export const ALL: N[] = [...BUKHATIR.map((n) => ({ ...n, artist: "bukhatir" })), ...OTHERS]
export const byArtist = (id: string) => ALL.filter((n) => n.artist === id)
export const artistOf = (n: { artist: string }) => ARTISTS.find((a) => a.id === n.artist)!
export { BUKHATIR_ALBUMS }

export const MOODS = [
  { id: "longing", label: "Longing", ar: "شوق", tags: ["Longing", "Jannah"] },
  { id: "grateful", label: "Grateful", ar: "شكر", tags: ["Gratitude", "Joy"] },
  { id: "heavy", label: "Heavy-hearted", ar: "صبر", tags: ["Patience", "Du'a", "Repentance"] },
  { id: "reminded", label: "Needing a reminder", ar: "ذكرى", tags: ["Death", "Dunya", "Reflection", "Time"] },
  { id: "prophet", label: "Missing the Prophet ﷺ", ar: "حب", tags: ["Prophet ﷺ"] },
  { id: "family", label: "Thinking of family", ar: "أهل", tags: ["Family", "Parents", "Marriage", "Children", "Brotherhood"] },
  { id: "trust", label: "Worried about tomorrow", ar: "توكل", tags: ["Tawakkul", "Hope", "Peace"] },
  { id: "festive", label: "Ramadan & Eid", ar: "عيد", tags: ["Ramadan", "Eid"] },
]

// Arabic words from the titles, for the flip-card game (the one place, with listening, that earns XP).
export const WORDS = [
  { ar: "شوق", tr: "shawq", en: "yearning, deep longing" },
  { ar: "عظيم", tr: "'adheem", en: "great, magnificent" },
  { ar: "غرور", tr: "ghurur", en: "illusion, self-deception" },
  { ar: "علم", tr: "'ilm", en: "knowledge" },
  { ar: "أمّ", tr: "umm", en: "mother" },
  { ar: "أخ", tr: "akh", en: "brother" },
  { ar: "حسنات", tr: "hasanat", en: "good deeds" },
  { ar: "غربة", tr: "ghurba", en: "exile, being a stranger" },
  { ar: "نسيم", tr: "naseem", en: "a gentle breeze" },
  { ar: "اقرأ", tr: "iqra'", en: "read! recite!" },
  { ar: "سرّ", tr: "sirr", en: "a secret" },
  { ar: "دموع", tr: "dumu'", en: "tears" },
  { ar: "تبصرة", tr: "tabsira", en: "insight, something that opens the eyes" },
  { ar: "قبس", tr: "qabas", en: "a flame carried from a fire" },
  { ar: "تراب", tr: "turab", en: "dust, earth" },
  { ar: "رزق", tr: "rizq", en: "provision, sustenance" },
]
