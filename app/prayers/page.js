"use client";

import ItemChecklist from '../components/shared/ItemChecklist';
import { PRAYERS_LIST, PRAYERS_DATA } from '../data/prayers';

export default function PrayersPage() {
  return (
    <>
      <div className="background-overlay"></div>
      <ItemChecklist 
        title="Prayers"
        subtitle="Magical Verses of Cvstodia"
        items={PRAYERS_LIST}
        detailsData={PRAYERS_DATA}
        storageKey="blasphemous_prayers"
        categories={['normal', 'dlc']}
        detailLabels={{ primary: 'Miracle Effect', secondary: 'Found In' }}
      />
    </>
  );
}
