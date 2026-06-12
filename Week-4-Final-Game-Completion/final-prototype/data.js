/* ════════════════════════════════════════════════════════════════
   PHISH HUNT — DYNAMIC SCENARIO DATABASE
   ----------------------------------------------------------------
   8 unique theme scenarios, each with a PAIRED configuration:
       • safeVariant  — a legitimate version of the message
       • scamVariant  — a phishing version of the same theme

   When a game starts, the engine runs a 50/50 coin-flip for EACH
   scenario and shows either its SAFE or its SCAM variant. That makes
   every session 1 of 2^8 = 256 possible combinations, so players
   learn to READ THE CLUES rather than memorise fixed answers.

   Variant fields:
       type     'safe' | 'scam'        (the correct answer)
       brand    key into BRAND_LOGOS   (renders an inline SVG logo)
       channel  drives the card icon + label + spoken "source" header
                ('email' | 'sms' | 'whatsapp' | 'discord' |
                 'instagram' | 'steam' | 'qr')
       verified true → shows a (fakeable) blue tick
       category 'qr' → shows the QR-Code Challenge badge
       title    the sender / subject line
       message  the body the player reads
       lesson   the educational takeaway (spoken + shown in Lesson Box)
       redFlags []  (scam only) bullet list of warning signs
   ════════════════════════════════════════════════════════════════ */

const dynamicScenarios = [
    /* ──────────── 1 · Gaming (Roblox / Fortnite V-Bucks) ──────────── */
    {
        id: 1,
        topic: 'Gaming (Roblox / Fortnite V-Bucks)',
        safeVariant: {
            type: 'safe',
            brand: 'epic',
            channel: 'email',
            title: 'Epic Games Purchase Receipt',
            message: "Thanks for your purchase! Your order of 1,000 V-Bucks is complete. Order ID: EPIC-98211. Didn't make this purchase? Open the Epic Games launcher and check your account's billing history yourself — we'll never ask for your password by email.",
            lesson: 'Real receipts tell you to check your own account in the official app or launcher, and never ask for your password. No panic and no "log in here" link is a good sign.'
        },
        scamVariant: {
            type: 'scam',
            brand: 'discord',
            channel: 'discord',
            title: "Discord DM from 'FreeNitro_Bot'",
            message: "🎁 CONGRATS! You've been picked for a FREE $100 Robux + V-Bucks gift card! Only 5 left! Claim in the next 10 minutes by logging in here 👉 bit.ly/free-vbux-claim 🔥 Hurry before it's gone!",
            redFlags: [
                'A bot you never added is messaging you out of nowhere',
                "Fake urgency — 'only 5 left' and 'next 10 minutes'",
                'A shortened bit.ly link hides where it really sends you',
                'It wants you to log in on another site, which hands over your account'
            ],
            lesson: 'Scammers hijack Discord bots to dangle "free" game currency. Real giveaways never make you log in through a random link.'
        }
    },

    /* ──────────── 2 · Discord Nitro Link ──────────── */
    {
        id: 2,
        topic: 'Discord Nitro Link',
        safeVariant: {
            type: 'safe',
            brand: 'discord',
            channel: 'discord',
            title: 'Discord: You received a gift',
            message: '🎉 Alex_W sent you a gift of Discord Nitro (1 month). To redeem it, open Discord and tap the gift in your Direct Messages. No payment and no password are needed.',
            lesson: 'A genuine Nitro gift is redeemed inside the Discord app itself — there is no outside website and your password is never required.'
        },
        scamVariant: {
            type: 'scam',
            brand: 'discord',
            channel: 'discord',
            title: "Discord DM: 'Free Nitro x Steam'",
            message: "Steam is giving away 3 months of FREE Discord Nitro for a new partnership! Grab yours before slots run out: discordnitro-gift.ru/steam — just sign in with your Steam login to prove you're real.",
            redFlags: [
                "A 'Steam x Discord free Nitro' partnership like this does not exist",
                'Odd web address ending in .ru, not discord.com',
                'Asks for your Steam login on a site that is not Steam',
                "Pressure that 'slots are running out'"
            ],
            lesson: 'The classic "free Nitro" scam asks you to sign in elsewhere to steal your Steam or Discord account. If it is not inside the official app, it is fake.'
        }
    },

    /* ──────────── 3 · Instagram Brand Ambassadorship ──────────── */
    {
        id: 3,
        topic: 'Instagram Brand Ambassadorship',
        safeVariant: {
            type: 'safe',
            brand: 'instagram',
            channel: 'instagram',
            verified: true,
            title: 'Instagram DM from @lush.uk',
            message: "Hi! We loved your skincare reels 💚 We'd like to send you some products to review — completely free to you. If you're interested, reply here and we'll email you from our official lush.com address to arrange delivery.",
            lesson: 'A real collab is free to you, comes from a verified account, and moves to an official company email. You are never asked to pay or hand over your password.'
        },
        scamVariant: {
            type: 'scam',
            brand: 'instagram',
            channel: 'instagram',
            title: 'Instagram DM from @official_brand_rewardz',
            message: "CONGRATULATIONS 🎉 You've been chosen as a Brand Ambassador! Free products + earn £300/week! Just pay £4.99 shipping and confirm your account by logging in here: ig-ambassador-verify.com 💸",
            redFlags: [
                "You never applied, yet you're suddenly 'chosen'",
                "Asks you to pay a fee to receive 'free' stuff",
                'Wants your Instagram login on a copycat website',
                'Unverified account, spammy name, and big money promises'
            ],
            lesson: 'Ambassador scams use flattery and easy money to grab your login or a small payment. Real brands never charge you or ask you to log in on another site.'
        }
    },

    /* ──────────── 4 · Steam Trade Offer ──────────── */
    {
        id: 4,
        topic: 'Steam Trade Offer',
        safeVariant: {
            type: 'safe',
            brand: 'steam',
            channel: 'email',
            title: 'Steam: Trade Offer Confirmation',
            message: "You sent a trade offer to 'Jordan_TF2'. To confirm it, open the Steam Mobile App and approve it in Steam Guard. If you didn't start this trade, just decline it in the app — never approve trades you don't recognise.",
            lesson: 'Steam trades are confirmed inside the Steam Guard mobile app, not through emailed links. You stay in control by approving only trades you started.'
        },
        scamVariant: {
            type: 'scam',
            brand: 'steam',
            channel: 'email',
            title: 'Steam Support: Trade Hold Warning',
            message: '⚠️ Your account was reported and your trade will be CANCELLED in 1 hour. Verify ownership now to keep your items: https://steamcommunlty.com/verify — sign in with your Steam username and password.',
            redFlags: [
                "Look closely: 'steamcommunlty.com' is misspelled, not steamcommunity.com",
                'A 1-hour countdown designed to make you rush',
                'Threatens to take your items unless you act',
                'Asks for your Steam password on a fake page'
            ],
            lesson: 'Item-theft scams use lookalike web addresses and threats about your inventory. Check the spelling of every domain and log in only through the real Steam app.'
        }
    },

    /* ──────────── 5 · Public Vending QR Code ──────────── */
    {
        id: 5,
        topic: 'Public Vending QR Code',
        safeVariant: {
            type: 'safe',
            channel: 'qr',
            category: 'qr',
            title: 'QR Code on a Vending Machine',
            message: "A drinks machine at the leisure centre shows a QR code to pay by phone. It opens pay.izettle.com with the machine's ID already filled in, displays the official payment app, and only asks for your card through the secure checkout — exactly like tapping your card.",
            lesson: 'A trustworthy payment QR opens a known, secure checkout from the same provider that runs the card reader, and asks for nothing extra. The web address matches a real payment company.'
        },
        scamVariant: {
            type: 'scam',
            brand: 'claim',
            channel: 'qr',
            category: 'qr',
            title: 'Sticker QR on a Vending Machine',
            message: "A sticker has been stuck over the machine's real QR code. Scanning it opens vend-pay-secure.xyz, which asks for your full card number, expiry, CVV, and your online banking password 'to set up faster payments'.",
            redFlags: [
                'The code is a stick-on label placed over the original — anyone could add that',
                'Random web address (.xyz), not a real payment provider',
                'Asks for your CVV and banking password, which real payments never need',
                "'Set up faster payments' is a made-up reason to grab extra details"
            ],
            lesson: "This is 'quishing' — a fake QR sticker over a real one. Genuine payments never ask for your banking password, so never type card or login details into a page a random QR opens."
        }
    },

    /* ──────────── 6 · SMS Delivery Tracking ──────────── */
    {
        id: 6,
        topic: 'SMS Delivery Tracking',
        safeVariant: {
            type: 'safe',
            brand: 'royalmail',
            channel: 'sms',
            title: 'SMS from Royal Mail',
            message: 'Royal Mail: Your parcel (ref RM482910736GB) is out for delivery today between 1–3pm. Track it at royalmail.com. No fees are due and no reply is needed.',
            lesson: 'A real delivery text uses the company\u2019s normal website, asks for no payment, and gives a tracking reference you can check yourself. No fee and no "pay" link is reassuring.'
        },
        scamVariant: {
            type: 'scam',
            brand: 'royalmail',
            channel: 'sms',
            title: "SMS from 'Royal Mail'",
            message: "Royal Mail: We couldn't deliver your parcel as a £1.99 fee is unpaid. Pay within 24 hours to arrange redelivery or it will be returned: royalmail-redelivery.info/pay",
            redFlags: [
                "The web address 'royalmail-redelivery.info' is not the real royalmail.com",
                'A tiny £1.99 fee is bait to capture your card details',
                'A 24-hour deadline pushes you to act without thinking',
                'Royal Mail does not collect fees through links in texts'
            ],
            lesson: '"Pay a small redelivery fee" texts are smishing. The fee is a trick to steal your card — check any parcel using the courier\u2019s official site or app instead.'
        }
    },

    /* ──────────── 7 · Spotify Billing Fix ──────────── */
    {
        id: 7,
        topic: 'Spotify Billing Fix',
        safeVariant: {
            type: 'safe',
            brand: 'spotify',
            channel: 'email',
            title: 'Email from Spotify',
            message: 'Hi! Your Spotify Premium payment of £11.99 went through — thanks! View your receipts any time under Account → Order History at spotify.com. We will never ask for your password or card details by email.',
            lesson: 'A genuine billing email confirms a payment, points you to your own account page, and never asks for your password or card number.'
        },
        scamVariant: {
            type: 'scam',
            brand: 'spotify',
            channel: 'email',
            title: "Email from 'Spotify Billing'",
            message: 'Your last Spotify payment FAILED and your Premium will be cancelled today. Update your card now to keep your music: https://spotify-billing-update.com/fix — enter your card number, expiry and CVV to continue.',
            redFlags: [
                "Web address 'spotify-billing-update.com' is not the real spotify.com",
                "Says your account will be cancelled 'today' to rush you",
                'Sends you off-site to type full card details including CVV',
                'You should update payment only inside the official Spotify app or site'
            ],
            lesson: '"Your payment failed, update now" emails are a common trap. Manage billing inside the real app — a website never needs your CVV just to "keep your account".'
        }
    },

    /* ──────────── 8 · School Portal Sign-in ──────────── */
    {
        id: 8,
        topic: 'School Portal Sign-in',
        safeVariant: {
            type: 'safe',
            brand: 'school',
            channel: 'email',
            title: 'Email from Oakwood Academy',
            message: 'Hi Year 11, your end-of-term reports are now on the student portal. Log in the usual way through the school website (oakwood.sch.uk) with your normal school account. Any problems? Pop into the IT office and we will help.',
            lesson: 'A real school message points you to the portal you already know, does not threaten you, and offers in-person help. Nothing urgent, nothing scary.'
        },
        scamVariant: {
            type: 'scam',
            brand: 'school',
            channel: 'email',
            title: "Email from 'School IT Helpdesk'",
            message: 'URGENT: Your school Microsoft 365 account will be DEACTIVATED in 12 hours due to a storage error. Re-verify immediately to avoid losing your coursework: sch00l-portal-login.com — sign in with your school email and password.',
            redFlags: [
                "Look closely: 'sch00l-portal-login.com' uses zeros and is not your school's real site",
                'Threatens to delete your coursework to make you panic',
                'A 12-hour countdown to stop you checking with a teacher',
                'Asks for your school login on an outside website'
            ],
            lesson: 'Students get targeted with "your account will be deleted" emails to steal logins. When in doubt, do not click — ask a teacher or the IT office in person.'
        }
    }
];