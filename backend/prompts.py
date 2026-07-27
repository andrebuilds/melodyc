PROMPT_GENERATOR_PROMPT = """
Reformat the following user-provided music description into a simple comma-separated list of audio tags.

User Description: "{user_prompt}"

Follow these guidelines strictly when reformatting. Include a tag from each category below in your final list:
- Include genre (e.g., "rap", "pop", "rock", "electronic")
- Include vocal type (e.g., "male vocal", "female vocal", "spoken word")
- Include instruments actually heard (e.g., "guitar", "piano", "synthesizer", "drums")
- Include mood/energy (e.g., "energetic", "calm", "aggressive", "melancholic")
- Include tempo if known (e.g., "120 bpm", "fast tempo", "slow tempo")
- Include key if known (e.g., "major key", "minor key", "C major")
- Include an artist reference style if one is clearly implied by the description (e.g., "in the style of Daft Punk"). Omit this tag entirely if no specific style is implied — do not guess.
- ALWAYS output tags in English, regardless of the language of the user description above. Never translate tags into another language.
- The output must be a single line of comma-separated tags. Do not add any other text or explanation.

If already a few tags, infer what the user wants and add 2-3 more tags that are synonyms to the users tags with no new categories.

Examples:
User Description: "a sad song about lost love"
Formatted Tags: pop, female vocal, piano, melancholic, slow tempo, minor key, emotional, atmospheric

User Description: "energetic gym music"
Formatted Tags: electronic, male vocal, synthesizer, drums, energetic, fast tempo, 140 bpm, major key, driving

User Description: "un pezzo rap aggressivo con basso pesante"
Formatted Tags: rap, male vocal, bass, aggressive, fast tempo, minor key, hard-hitting, gritty

Formatted Tags:
"""

LYRICS_GENERATOR_PROMPT = """
Generate song lyrics based on the following description.
The lyrics should be suitable for a song and structured clearly.
Use tags like [verse], [chorus], [bridge], [intro], and [outro] to structure the song.
Write the lyrics entirely in {language}.
The dominant mood/emotion of the lyrics should be: {mood}.
Each verse and chorus should have approximately 4 lines per section, unless the structure clearly calls for more.

Here is an example:
"[verse]\nWoke up in a city that's always alive\nNeon lights they shimmer they thrive\nElectric pulses beat they drive\nMy heart races just to survive\n\n[chorus]\nOh electric dreams they keep me high\nThrough the wires I soar and fly\nMidnight rhythms in the sky\nElectric dreams together we’ll defy\n\n[verse]\nLost in the labyrinth of screens\nVirtual love or so it seems\nIn the night the city gleams\nDigital faces haunted by memes\n\n[chorus]\nOh electric dreams they keep me high\nThrough the wires I soar and fly\nMidnight rhythms in the sky\nElectric dreams together we’ll defy\n\n[bridge]\nSilent whispers in my ear\nPixelated love serene and clear\nThrough the chaos find you near\nIn electric dreams no fear\n\n[verse]\nBound by circuits intertwined\nLove like ours is hard to find\nIn this world we’re truly blind\nBut electric dreams free the mind"

Description: "{description}"

Lyrics:
"""
