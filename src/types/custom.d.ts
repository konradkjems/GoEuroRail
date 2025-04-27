// Type declarations for custom components
declare module './TripItineraryItem' {
  import { FC } from 'react';
  import { FormTripStop, City } from '@/types';
  
  interface TripItineraryItemProps {
    stop: FormTripStop;
    city: City | undefined;
    index: number;
    isSelected: boolean;
    isLastStop: boolean;
    onSelect: () => void;
    onUpdate: (updatedStop: Partial<FormTripStop>) => void;
    onTransportClick: () => void;
  }
  
  const TripItineraryItem: FC<TripItineraryItemProps>;
  export default TripItineraryItem;
}

declare module './TransportModal' {
  import { FC } from 'react';
  import { City } from '@/types';
  
  interface TrainDetails {
    trainNumber: string;
    duration: string;
    changes: number;
    price?: {
      amount: number;
      currency: string;
    };
  }
  
  interface TransportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (trainDetails: TrainDetails) => void;
    initialData?: TrainDetails;
    fromCity: City | null;
    toCity: City | null;
  }
  
  const TransportModal: FC<TransportModalProps>;
  export default TransportModal;
} 