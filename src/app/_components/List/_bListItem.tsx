import React from 'react';
import Image from 'next/image';
import { QuerySpore } from '@/hooks/useQuery/type'; // 这应该替换为您的盲盒类型
import Link from 'next/link';
import { boxData } from '@/types/BlindBox';

interface BlindBoxItem {
    id: string;
    boxData: boxData[];
}


interface BlindBoxItemProps {
  blindBox: BlindBoxItem; // 替换为您的盲盒类型
  isSelected: boolean;
  onSelect: () => void;
  viewMode: 'list' | 'grid';
  interactionType?: number;
}

const BlindBoxItem: React.FC<BlindBoxItemProps> = ({ blindBox, isSelected, onSelect, viewMode, interactionType }) => {
  const itemContent = (
    <div 
      className={`${isSelected ? 'bg-primary006' : ''} relative border-white009
        ${viewMode === 'list' ? 'flex items-center px-4 border-t-[1px]' : 'border rounded'} `}
      onClick={interactionType && interactionType > 1 ? onSelect : undefined}
    >
      <div className={`${viewMode === 'list' ? 'w-12 h-12 mr-4' : 'h-[120px]'} relative`}>
        <img alt={blindBox.id!} src={`/svg/BlindBox.svg`} className="rounded max-h-[120px] object-cover w-full"/>
      </div>
      <div className="w-[115px] ml-4 h-[80px] flex-grow flex flex-col items-start justify-center">
        <p className="font-semibold font-SourceSanPro text-body1mb text-white001">{blindBox.id}</p>
      </div>
      {isSelected && (
        <div className={`absolute ${viewMode === 'list' ? 'right-4' : 'top-2 right-2'} w-6 h-6 rounded-full bg-green-500 border-green-500 flex items-center justify-center`}>
          <Image 
            src='/svg/icon-check.svg'
            width={24}
            height={24}
            alt="Selected"
          />
        </div>
      )}
    </div>
  );

  return interactionType && interactionType > 1 ? itemContent : (
    <Link href={`/blindBox/${blindBox.id}`}>
      {itemContent}
    </Link>
  );
};

export default BlindBoxItem
