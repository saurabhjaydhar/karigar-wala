import type { PageContent } from "@/types";

type LocalizedPageContent = Record<"en" | "hi", Omit<PageContent, "_id" | "slug">>;

export const ABOUT_US_CONTENT: LocalizedPageContent = {
  en: {
    title: "About Us",
    sections: [
      {
        body: "Karigar Saathi connects you with verified local tradespeople — electricians, AC technicians, contractors, and more — for the home-service jobs that come up in everyday life. No cold-calling around for a number someone half-remembers; pick a service, pick a time, and we take it from there.",
      },
      {
        body: "Every karigar on the platform goes through our verification process before they can take a single booking, and every job is backed by real customer reviews, so you know who's showing up at your door.",
      },
      {
        body: "We're starting local and staying local — focused on doing right by one region before expanding to the next.",
      },
    ],
  },
  hi: {
    title: "हमारे बारे में",
    sections: [
      {
        body: "कारीगर साथी आपको सत्यापित स्थानीय कारीगरों से जोड़ता है — इलेक्ट्रीशियन, AC टेक्नीशियन, कॉन्ट्रैक्टर और भी बहुत कुछ — रोज़मर्रा की ज़िंदगी में आने वाले घरेलू कामों के लिए। किसी अधूरे याद नंबर पर फ़ोन लगाने की ज़रूरत नहीं; सेवा चुनें, समय चुनें, बाकी हम संभाल लेंगे।",
      },
      {
        body: "प्लेटफ़ॉर्म पर हर कारीगर को पहली बुकिंग लेने से पहले हमारी सत्यापन प्रक्रिया से गुज़रना होता है, और हर काम असली ग्राहक समीक्षाओं द्वारा समर्थित होता है, ताकि आपको पता हो कि आपके दरवाज़े पर कौन आ रहा है।",
      },
      {
        body: "हम स्थानीय स्तर पर शुरुआत कर रहे हैं और स्थानीय ही बने रहेंगे — अगले क्षेत्र में विस्तार करने से पहले एक क्षेत्र में सही तरीके से काम करने पर ध्यान केंद्रित कर रहे हैं।",
      },
    ],
  },
};

export const SAFETY_CONTENT: LocalizedPageContent = {
  en: {
    title: "Safety",
    intro: "A few things we do to keep bookings on Karigar Saathi trustworthy for both sides.",
    sections: [
      {
        title: "4-point verification",
        body: "Every karigar is checked before they can take a booking — government ID, address, a background/reference check, and a skill assessment are all confirmed as part of onboarding.",
      },
      {
        title: "Phone-verified customers",
        body: "Every booking is tied to a real, OTP-verified phone number, so both sides of the job know who they're dealing with.",
      },
      {
        title: "Reviews after every job",
        body: "Completed jobs can be rated — a karigar's rating reflects real customer experience, not just a profile claim.",
      },
      {
        title: "Report a problem",
        body: "If something goes wrong on a job, reach us through the chat button or your booking details and we'll step in.",
      },
    ],
  },
  hi: {
    title: "सुरक्षा",
    intro: "कुछ बातें जो हम कारीगर साथी पर बुकिंग को दोनों पक्षों के लिए भरोसेमंद बनाए रखने के लिए करते हैं।",
    sections: [
      {
        title: "4-सूत्रीय सत्यापन",
        body: "हर कारीगर को बुकिंग लेने से पहले जांचा जाता है — सरकारी पहचान पत्र, पता, बैकग्राउंड/रेफरेंस जांच, और स्किल असेसमेंट, ये सभी ऑनबोर्डिंग के हिस्से के रूप में सुनिश्चित किए जाते हैं।",
      },
      {
        title: "फ़ोन-सत्यापित ग्राहक",
        body: "हर बुकिंग एक असली, OTP-सत्यापित फ़ोन नंबर से जुड़ी होती है, ताकि काम के दोनों पक्षों को पता हो कि वे किसके साथ व्यवहार कर रहे हैं।",
      },
      {
        title: "हर काम के बाद समीक्षा",
        body: "पूरे हो चुके काम को रेट किया जा सकता है — कारीगर की रेटिंग असली ग्राहक अनुभव को दर्शाती है, केवल प्रोफ़ाइल के दावे को नहीं।",
      },
      {
        title: "समस्या की रिपोर्ट करें",
        body: "अगर किसी काम में कुछ गलत होता है, तो चैट बटन या अपनी बुकिंग विवरण के ज़रिए हमसे संपर्क करें, हम मदद के लिए आगे आएंगे।",
      },
    ],
  },
};

export const FAQ_CONTENT: LocalizedPageContent = {
  en: {
    title: "Frequently Asked Questions",
    sections: [
      {
        title: "How do I book a service?",
        body: "Pick a service category and your area, choose a date and time slot, and confirm with an OTP sent to your phone. We'll auto-assign the best-rated available karigar, or you can pick a specific one yourself.",
      },
      {
        title: "How are karigars verified?",
        body: "Every karigar goes through a 4-point check before they can take a booking — government ID, address, a background/reference check, and a skill assessment. See the Safety page for details.",
      },
      {
        title: "How do I pay?",
        body: "Pay the karigar directly once the job is done — cash or UPI, whatever's convenient. There's no online payment on the platform yet.",
      },
      {
        title: "Can I cancel a booking?",
        body: "Yes, from My Bookings, any time before the job is marked complete.",
      },
      {
        title: "What if something goes wrong during a job?",
        body: "Reach us through the chat button or your booking details and we'll step in. See the Safety page for more on how we handle this.",
      },
      {
        title: "Do you operate in my area?",
        body: "We're live in a limited set of areas for now — you'll see the exact list when booking. We're starting local and staying local before expanding further.",
      },
      {
        title: "How do coupon codes work?",
        body: "Enter a code on the booking form and it's validated instantly — you'll see the discount before you confirm.",
      },
      {
        title: "What's the difference between a karigar and a contractor?",
        body: "Karigars handle individual jobs you can book directly. Contractors manage larger projects (like renovations) — you request a quote first, and they get back to you with a cost and timeline before any commitment.",
      },
    ],
  },
  hi: {
    title: "अक्सर पूछे जाने वाले सवाल",
    sections: [
      {
        title: "मैं सेवा कैसे बुक करूं?",
        body: "सेवा श्रेणी और अपना क्षेत्र चुनें, तारीख और समय स्लॉट चुनें, और अपने फ़ोन पर भेजे गए OTP से पुष्टि करें। हम सबसे बेहतर रेटिंग वाले उपलब्ध कारीगर को ऑटो-असाइन करेंगे, या आप खुद किसी खास कारीगर को चुन सकते हैं।",
      },
      {
        title: "कारीगरों को कैसे सत्यापित किया जाता है?",
        body: "हर कारीगर को बुकिंग लेने से पहले 4-सूत्रीय जांच से गुज़रना होता है — सरकारी पहचान पत्र, पता, बैकग्राउंड/रेफरेंस जांच, और स्किल असेसमेंट। विवरण के लिए सुरक्षा पेज देखें।",
      },
      {
        title: "मैं भुगतान कैसे करूं?",
        body: "काम पूरा होने के बाद कारीगर को सीधे भुगतान करें — नकद या UPI, जो भी सुविधाजनक हो। प्लेटफ़ॉर्म पर अभी ऑनलाइन भुगतान की सुविधा नहीं है।",
      },
      {
        title: "क्या मैं बुकिंग रद्द कर सकता हूं?",
        body: "हां, 'मेरी बुकिंग' से, काम पूरा होने के रूप में चिह्नित होने से पहले कभी भी।",
      },
      {
        title: "अगर काम के दौरान कुछ गलत हो जाए तो?",
        body: "चैट बटन या अपनी बुकिंग विवरण के ज़रिए हमसे संपर्क करें, हम मदद के लिए आगे आएंगे। हम इसे कैसे संभालते हैं, इस बारे में अधिक जानकारी के लिए सुरक्षा पेज देखें।",
      },
      {
        title: "क्या आप मेरे क्षेत्र में सेवा देते हैं?",
        body: "अभी हम सीमित क्षेत्रों में सक्रिय हैं — बुकिंग करते समय आपको सही सूची दिखेगी। आगे विस्तार करने से पहले हम स्थानीय स्तर पर शुरुआत कर रहे हैं और स्थानीय ही बने रहेंगे।",
      },
      {
        title: "कूपन कोड कैसे काम करते हैं?",
        body: "बुकिंग फ़ॉर्म पर एक कोड डालें और यह तुरंत मान्य हो जाता है — पुष्टि करने से पहले आपको छूट दिख जाएगी।",
      },
      {
        title: "कारीगर और कॉन्ट्रैक्टर में क्या अंतर है?",
        body: "कारीगर व्यक्तिगत काम संभालते हैं जिन्हें आप सीधे बुक कर सकते हैं। कॉन्ट्रैक्टर बड़े प्रोजेक्ट्स (जैसे नवीनीकरण) संभालते हैं — आप पहले कोटेशन मांगते हैं, और वे किसी भी प्रतिबद्धता से पहले लागत और समयसीमा के साथ आपसे संपर्क करते हैं।",
      },
    ],
  },
};
