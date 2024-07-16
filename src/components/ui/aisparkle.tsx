import React from 'react';
import { Button } from '@nextui-org/button';
import { HiSparkles } from 'react-icons/hi';

interface AIButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
  disabled: boolean;
}

const AIButton: React.FC<AIButtonProps> = ({ onClick, isLoading, disabled }) => {
  return (
    <Button
      size="sm"
      color="secondary"
      variant="flat"
      onClick={onClick}
      isLoading={isLoading}
      disabled={disabled}
      startContent={!isLoading && <HiSparkles />}
      className={`absolute bottom-8 z-10 right-2
       ${disabled ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-500 text-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'}
       py-2 px-4 rounded-md`}
    >
      {isLoading ? 'Menulis...' : disabled ? 'Perlu 20 Kata' : 'Use AI'}
    </Button>
  );
};

export default AIButton;
