import React from "react";
import DashboardSection from "./DashboardSection";
import RelationshipCard from "./RelationshipCard";
import { RELATIONSHIP_ACTIVITY } from "./constants";

export default function RelationshipFlow() {
  return (
    <DashboardSection
      label="Pipeline"
      title="Relationship Flow"
      description="Client, gift, and referral signals in one operational view — tuned for revenue clarity, not social noise."
    >
      <ul className="flex flex-col gap-3">
        {RELATIONSHIP_ACTIVITY.map((item) => (
          <RelationshipCard key={item.id} item={item} />
        ))}
      </ul>
    </DashboardSection>
  );
}
