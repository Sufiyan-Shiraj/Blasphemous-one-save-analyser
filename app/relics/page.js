"use client";

import ItemChecklist from '../components/shared/ItemChecklist';
import { RELICS_LIST, RELICS_DATA } from '../data/relics';

export default function RelicsPage() {
  return (
    <>
      <div className="background-overlay"></div>
      <ItemChecklist 
        title="Relics"
        subtitle="Visions of the Miracle"
        items={RELICS_LIST}
        detailsData={RELICS_DATA}
        storageKey="blasphemous_relics"
        categories={['normal']}
        detailLabels={{ primary: 'Passive Vision', secondary: 'Acquisition' }}
      />
    </>
  );
}
