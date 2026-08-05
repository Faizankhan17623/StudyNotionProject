// Subscription plan tiers, lowest to highest
export const PLAN = {
  FREE: "Free",
  PRO: "Pro",
  PRO_MAX: "ProMax",
}

const PLAN_RANK = {
  [PLAN.FREE]: 0,
  [PLAN.PRO]: 1,
  [PLAN.PRO_MAX]: 2,
}

export const PLAN_LABEL = {
  [PLAN.FREE]: "Free",
  [PLAN.PRO]: "Pro",
  [PLAN.PRO_MAX]: "Pro Max",
}

// True if the user's current plan meets or exceeds the required tier
export const hasPlanAccess = (userPlan, requiredPlan) => {
  const currentRank = PLAN_RANK[userPlan] ?? 0
  const requiredRank = PLAN_RANK[requiredPlan] ?? 0
  return currentRank >= requiredRank
}

export const isPro = (userPlan) => hasPlanAccess(userPlan, PLAN.PRO)
export const isProMax = (userPlan) => hasPlanAccess(userPlan, PLAN.PRO_MAX)

export const getPlanLabel = (userPlan) => PLAN_LABEL[userPlan] || PLAN_LABEL[PLAN.FREE]
