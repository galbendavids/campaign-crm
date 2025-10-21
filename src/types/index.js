// Campaign types
export const CampaignStatus = {
  DRAFT: "draft",
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
};

// Contact types
export const ContactStatus = {
  LEAD: "lead",
  PROSPECT: "prospect",
  CUSTOMER: "customer",
  INACTIVE: "inactive",
};

// Company types
export const CompanySize = {
  LESS_THAN_30: "less than 30",
  THIRTY_TO_SIXTY: "30 to 60",
  SIXTY_TO_HUNDRED: "60 to 100",
  HUNDRED_TO_THREE_HUNDRED: "100 to 300",
  THREE_HUNDRED_TO_THOUSAND: "300-1000",
  MORE_THAN_THOUSAND: "more than 1,000",
};

// Default form structures
export const defaultCampaign = {
  name: "",
  description: "",
  titleConcept: "",
  messageConcept: "",
  status: CampaignStatus.DRAFT,
  startDate: new Date(),
  tags: [],
};

export const defaultContact = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  companyCode: "", // Will be required to be filled by user
  position: "",
  status: ContactStatus.LEAD,
  source: "",
  notes: "",
  role: "",
  tags: [],
  lastContacted: null,
  created: new Date(),
};

export const defaultCompany = {
  name: "",
  companyCode: "",
  size: "",
  industry: "",
  website: "",
  country: "",
  zone: "",
  created_date: new Date(),
  descriptionPurposeAI: "",
  nextYearsTargetsAI: "",
};
