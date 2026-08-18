PRESET_LOFI = (
	"lofi hip hop, instrumental, soft drums, jazzy chords, mellow, warm, "
	"vinyl crackle, 80 bpm, minor key"
)

PRESET_CINEMATIC = (
	"cinematic, orchestral, strings, brass, percussion, epic, emotional, "
	"120 bpm, minor key"
)

PRESET_SYNTHWAVE = (
	"synthwave, retro electronic, synthesizer, drum machine, nostalgic, "
	"driving, 110 bpm, minor key, in the style of 80s soundtrack"
)

PRESET_ACOUSTIC = (
	"acoustic pop, male vocal, acoustic guitar, piano, intimate, warm, "
	"slow tempo, major key"
)

STYLE_PRESETS = {
	"lofi": PRESET_LOFI,
	"cinematic": PRESET_CINEMATIC,
	"synthwave": PRESET_SYNTHWAVE,
	"acoustic": PRESET_ACOUSTIC,
}

STYLE_PRESETS_REFERENCE = "\n".join(
	[f'- "{name}": {tags}' for name, tags in STYLE_PRESETS.items()]
)

PROMPT_GENERATOR_PROMPT = f"""
Reformat the following user-provided music description into a simple comma-separated list of audio tags.

User Description: "{{user_prompt}}"

Follow these guidelines strictly when reformatting. Include at least one tag from each category below in your final list:
- Include genre (e.g., "rap", "pop", "rock", "electronic")
- Include vocal type (e.g., "male vocal", "female vocal", "spoken word", "instrumental")
- Include instruments actually heard (e.g., "guitar", "piano", "synthesizer", "drums")
- Include mood/energy (e.g., "energetic", "calm", "aggressive", "melancholic")
- Include tempo if known (e.g., "120 bpm", "fast tempo", "slow tempo")
- Include key if known (e.g., "major key", "minor key", "C major")
- Include an artist reference style if one is clearly implied by the description (e.g., "in the style of Daft Punk"). Omit this tag entirely if no specific style is implied; do not guess.
- ALWAYS output tags in English, regardless of the language of the user description above.
- If the user already provides tags, preserve intent and add 2-3 useful synonyms without introducing unrelated categories.
- The output must be a single line of comma-separated tags. Do not add any other text or explanation.

Style presets you can use when the user explicitly references one:
{STYLE_PRESETS_REFERENCE}

Examples:
User Description: "a sad song about lost love"
Formatted Tags: pop, female vocal, piano, melancholic, slow tempo, minor key, emotional, atmospheric

User Description: "energetic gym music"
Formatted Tags: electronic, male vocal, synthesizer, drums, energetic, fast tempo, 140 bpm, major key, driving

User Description: "un pezzo rap aggressivo con basso pesante"
Formatted Tags: rap, male vocal, bass, aggressive, fast tempo, minor key, hard-hitting, gritty

User Description: "dreamy indie with jangly guitars and reverb"
Formatted Tags: indie rock, female vocal, electric guitar, drums, dreamy, mid tempo, major key, shimmering, nostalgic

User Description: "orchestral trailer music in the style of Hans Zimmer"
Formatted Tags: cinematic, instrumental, strings, brass, percussion, epic, 120 bpm, minor key, in the style of Hans Zimmer, dramatic

Formatted Tags:
"""

LYRICS_PROMPT_COMMON = """
Generate song lyrics based on the following description.
The lyrics should be suitable for a song, vivid, and emotionally coherent.
Use section tags like [intro], [verse], [chorus], [bridge], and [outro].
Write the lyrics entirely in {language}.
The dominant mood/emotion of the lyrics should be: {mood}.
Structure requirements:
- Keep verses and choruses to approximately 4 lines each.
- Use 2 to 3 verses and 2 choruses.
- Keep line lengths singable (roughly short to medium phrases).
- Avoid meta commentary and do not explain the lyrics.

Description: "{description}"

Lyrics:
"""

LYRICS_GENERATOR_PROMPT = LYRICS_PROMPT_COMMON

LYRICS_RAP_PROMPT = LYRICS_PROMPT_COMMON + """
Rap-specific style rules:
- Prioritize rhythm, punchy multisyllabic rhyme, and internal rhyme.
- Use confident phrasing and strong cadence markers.
- Allow occasional ad-libs in parentheses if they fit the flow.
"""

LYRICS_POP_PROMPT = LYRICS_PROMPT_COMMON + """
Pop-specific style rules:
- Prioritize a catchy, repeatable chorus hook.
- Keep language clear, direct, and memorable.
- Use emotionally accessible imagery and a strong topline feel.
"""

LYRICS_BLUES_PROMPT = LYRICS_PROMPT_COMMON + """
Blues-specific style rules:
- Use storytelling, concrete imagery, and a soulful tone.
- Favor AAB-like phrasing in verses when natural.
- Keep the emotional arc grounded, raw, and human.
"""

LYRICS_METAL_PROMPT = LYRICS_PROMPT_COMMON + """
Metal-specific style rules:
- Use intense imagery, high-contrast emotion, and forceful diction.
- Favor anthemic chorus lines and dramatic build-up in verses.
- Keep the language powerful but coherent and performable.
"""

LYRICS_PROMPTS_BY_GENRE = {
	"rap": LYRICS_RAP_PROMPT,
	"hip hop": LYRICS_RAP_PROMPT,
	"pop": LYRICS_POP_PROMPT,
	"blues": LYRICS_BLUES_PROMPT,
	"metal": LYRICS_METAL_PROMPT,
}
