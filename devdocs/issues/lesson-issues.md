# Lesson Development Issues

This document contains detailed specifications for each planned lesson. Each section represents a GitHub issue to be created for lesson development.

---

## Issue Template Format

Each issue follows this structure:
- **Title**: feat(lessons): [Lesson Name]
- **Labels**: `enhancement`, `lesson`, `[level]` (A1/A2/B1/B2)
- **Description**: Learning objectives, content outline, exercise specifications

---

# A1 Level Issues (Foundation)

---

## Issue #1: Lesson 4 - Numbers 0-100 & Age Expressions

**Labels:** `enhancement`, `lesson`, `A1`, `priority-high`

### Description
Create an interactive lesson teaching Hungarian numbers from 0-100 and age-related expressions.

### Learning Objectives
- Recognize and produce numbers 0-20 (unique forms)
- Understand the pattern for numbers 21-99
- Express age using "Hány éves vagy/van?" pattern
- Use numbers in practical contexts (prices, quantities)

### Content Outline

#### Section 1: Numbers 0-10
| Number | Hungarian | Pronunciation Guide |
|--------|-----------|-------------------|
| 0 | nulla | NOO-lah |
| 1 | egy | edge |
| 2 | kettő/két | KET-tuh / kayt |
| 3 | három | HAH-rohm |
| 4 | négy | nayj |
| 5 | öt | ut |
| 6 | hat | hot |
| 7 | hét | hayt |
| 8 | nyolc | nyolts |
| 9 | kilenc | KEE-lents |
| 10 | tíz | teez |

#### Section 2: Numbers 11-20
- tizenegy, tizenkettő, tizenhárom... (tizen- prefix)

#### Section 3: Tens (20-100)
- húsz (20), harminc (30), negyven (40), ötven (50)
- hatvan (60), hetven (70), nyolcvan (80), kilencven (90), száz (100)

#### Section 4: Compound Numbers
- Pattern: [tens] + [units] (e.g., huszonegy = 21)
- Note: húsz → huszon-, harminc → harminc- (no change)

#### Section 5: Age Expressions
- "Hány éves vagy?" (How old are you? - informal)
- "Hány éves (ön)?" (How old are you? - formal)
- "X éves vagyok" (I am X years old)

### Exercise Specifications

**Stage 1: Number Recognition (10 items)**
- Type: Card flip
- Show Hungarian → reveal number
- Click cycling: Hungarian word → number → pronunciation tip

**Stage 2: Number Production (10 items)**
- Type: Fill-in-blank
- Given: Number → Write Hungarian word
- Include: Score tracking, accent-aware validation

**Stage 3: Listening Numbers (6 items)**
- Type: Multiple choice
- Display written number → select correct Hungarian
- Prepares for future audio integration

**Stage 4: Age Dialogue (6 items)**
- Type: Dialogue completion
- Context: Meeting new people, asking/telling ages
- Characters: Use existing (Sophie, David, Elena) + new ones

### Acceptance Criteria
- [ ] All 100 numbers represented in learning material
- [ ] Minimum 32 interactive exercises
- [ ] Score tracking per stage
- [ ] Responsive grid layout for number cards
- [ ] Links to Lesson 3 (verb "to be") for age expressions

---

## Issue #2: Lesson 5 - Greetings & Polite Phrases

**Labels:** `enhancement`, `lesson`, `A1`, `priority-high`

### Description
Create an interactive lesson teaching essential Hungarian greetings and polite expressions for everyday social interactions.

### Learning Objectives
- Use appropriate greetings for different times of day
- Distinguish formal (Ön) vs informal (te) address
- Express basic politeness (please, thank you, excuse me)
- Respond appropriately to common social phrases

### Content Outline

#### Section 1: Basic Greetings
| Hungarian | English | Usage |
|-----------|---------|-------|
| Szia! | Hi!/Bye! | Informal, single person |
| Sziasztok! | Hi!/Bye! (plural) | Informal, multiple people |
| Helló! | Hello! | Informal |
| Viszlát! | Goodbye! | Neutral |
| Viszontlátásra! | Goodbye! | Formal |

#### Section 2: Time-Based Greetings
| Hungarian | English | Time |
|-----------|---------|------|
| Jó reggelt! | Good morning! | Until ~9am |
| Jó napot (kívánok)! | Good day! | Daytime, formal |
| Jó estét! | Good evening! | Evening |
| Jó éjszakát! | Good night! | Bedtime |

#### Section 3: Polite Expressions
| Hungarian | English |
|-----------|---------|
| Kérem (szépen) | Please |
| Köszönöm (szépen) | Thank you |
| Szívesen | You're welcome |
| Elnézést | Excuse me/Sorry |
| Bocsánat | Sorry/Pardon |
| Sajnálom | I'm sorry (empathy) |

#### Section 4: Conversational Phrases
| Hungarian | English |
|-----------|---------|
| Hogy vagy? | How are you? (informal) |
| Hogy van? | How are you? (formal) |
| Jól vagyok | I'm fine |
| És te? / És Ön? | And you? |
| Örülök, hogy megismertelek | Nice to meet you |

### Exercise Specifications

**Stage 1: Greeting Recognition (8 items)**
- Type: Matching cards
- Match Hungarian greeting to English equivalent
- Click to flip, pair matching

**Stage 2: Formal vs Informal (8 items)**
- Type: Dropdown selection
- Scenario given → choose appropriate greeting
- Situations: meeting boss, greeting friend, etc.

**Stage 3: Time-Appropriate Greetings (6 items)**
- Type: Multiple choice
- Given time/context → select correct greeting
- Visual: Clock icons or time indicators

**Stage 4: Response Matching (6 items)**
- Type: Fill-in-blank
- Given: Greeting/question → Write appropriate response
- Example: "Köszönöm!" → "___" (Szívesen)

**Stage 5: Dialogue Completion (6 items)**
- Type: Multi-input dialogue
- Complete full greeting exchange scenarios
- Context: coffee shop, office, street meeting

### Acceptance Criteria
- [ ] Cover all essential greetings and polite phrases
- [ ] Clear formal/informal distinction explained
- [ ] Minimum 34 interactive exercises
- [ ] Real-world dialogue scenarios
- [ ] Cultural notes on Hungarian politeness norms

---

## Issue #3: Lesson 6 - Personal Pronouns & Basic Questions

**Labels:** `enhancement`, `lesson`, `A1`, `priority-high`

### Description
Create an interactive lesson teaching Hungarian personal pronouns and basic question formation.

### Learning Objectives
- Master all personal pronouns (subject form)
- Form basic yes/no questions
- Use question words (ki, mi, hol, mikor, hogyan, miért)
- Understand Hungarian question intonation patterns

### Content Outline

#### Section 1: Personal Pronouns
| Hungarian | English | Notes |
|-----------|---------|-------|
| én | I | Often omitted when verb shows person |
| te | you (informal) | Singular, casual |
| ő | he/she/it | No gender distinction! |
| Ön | you (formal) | Takes 3rd person verb |
| mi | we | |
| ti | you (plural informal) | |
| ők | they | |
| Önök | you (plural formal) | |

#### Section 2: Question Words
| Hungarian | English | Example |
|-----------|---------|---------|
| Ki? | Who? | Ki vagy? |
| Mi? | What? | Mi ez? |
| Hol? | Where? | Hol vagy? |
| Mikor? | When? | Mikor jössz? |
| Hogyan/Hogy? | How? | Hogy vagy? |
| Miért? | Why? | Miért? |
| Melyik? | Which? | Melyik a tiéd? |
| Hány? | How many? | Hány éves? |
| Mennyi? | How much? | Mennyi az? |

#### Section 3: Yes/No Questions
- Word order remains same, only intonation changes
- Rising intonation at end indicates question
- "Igen" (yes) / "Nem" (no) answers

#### Section 4: Question Patterns
- Ki + verb?: Ki beszél magyarul?
- Mi + noun?: Mi a neved?
- Hol + van?: Hol van a bank?

### Exercise Specifications

**Stage 1: Pronoun Recognition (8 items)**
- Type: Fill-in-blank
- Given context → write correct pronoun
- Example: "___ tanár vagyok" (Én)

**Stage 2: Pronoun-Verb Matching (8 items)**
- Type: Matching
- Connect pronouns to correct verb forms (from Lesson 3)
- Reinforces conjugation patterns

**Stage 3: Question Word Selection (8 items)**
- Type: Multiple choice
- Given answer → select which question word fits
- Example: "Budapesten vagyok" → Hol?

**Stage 4: Question Formation (6 items)**
- Type: Sentence transformation
- Convert statement to question
- Focus on word order/intonation notation

**Stage 5: Q&A Dialogue (6 items)**
- Type: Dialogue completion
- Complete question-answer exchanges
- Practical: introductions, basic info exchange

### Acceptance Criteria
- [ ] All pronouns with clear formal/informal distinction
- [ ] All basic question words covered
- [ ] Minimum 36 interactive exercises
- [ ] Clear examples showing pronoun omission
- [ ] Connection to verb conjugation (Lesson 3)

---

## Issue #4: Lesson 7 - Nouns & Articles (a/az)

**Labels:** `enhancement`, `lesson`, `A1`, `priority-high`

### Description
Create an interactive lesson teaching Hungarian noun usage and the definite article system.

### Learning Objectives
- Understand Hungarian has NO indefinite article (a/an equivalent)
- Master definite article usage (a vs az)
- Recognize noun classes for vowel harmony
- Form basic noun phrases

### Content Outline

#### Section 1: The Definite Article
| Article | Usage | Example |
|---------|-------|---------|
| a | Before consonants | a ház (the house) |
| az | Before vowels | az alma (the apple) |

**Key Insight:** Hungarian has NO indefinite article!
- "Tanár vagyok" = I am **a** teacher (article implied)
- "A tanár" = **the** teacher (specific)

#### Section 2: When to Use Articles
- Use "a/az": specific, known items
- Omit article: general statements, professions, nationalities
- Compare: "Ő tanár" (She's a teacher) vs "Ő a tanár" (She's the teacher)

#### Section 3: Noun Categories (Vowel Harmony)
| Category | Examples | Why It Matters |
|----------|----------|----------------|
| Back vowel | ház, ablak, asztal | Takes -ban, -nak, etc. |
| Front vowel | szék, kert, gyerek | Takes -ben, -nek, etc. |
| Front rounded | tükör, gyümölcs | Takes -ben, -nek (same as front) |

#### Section 4: Common Nouns
- Family: anya, apa, gyerek, család
- Objects: könyv, asztal, szék, ablak, ajtó
- Places: ház, iskola, bolt, étterem
- Nature: fa, virág, nap, hold

### Exercise Specifications

**Stage 1: Article Selection (10 items)**
- Type: Dropdown (a/az/-)
- Given noun → select correct article
- Include "no article" option for indefinite

**Stage 2: Vowel Harmony Classification (10 items)**
- Type: Card sorting
- Drag nouns to "Back vowel" or "Front vowel" category
- Visual: Color-coded categories

**Stage 3: Definite vs Indefinite (8 items)**
- Type: Sentence comparison
- Show both versions → select meaning difference
- Example: "Ő tanár" vs "Ő a tanár" - what's different?

**Stage 4: Noun Phrase Building (6 items)**
- Type: Fill-in-blank
- Complete: "Ez ___ ___" (This is a/the ___)
- Practice article + noun combinations

**Stage 5: Translation Practice (8 items)**
- Type: Fill-in-blank
- English → Hungarian with correct article usage
- "The apple is red" → "Az alma piros"

### Acceptance Criteria
- [ ] Clear explanation of missing indefinite article
- [ ] a/az distinction fully explained
- [ ] Vowel harmony categories introduced
- [ ] Minimum 42 interactive exercises
- [ ] Common noun vocabulary (30+ words)
- [ ] Connection to Lesson 2 (vowel harmony) reinforced

---

## Issue #5: Lesson 8 - Accusative Case (-t suffix)

**Labels:** `enhancement`, `lesson`, `A1`, `priority-high`

### Description
Create an interactive lesson teaching the Hungarian accusative case, the first grammatical case for direct objects.

### Learning Objectives
- Understand the concept of grammatical cases
- Apply accusative -t suffix correctly
- Handle vowel linking rules (a→á, e→é before -t)
- Build basic Subject-Verb-Object sentences

### Content Outline

#### Section 1: What is the Accusative Case?
- Marks the **direct object** of a sentence
- English uses word order; Hungarian uses suffixes
- "I see the house" → "Látom a házat" (ház + -at)

#### Section 2: Basic -t Suffix Rules
| Noun Ending | Accusative | Example |
|-------------|------------|---------|
| Vowel | + t | alma → almát |
| Consonant (back) | + ot/at | ház → házat |
| Consonant (front) | + et | kert → kertet |
| Consonant (front rounded) | + öt | gyümölcs → gyümölcsöt |

#### Section 3: Vowel Changes Before -t
| Original | Accusative | Note |
|----------|------------|------|
| alma | almát | a → á |
| körte | körtét | e → é |
| anya | anyát | a → á |

#### Section 4: Special Cases
- Words ending in -a/-e lengthen: fa → fát, fekete → feketét
- Some consonant clusters need linking vowel
- Irregular: mi → mit, ki → kit

#### Section 5: Sentence Structure with Accusative
- Basic pattern: Subject + Verb + Object-t
- "Péter látja a házat" (Peter sees the house)
- "Eszem az almát" (I eat the apple)

### Exercise Specifications

**Stage 1: Suffix Selection (10 items)**
- Type: Multiple choice
- Given noun → select correct accusative form
- Options: -t, -ot, -at, -et, -öt

**Stage 2: Accusative Formation (12 items)**
- Type: Fill-in-blank
- Given nominative → write accusative form
- Accent-aware validation essential

**Stage 3: Sentence Completion (8 items)**
- Type: Fill-in-blank
- "Látom ___" (I see ___) + noun given
- Must provide accusative form

**Stage 4: Translation Practice (8 items)**
- Type: Full sentence input
- English → Hungarian with correct object marking
- Example: "I eat an apple" → "Eszem egy almát"

**Stage 5: Error Correction (6 items)**
- Type: Multiple choice
- Identify incorrect accusative usage in sentences
- Select the error and correct form

### Acceptance Criteria
- [ ] Clear explanation of case concept
- [ ] All suffix variations covered (-t, -ot, -at, -et, -öt)
- [ ] Vowel lengthening rules explained
- [ ] Minimum 44 interactive exercises
- [ ] Connection to vowel harmony (Lesson 2)
- [ ] Common verbs that take accusative objects

---

## Issue #6: Lesson 9 - Basic Adjectives & Agreement

**Labels:** `enhancement`, `lesson`, `A1`, `priority-medium`

### Description
Create an interactive lesson teaching Hungarian adjectives and their usage patterns.

### Learning Objectives
- Learn common descriptive adjectives
- Understand adjective placement (before noun)
- Know that adjectives DON'T agree in Hungarian (unlike many languages)
- Use adjectives predicatively with "van/vannak"

### Content Outline

#### Section 1: Common Adjectives
| Hungarian | English | Opposite |
|-----------|---------|----------|
| nagy | big | kicsi (small) |
| jó | good | rossz (bad) |
| szép | beautiful | csúnya (ugly) |
| régi | old (things) | új (new) |
| öreg | old (people) | fiatal (young) |
| drága | expensive | olcsó (cheap) |
| gyors | fast | lassú (slow) |
| könnyű | easy/light | nehéz (difficult/heavy) |
| hideg | cold | meleg (warm/hot) |
| magas | tall | alacsony (short) |

#### Section 2: Adjective Placement
- **Attributive:** Before noun, NO agreement
  - "a nagy ház" (the big house)
  - "a nagy házak" (the big houses) - adjective unchanged!
- **Predicative:** After noun with van/vannak
  - "A ház nagy" (The house is big)
  - "A házak nagyok" (The houses are big) - plural marker on adjective!

#### Section 3: Predicative Plural Forms
- Add -k or -ak/-ek/-ok to adjective
- nagy → nagyok, szép → szépek, jó → jók

#### Section 4: Colors
| Hungarian | English |
|-----------|---------|
| piros | red |
| kék | blue |
| zöld | green |
| sárga | yellow |
| fekete | black |
| fehér | white |
| barna | brown |
| narancssárga | orange |

### Exercise Specifications

**Stage 1: Adjective Vocabulary (12 items)**
- Type: Card flip matching
- Hungarian ↔ English pairs
- Include images where applicable

**Stage 2: Opposites Matching (10 items)**
- Type: Drag-and-drop matching
- Connect adjectives to their opposites
- nagy ↔ kicsi, jó ↔ rossz, etc.

**Stage 3: Attributive Usage (8 items)**
- Type: Fill-in-blank
- Complete "a ___ ház" type phrases
- Translation provided as hint

**Stage 4: Predicative Forms (8 items)**
- Type: Fill-in-blank
- Convert "A ház nagy" → "A házak ___"
- Focus on plural adjective forms

**Stage 5: Description Building (8 items)**
- Type: Sentence completion
- Describe objects/people using adjectives
- Mix attributive and predicative usage

**Stage 6: Color Identification (6 items)**
- Type: Visual matching
- Color swatches → Hungarian color names
- Interactive and visually engaging

### Acceptance Criteria
- [ ] 20+ common adjectives covered
- [ ] Clear attributive vs predicative distinction
- [ ] Plural predicative forms explained
- [ ] All basic colors included
- [ ] Minimum 52 interactive exercises
- [ ] Visual elements for color section

---

## Issue #7: Lesson 10 - Present Tense Verbs (Indefinite Conjugation)

**Labels:** `enhancement`, `lesson`, `A1`, `priority-medium`

### Description
Create an interactive lesson teaching Hungarian present tense indefinite verb conjugation.

### Learning Objectives
- Conjugate regular verbs in present tense (indefinite)
- Understand when to use indefinite vs definite (intro only)
- Apply vowel harmony to verb endings
- Use common everyday verbs

### Content Outline

#### Section 1: Indefinite vs Definite Overview
- **Indefinite:** No specific object, intransitive, or indefinite object
- **Definite:** Specific/definite object (covered in Lesson 13)
- This lesson focuses on INDEFINITE conjugation

#### Section 2: Present Tense Indefinite Endings
| Person | Back Vowel | Front Vowel | Example (lát) | Example (néz) |
|--------|------------|-------------|---------------|---------------|
| én | -ok | -ek/-ök | látok | nézek |
| te | -sz | -sz | látsz | nézel |
| ő/Ön | - | - | lát | néz |
| mi | -unk | -ünk | látunk | nézünk |
| ti | -tok | -tek/-tök | láttok | néztek |
| ők | -nak | -nek | látnak | néznek |

#### Section 3: Common Verbs
| Hungarian | English | Type |
|-----------|---------|------|
| tanul | to learn/study | Back |
| beszél | to speak | Front |
| olvas | to read | Back |
| ír | to write | Front |
| dolgozik | to work | Back (-ik verb) |
| lakik | to live | Back (-ik verb) |
| eszik | to eat | Front (-ik verb) |
| iszik | to drink | Front (-ik verb) |
| jön | to come | Irregular |
| megy | to go | Irregular |

#### Section 4: -ik Verbs (Special Pattern)
- First person: -om/-em/-öm instead of -ok/-ek/-ök
- "dolgozom" (I work), "eszem" (I eat)
- Other persons follow regular pattern

#### Section 5: Irregular Verbs (Key Ones)
- jön: jövök, jössz, jön, jövünk, jöttök, jönnek
- megy: megyek, mész, megy, megyünk, mentek, mennek

### Exercise Specifications

**Stage 1: Conjugation Tables (6 verbs)**
- Type: Fill-in-blank table
- Complete full conjugation for each verb
- Mix back/front vowel verbs

**Stage 2: Sentence Completion (12 items)**
- Type: Fill-in-blank
- Given pronoun + infinitive → conjugated form
- "Én (tanul) → ___" (tanulok)

**Stage 3: Translation Practice (10 items)**
- Type: Fill-in-blank
- English sentence → Hungarian verb form
- "She speaks Hungarian" → "Ő magyarul ___"

**Stage 4: -ik Verb Practice (8 items)**
- Type: Fill-in-blank
- Focus on -ik verb special conjugation
- dolgozik, lakik, eszik, iszik

**Stage 5: Irregular Verb Drill (8 items)**
- Type: Multiple choice
- jön and megy conjugations
- Common usage scenarios

**Stage 6: Free Response (6 items)**
- Type: Full sentence writing
- Describe daily activities
- "What do you do in the morning?" type prompts

### Acceptance Criteria
- [ ] Clear conjugation pattern tables
- [ ] Back/front vowel distinction applied
- [ ] -ik verb special rules covered
- [ ] Key irregular verbs (jön, megy) included
- [ ] Minimum 50 interactive exercises
- [ ] Daily routine context for practical usage

---

## Issue #8: Lesson 11 - Family & Relationships Vocabulary

**Labels:** `enhancement`, `lesson`, `A1`, `priority-medium`

### Description
Create an interactive lesson teaching family member vocabulary and relationship expressions.

### Learning Objectives
- Name immediate and extended family members
- Describe family relationships
- Use possessive expressions (intro level)
- Talk about one's own family

### Content Outline

#### Section 1: Immediate Family
| Hungarian | English |
|-----------|---------|
| anya / anyuka | mother / mom |
| apa / apuka | father / dad |
| szülő / szülők | parent / parents |
| gyerek | child |
| fiú | son / boy |
| lány | daughter / girl |
| testvér | sibling |
| fivér / báty / öcs | brother (formal / older / younger) |
| nővér / húg | sister (older / younger) |

#### Section 2: Extended Family
| Hungarian | English |
|-----------|---------|
| nagymama / nagyi | grandmother / grandma |
| nagypapa / nagyapa | grandfather / grandpa |
| nagyszülők | grandparents |
| unoka | grandchild |
| nagybácsi | uncle |
| nagynéni | aunt |
| unokatestvér | cousin |

#### Section 3: In-Laws & Marriage
| Hungarian | English |
|-----------|---------|
| férj | husband |
| feleség | wife |
| após | father-in-law |
| anyós | mother-in-law |
| sógor | brother-in-law |
| sógornő | sister-in-law |
| vő | son-in-law |
| meny | daughter-in-law |

#### Section 4: Talking About Family
- "Van testvéred?" (Do you have siblings?)
- "Két testvérem van" (I have two siblings)
- "Ő az anyám" (She is my mother)
- "Nincs gyerekem" (I don't have children)

### Exercise Specifications

**Stage 1: Vocabulary Cards (20 items)**
- Type: Card flip
- Hungarian term → English + optional image
- Family tree style visual

**Stage 2: Relationship Matching (10 items)**
- Type: Drag-and-drop
- Match relationship descriptions to terms
- "Your mother's mother" → nagymama

**Stage 3: Family Tree Completion (8 items)**
- Type: Fill-in-blank on diagram
- Given partial family tree → fill in relationship terms
- Visual family tree format

**Stage 4: Describing Your Family (8 items)**
- Type: Sentence completion
- "Van ___?" / "___ van" patterns
- Practice having/not having relations

**Stage 5: Dialogue Practice (6 items)**
- Type: Conversation completion
- Meeting someone, discussing families
- Use characters from previous lessons

### Acceptance Criteria
- [ ] Complete family vocabulary (~30 terms)
- [ ] Clear immediate/extended distinction
- [ ] Visual family tree element
- [ ] "Van/nincs" possession patterns
- [ ] Minimum 52 interactive exercises
- [ ] Cultural notes on Hungarian family terms

---

## Issue #9: Lesson 12 - A1 Review & Self-Introduction

**Labels:** `enhancement`, `lesson`, `A1`, `priority-medium`

### Description
Create a comprehensive review lesson consolidating all A1 material with extended self-introduction practice.

### Learning Objectives
- Consolidate all A1 grammar and vocabulary
- Produce extended self-introductions
- Engage in basic conversations on familiar topics
- Assess readiness for A2 level

### Content Outline

#### Section 1: Grammar Review Summaries
- Verb "to be" conjugation recap
- Accusative case reminder
- Question formation review
- Article usage summary

#### Section 2: Vocabulary Review by Category
- Numbers and age
- Greetings and politeness
- Family members
- Basic adjectives
- Common verbs

#### Section 3: Extended Self-Introduction Model
```
Szia! Én Kovács Anna vagyok. Huszonöt éves vagyok.
Budapesten lakom. Tanár vagyok.
Van egy bátyám és egy húgom.
A bátyám harmincéves, orvos. A húgom húszéves, egyetemista.
Szeretek olvasni és utazni.
Örülök, hogy megismertelek!
```

#### Section 4: Conversation Topics
- Personal information
- Family description
- Daily activities
- Likes and preferences

### Exercise Specifications

**Stage 1: Grammar Quick Review (10 items)**
- Type: Mixed (fill-in, multiple choice)
- One or two items per major grammar point
- Quick assessment format

**Stage 2: Vocabulary Recognition (15 items)**
- Type: Matching/multiple choice
- Words from all A1 lessons
- Timed challenge optional

**Stage 3: Listening Comprehension (6 items)**
- Type: Q&A based on text
- Read introduction → answer questions
- Tests understanding of personal info

**Stage 4: Self-Introduction Writing (1 extended item)**
- Type: Guided free writing
- Prompts for each sentence
- Model provided for comparison

**Stage 5: Role-Play Dialogue (8 items)**
- Type: Dialogue completion
- Extended conversation between two people
- Uses all A1 topics naturally

**Stage 6: Self-Assessment Checklist**
- Type: Checkbox review
- "Can you...?" statements for each A1 objective
- Identifies areas for review

### Acceptance Criteria
- [ ] Covers all A1 lessons (1-11)
- [ ] Minimum 40 review exercises
- [ ] Extended self-introduction model
- [ ] Self-assessment component
- [ ] Clear progression indicators to A2
- [ ] Character dialogues for context

---

# A2 Level Issues (Waystage)

---

## Issue #10: Lesson 13 - Present Tense (Definite Conjugation)

**Labels:** `enhancement`, `lesson`, `A2`, `priority-high`

### Description
Create an interactive lesson teaching the Hungarian definite verb conjugation - a unique feature of the language.

### Learning Objectives
- Understand when to use definite vs indefinite conjugation
- Conjugate verbs in definite present tense
- Apply definite conjugation to object-specific sentences
- Recognize the definite conjugation pattern

### Content Outline

#### Section 1: When to Use Definite Conjugation
**Use DEFINITE when the object is:**
- A noun with definite article (a/az)
- A proper noun (names, places)
- A demonstrative (ez, az)
- A possessive phrase (a könyvem)
- The pronouns őt, önöket, engem (certain cases)

**Use INDEFINITE when:**
- No object (intransitive)
- Indefinite object (egy könyv, valami)
- First/second person objects in certain combinations

#### Section 2: Definite Conjugation Endings
| Person | Back Vowel | Front Vowel | Example (lát) | Example (néz) |
|--------|------------|-------------|---------------|---------------|
| én | -om | -em/-öm | látom | nézem |
| te | -od | -ed/-öd | látod | nézed |
| ő/Ön | -ja/-a | -i | látja | nézi |
| mi | -juk/-uk | -jük/-ük | látjuk | nézzük |
| ti | -játok/-átok | -itek | látjátok | nézitek |
| ők | -ják/-ák | -ik | látják | nézik |

#### Section 3: Comparison Examples
| Indefinite | Meaning | Definite | Meaning |
|------------|---------|----------|---------|
| Olvasok | I read / I'm reading | Olvasom | I read it (specific) |
| Látsz | You see | Látod | You see it/him/her |
| Eszünk | We eat | Esszük | We eat it (specific food) |

#### Section 4: Special Verb Patterns
- Verbs ending in -s, -sz, -z take special forms
- néz → nézem, nézed, nézi...
- olvas → olvasom, olvasod, olvassa...

### Exercise Specifications

**Stage 1: Definite vs Indefinite Recognition (12 items)**
- Type: Classification
- Given sentence → identify why definite or indefinite
- Builds analytical understanding

**Stage 2: Conjugation Drill (12 items)**
- Type: Fill-in-blank
- Complete definite conjugation forms
- Mix back and front vowel verbs

**Stage 3: Choose the Correct Form (10 items)**
- Type: Multiple choice
- Sentence with object → select correct conjugation
- Clear explanation of why

**Stage 4: Translation Practice (10 items)**
- Type: Fill-in-blank
- English with specific object → Hungarian definite
- "I read the book" → "Olvasom a könyvet"

**Stage 5: Transformation (8 items)**
- Type: Rewrite
- Change indefinite to definite (add specific object)
- "Olvasok" → "Olvasom a könyvet"

### Acceptance Criteria
- [ ] Clear rules for when to use each conjugation
- [ ] Full definite paradigm for both vowel types
- [ ] Comparison tables with indefinite
- [ ] Minimum 52 interactive exercises
- [ ] Special verb patterns addressed
- [ ] This is a CRITICAL Hungarian feature - thorough coverage

---

## Issue #11: Lesson 14 - Negation (nem, nincs, sincs)

**Labels:** `enhancement`, `lesson`, `A2`, `priority-high`

### Description
Create an interactive lesson teaching Hungarian negation patterns.

### Learning Objectives
- Use "nem" for standard negation
- Understand "nincs/nincsenek" for "there is not"
- Apply "sincs/sincsenek" for "neither/not...either"
- Form negative questions and responses

### Content Outline

#### Section 1: Basic Negation with "nem"
- Placement: Before the verb/word being negated
- "Nem vagyok tanár" (I am not a teacher)
- "Nem magyar vagyok" (I am not Hungarian)
- "Nem látom" (I don't see it)

#### Section 2: Nincs/Nincsenek (Non-existence)
- Negative of "van/vannak" for existence/location
- "Nincs pénzem" (I don't have money)
- "Itt nincs bolt" (There is no shop here)
- "Nincsenek gyerekei" (He/she has no children)

#### Section 3: Sincs/Sincsenek (Neither/Not...either)
- "Nekem sincs" (I don't have one either)
- "Ő sem látja" (He doesn't see it either) - note: sem with verb
- "Itt sincs" (It's not here either)

#### Section 4: Nem + Question Words
- "Senki" (nobody), "semmi" (nothing), "sehol" (nowhere)
- "Soha" (never), "semmilyen" (no kind of)
- These require negative verb too: "Senki nem jött" (Nobody came)

### Exercise Specifications

**Stage 1: Nem Placement (10 items)**
- Type: Sentence reordering/fill-in
- Add negation to positive sentences
- Practice correct placement

**Stage 2: Nincs vs Nem Van (10 items)**
- Type: Multiple choice/correction
- "Van" → "Nincs" transformation
- Location and existence contexts

**Stage 3: Sincs Usage (8 items)**
- Type: Dialogue completion
- "Nekem van" → "Nekem nincs" → "Nekem sincs"
- Builds on previous statement

**Stage 4: Negative Question Words (10 items)**
- Type: Translation
- "Nobody knows" → "Senki nem tudja"
- Practice double negative rule

**Stage 5: Negative Dialogue (8 items)**
- Type: Conversation completion
- Practical negative exchanges
- Complaining, denying, disagreeing scenarios

### Acceptance Criteria
- [ ] All negation patterns covered
- [ ] Clear distinction between nem/nincs/sincs
- [ ] Double negative rule explained
- [ ] Minimum 46 interactive exercises
- [ ] Negative question word forms
- [ ] Practical dialogue contexts

---

## Issue #12: Lesson 15 - Location & Direction Cases

**Labels:** `enhancement`, `lesson`, `A2`, `priority-high`

### Description
Create an interactive lesson teaching Hungarian locative cases (where things are and where they go).

### Learning Objectives
- Master the "where?/whereto?/wherefrom?" case system
- Apply inessive (-ban/-ben), superessive (-n/-on/-en/-ön)
- Use illative (-ba/-be), sublative (-ra/-re)
- Distinguish static vs dynamic location

### Content Outline

#### Section 1: The Three-Way Location System
| Question | "In" Type | "On" Type | "At" Type |
|----------|-----------|-----------|-----------|
| Hol? (Where?) | -ban/-ben | -n/-on/-en/-ön | -nál/-nél |
| Hová? (Whereto?) | -ba/-be | -ra/-re | -hoz/-hez/-höz |
| Honnan? (Wherefrom?) | -ból/-ből | -ról/-ről | -tól/-től |

#### Section 2: Inside Location (-ban/-ben System)
| Static | Dynamic To | Dynamic From | Example |
|--------|------------|--------------|---------|
| -ban | -ba | -ból | ház: házban, házba, házból |
| -ben | -be | -ből | kert: kertben, kertbe, kertből |

**Usage:** Buildings, enclosed spaces, cities, countries
- "Budapesten vagyok" BUT "Budapesten" (special)
- "Magyarországon" (on Hungary - geographic)

#### Section 3: Surface Location (-n System)
| Static | Dynamic To | Dynamic From |
|--------|------------|--------------|
| -on/-en/-ön/-n | -ra/-re | -ról/-ről |

**Usage:** Surfaces, geographic locations, certain idioms
- "az asztalon" (on the table)
- "Magyarországon" (in Hungary - uses surface!)

#### Section 4: Proximity Location (-nál/-nél System)
| Static | Dynamic To | Dynamic From |
|--------|------------|--------------|
| -nál/-nél | -hoz/-hez/-höz | -tól/-től |

**Usage:** Near people, at someone's place
- "Péternél" (at Peter's place)
- "orvoshoz" (to the doctor)

### Exercise Specifications

**Stage 1: Case Recognition (12 items)**
- Type: Classification
- Identify which case is used and why
- Builds analytical skills

**Stage 2: Static Location Drill (12 items)**
- Type: Fill-in-blank
- Add correct static case suffix
- "A könyv az asztal___" (on)

**Stage 3: Dynamic Location Drill (12 items)**
- Type: Fill-in-blank
- "Whereto" and "wherefrom" suffixes
- "Megyek a bolt___" (to)

**Stage 4: Translation Practice (10 items)**
- Type: Full sentence
- English location sentences → Hungarian
- Mix all three systems

**Stage 5: Map Exercise (6 items)**
- Type: Interactive map/visual
- Describe movement on a simple map
- "From the house to the shop"

**Stage 6: Dialogue with Directions (8 items)**
- Type: Conversation completion
- Asking for and giving directions
- Practical real-world application

### Acceptance Criteria
- [ ] All nine location suffixes covered
- [ ] Clear three-way system explanation
- [ ] Vowel harmony application shown
- [ ] Minimum 60 interactive exercises
- [ ] Visual map/diagram element
- [ ] Direction dialogue practice

---

## Issue #13: Lesson 16 - Time Expressions & Calendar

**Labels:** `enhancement`, `lesson`, `A2`, `priority-medium`

### Description
Create an interactive lesson teaching time expressions, days, months, and calendar usage.

### Learning Objectives
- Tell time in Hungarian
- Name days of the week and months
- Express dates and time periods
- Schedule events and appointments

### Content Outline

#### Section 1: Telling Time
- "Hány óra (van)?" (What time is it?)
- "Egy óra" (1:00), "Két óra" (2:00)...
- Half hours: "Fél kettő" (1:30 - half TO two!)
- Quarter hours: "Negyed kettő" (1:15), "Háromnegyed kettő" (1:45)

#### Section 2: Days of the Week
| Hungarian | English |
|-----------|---------|
| hétfő | Monday |
| kedd | Tuesday |
| szerda | Wednesday |
| csütörtök | Thursday |
| péntek | Friday |
| szombat | Saturday |
| vasárnap | Sunday |

- "Hétfőn" (on Monday) - uses -n suffix

#### Section 3: Months of the Year
| Hungarian | English |
|-----------|---------|
| január | January |
| február | February |
| március | March |
| április | April |
| május | May |
| június | June |
| július | July |
| augusztus | August |
| szeptember | September |
| október | October |
| november | November |
| december | December |

- "Januárban" (in January) - uses -ban

#### Section 4: Dates and Time Expressions
- "2024. január 15." (January 15, 2024)
- "Ma" (today), "Tegnap" (yesterday), "Holnap" (tomorrow)
- "Most" (now), "Később" (later), "Korábban" (earlier)
- Duration: "Egy órája" (for an hour), "Két napig" (for two days)

### Exercise Specifications

**Stage 1: Clock Reading (10 items)**
- Type: Visual clock + multiple choice
- Clock face → select correct Hungarian time
- Include half/quarter hours

**Stage 2: Days & Months Vocabulary (14 items)**
- Type: Card flip/matching
- Learn all days and months
- Ordinal numbers for dates

**Stage 3: Time Expression Fill-in (10 items)**
- Type: Fill-in-blank
- "Hétfőn ___-kor találkozunk" (We meet on Monday at __)
- Practice time + day combinations

**Stage 4: Schedule Reading (8 items)**
- Type: Q&A based on schedule
- Given weekly schedule → answer questions
- "Mikor van a magyar óra?"

**Stage 5: Appointment Dialogue (8 items)**
- Type: Dialogue completion
- Making appointments, scheduling
- Doctor, meeting, social plans

### Acceptance Criteria
- [ ] Complete time-telling system
- [ ] All days and months covered
- [ ] Hungarian date format explained
- [ ] Duration expressions included
- [ ] Minimum 50 interactive exercises
- [ ] Visual clock elements

---

## Issue #14: Lesson 22 - Possession & Possessive Suffixes

**Labels:** `enhancement`, `lesson`, `A2`, `priority-high`

### Description
Create an interactive lesson teaching Hungarian possessive suffixes - a critical feature of the language.

### Learning Objectives
- Apply possessive suffixes to nouns
- Handle vowel harmony in possession
- Express ownership without separate possessive pronouns
- Understand the possessive + case stacking

### Content Outline

#### Section 1: Possessive Suffix System
| Person | Suffix (back) | Suffix (front) | Example |
|--------|---------------|----------------|---------|
| my | -om/-am | -em/-öm | házam, kertem |
| your (te) | -od/-ad | -ed/-öd | házad, kerted |
| his/her | -ja/-a | -je/-e | háza, kertje |
| our | -unk | -ünk | házunk, kertünk |
| your (ti) | -otok/-atok | -etek/-ötök | házatok, kertetek |
| their | -juk/-uk | -jük/-ük | házuk, kertjük |

#### Section 2: Possessed + Case (Stacking)
- "A házamat látom" (I see my house - possessive + accusative)
- "A házadban" (in your house - possessive + inessive)
- Possessive suffix comes BEFORE case suffix

#### Section 3: Using with Pronouns (Emphasis)
- "Az én házam" (MY house - emphatic)
- "A te könyved" (YOUR book - emphatic)
- Pronoun optional unless emphasizing

#### Section 4: Irregular Possessed Forms
- Some nouns change: "barát" → "barátom" but "apa" → "apám"
- Special: "kéz" → "kezem", "víz" → "vizem"

### Exercise Specifications

**Stage 1: Suffix Formation (15 items)**
- Type: Fill-in-blank
- Add correct possessive suffix
- "A ___ (ház, my)" → "házam"

**Stage 2: Vowel Harmony Practice (10 items)**
- Type: Multiple choice
- Select correct possessive form
- Mix back and front vowel nouns

**Stage 3: Translation (12 items)**
- Type: Fill-in-blank
- English possessive → Hungarian
- "My book" → "A könyvem"

**Stage 4: Case Stacking (10 items)**
- Type: Build the form
- Possessive + case suffix combinations
- "In my house" → "A házamban"

**Stage 5: Family Possession (8 items)**
- Type: Sentence completion
- Describe family with possession
- "Az anyám tanár" (My mother is a teacher)

**Stage 6: Dialogue with Possession (8 items)**
- Type: Conversation completion
- Talking about belongings, family
- "A te kutyád nagy!"

### Acceptance Criteria
- [ ] Complete possessive paradigm
- [ ] Vowel harmony clearly shown
- [ ] Case stacking explained and practiced
- [ ] Irregular forms noted
- [ ] Minimum 63 interactive exercises
- [ ] Practical family/ownership contexts

---

# Additional Issues (Summary Format)

For brevity, remaining lessons are listed with key specifications:

---

## Issues #15-20: Remaining A2 Lessons

### Issue #15: Lesson 17 - Food & Restaurant Vocabulary
- **Focus:** Food items, ordering, dietary terms
- **Key Exercise:** Menu ordering simulation
- **Items:** 50+ vocabulary, 45+ exercises

### Issue #16: Lesson 18 - Shopping & Money
- **Focus:** Prices, currency, transaction dialogue
- **Key Exercise:** Price negotiation simulation
- **Items:** 40+ vocabulary, 40+ exercises

### Issue #17: Lesson 19 - Modal Verbs
- **Focus:** Tud (can), akar (want), kell (must), szabad (may)
- **Key Exercise:** Modal + infinitive patterns
- **Items:** 50+ exercises

### Issue #18: Lesson 20 - Past Tense Indefinite
- **Focus:** Past tense verb conjugation (indefinite)
- **Key Exercise:** Narrative transformation
- **Items:** 55+ exercises

### Issue #19: Lesson 21 - Past Tense Definite
- **Focus:** Past tense verb conjugation (definite)
- **Key Exercise:** Story retelling
- **Items:** 55+ exercises

### Issue #20: Lesson 23-26 - Practical Topics
- Transportation, Weather, Health, A2 Review
- Real-world scenario focus
- Comprehensive review before B1

---

## Issues #21-35: B1 Level Lessons (Weeks 27-40)

### Focus Areas:
- Future tense and intentions
- Conditional mood
- Imperative mood
- Advanced cases (dative, instrumental, ablative)
- Comparatives and superlatives
- Relative clauses
- Work and profession vocabulary
- Housing vocabulary
- Hobbies and leisure
- Hungarian culture and traditions
- News and current events

---

## Issues #36-47: B2 Level Lessons (Weeks 41-52)

### Focus Areas:
- Verbal prefixes (aspect)
- Subjunctive mood
- Passive constructions
- Complex sentences
- Idioms and expressions
- Register switching
- Academic Hungarian
- Literature introduction
- Humor and wordplay
- Debate and argumentation
- Comprehensive review
- Capstone conversation simulation

---

# Implementation Notes

## Priority Order for Development

### Immediate (High Priority)
1. Lesson 4: Numbers
2. Lesson 5: Greetings
3. Lesson 6: Pronouns & Questions
4. Lesson 7: Nouns & Articles
5. Lesson 8: Accusative Case

### Short-term (Medium Priority)
6. Lesson 9: Adjectives
7. Lesson 10: Present Verbs
8. Lesson 11: Family
9. Lesson 12: A1 Review
10. Lesson 13: Definite Conjugation

### Medium-term
- Remaining A2 lessons
- B1 lessons

### Long-term
- B2 lessons
- Advanced content

## Technical Patterns to Maintain

1. **HTML Structure:** Follow existing lesson-template.html
2. **Styling:** Tailwind CSS only, Inter font
3. **JavaScript:** Inline, vanilla JS, existing patterns
4. **Responsive:** 3 breakpoints (mobile/tablet/desktop)
5. **Feedback:** Emoji + text, color-coded
6. **Validation:** Accent-aware comparison

## Git Workflow

```bash
# For each lesson
git checkout -b claude/lesson-X-topic
# Develop and test
git add lessons/lesson_name.html
git commit -m "feat(lessons): add lesson X - topic name"
git push -u origin claude/lesson-X-topic
# Create PR for review
```

---

*Document created as part of Hungarian language curriculum planning. Update this file as lessons are developed and completed.*
