const bot = require('bbot')
const { memory, Envelope } = require('bbot')

/** Add your bot logic here. Removing the imported examples. */
// require('./examples')
/** bot.global.enter( b=> {
    b.respond(`Welcome to the *Mechacynic Chat* @${b.message.user.name}! Before you can get started using our chat service, I need to run through some things with you real quick.`)
    b.respond(`First, I need to make clear that I am a bot, if you hadn’t already guessed. :m-excited: However, I am not an interactive chat bot. During the course of our conversation, I will be asking you to say specific things so that I know that you understand or agree to what I am saying. Please be sure to say exactly the words that I ask you to, otherwise I will not be able to understand you.`)
    b.respond(`Also, because I am a bot, our conversations are able to be seen by the administrators of this website. Please *do not expect any privacy when talking to any of the bots on this website*. The administration will only view these messages in order to program them better, or to train the *machine learning* in the bots that use *natural language processing*. By continuing with this conversation, *you accept these terms*, as well as the *Terms of Service* and *Privacy Policy* of Mechacynic.`)
    b.respond(`If you understand and agree, please say “yes” or “okay”. If you don’t understand, say anything else and I will explain in more detail.`)
}) */

bot.global.text({
    contains: 'begin'
}, b => {
    b.envelope
      .write(`Welcome to the *Mechacynic Chat* @${b.message.user.name}! Before you can get started using our chat service, I need to run through some things with you real quick.`)
      .write(`First, I need to make clear that I am a bot, if you hadn't already guessed. ` + ":m-excited:" + ` However, I am not an interactive chat bot. During the course of our conversation, I will be asking you to say specific things so that I know that you understand or agree to what I am saying. Please be sure to say exactly the words that I ask you to, otherwise I will not be able to understand you.`)
      .write(`Also, because I am a bot, the admins here can view our chats. Please *don't expect privacy talking to bots*. The admins will only view these messages in order to program us better, or to train our *machine learning*. By continuing with this conversation, *you accept these terms*, as well as the *Terms of Service* and *Privacy Policy* of Mechacynic.`)
      .write(`If you understand, say "yes" or press the *Yes* button below. If you don't, say "no" or press the *No* button below.`)
      .attach({ color: '#f4426e'})
      .payload
        .quickReply({ text: 'Yes'})
        .quickReply({ text: 'No' })
    b.bot.memory.set('agreeState', 1)
    return b.respond()
}, { id: 'intro' })

/** TODO: Implement improper response 'bad path' if agreeState is 1 but user does not say yes or okay. */
bot.global.text({
    contains: [ 'No' ]
}, b => {
    let agreeState = b.bot.memory.get('agreeState') || 0
    switch (agreeState)
    {
        case 0:
            break;
        case 1:
            b.respond(`I am a bot that was created by @atlas to make sure that everyone understood how to use Rocket.Chat and also understood the rules. Before I can allow you access to the chat, I need to go over the rules with you and show you the ropes. It's quick and easy. If you're on the desktop version, there's handy little buttons you can push in order to respond to me. If you're on mobile, it's as simple as typing the word I request from you. I promise, it's quick and painless. Let's go ahead and continue. Say "yes" or press the *Yes* button above this message. :heart: `)
            break;
        case 2:
            //Second state, they've just said they haven't used RocketChat.
            b.envelope
                .write(`The Mechacynic Chat contains a variety of different public channels that you can speak in. A public channel is a channel that everyone on the site can participate in.`)
                .write(`You can also choose to create private channels to talk with your friends privately.`)
                .write(`The Mechacynic Chat supports End to End encryption (or E2E) on the browser version of the website. Currently, the mobile app does not support E2E. This feature provides you with an added layer of security. A channel with E2E turned on will be unreadable to any prying eyes. Nobody except for the people in that channel can read the messages in these channels, not even the administration. E2E is currently optional. You must turn this feature on manually when you create a new channel. It can be turned off later. Anyone viewing the messages in this channel on mobile will only see the unencrypted version of the text -- just lots of letters and numbers.`)
                .write(`Let me know when you’re ready to keep going by saying “continue”.`)
                .attach({ color: '#f4426e'})
                    .payload
                        .quickReply({ text: 'Continue!'})
                b.bot.memory.set('agreeState', 3)
                return b.respond()
        case 12:
            b.envelope.write(`Great, I’ll get you added to those channels, then. Don’t forget, you can always leave a channel if you decide you don’t like it.`)

            b.envelope.write(`We’re all done! I hope you enjoy the chat. If you have any feedback for me, just type “feedback”.`)
            b.bot.memory.set('addNSFW', false)
            b.bot.memory.set('agreeState', 13)
            return b.respond()

    }
}, { id: 'bad-path'})

//Good path
bot.global.text({
    contains: [ 'Yes', 'Continue', 'Agree' ]
}, b => {
    let agreeState = b.bot.memory.get('agreeState') || 0
    switch (agreeState)
    {
        case 0:
            break;
        case 1:
            //First state, they've just agreed to ToS, Privacy Policy, and terms of bot chats.
            b.envelope.write(`Great. The Mechacynic Chat runs on an open-source self-hosted copy of Rocket.Chat. Have you ever used Rocket.Chat before?`)
            b.envelope.attach({ color: '#f4426e'})
            b.envelope.payload
                .quickReply({ text: 'Yes'})
                .quickReply({ text: 'No' })
            b.bot.memory.set('agreeState', 2)
            return b.respond()
        case 2:
            //Second state -- they've said they know how to use RocketChat. Skip to the rules & threading.
            b.envelope
                .write(`Okay. We just need to go over the rules and threading, then.`)
                .write(`Let me know when you’re ready to continue by saying “continue”.`)
                .attach({ color: '#f4426e'})
                    .payload
                        .quickReply({ text: 'Continue!'})
            b.bot.memory.set('agreeState', 6)
            return b.respond()
        case 3:
            b.envelope
                .write(`The user interface of the mobile app and desktop or web version are slightly different. During our conversation, I’ll be sure to tell you how to do things on both the desktop and mobile versions. If you don’t plan to use one or the other, you can just skip the parts referring to the one you don’t plan to use. If you ever need these instructions again, after our conversation is over I am able to answer specific questions.`) 
                .write(`Let me know when you’re ready to continue by saying “continue”.`)
                .attach({ color: '#f4426e'})
                    .payload
                        .quickReply({ text: 'Continue!'})
            b.bot.memory.set('agreeState', 4)
            return b.respond()
        case 4:
            b.envelope
                .write(`In the Mechacynic Chat, some channels require the use of threads. In these channels, you can think of them more like categories of a forum. Posting in those channels is like creating the title for your thread, and responding is like creating the first post for your thread. This feature is important because of the nature of these channels. They’re meant to be a sort of hub for talking about a wide variety of subjects, and threads allow many conversations to co-exist in the same channel.`) 
                .write(`I’ve attached a quick video displaying how to use threads.`)
                .write(`{placeholder - attach video showing how to thread}`)
                .write(`Let me know when you’re ready to continue by saying “continue”.`)
                .attach({ color: '#f4426e'})
                    .payload
                        .quickReply({ text: 'Continue!'})
            b.bot.memory.set('agreeState', 5)
            return b.respond()
        case 5:
            b.envelope
                .write(`Discussions are a lot like channels, with one exception. A discussion is created inside a channel. Anyone can make discussions. Consider discussions to be like a sub-category. For example, you might visit #technology and you may want to talk about electronic vehicles. But, there are many different kinds of electronic vehicles, and you feel that it would be best to talk about these different kinds separately, so you create a discussion called Electronic Vehicles. At this point, the discussion is now yours. You can decide whether or not the discussion requires the use of threads, and what other rules might apply. It is still a public channel, though, so you do need to adhere to the channel’s rules and the server’s rules.`)
                .write(`Let me know when you’re ready to continue by saying “continue”.`) 
                .attach({ color: '#f4426e'})
                    .payload
                        .quickReply({ text: 'Continue!'})
            b.bot.memory.set('agreeState', 6)
            return b.respond()
        case 6:
            b.envelope
                .write(`There are four types of rules that apply to the Mechacynic Chat. The first is global rules, the second is threading rules, the third is public NSFW channel rules, and the fourth is individual channel rules.`)
                .write(`Global Rules:
                1. You must be 18 or over to use the chat.
                2. Treat other people with respect. Do not be rude or obscene towards others. Do not harass, belittle, or publicly shame others. Just don't be a jerk.
                3. Do not argue with administrators or moderators. If you have a problem with a staff member, please contact @atlas or @onaka .
                4. Moderators and admins will not handle user-to-user disputes.
                5. Harrasment will not be tolerated and will result in an instant ban if provable.`)
                 
                .write(`Once you’ve read these rules and agreed to them, please say “I agree”.`)
                .attach({ color: '#f4426e'})
                    .payload
                        .quickReply({ text: 'I agree.'})
            b.bot.memory.set('agreeState', 7)
            return b.respond()
        case 7:
            b.envelope
                .write(`Threading Rules:
                1. If a channel, in its rules, specifies that it requires threading, then you must create and use threads. 
                2. A thread title consists of a prefix and a short description of the thread. For example, \`TOPIC\` is a prefix and “Talking about threads” is the description. As a whole, this would be “\`Topic\` Talking about threads”.
                3. A thread description is a description of the threads purpose in more detail than the title. For example, “This thread is used to discuss how threading works in more detail.” would be a description for our last title.
                4. In channels that require threading, all threads must start with a title and be followed up by a reply with the description.`)
                 
                .write(`Once you’ve read these rules and agreed to them, please say “I agree”.`)
                .attach({ color: '#f4426e'})
                    .payload
                        .quickReply({ text: 'I agree.'})
            b.bot.memory.set('agreeState', 8)
            return b.respond()
        case 8:
            b.envelope
                .write(`Public NSFW Channel Rules:
                1. Absolutely no illegal content. The server is currently hosted in Washington State within the US, and as such all laws in Washington and the US apply.
                2. No gore, real rape, abuse, or nonconsensual acts.
                3. All NSFW channels are required to use threads.
                4. For broad categories, you’re welcome to use discussions. Discussions within NSFW channels absolutely must adhere to that channels rules, and the public NSFW channel rules. You do not have to use discussions if you do not want to.
                5. Never, ever post any pornographic content into the main channel. They must be replies to a thread. This is a bannable offense. If by accident, you can delete your post.`)
                 
                .write(`Once you’ve read these rules and agreed to them, please say “I agree”.`)
                .attach({ color: '#f4426e'})
                    .payload
                        .quickReply({ text: 'I agree.'})
            b.bot.memory.set('agreeState', 9)
            return b.respond()
        case 9:
            b.envelope
                .write(`Great. Remember, you are required to use threads inside all NSFW channels except #erotic-hypnosis and #memes-and-shitposts .The following SFW channels require that you use threads:
                > #technology
                > #suggestions
                > #video-games
                > #help
                > #anime`)
                 
                .write(`The following channels require threading, but do not require prefixes:
                > #hentai
                > #pornography
                > #video-games
                > #anime`)
                 
                .write(`Once you’ve read these rules and agreed to them, please say “I agree”.`)
                .attach({ color: '#f4426e'})
                    .payload
                        .quickReply({ text: 'I agree.'})
            b.bot.memory.set('agreeState', 10)
            return b.respond()
        case 10:
            b.envelope
                .write(`The last thing we need to go over is individual channel rules. Few channels have additional rules. Let’s start with #hentai .
 
                1. Drawn and 3D are OK. Any form of pornographic artwork is acceptable.
                2. To be clear, this includes artwork that you may not enjoy. Lolicon, shotacon, bestiality, et cetera are all acceptable. If you don’t want to see this kind of content, you don’t have to -- that’s why we use threads.
                 
                Next up is #erotic-hypnosis .
                 
                1. Threading is not required. You may still use threads, if you’d like to.
                2. All hypnotic interactions require consent. Consent cannot be given during trance, or in the following 15 minutes after trance.
                3. Do not discuss the use of hypnosis with minors.
                4. Trigger words may be used in this chat.
                5. Pornographic imagery may be posted outside of threads, given that it has some element of hypnosis in it.
                6. Spirals are allowed.`)
                 
                .write(`Once you’ve read these rules and agreed to them, please say “I agree”.`)
                .attach({ color: '#f4426e'})
                    .payload
                        .quickReply({ text: 'I agree.'})
            b.bot.memory.set('agreeState', 11)
            return b.respond()
        case 11:
            b.envelope
                .write(`That’s it! Thanks for sticking with me, I really appreciate it. I’ll add you to all the SFW channels by default. Do you want me to add you to the NSFW channels, as well? You can always change your mind later and join them manually from the directory. You can say “yes” or “no”.`)
                .attach({ color: '#f4426e'})
                    .payload
                        .quickReply({ text: 'Yes'})
                        .quickReply({ text: 'No'})
            b.bot.memory.set('agreeState', 12)
            return b.respond()
        case 12:
            b.envelope.write(`Great, I’ll get you added to those channels, then. Don’t forget, you can always leave a channel if you decide you don’t like it.`)

            b.envelope.write(`We’re all done! I hope you enjoy the chat. If you have any feedback for me, just type “feedback”.`)
            b.bot.memory.set('addNSFW', true)
            b.bot.memory.set('agreeState', 13)
            return b.respond()
        
    }
})

//Bad path
/*
bot.global.text({
    contains: [ 'no' ]
}, b => {
    let agreeState = b.bot.memory.get('agreeState') || 0
})*/
bot.start()
