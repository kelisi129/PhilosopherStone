"use client"

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import AddGiftsModal from '@/app/_components/AddGiftsModal/AddGiftsModal';
import GiftList from '@/app/_components/List/GiftList';
import BlindBoxList from '@/app/_components/List/BlindBoxList';

interface boxData {
  id: string
}

const BlindBoxPage = () => {
  const pathName = usePathname();
  const boxName = pathName.split("/")[pathName.split('/').length - 1]
  const [boxItems, setBoxItems] = useState([]);
  const [boxGifts, setBoxGifts] = useState<boxData[]>([])
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedGifts, setSelectedGifts] = useState<string[]>([])
  const getBlindBox = async () => {
    const response = await fetch('/api/blindbox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'getBoxByName', key: walletAddress, name: decodeURIComponent(boxName)}),
    });
    const data = await response.json();
    setBoxGifts(data.data.box.boxData)
  }

  const addToBlindBox = async (ids: string[]) => {
    const response = await fetch('/api/blindbox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'add', key: walletAddress, name: decodeURIComponent(boxName), ids: ids}),
    });
    const data = await response.json();
    setBoxGifts(data.data.data)
  }

  const convertToObjects = (ids: string[]) => {
    return ids.map(item => ({ id: item }));
  }

  const removeGifts = async (ids: string[]) => {
    const response = await fetch('/api/blindbox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'remove', key: walletAddress, name: decodeURIComponent(boxName), ids: convertToObjects(ids)}),
    });
    const data = await response.json();
    setBoxGifts(data.data.data)
  }


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const getSelectedList = (ids: string[]) => {
    setSelectedGifts(ids)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onConfirm = (ids: string[]) => {
    addToBlindBox(ids)
  }

  const onRemoveGifts = () => {
    removeGifts(selectedGifts)
  }


  useEffect(() => {
    if(walletAddress) {
      getBlindBox()
    }
  }, [boxName, walletAddress]);

  if (!boxName) {
    return <p>Loading...</p>; 
  }

  return (
    <div className='flex flex-col flex-1 px-4'>
      {isModalOpen && <AddGiftsModal onConfirm={onConfirm} onClose={handleCloseModal} walletAddress={walletAddress!!} listItems={boxGifts} />}
      <div className='text-white text-hd2mb font-bold px-4 py-8 border-b'>{decodeURIComponent(boxName)}</div>
      <div className={`flex-1 flex ${boxGifts.length > 0 ? 'items-start' : 'items-center'}  justify-center`}> 
        {(boxGifts && !boxGifts.length) && (
          <div className='px-4'>
            <p className="font-PlayfairDisplay text-hd2mb text-center text-white001">There is no gifts in this blind box</p>
            <button className="w-full h-12 mt-8 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded" onClick={handleOpenModal}>Add Gifts</button>
          </div>
        )}
        {boxGifts.length > 0 ? (
          <div className='w-full'>
            <BlindBoxList list={boxGifts}  interactionType={3} updateGiftList={getSelectedList}/>
          </div>
        ) : (
          <></>
        )}
        
      </div>
      <div className='flex gap-4'>
        {
          selectedGifts.length > 0 && (
            <button 
              className="flex-1 h-12 mb-8 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded"     
              onClick={onRemoveGifts}    
            >
              Romove Gifts
            </button>
          )
        }
        {boxGifts && boxGifts.length > 0 && (
            <button 
              className="flex-1 h-12 mb-8 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded"         
            >
              Send Blind Box
            </button>
            
        )}
      </div>
    </div>
  );
};

export default BlindBoxPage;
