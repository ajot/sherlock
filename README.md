# Sherlock - Alexa evangelist finder

An Alexa skill built using the Alexa Node SDK, that lets you find information about Alexa evangelists and Solutions Architects.

## The flow
**Initial question**
"Who is Dave" or "Find Paul"

**Follow up question**
"Tell me more" or "Give me his contact info"

## People in the database right now
- paul
- jeff
- memo
- rob
- dave
- michael
- amit

## Concepts
- Intents: SearchIntent (search for a contact) and TellMeMoreIntent (give more details about a contact just searched for)
- Slots: built in name slots, extending those with custom names
- session attributes to support context (ex: "what's his linked in" would reference the person previously referenced)
- states based handling of intents - search mode and description mode
- data look up from an array includes in an external JS file.
- SSML tags to spell out the twitter and github handle in a slightly sped up, but natural way.
- send properly formatted cards with contact info to the Alexa companion app, along with images.
- Context: store the active contact as an object in session attributes, so Alexa can can
reply to the question - "tell me more" with context.

## What's implemented thus far
- Ask Alexa to search for a contact by first name - "Alexa, who is dave"
- Logic to respond when the name is someone on our team and not,
- Slots: for names, and also for info types - like twitter, github etc.
- Would you like to learn more - yes/no is handles using the built-in Yes/No intents
- Check all variable names in the card content part - specifically cardTitle may not be needed in SearchIntent
- Create a helper function for generating card content. this should be used by the TellMeMoreIntent and TellMeThisIntent
- Add images for the evangelists
- Say the twitter handle, then spell it.

## TODO
- Allow user to daisy chain questions for an active contact.
- Answer more context specific questions, like "where does he live?", "what's his github handle"
- Add more bio information for everyone.
- Populate with more data from the ASK SA team.
- Alexa, ask sherlock who is {dave}
