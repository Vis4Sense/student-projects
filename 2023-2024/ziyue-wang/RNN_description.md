// RNN is useful to predict some values, the simplified process is below:

I want to buy a phone.  // this is a scentence

I want to __ a phone. // there is a empty position, so this scentence is not complete, given to the computer, it doesn't know what do you mean

My phone is broken, so I want to __ __ ... // more position is empty, harder for the computer to realize

// there are two examples:

My phone is broken, so I want to __ (buy/repair) a new phone // choosing 'buy' to place in this position is better

My phone is broken, so I want to __(buy/repair) this phone // choosing 'repair' to place in this position is better

// the scentences including these words are the datas, what the RNN needs to do is implementing (predicting) the rest of them

// assume in the end of our process, two phones are left. phone_1 and phone_2

phone_1 __(>/==/<) phone_2 (we assume '>' is better than, '=' is almost the same, '<' is worse than)

// so in the end, we shoule be able to compare which is better after RNN training

// assume there is a list of achieve phones. from phone_1 to phone_n

phone_1
phone_2
...
phone_n

// so in the end, if possible, the extension should be able to suggest the user which is better.
// it is the same if the phone is replaced by other things, like camera and so on
// more complex jobs should be based on the Knowledge Base support, it means that we should hold an additional knowledge base
