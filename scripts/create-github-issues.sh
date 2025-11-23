#!/bin/bash

# GitHub Issue Creation Script for Learning Hungarian Curriculum
#
# Usage:
#   export GITHUB_TOKEN="your_personal_access_token"
#   ./scripts/create-github-issues.sh
#
# Required: A GitHub Personal Access Token with 'repo' scope
# Get one at: https://github.com/settings/tokens

set -e

# Configuration
REPO_OWNER="jaypaulb"
REPO_NAME="learninghungarian"
API_BASE="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}"

# Check for token
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: GITHUB_TOKEN environment variable is not set"
    echo "Please set it with: export GITHUB_TOKEN='your_token'"
    exit 1
fi

# API headers
AUTH_HEADER="Authorization: token ${GITHUB_TOKEN}"
CONTENT_TYPE="Content-Type: application/json"
ACCEPT="Accept: application/vnd.github.v3+json"

# Helper function to create an issue
create_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    local milestone="$4"

    local payload=$(jq -n \
        --arg title "$title" \
        --arg body "$body" \
        --argjson labels "$labels" \
        --argjson milestone "$milestone" \
        '{title: $title, body: $body, labels: $labels, milestone: $milestone}')

    local response=$(curl -s -X POST "${API_BASE}/issues" \
        -H "$AUTH_HEADER" \
        -H "$CONTENT_TYPE" \
        -H "$ACCEPT" \
        -d "$payload")

    local issue_number=$(echo "$response" | jq -r '.number')
    local issue_url=$(echo "$response" | jq -r '.html_url')

    if [ "$issue_number" != "null" ] && [ -n "$issue_number" ]; then
        echo "✓ Created issue #${issue_number}: ${title}"
        echo "  ${issue_url}"
        echo "$issue_number"
    else
        echo "✗ Failed to create issue: ${title}"
        echo "  Response: $response"
        echo "0"
    fi
}

# Helper function to create a milestone
create_milestone() {
    local title="$1"
    local description="$2"

    local payload=$(jq -n \
        --arg title "$title" \
        --arg description "$description" \
        '{title: $title, description: $description, state: "open"}')

    local response=$(curl -s -X POST "${API_BASE}/milestones" \
        -H "$AUTH_HEADER" \
        -H "$CONTENT_TYPE" \
        -H "$ACCEPT" \
        -d "$payload")

    local milestone_number=$(echo "$response" | jq -r '.number')

    if [ "$milestone_number" != "null" ] && [ -n "$milestone_number" ]; then
        echo "✓ Created milestone: ${title} (#${milestone_number})"
        echo "$milestone_number"
    else
        # Milestone might already exist, try to get it
        local existing=$(curl -s "${API_BASE}/milestones" \
            -H "$AUTH_HEADER" \
            -H "$ACCEPT" | jq -r ".[] | select(.title == \"$title\") | .number")
        if [ -n "$existing" ]; then
            echo "→ Milestone exists: ${title} (#${existing})"
            echo "$existing"
        else
            echo "✗ Failed to create milestone: ${title}"
            echo "0"
        fi
    fi
}

# Helper function to create labels
create_label() {
    local name="$1"
    local color="$2"
    local description="$3"

    local payload=$(jq -n \
        --arg name "$name" \
        --arg color "$color" \
        --arg description "$description" \
        '{name: $name, color: $color, description: $description}')

    curl -s -X POST "${API_BASE}/labels" \
        -H "$AUTH_HEADER" \
        -H "$CONTENT_TYPE" \
        -H "$ACCEPT" \
        -d "$payload" > /dev/null 2>&1
}

echo "========================================"
echo "Learning Hungarian - GitHub Issue Setup"
echo "========================================"
echo ""

# Create labels first
echo "Creating labels..."
create_label "lesson" "0e8a16" "Lesson content development"
create_label "A1" "c5def5" "CEFR A1 Level - Breakthrough"
create_label "A2" "bfd4f2" "CEFR A2 Level - Waystage"
create_label "B1" "d4c5f9" "CEFR B1 Level - Threshold"
create_label "B2" "f9c5d4" "CEFR B2 Level - Vantage"
create_label "priority-high" "d93f0b" "High priority task"
create_label "priority-medium" "fbca04" "Medium priority task"
create_label "priority-low" "0e8a16" "Low priority task"
create_label "curriculum" "5319e7" "Curriculum planning"
echo "✓ Labels created"
echo ""

# Create milestones
echo "Creating milestones..."
MILESTONE_A1=$(create_milestone "A1 - Breakthrough" "CEFR A1 Level: Basic phrases, introductions, simple questions (Lessons 4-12)" | tail -1)
MILESTONE_A2=$(create_milestone "A2 - Waystage" "CEFR A2 Level: Everyday expressions, simple descriptions, routine tasks (Lessons 13-26)" | tail -1)
MILESTONE_B1=$(create_milestone "B1 - Threshold" "CEFR B1 Level: Main points on familiar matters, travel, experiences (Lessons 27-40)" | tail -1)
MILESTONE_B2=$(create_milestone "B2 - Vantage" "CEFR B2 Level: Complex texts, spontaneous interaction, detailed expression (Lessons 41-52)" | tail -1)
echo ""

echo "========================================"
echo "Creating A1 Level Issues"
echo "========================================"
echo ""

# Issue 1: Lesson 4 - Numbers (No dependencies)
ISSUE_4=$(create_issue \
    "feat(lessons): Lesson 4 - Numbers 0-100 & Age Expressions" \
    "## Description
Create an interactive lesson teaching Hungarian numbers from 0-100 and age-related expressions.

## Learning Objectives
- Recognize and produce numbers 0-20 (unique forms)
- Understand the pattern for numbers 21-99
- Express age using \"Hány éves vagy/van?\" pattern
- Use numbers in practical contexts (prices, quantities)

## Content Outline

### Section 1: Numbers 0-10
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

### Section 2: Numbers 11-20
tizenegy, tizenkettő, tizenhárom... (tizen- prefix)

### Section 3: Tens (20-100)
húsz (20), harminc (30), negyven (40), ötven (50), hatvan (60), hetven (70), nyolcvan (80), kilencven (90), száz (100)

### Section 4: Compound Numbers
Pattern: [tens] + [units] (e.g., huszonegy = 21)
Note: húsz → huszon-, harminc → harminc- (no change)

### Section 5: Age Expressions
- \"Hány éves vagy?\" (How old are you? - informal)
- \"Hány éves (ön)?\" (How old are you? - formal)
- \"X éves vagyok\" (I am X years old)

## Exercise Specifications

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

## Acceptance Criteria
- [ ] All 100 numbers represented in learning material
- [ ] Minimum 32 interactive exercises
- [ ] Score tracking per stage
- [ ] Responsive grid layout for number cards
- [ ] Links to Lesson 3 (verb \"to be\") for age expressions

## Dependencies
- Builds on: Lesson 3 (verb \"to be\") - uses \"vagyok/vagy/van\" for age expressions

## Technical Notes
- Follow existing HTML lesson structure
- Use Tailwind CSS for styling
- Inline JavaScript for interactivity" \
    '["enhancement", "lesson", "A1", "priority-high"]' \
    "$MILESTONE_A1" | tail -1)
echo ""

# Issue 2: Lesson 5 - Greetings (No dependencies)
ISSUE_5=$(create_issue \
    "feat(lessons): Lesson 5 - Greetings & Polite Phrases" \
    "## Description
Create an interactive lesson teaching essential Hungarian greetings and polite expressions for everyday social interactions.

## Learning Objectives
- Use appropriate greetings for different times of day
- Distinguish formal (Ön) vs informal (te) address
- Express basic politeness (please, thank you, excuse me)
- Respond appropriately to common social phrases

## Content Outline

### Section 1: Basic Greetings
| Hungarian | English | Usage |
|-----------|---------|-------|
| Szia! | Hi!/Bye! | Informal, single person |
| Sziasztok! | Hi!/Bye! (plural) | Informal, multiple people |
| Helló! | Hello! | Informal |
| Viszlát! | Goodbye! | Neutral |
| Viszontlátásra! | Goodbye! | Formal |

### Section 2: Time-Based Greetings
| Hungarian | English | Time |
|-----------|---------|------|
| Jó reggelt! | Good morning! | Until ~9am |
| Jó napot (kívánok)! | Good day! | Daytime, formal |
| Jó estét! | Good evening! | Evening |
| Jó éjszakát! | Good night! | Bedtime |

### Section 3: Polite Expressions
| Hungarian | English |
|-----------|---------|
| Kérem (szépen) | Please |
| Köszönöm (szépen) | Thank you |
| Szívesen | You're welcome |
| Elnézést | Excuse me/Sorry |
| Bocsánat | Sorry/Pardon |
| Sajnálom | I'm sorry (empathy) |

### Section 4: Conversational Phrases
| Hungarian | English |
|-----------|---------|
| Hogy vagy? | How are you? (informal) |
| Hogy van? | How are you? (formal) |
| Jól vagyok | I'm fine |
| És te? / És Ön? | And you? |
| Örülök, hogy megismertelek | Nice to meet you |

## Exercise Specifications

**Stage 1: Greeting Recognition (8 items)**
- Type: Matching cards
- Match Hungarian greeting to English equivalent

**Stage 2: Formal vs Informal (8 items)**
- Type: Dropdown selection
- Scenario given → choose appropriate greeting

**Stage 3: Time-Appropriate Greetings (6 items)**
- Type: Multiple choice
- Given time/context → select correct greeting

**Stage 4: Response Matching (6 items)**
- Type: Fill-in-blank
- Given: Greeting/question → Write appropriate response

**Stage 5: Dialogue Completion (6 items)**
- Type: Multi-input dialogue
- Complete full greeting exchange scenarios

## Acceptance Criteria
- [ ] Cover all essential greetings and polite phrases
- [ ] Clear formal/informal distinction explained
- [ ] Minimum 34 interactive exercises
- [ ] Real-world dialogue scenarios
- [ ] Cultural notes on Hungarian politeness norms

## Dependencies
- Builds on: Lesson 3 (verb \"to be\") - uses \"vagyok\" for \"Jól vagyok\"

## Technical Notes
- Follow existing HTML lesson structure
- Use Tailwind CSS for styling
- Inline JavaScript for interactivity" \
    '["enhancement", "lesson", "A1", "priority-high"]' \
    "$MILESTONE_A1" | tail -1)
echo ""

# Issue 3: Lesson 6 - Pronouns & Questions (Depends on Lesson 3)
ISSUE_6=$(create_issue \
    "feat(lessons): Lesson 6 - Personal Pronouns & Basic Questions" \
    "## Description
Create an interactive lesson teaching Hungarian personal pronouns and basic question formation.

## Learning Objectives
- Master all personal pronouns (subject form)
- Form basic yes/no questions
- Use question words (ki, mi, hol, mikor, hogyan, miért)
- Understand Hungarian question intonation patterns

## Content Outline

### Section 1: Personal Pronouns
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

### Section 2: Question Words
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

### Section 3: Yes/No Questions
- Word order remains same, only intonation changes
- Rising intonation at end indicates question
- \"Igen\" (yes) / \"Nem\" (no) answers

### Section 4: Question Patterns
- Ki + verb?: Ki beszél magyarul?
- Mi + noun?: Mi a neved?
- Hol + van?: Hol van a bank?

## Exercise Specifications

**Stage 1: Pronoun Recognition (8 items)** - Fill-in-blank
**Stage 2: Pronoun-Verb Matching (8 items)** - Matching
**Stage 3: Question Word Selection (8 items)** - Multiple choice
**Stage 4: Question Formation (6 items)** - Sentence transformation
**Stage 5: Q&A Dialogue (6 items)** - Dialogue completion

## Acceptance Criteria
- [ ] All pronouns with clear formal/informal distinction
- [ ] All basic question words covered
- [ ] Minimum 36 interactive exercises
- [ ] Clear examples showing pronoun omission
- [ ] Connection to verb conjugation (Lesson 3)

## Dependencies
- **Requires:** Lesson 3 (verb \"to be\") - conjugation patterns
- **Enhances:** Lesson 4 (numbers) - \"Hány\" questions
- **Enhances:** Lesson 5 (greetings) - \"Hogy vagy?\" pattern" \
    '["enhancement", "lesson", "A1", "priority-high"]' \
    "$MILESTONE_A1" | tail -1)
echo ""

# Issue 4: Lesson 7 - Nouns & Articles (Depends on Lesson 2)
ISSUE_7=$(create_issue \
    "feat(lessons): Lesson 7 - Nouns & Articles (a/az)" \
    "## Description
Create an interactive lesson teaching Hungarian noun usage and the definite article system.

## Learning Objectives
- Understand Hungarian has NO indefinite article (a/an equivalent)
- Master definite article usage (a vs az)
- Recognize noun classes for vowel harmony
- Form basic noun phrases

## Content Outline

### Section 1: The Definite Article
| Article | Usage | Example |
|---------|-------|---------|
| a | Before consonants | a ház (the house) |
| az | Before vowels | az alma (the apple) |

**Key Insight:** Hungarian has NO indefinite article!
- \"Tanár vagyok\" = I am **a** teacher (article implied)
- \"A tanár\" = **the** teacher (specific)

### Section 2: When to Use Articles
- Use \"a/az\": specific, known items
- Omit article: general statements, professions, nationalities
- Compare: \"Ő tanár\" vs \"Ő a tanár\"

### Section 3: Noun Categories (Vowel Harmony)
| Category | Examples | Why It Matters |
|----------|----------|----------------|
| Back vowel | ház, ablak, asztal | Takes -ban, -nak, etc. |
| Front vowel | szék, kert, gyerek | Takes -ben, -nek, etc. |
| Front rounded | tükör, gyümölcs | Takes -ben, -nek (same as front) |

### Section 4: Common Nouns
- Family: anya, apa, gyerek, család
- Objects: könyv, asztal, szék, ablak, ajtó
- Places: ház, iskola, bolt, étterem
- Nature: fa, virág, nap, hold

## Exercise Specifications

**Stage 1: Article Selection (10 items)** - Dropdown (a/az/-)
**Stage 2: Vowel Harmony Classification (10 items)** - Card sorting
**Stage 3: Definite vs Indefinite (8 items)** - Sentence comparison
**Stage 4: Noun Phrase Building (6 items)** - Fill-in-blank
**Stage 5: Translation Practice (8 items)** - Fill-in-blank

## Acceptance Criteria
- [ ] Clear explanation of missing indefinite article
- [ ] a/az distinction fully explained
- [ ] Vowel harmony categories introduced
- [ ] Minimum 42 interactive exercises
- [ ] Common noun vocabulary (30+ words)
- [ ] Connection to Lesson 2 (vowel harmony) reinforced

## Dependencies
- **Requires:** Lesson 2 (vowel harmony) - categorization system
- **Required by:** Lesson 8 (accusative) - noun forms
- **Required by:** Lesson 9 (adjectives) - noun phrases" \
    '["enhancement", "lesson", "A1", "priority-high"]' \
    "$MILESTONE_A1" | tail -1)
echo ""

# Issue 5: Lesson 8 - Accusative Case (Depends on Lessons 2, 7)
ISSUE_8=$(create_issue \
    "feat(lessons): Lesson 8 - Accusative Case (-t suffix)" \
    "## Description
Create an interactive lesson teaching the Hungarian accusative case, the first grammatical case for direct objects.

## Learning Objectives
- Understand the concept of grammatical cases
- Apply accusative -t suffix correctly
- Handle vowel linking rules (a→á, e→é before -t)
- Build basic Subject-Verb-Object sentences

## Content Outline

### Section 1: What is the Accusative Case?
- Marks the **direct object** of a sentence
- English uses word order; Hungarian uses suffixes
- \"I see the house\" → \"Látom a házat\" (ház + -at)

### Section 2: Basic -t Suffix Rules
| Noun Ending | Accusative | Example |
|-------------|------------|---------|
| Vowel | + t | alma → almát |
| Consonant (back) | + ot/at | ház → házat |
| Consonant (front) | + et | kert → kertet |
| Consonant (front rounded) | + öt | gyümölcs → gyümölcsöt |

### Section 3: Vowel Changes Before -t
| Original | Accusative | Note |
|----------|------------|------|
| alma | almát | a → á |
| körte | körtét | e → é |
| anya | anyát | a → á |

### Section 4: Special Cases
- Words ending in -a/-e lengthen: fa → fát, fekete → feketét
- Irregular: mi → mit, ki → kit

### Section 5: Sentence Structure with Accusative
- Basic pattern: Subject + Verb + Object-t
- \"Péter látja a házat\" (Peter sees the house)
- \"Eszem az almát\" (I eat the apple)

## Exercise Specifications

**Stage 1: Suffix Selection (10 items)** - Multiple choice
**Stage 2: Accusative Formation (12 items)** - Fill-in-blank
**Stage 3: Sentence Completion (8 items)** - Fill-in-blank
**Stage 4: Translation Practice (8 items)** - Full sentence input
**Stage 5: Error Correction (6 items)** - Multiple choice

## Acceptance Criteria
- [ ] Clear explanation of case concept
- [ ] All suffix variations covered (-t, -ot, -at, -et, -öt)
- [ ] Vowel lengthening rules explained
- [ ] Minimum 44 interactive exercises
- [ ] Connection to vowel harmony (Lesson 2)
- [ ] Common verbs that take accusative objects

## Dependencies
- **Requires:** Lesson 2 (vowel harmony) - suffix selection
- **Requires:** Lesson 7 (nouns) - noun vocabulary
- **Required by:** Lesson 10 (verbs) - object handling
- **Required by:** Lesson 13 (definite conjugation) - definite objects" \
    '["enhancement", "lesson", "A1", "priority-high"]' \
    "$MILESTONE_A1" | tail -1)
echo ""

# Issue 6: Lesson 9 - Adjectives (Depends on Lesson 7)
ISSUE_9=$(create_issue \
    "feat(lessons): Lesson 9 - Basic Adjectives & Agreement" \
    "## Description
Create an interactive lesson teaching Hungarian adjectives and their usage patterns.

## Learning Objectives
- Learn common descriptive adjectives
- Understand adjective placement (before noun)
- Know that adjectives DON'T agree in Hungarian (unlike many languages)
- Use adjectives predicatively with \"van/vannak\"

## Content Outline

### Section 1: Common Adjectives
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

### Section 2: Adjective Placement
- **Attributive:** Before noun, NO agreement
  - \"a nagy ház\" (the big house)
  - \"a nagy házak\" (the big houses) - adjective unchanged!
- **Predicative:** After noun with van/vannak
  - \"A ház nagy\" (The house is big)
  - \"A házak nagyok\" (The houses are big) - plural marker on adjective!

### Section 3: Predicative Plural Forms
- Add -k or -ak/-ek/-ok to adjective
- nagy → nagyok, szép → szépek, jó → jók

### Section 4: Colors
piros, kék, zöld, sárga, fekete, fehér, barna, narancssárga

## Exercise Specifications

**Stage 1: Adjective Vocabulary (12 items)** - Card flip matching
**Stage 2: Opposites Matching (10 items)** - Drag-and-drop
**Stage 3: Attributive Usage (8 items)** - Fill-in-blank
**Stage 4: Predicative Forms (8 items)** - Fill-in-blank
**Stage 5: Description Building (8 items)** - Sentence completion
**Stage 6: Color Identification (6 items)** - Visual matching

## Acceptance Criteria
- [ ] 20+ common adjectives covered
- [ ] Clear attributive vs predicative distinction
- [ ] Plural predicative forms explained
- [ ] All basic colors included
- [ ] Minimum 52 interactive exercises
- [ ] Visual elements for color section

## Dependencies
- **Requires:** Lesson 7 (nouns) - noun vocabulary for phrases
- **Requires:** Lesson 3 (to be) - predicative constructions
- **Required by:** Lesson 12 (A1 review) - description skills" \
    '["enhancement", "lesson", "A1", "priority-medium"]' \
    "$MILESTONE_A1" | tail -1)
echo ""

# Issue 7: Lesson 10 - Present Tense Verbs (Depends on Lessons 2, 8)
ISSUE_10=$(create_issue \
    "feat(lessons): Lesson 10 - Present Tense Verbs (Indefinite Conjugation)" \
    "## Description
Create an interactive lesson teaching Hungarian present tense indefinite verb conjugation.

## Learning Objectives
- Conjugate regular verbs in present tense (indefinite)
- Understand when to use indefinite vs definite (intro only)
- Apply vowel harmony to verb endings
- Use common everyday verbs

## Content Outline

### Section 1: Indefinite vs Definite Overview
- **Indefinite:** No specific object, intransitive, or indefinite object
- **Definite:** Specific/definite object (covered in Lesson 13)
- This lesson focuses on INDEFINITE conjugation

### Section 2: Present Tense Indefinite Endings
| Person | Back Vowel | Front Vowel | Example (lát) | Example (néz) |
|--------|------------|-------------|---------------|---------------|
| én | -ok | -ek/-ök | látok | nézek |
| te | -sz | -sz | látsz | nézel |
| ő/Ön | - | - | lát | néz |
| mi | -unk | -ünk | látunk | nézünk |
| ti | -tok | -tek/-tök | láttok | néztek |
| ők | -nak | -nek | látnak | néznek |

### Section 3: Common Verbs
tanul, beszél, olvas, ír, dolgozik, lakik, eszik, iszik, jön, megy

### Section 4: -ik Verbs (Special Pattern)
- First person: -om/-em/-öm instead of -ok/-ek/-ök
- \"dolgozom\" (I work), \"eszem\" (I eat)

### Section 5: Irregular Verbs
- jön: jövök, jössz, jön, jövünk, jöttök, jönnek
- megy: megyek, mész, megy, megyünk, mentek, mennek

## Exercise Specifications

**Stage 1: Conjugation Tables (6 verbs)** - Fill-in-blank table
**Stage 2: Sentence Completion (12 items)** - Fill-in-blank
**Stage 3: Translation Practice (10 items)** - Fill-in-blank
**Stage 4: -ik Verb Practice (8 items)** - Fill-in-blank
**Stage 5: Irregular Verb Drill (8 items)** - Multiple choice
**Stage 6: Free Response (6 items)** - Full sentence writing

## Acceptance Criteria
- [ ] Clear conjugation pattern tables
- [ ] Back/front vowel distinction applied
- [ ] -ik verb special rules covered
- [ ] Key irregular verbs (jön, megy) included
- [ ] Minimum 50 interactive exercises
- [ ] Daily routine context for practical usage

## Dependencies
- **Requires:** Lesson 2 (vowel harmony) - ending selection
- **Requires:** Lesson 6 (pronouns) - subject pronouns
- **Requires:** Lesson 8 (accusative) - object introduction
- **Required by:** Lesson 13 (definite conjugation) - contrast pattern" \
    '["enhancement", "lesson", "A1", "priority-medium"]' \
    "$MILESTONE_A1" | tail -1)
echo ""

# Issue 8: Lesson 11 - Family Vocabulary (Depends on Lesson 7)
ISSUE_11=$(create_issue \
    "feat(lessons): Lesson 11 - Family & Relationships Vocabulary" \
    "## Description
Create an interactive lesson teaching family member vocabulary and relationship expressions.

## Learning Objectives
- Name immediate and extended family members
- Describe family relationships
- Use possessive expressions (intro level)
- Talk about one's own family

## Content Outline

### Section 1: Immediate Family
anya/anyuka, apa/apuka, szülő/szülők, gyerek, fiú, lány, testvér, fivér/báty/öcs, nővér/húg

### Section 2: Extended Family
nagymama/nagyi, nagypapa/nagyapa, nagyszülők, unoka, nagybácsi, nagynéni, unokatestvér

### Section 3: In-Laws & Marriage
férj, feleség, após, anyós, sógor, sógornő, vő, meny

### Section 4: Talking About Family
- \"Van testvéred?\" (Do you have siblings?)
- \"Két testvérem van\" (I have two siblings)
- \"Ő az anyám\" (She is my mother)
- \"Nincs gyerekem\" (I don't have children)

## Exercise Specifications

**Stage 1: Vocabulary Cards (20 items)** - Card flip
**Stage 2: Relationship Matching (10 items)** - Drag-and-drop
**Stage 3: Family Tree Completion (8 items)** - Fill-in-blank on diagram
**Stage 4: Describing Your Family (8 items)** - Sentence completion
**Stage 5: Dialogue Practice (6 items)** - Conversation completion

## Acceptance Criteria
- [ ] Complete family vocabulary (~30 terms)
- [ ] Clear immediate/extended distinction
- [ ] Visual family tree element
- [ ] \"Van/nincs\" possession patterns
- [ ] Minimum 52 interactive exercises
- [ ] Cultural notes on Hungarian family terms

## Dependencies
- **Requires:** Lesson 7 (nouns) - noun patterns
- **Requires:** Lesson 3 (to be) - \"van\" for possession
- **Introduces:** Possessive concepts (expanded in Lesson 22)" \
    '["enhancement", "lesson", "A1", "priority-medium"]' \
    "$MILESTONE_A1" | tail -1)
echo ""

# Issue 9: Lesson 12 - A1 Review (Depends on all A1 lessons)
ISSUE_12=$(create_issue \
    "feat(lessons): Lesson 12 - A1 Review & Self-Introduction" \
    "## Description
Create a comprehensive review lesson consolidating all A1 material with extended self-introduction practice.

## Learning Objectives
- Consolidate all A1 grammar and vocabulary
- Produce extended self-introductions
- Engage in basic conversations on familiar topics
- Assess readiness for A2 level

## Content Outline

### Section 1: Grammar Review Summaries
- Verb \"to be\" conjugation recap
- Accusative case reminder
- Question formation review
- Article usage summary

### Section 2: Vocabulary Review by Category
- Numbers and age
- Greetings and politeness
- Family members
- Basic adjectives
- Common verbs

### Section 3: Extended Self-Introduction Model
\`\`\`
Szia! Én Kovács Anna vagyok. Huszonöt éves vagyok.
Budapesten lakom. Tanár vagyok.
Van egy bátyám és egy húgom.
A bátyám harmincéves, orvos. A húgom húszéves, egyetemista.
Szeretek olvasni és utazni.
Örülök, hogy megismertelek!
\`\`\`

### Section 4: Conversation Topics
Personal information, Family description, Daily activities, Likes and preferences

## Exercise Specifications

**Stage 1: Grammar Quick Review (10 items)** - Mixed (fill-in, multiple choice)
**Stage 2: Vocabulary Recognition (15 items)** - Matching/multiple choice
**Stage 3: Listening Comprehension (6 items)** - Q&A based on text
**Stage 4: Self-Introduction Writing (1 extended item)** - Guided free writing
**Stage 5: Role-Play Dialogue (8 items)** - Dialogue completion
**Stage 6: Self-Assessment Checklist** - Checkbox review

## Acceptance Criteria
- [ ] Covers all A1 lessons (4-11)
- [ ] Minimum 40 review exercises
- [ ] Extended self-introduction model
- [ ] Self-assessment component
- [ ] Clear progression indicators to A2
- [ ] Character dialogues for context

## Dependencies
- **Requires:** ALL A1 lessons (Lessons 4-11)
- **Gateway to:** A2 Level content
- This is the A1 milestone completion lesson" \
    '["enhancement", "lesson", "A1", "priority-medium"]' \
    "$MILESTONE_A1" | tail -1)
echo ""

echo "========================================"
echo "Creating A2 Level Issues"
echo "========================================"
echo ""

# Issue 10: Lesson 13 - Definite Conjugation (Depends on Lesson 10)
ISSUE_13=$(create_issue \
    "feat(lessons): Lesson 13 - Present Tense (Definite Conjugation)" \
    "## Description
Create an interactive lesson teaching the Hungarian definite verb conjugation - a unique feature of the language.

## Learning Objectives
- Understand when to use definite vs indefinite conjugation
- Conjugate verbs in definite present tense
- Apply definite conjugation to object-specific sentences
- Recognize the definite conjugation pattern

## Content Outline

### Section 1: When to Use Definite Conjugation
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

### Section 2: Definite Conjugation Endings
| Person | Back Vowel | Front Vowel |
|--------|------------|-------------|
| én | -om | -em/-öm |
| te | -od | -ed/-öd |
| ő/Ön | -ja/-a | -i |
| mi | -juk/-uk | -jük/-ük |
| ti | -játok/-átok | -itek |
| ők | -ják/-ák | -ik |

### Section 3: Comparison Examples
| Indefinite | Meaning | Definite | Meaning |
|------------|---------|----------|---------|
| Olvasok | I read | Olvasom | I read it (specific) |
| Látsz | You see | Látod | You see it/him/her |

## Exercise Specifications

**Stage 1: Definite vs Indefinite Recognition (12 items)** - Classification
**Stage 2: Conjugation Drill (12 items)** - Fill-in-blank
**Stage 3: Choose the Correct Form (10 items)** - Multiple choice
**Stage 4: Translation Practice (10 items)** - Fill-in-blank
**Stage 5: Transformation (8 items)** - Rewrite

## Acceptance Criteria
- [ ] Clear rules for when to use each conjugation
- [ ] Full definite paradigm for both vowel types
- [ ] Comparison tables with indefinite
- [ ] Minimum 52 interactive exercises
- [ ] Special verb patterns addressed
- [ ] This is a CRITICAL Hungarian feature - thorough coverage

## Dependencies
- **Requires:** Lesson 10 (indefinite conjugation) - contrast pattern
- **Requires:** Lesson 8 (accusative) - object marking
- **Requires:** Lesson 7 (articles) - definiteness concept" \
    '["enhancement", "lesson", "A2", "priority-high"]' \
    "$MILESTONE_A2" | tail -1)
echo ""

# Issue 11: Lesson 14 - Negation
ISSUE_14=$(create_issue \
    "feat(lessons): Lesson 14 - Negation (nem, nincs, sincs)" \
    "## Description
Create an interactive lesson teaching Hungarian negation patterns.

## Learning Objectives
- Use \"nem\" for standard negation
- Understand \"nincs/nincsenek\" for \"there is not\"
- Apply \"sincs/sincsenek\" for \"neither/not...either\"
- Form negative questions and responses

## Content Outline

### Section 1: Basic Negation with \"nem\"
- Placement: Before the verb/word being negated
- \"Nem vagyok tanár\" (I am not a teacher)

### Section 2: Nincs/Nincsenek (Non-existence)
- Negative of \"van/vannak\" for existence/location
- \"Nincs pénzem\" (I don't have money)

### Section 3: Sincs/Sincsenek (Neither/Not...either)
- \"Nekem sincs\" (I don't have one either)

### Section 4: Nem + Question Words
- \"Senki\" (nobody), \"semmi\" (nothing), \"sehol\" (nowhere)
- These require negative verb too: \"Senki nem jött\"

## Exercise Specifications

**Stage 1: Nem Placement (10 items)** - Sentence reordering/fill-in
**Stage 2: Nincs vs Nem Van (10 items)** - Multiple choice/correction
**Stage 3: Sincs Usage (8 items)** - Dialogue completion
**Stage 4: Negative Question Words (10 items)** - Translation
**Stage 5: Negative Dialogue (8 items)** - Conversation completion

## Acceptance Criteria
- [ ] All negation patterns covered
- [ ] Clear distinction between nem/nincs/sincs
- [ ] Double negative rule explained
- [ ] Minimum 46 interactive exercises

## Dependencies
- **Requires:** Lesson 3 (to be) - \"van\" → \"nincs\"
- **Requires:** Lesson 10 (verbs) - verb negation" \
    '["enhancement", "lesson", "A2", "priority-high"]' \
    "$MILESTONE_A2" | tail -1)
echo ""

# Issue 12: Lesson 15 - Location Cases
ISSUE_15=$(create_issue \
    "feat(lessons): Lesson 15 - Location & Direction Cases" \
    "## Description
Create an interactive lesson teaching Hungarian locative cases (where things are and where they go).

## Learning Objectives
- Master the \"where?/whereto?/wherefrom?\" case system
- Apply inessive (-ban/-ben), superessive (-n/-on/-en/-ön)
- Use illative (-ba/-be), sublative (-ra/-re)
- Distinguish static vs dynamic location

## Content Outline

### Section 1: The Three-Way Location System
| Question | \"In\" Type | \"On\" Type | \"At\" Type |
|----------|-----------|-----------|-----------|
| Hol? | -ban/-ben | -n/-on/-en/-ön | -nál/-nél |
| Hová? | -ba/-be | -ra/-re | -hoz/-hez/-höz |
| Honnan? | -ból/-ből | -ról/-ről | -tól/-től |

### Section 2-4: Inside, Surface, and Proximity Location systems with examples

## Exercise Specifications

**Stage 1: Case Recognition (12 items)** - Classification
**Stage 2: Static Location Drill (12 items)** - Fill-in-blank
**Stage 3: Dynamic Location Drill (12 items)** - Fill-in-blank
**Stage 4: Translation Practice (10 items)** - Full sentence
**Stage 5: Map Exercise (6 items)** - Interactive map/visual
**Stage 6: Dialogue with Directions (8 items)** - Conversation completion

## Acceptance Criteria
- [ ] All nine location suffixes covered
- [ ] Clear three-way system explanation
- [ ] Vowel harmony application shown
- [ ] Minimum 60 interactive exercises
- [ ] Visual map/diagram element

## Dependencies
- **Requires:** Lesson 2 (vowel harmony) - suffix selection
- **Requires:** Lesson 7 (nouns) - noun forms" \
    '["enhancement", "lesson", "A2", "priority-high"]' \
    "$MILESTONE_A2" | tail -1)
echo ""

# Issue 13: Lesson 16 - Time Expressions
ISSUE_16=$(create_issue \
    "feat(lessons): Lesson 16 - Time Expressions & Calendar" \
    "## Description
Create an interactive lesson teaching time expressions, days, months, and calendar usage.

## Learning Objectives
- Tell time in Hungarian
- Name days of the week and months
- Express dates and time periods
- Schedule events and appointments

## Content Outline
- Telling time (Hány óra?, fél kettő, negyed, háromnegyed)
- Days of the week (hétfő through vasárnap)
- Months of the year
- Dates and duration expressions

## Exercise Specifications

**Stage 1: Clock Reading (10 items)** - Visual clock + multiple choice
**Stage 2: Days & Months Vocabulary (14 items)** - Card flip/matching
**Stage 3: Time Expression Fill-in (10 items)** - Fill-in-blank
**Stage 4: Schedule Reading (8 items)** - Q&A based on schedule
**Stage 5: Appointment Dialogue (8 items)** - Dialogue completion

## Acceptance Criteria
- [ ] Complete time-telling system
- [ ] All days and months covered
- [ ] Hungarian date format explained
- [ ] Duration expressions included
- [ ] Minimum 50 interactive exercises
- [ ] Visual clock elements

## Dependencies
- **Requires:** Lesson 4 (numbers) - number vocabulary
- **Requires:** Lesson 15 (cases) - time case suffixes" \
    '["enhancement", "lesson", "A2", "priority-medium"]' \
    "$MILESTONE_A2" | tail -1)
echo ""

# Issue 14: Lesson 22 - Possession
ISSUE_22=$(create_issue \
    "feat(lessons): Lesson 22 - Possession & Possessive Suffixes" \
    "## Description
Create an interactive lesson teaching Hungarian possessive suffixes - a critical feature of the language.

## Learning Objectives
- Apply possessive suffixes to nouns
- Handle vowel harmony in possession
- Express ownership without separate possessive pronouns
- Understand the possessive + case stacking

## Content Outline

### Section 1: Possessive Suffix System
| Person | Suffix (back) | Suffix (front) |
|--------|---------------|----------------|
| my | -om/-am | -em/-öm |
| your (te) | -od/-ad | -ed/-öd |
| his/her | -ja/-a | -je/-e |
| our | -unk | -ünk |
| your (ti) | -otok/-atok | -etek/-ötök |
| their | -juk/-uk | -jük/-ük |

### Section 2-4: Case stacking, emphatic pronouns, irregular forms

## Exercise Specifications

**Stage 1: Suffix Formation (15 items)** - Fill-in-blank
**Stage 2: Vowel Harmony Practice (10 items)** - Multiple choice
**Stage 3: Translation (12 items)** - Fill-in-blank
**Stage 4: Case Stacking (10 items)** - Build the form
**Stage 5: Family Possession (8 items)** - Sentence completion
**Stage 6: Dialogue with Possession (8 items)** - Conversation completion

## Acceptance Criteria
- [ ] Complete possessive paradigm
- [ ] Vowel harmony clearly shown
- [ ] Case stacking explained and practiced
- [ ] Irregular forms noted
- [ ] Minimum 63 interactive exercises

## Dependencies
- **Requires:** Lesson 2 (vowel harmony) - suffix harmony
- **Requires:** Lesson 11 (family) - possession context
- **Requires:** Lesson 8 (accusative) - case stacking understanding" \
    '["enhancement", "lesson", "A2", "priority-high"]' \
    "$MILESTONE_A2" | tail -1)
echo ""

echo "========================================"
echo "Creating Summary Issues for Remaining Lessons"
echo "========================================"
echo ""

# Issue 15: Remaining A2 Lessons (17-21, 23-26)
create_issue \
    "feat(lessons): Lessons 17-21, 23-26 - Remaining A2 Content" \
    "## Description
Bundle issue for remaining A2 lessons not yet detailed.

## Lessons Included

### Lesson 17: Food & Restaurant Vocabulary
- Focus: Food items, ordering, dietary terms
- Key Exercise: Menu ordering simulation
- Items: 50+ vocabulary, 45+ exercises

### Lesson 18: Shopping & Money
- Focus: Prices, currency, transaction dialogue
- Key Exercise: Price negotiation simulation
- Items: 40+ vocabulary, 40+ exercises

### Lesson 19: Modal Verbs (can, want, must)
- Focus: Tud, akar, kell, szabad
- Key Exercise: Modal + infinitive patterns
- Items: 50+ exercises

### Lesson 20: Past Tense (Indefinite Conjugation)
- Focus: Past tense verb conjugation (indefinite)
- Key Exercise: Narrative transformation
- Items: 55+ exercises

### Lesson 21: Past Tense (Definite Conjugation)
- Focus: Past tense verb conjugation (definite)
- Key Exercise: Story retelling
- Items: 55+ exercises

### Lesson 23: Transportation & Travel
- Focus: Route planning, ticket booking
- Items: 45+ exercises

### Lesson 24: Weather & Seasons
- Focus: Weather descriptions, seasonal activities
- Items: 40+ exercises

### Lesson 25: Health & Body Parts
- Focus: Symptom description, doctor visit dialogue
- Items: 45+ exercises

### Lesson 26: A2 Review & Extended Dialogue
- Focus: Comprehensive A2 review
- Items: 60+ exercises

## Note
Each of these will be broken out into individual issues when development approaches.

## Dependencies
- All require completion of A1 lessons
- Should be developed in sequence" \
    '["enhancement", "curriculum", "A2", "priority-low"]' \
    "$MILESTONE_A2" > /dev/null
echo "✓ Created: Remaining A2 lessons bundle"
echo ""

# Issue 16: B1 Level Lessons
create_issue \
    "feat(lessons): Lessons 27-40 - B1 Level (Threshold)" \
    "## Description
Bundle issue for B1 level lessons (Weeks 27-40).

## Focus Areas

### Grammar
- Lesson 27: Future Tense & Intentions
- Lesson 28: Conditional Mood (would/could)
- Lesson 29: Imperative Mood (commands/requests)
- Lesson 30: Dative Case (-nak/-nek)
- Lesson 31: Instrumental Case (-val/-vel)
- Lesson 32: Ablative & Other Location Cases
- Lesson 33: Comparatives & Superlatives
- Lesson 34: Relative Clauses (aki, ami, amely)

### Vocabulary & Culture
- Lesson 35: Work & Profession Vocabulary
- Lesson 36: Housing & Home
- Lesson 37: Hobbies & Leisure Activities
- Lesson 38: Hungarian Culture & Traditions
- Lesson 39: News & Current Events
- Lesson 40: B1 Review & Narrative Writing

## Target Outcomes
- Express opinions and preferences
- Handle most travel situations
- Discuss work, hobbies, and current events
- Write simple connected text

## Dependencies
- **Requires:** Completion of A2 level (Lessons 13-26)
- **Gateway to:** B2 level content" \
    '["enhancement", "curriculum", "B1", "priority-low"]' \
    "$MILESTONE_B1" > /dev/null
echo "✓ Created: B1 lessons bundle"
echo ""

# Issue 17: B2 Level Lessons
create_issue \
    "feat(lessons): Lessons 41-52 - B2 Level (Vantage)" \
    "## Description
Bundle issue for B2 level lessons (Weeks 41-52).

## Focus Areas

### Advanced Grammar
- Lesson 41: Verbal Prefixes (meg-, el-, ki-, be-)
- Lesson 42: Subjunctive Mood
- Lesson 43: Passive & Impersonal Constructions
- Lesson 44: Complex Sentence Structures

### Advanced Usage
- Lesson 45: Idiomatic Expressions
- Lesson 46: Formal vs Informal Register
- Lesson 47: Academic & Professional Hungarian
- Lesson 48: Literature & Poetry Introduction
- Lesson 49: Humor & Wordplay in Hungarian
- Lesson 50: Debate & Argumentation
- Lesson 51: Advanced Review & Self-Assessment
- Lesson 52: Capstone: Full Conversation Simulation

## Target Outcomes
- Understand complex texts
- Interact with native speakers fluently
- Produce clear, detailed text
- Express viewpoints on current issues

## Dependencies
- **Requires:** Completion of B1 level (Lessons 27-40)
- **Capstone:** Full curriculum completion" \
    '["enhancement", "curriculum", "B2", "priority-low"]' \
    "$MILESTONE_B2" > /dev/null
echo "✓ Created: B2 lessons bundle"
echo ""

echo "========================================"
echo "Issue Creation Complete!"
echo "========================================"
echo ""
echo "Summary:"
echo "  - Created 4 milestones (A1, A2, B1, B2)"
echo "  - Created 8 labels"
echo "  - Created 14 detailed lesson issues"
echo "  - Created 3 bundle issues for remaining lessons"
echo ""
echo "Next steps:"
echo "  1. Review created issues at: https://github.com/${REPO_OWNER}/${REPO_NAME}/issues"
echo "  2. Add any additional labels or assignees as needed"
echo "  3. Start development with high-priority A1 issues"
echo ""
echo "Dependency Overview:"
echo "  Lesson 4 (Numbers) ─────────────────┐"
echo "  Lesson 5 (Greetings) ───────────────┤"
echo "  Lesson 6 (Pronouns) ← Lesson 3 ─────┤"
echo "  Lesson 7 (Nouns) ← Lesson 2 ────────┼─→ Lesson 12 (A1 Review)"
echo "  Lesson 8 (Accusative) ← L2, L7 ─────┤"
echo "  Lesson 9 (Adjectives) ← L3, L7 ─────┤"
echo "  Lesson 10 (Verbs) ← L2, L6, L8 ─────┤"
echo "  Lesson 11 (Family) ← L3, L7 ────────┘"
echo ""
echo "  Lesson 12 → Lesson 13 (Definite) → A2 Lessons → B1 → B2"
