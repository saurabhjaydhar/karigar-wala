import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDb } from "../utils/db";
import { logger } from "../utils/logger";
import { ServiceCategoryModel } from "./models/service-category.model";
import { ServiceModel } from "./models/service.model";
import { AreaModel } from "./models/area.model";
import { PageContentModel } from "./models/page-content.model";
import { KarigarModel } from "./models/karigar.model";
import { AdminModel } from "./models/admin.model";
import { CouponModel } from "./models/coupon.model";
import { UserModel } from "./models/user.model";
import { AddressModel } from "./models/address.model";
import { BookingModel } from "./models/booking.model";
import { ReviewModel } from "./models/review.model";

const CATEGORIES = [
  {
    name: "Contractor",
    slug: "contractor",
    description: "Full home renovation and construction work.",
    startingPrice: 5000,
    isNew: false,
  },
  {
    name: "AC Technician",
    slug: "ac-technician",
    description: "AC installation, servicing, and repair.",
    startingPrice: 499,
    isNew: false,
  },
  {
    name: "Electrician",
    slug: "electrician",
    description: "Wiring, fittings, and electrical repairs.",
    startingPrice: 199,
    isNew: false,
  },
  {
    name: "Labour/Mistri",
    slug: "labour-mistri",
    description: "General labour and skilled mistri work.",
    startingPrice: 299,
    isNew: false,
  },
  {
    name: "Gardener",
    slug: "gardener",
    description: "Lawn care, planting, and garden maintenance.",
    startingPrice: 249,
    isNew: true,
  },
];

// Real launch cities (per the business), each broken into a few broad zones.
// `name` embeds the city so the flat area dropdown in the booking form stays
// unambiguous across cities (it doesn't have a separate city selector) —
// e.g. "Sitarganj Central" vs. "Rudrapur Central" are distinct options, not
// two entries both just called "Central".
const CITIES = ["Sitarganj", "Rudrapur", "Haldwani", "Shaktifarm"];
const ZONES = ["Central", "North", "South", "East"];
const AREAS = CITIES.flatMap((city) =>
  ZONES.map((zone) => ({
    name: `${city} ${zone}`,
    city,
    isServiceable: true,
  })),
);

const PAGE_CONTENT = [
  {
    slug: "about-us",
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
  },
  {
    slug: "safety",
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
  },
  {
    slug: "faq",
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
  },
];

const SUB_SERVICES: Record<string, { name: string; description: string; basePrice: number }[]> = {
  "ac-technician": [
    { name: "AC General Service", description: "Cleaning and gas pressure check.", basePrice: 499 },
    { name: "AC Installation", description: "Split/window AC mounting and setup.", basePrice: 1200 },
    { name: "Gas Refilling", description: "Refrigerant top-up for cooling issues.", basePrice: 1800 },
  ],
  electrician: [
    { name: "Fan Installation", description: "Ceiling or wall fan fitting.", basePrice: 199 },
    { name: "Switchboard Repair", description: "Fix faulty switches and sockets.", basePrice: 249 },
    { name: "Wiring Inspection", description: "Full-home wiring safety check.", basePrice: 599 },
  ],
  "labour-mistri": [
    { name: "Tile Fitting", description: "Floor or wall tile installation, per room.", basePrice: 1500 },
    { name: "Wall Painting", description: "Interior wall painting, per room.", basePrice: 2500 },
  ],
  gardener: [
    { name: "Lawn Mowing", description: "Single visit lawn mowing and edging.", basePrice: 249 },
    { name: "Planting & Landscaping", description: "New plants, beds, and basic layout work.", basePrice: 899 },
  ],
};

const FULLY_VERIFIED = {
  idVerified: true,
  addressVerified: true,
  backgroundCheckPassed: true,
  skillAssessmentPassed: true,
};

const KARIGARS = [
  {
    name: "Ramesh Kumar",
    phone: "+919810000001",
    type: "karigar" as const,
    primarySkill: "Electrician",
    skills: ["Wiring", "Fan Installation"],
    yearsOfExperience: 8,
    areasServed: ["Sitarganj Central", "Sitarganj North"],
    verificationStatus: "approved" as const,
    verificationChecklist: FULLY_VERIFIED,
    rating: 4.8,
    reviewCount: 32,
  },
  {
    name: "Suresh Yadav",
    phone: "+919810000002",
    type: "karigar" as const,
    primarySkill: "AC Technician",
    skills: ["AC Repair", "AC Installation"],
    yearsOfExperience: 5,
    areasServed: ["Rudrapur Central", "Rudrapur South"],
    verificationStatus: "approved" as const,
    verificationChecklist: FULLY_VERIFIED,
    rating: 4.6,
    reviewCount: 21,
  },
  {
    name: "Vikram Singh",
    phone: "+919810000003",
    type: "contractor" as const,
    primarySkill: "Contractor",
    skills: ["Renovation", "Tiling"],
    yearsOfExperience: 12,
    teamSize: 6,
    verificationChecklist: FULLY_VERIFIED,
    areasServed: ["Haldwani Central", "Haldwani East"],
    verificationStatus: "approved" as const,
    rating: 4.9,
    reviewCount: 47,
  },
  {
    name: "Anil Verma",
    phone: "+919810000004",
    type: "karigar" as const,
    primarySkill: "Gardener",
    skills: ["Lawn Care"],
    yearsOfExperience: 3,
    areasServed: ["Shaktifarm Central"],
    verificationStatus: "pending" as const,
    rating: 0,
    reviewCount: 0,
  },
];

const CUSTOMERS = [
  { name: "Priya Sharma", phone: "+919820000001", area: "Sitarganj Central", city: "Sitarganj" },
  { name: "Manoj Tiwari", phone: "+919820000002", area: "Rudrapur Central", city: "Rudrapur" },
  { name: "Neha Joshi", phone: "+919820000003", area: "Haldwani Central", city: "Haldwani" },
  { name: "Arjun Rawat", phone: "+919820000004", area: "Sitarganj North", city: "Sitarganj" },
];

const FEEDBACK = [
  {
    customerPhone: "+919820000001",
    karigarPhone: "+919810000001", // Ramesh Kumar, Electrician
    categorySlug: "electrician",
    rating: 5,
    comment: "Ramesh fixed our wiring issue in under an hour and explained everything clearly. Very professional and on time.",
    preferredDate: "2026-07-10",
  },
  {
    customerPhone: "+919820000002",
    karigarPhone: "+919810000002", // Suresh Yadav, AC Technician
    categorySlug: "ac-technician",
    rating: 5,
    comment: "Suresh serviced our AC before summer and it's cooling like new. Clean work, fair pricing.",
    preferredDate: "2026-06-02",
  },
  {
    customerPhone: "+919820000003",
    karigarPhone: "+919810000003", // Vikram Singh, Contractor
    categorySlug: "contractor",
    rating: 5,
    comment: "Vikram's team renovated our kitchen on schedule and the quality was excellent. Highly recommend for bigger projects.",
    preferredDate: "2026-05-20",
  },
  {
    customerPhone: "+919820000004",
    karigarPhone: "+919810000001", // Ramesh Kumar again, different job
    categorySlug: "electrician",
    rating: 4,
    comment: "Quick fan installation, courteous and tidy. Would book again.",
    preferredDate: "2026-07-22",
  },
];

async function seed() {
  await connectDb();

  let subServiceCount = 0;
  for (const category of CATEGORIES) {
    const savedCategory = await ServiceCategoryModel.findOneAndUpdate(
      { slug: category.slug },
      category,
      { upsert: true, returnDocument: "after" },
    );
    const subServices = SUB_SERVICES[category.slug] ?? [];
    for (const subService of subServices) {
      await ServiceModel.findOneAndUpdate(
        { categoryId: savedCategory!._id, name: subService.name },
        { ...subService, categoryId: savedCategory!._id },
        { upsert: true, returnDocument: "after" },
      );
      subServiceCount += 1;
    }
  }
  logger.info(`Seeded ${CATEGORIES.length} service categories, ${subServiceCount} sub-services`);

  for (const content of PAGE_CONTENT) {
    await PageContentModel.findOneAndUpdate({ slug: content.slug }, content, {
      upsert: true,
      returnDocument: "after",
    });
  }
  logger.info(`Seeded ${PAGE_CONTENT.length} page-content docs`);

  for (const area of AREAS) {
    await AreaModel.findOneAndUpdate({ name: area.name, city: area.city }, area, {
      upsert: true,
      returnDocument: "after",
    });
  }
  logger.info(`Seeded ${AREAS.length} serviceable areas`);

  for (const karigar of KARIGARS) {
    await KarigarModel.findOneAndUpdate({ phone: karigar.phone }, karigar, {
      upsert: true,
      returnDocument: "after",
    });
  }
  logger.info(`Seeded ${KARIGARS.length} karigars`);

  await CouponModel.findOneAndUpdate(
    { code: "FIRST10" },
    {
      code: "FIRST10",
      type: "percentage",
      value: 10,
      validFrom: new Date("2026-01-01"),
      validTo: new Date("2027-01-01"),
      isActive: true,
    },
    { upsert: true, returnDocument: "after" },
  );
  logger.info("Seeded FIRST10 coupon");

  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@karigarsaathi.dev";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "changeme123";
  await AdminModel.findOneAndUpdate(
    { email: adminEmail },
    {
      email: adminEmail,
      name: "Admin",
      role: "super_admin",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
    { upsert: true, returnDocument: "after" },
  );
  logger.info(`Seeded admin account (${adminEmail} / ${adminPassword})`);

  for (const customer of CUSTOMERS) {
    const savedUser = await UserModel.findOneAndUpdate(
      { phone: customer.phone },
      { name: customer.name, phone: customer.phone, isVerified: true },
      { upsert: true, returnDocument: "after" },
    );
    await AddressModel.findOneAndUpdate(
      { userId: savedUser!._id, label: "Home" },
      { userId: savedUser!._id, label: "Home", line: "House no. 12", area: customer.area, city: customer.city },
      { upsert: true, returnDocument: "after" },
    );
  }
  logger.info(`Seeded ${CUSTOMERS.length} sample customers`);

  let feedbackCount = 0;
  for (const fb of FEEDBACK) {
    const customer = await UserModel.findOne({ phone: fb.customerPhone });
    const karigar = await KarigarModel.findOne({ phone: fb.karigarPhone });
    const category = await ServiceCategoryModel.findOne({ slug: fb.categorySlug });
    const address = await AddressModel.findOne({ userId: customer?._id });
    if (!customer || !karigar || !category || !address) continue;

    const booking = await BookingModel.findOneAndUpdate(
      { customerId: customer._id, karigarId: karigar._id, preferredDate: new Date(fb.preferredDate) },
      {
        customerId: customer._id,
        karigarId: karigar._id,
        categoryId: category._id,
        serviceIds: [],
        addressId: address._id,
        area: address.area,
        preferredDate: new Date(fb.preferredDate),
        timeSlot: "10:00-12:00",
        status: "completed",
      },
      { upsert: true, returnDocument: "after" },
    );

    await ReviewModel.findOneAndUpdate(
      { bookingId: booking!._id },
      {
        bookingId: booking!._id,
        customerId: customer._id,
        karigarId: karigar._id,
        rating: fb.rating,
        comment: fb.comment,
      },
      { upsert: true, returnDocument: "after" },
    );
    feedbackCount += 1;
  }
  logger.info(`Seeded ${feedbackCount} sample reviews`);

  process.exit(0);
}

seed().catch((err) => {
  logger.error({ err }, "Seed failed");
  process.exit(1);
});
