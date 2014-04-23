word-environment
================

This app uses the Moby project parts of speech catalog which I parsed into a JSON file (posDic.js) that can be found in the root directory. The user inputs a sentence or a block of text and clicks "begin". In the next step the words are analyzed and presented in a vertical list with a series of buttons below each word for each possible part of speech for that word according to the Moby catalog. When the user has selected a part of speech for each word and clicks "finished", the graph database will store a "word environment" for each word.

Word Environments

A word environment consists of a word nucleus stored alongside its preceeding and succeeding words, for example:

({value: "a", pos: "article"})-[precedes]->({value:"beautiful", pos:"adj"})<-[follows]-({value:"woman", pos:"noun"})

Here the words "a" and "woman" serve as the environment for the word "beautiful" and as a result of this word environment it may be predicted that the word "beautiful" might fall between an article and a noun and that an adjective might fall between an article and a noun.

While many projects seek entirely automated machine learning algorithms, I think this shows the potential power an accuracy of a simple algorithm when aided by learned human input.
