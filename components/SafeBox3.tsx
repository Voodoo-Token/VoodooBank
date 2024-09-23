import Image from 'next/image';

interface SafeBoxProps {
  inUse: boolean;
  totalStaked?: string; // Optional prop for total staked value
  onClick: () => void; // Adding onClick prop
}

const SafeBox: React.FC<SafeBoxProps> = ({ inUse, onClick, }) => {
  const imageName = inUse ? 'safe3_closed.png' : 'safe3_open.png';

  return (
    <div onClick={onClick} className="cursor-pointer">

      <div
        className="w-[90%] relative m-auto border border-gray-300 shadow rounded-md overflow-hidden bg-gray-500 cursor-pointer"
        style={{ paddingBottom: '90%' }}
        onClick={onClick} // Use the onClick prop
      >     
       <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-4">
          {/* Adjust the container to exactly 300px x 300px */}
          <div className="w-[300px] h-[300px] flex justify-center items-center relative">
            {/* Since we're specifying dimensions, we can adjust the layout and remove objectFit */}
            <Image src={`/${imageName}`} alt={inUse ? 'Safe Closed' : 'Safe Open'} width={300} height={300} />
          </div>
          {/* Additional content can go here */}
        </div>
      </div>
    </div>
  );
};

export default SafeBox;
