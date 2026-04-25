"use client";

import ItemChecklist from '../components/shared/ItemChecklist';
import { BONES_LIST, BONES_DATA } from '../data/bones';

export default function BonesPage() {
  return (
    <>
      <div className="background-overlay"></div>
      <ItemChecklist 
        title="Ossuary Bones"
        subtitle="Collectibles of the Deceased"
        items={BONES_LIST}
        detailsData={BONES_DATA}
        storageKey="blasphemous_bones"
        categories={['normal']}
        detailLabels={{ primary: 'Status', secondary: 'Found In' }}
      />
    </>
  );
}
