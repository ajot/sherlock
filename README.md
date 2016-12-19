#Contact Info Skill

A skill with all the contact info for evangelists and SAs.

## What's implemented thus far
- Uses Alexa Node SDK
- Ask Alexa to search for a contact by first name - "Alexa, who is dave"
- Logic to respond when the name is someone on our team and not,
- Slots: for names, and also for info types - like twitter, github etc.
- Would you like to learn more - yes/no is handles using the built-in Yes/No
intents

## The flow
**Initial question**
"Who is Dave" or "Find Paul"

**Follow up question**
"Tell me more" or "Give me his contact info"

## Concepts
- Intents: SearchIntent (search for a contact) and TellMeMoreIntent (give more details about a contact just searched for)
- Slots: built in name slots, extending those with custom names
- session attributes to support context (ex: "what's his linked in" would reference the person previously referenced)
- states based handling of intents - search mode and description mode
- data look up from an array includes in an external JS file.
- SSML tags to spell out the twitter handle in a natural way.
- send properly formatted cards with contact info to the Alexa companion app
- Context: store the active contact as an object in session attributes, so Alexa can can
reply to the question - "tell me more" with context.

## TODO
- Alexa, ask sherlock who is {dave}
- Answer more context specific questions, like "where does he live?", "what's his github handle"
