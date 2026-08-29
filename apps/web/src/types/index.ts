export type { KarigarType, VerificationStatus } from "@karigar-wala/shared";
export type { BookingStatus, ContractStatus } from "@karigar-wala/shared";

import type { KarigarType, BookingStatus } from "@karigar-wala/shared";

export interface ServiceCategory {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  startingPrice: number;
  isNew: boolean;
  isActive: boolean;
}

export interface PageContentSection {
  title?: string;
  body: string;
}

export interface PageContent {
  _id: string;
  slug: string;
  title: string;
  intro?: string;
  sections: PageContentSection[];
}

export interface Area {
  _id: string;
  name: string;
  city: string;
  isServiceable: boolean;
}

export interface SubService {
  _id: string;
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
}

export interface KarigarVerificationChecklist {
  idVerified: boolean;
  addressVerified: boolean;
  backgroundCheckPassed: boolean;
  skillAssessmentPassed: boolean;
}

export interface Karigar {
  _id: string;
  name: string;
  phone: string;
  photoUrl?: string;
  type: KarigarType;
  primarySkill: string;
  skills: string[];
  yearsOfExperience: number;
  areasServed: string[];
  verificationChecklist: KarigarVerificationChecklist;
  rating: number;
  reviewCount: number;
}

export function isFullyVerified(checklist: KarigarVerificationChecklist): boolean {
  return Object.values(checklist).every(Boolean);
}

export interface BookingListItem {
  _id: string;
  categoryId: { _id: string; name: string; slug: string };
  karigarId: { _id: string; name: string; phone: string; rating: number } | null;
  serviceIds: { _id: string; name: string; basePrice: number }[];
  area: string;
  preferredDate: string;
  timeSlot: string;
  status: BookingStatus;
  autoAssigned: boolean;
  createdAt: string;
}
