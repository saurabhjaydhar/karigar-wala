import { Router } from "express";
import bcrypt from "bcryptjs";
import { AdminModel } from "../../db/models/admin.model";
import { ServiceCategoryModel } from "../../db/models/service-category.model";
import { AreaModel } from "../../db/models/area.model";
import { UserModel } from "../../db/models/user.model";

// One-time production setup endpoint (create the first admin + seed
// categories) for environments where the DB has no private-network access
// from outside Railway. Gated by BOOTSTRAP_SECRET; delete this route once
// production has been bootstrapped.
export const bootstrapRouter = Router();

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
  {
    name: "Plumber",
    slug: "plumber",
    description: "Pipe fitting, leak repairs, and bathroom/kitchen plumbing.",
    startingPrice: 199,
    isNew: true,
  },
  {
    name: "Painter",
    slug: "painter",
    description: "Interior and exterior wall painting and touch-ups.",
    startingPrice: 349,
    isNew: true,
  },
];

const CITIES = ["Sitarganj", "Rudrapur", "Haldwani", "Shaktifarm"];
const ZONES = ["Central", "North", "South", "East"];
const AREAS = CITIES.flatMap((city) =>
  ZONES.map((zone) => ({
    name: `${city} ${zone}`,
    city,
    isServiceable: true,
  })),
);

bootstrapRouter.post("/", async (req, res, next) => {
  try {
    const secret = req.header("x-bootstrap-secret");
    if (!process.env.BOOTSTRAP_SECRET || secret !== process.env.BOOTSTRAP_SECRET) {
      res.status(404).end();
      return;
    }

    const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@karigarsaathi.dev";
    const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "changeme123";
    const admin = await AdminModel.findOneAndUpdate(
      { email: adminEmail },
      {
        email: adminEmail,
        name: "Admin",
        role: "super_admin",
        passwordHash: await bcrypt.hash(adminPassword, 10),
      },
      { upsert: true, returnDocument: "after" },
    );

    let categoriesSeeded = 0;
    for (const category of CATEGORIES) {
      await ServiceCategoryModel.findOneAndUpdate({ slug: category.slug }, category, {
        upsert: true,
      });
      categoriesSeeded += 1;
    }

    let areasSeeded = 0;
    for (const area of AREAS) {
      await AreaModel.findOneAndUpdate({ name: area.name, city: area.city }, area, {
        upsert: true,
      });
      areasSeeded += 1;
    }

    res.json({ admin: admin!.email, categoriesSeeded, areasSeeded });
  } catch (err) {
    next(err);
  }
});

bootstrapRouter.get("/users", async (req, res, next) => {
  try {
    const secret = req.header("x-bootstrap-secret");
    if (!process.env.BOOTSTRAP_SECRET || secret !== process.env.BOOTSTRAP_SECRET) {
      res.status(404).end();
      return;
    }

    const users = await UserModel.find({}, "phone name isVerified createdAt").lean();
    res.json({ count: users.length, users });
  } catch (err) {
    next(err);
  }
});
