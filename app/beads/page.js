"use client";

import ItemChecklist from '../components/shared/ItemChecklist';
import { BEADS_LIST, ROSARY_DATA } from '../data/rosary';

export default function BeadsPage() {
  return (
    <>
      <div className="background-overlay"></div>
      <ItemChecklist 
        title="Rosary Beads"
        subtitle="Cvstodia Collection Checklist"
        items={BEADS_LIST}
        detailsData={ROSARY_DATA}
        storageKey="blasphemous_beads"
        categories={['normal', 'dlc', 'ng-plus', 'secret', 'missable', 'true-ending']}
        detailLabels={{ primary: 'Effect', secondary: 'Location' }}
      />
    </>
  );
}
