import { Link } from 'react-router-dom';

const CardField = ({ label, value }) => (
  <div className="w-full flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
    <p className="font-semibold">{label}</p>
    <p>{value}</p>
  </div>
);

const CardFieldList = ({ label, items }) => (
  <div className="w-full flex justify-between items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
    <p className="w-1/3 font-semibold">{label}</p>
    <ul className="w-2/3 space-y-1">
      {items.map((element, index) => (
        <li key={index} className="text-right">{element}</li>
      ))}
    </ul>
  </div>
);

const CardMessage = ({ message }) => {
  const truncatedMessage = message.length > 215 ? message.substr(0, 215) + '...' : message;

  return (
    <div className="w-full p-3">
      <p className="bg-gray-100 text-justify dark:bg-gray-900 rounded-lg p-4 transition-all">
        {truncatedMessage}
      </p>
    </div>
  );
};

// Sample data structure for demonstration
const defaultAdvertisement = {
  title: "Default Advertisement",
  sequence: [],
  formSequence: [],
  deadline: new Date(Date.now() + 86400000 * 5), // 5 days from now
  creator: "Anonymous"
};

const Card = ({ advertisement = defaultAdvertisement, boo = true}) => {
  const content = [];
  if (advertisement.sequence) {
    for (let component of advertisement.sequence) {
      if (content.length >= 5) break;

      switch (component.type) {
        case 'field':
          content.push(<CardField key={content.length} label={component.label} value={component.value} />);
          break;
        case 'fieldList':
          content.push(<CardFieldList key={content.length} label={component.label} items={component.items} />);
          break;
        case 'fieldMessage':
          content.push(<CardMessage key={content.length} message={component.message} />);
          break;
      }
    }
  }

  const date = new Date();
  const deadline = new Date(advertisement.deadline);
  const timeDifference = deadline - date;
  const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const timeColorClass = daysLeft > 3 ? 'text-green-500' : daysLeft > 1 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="max-w-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col justify-between">
      <div className="w-full h-max rounded-xl overflow-hidden">
        <h1
          className='bg-black text-white dark:bg-gray-200 dark:text-black py-4 px-6 text-xl font-bold text-center transition-all duration-300 hover:tracking-[10px]'>
          {advertisement.title}
        </h1>

        <div className="divide-y text-black dark:text-white divide-gray-200 dark:divide-gray-700">
          {content}
        </div>

      </div>
      <div>
        <div className="p-4 flex border-0 justify-between gap-4">
          <Link
            to='/showAd'
            state={{ ad: advertisement }}
            onClick={() => localStorage.setItem('homeY', window.scrollY)}
            className="w-full py-2 bg-purple-600 text-center hover:bg-purple-700 text-white rounded-lg transform transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
            Know More
          </Link>
          <Link
            to='/showForm'
            state={{ form: advertisement }}
            onClick={() => localStorage.setItem('homeY', window.scrollY)}
            className={`w-full py-2 bg-green-600 text-center hover:bg-green-700 text-white rounded-lg transform transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${boo ? '' : 'hidden'}`}>
            Apply
          </Link>
        </div>
        <div className="h-[70px] mt-2 px-4 py-3 bg-gray-700 dark:bg-gray-900 rounded-b-xl flex justify-between">
          <span className={`${timeColorClass} font-semibold whitespace-nowrap`}>
            Time left: {daysLeft}d {hoursLeft}h
          </span>
          <span className="text-white text-right text-wrap">
            By {advertisement.creator}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;

