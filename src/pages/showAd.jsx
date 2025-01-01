import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ShowAd = () => {
  window.scrollTo(0, 0);
  const location = useLocation();
  const advertisement = location.state?.ad;

  const content = [];
  for (let component of advertisement.sequence) {
    switch (component.type) {
      case 'field': {
        content.push(<DetailField label={component.label} value={component.value} key={component.label} />);
        break;
      }
      case 'fieldList': {
        content.push(<DetailList label={component.label} items={component.items} key={component.label} />);
        break;
      }
      case 'fieldMessage': {
        content.push(<DetailMessage message={component.message} key={component.message} />);
        break;
      }
    }
  }

  let date = new Date();
  let deadline = new Date(advertisement.deadline);
  let timeDifference = deadline - date;
  const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  let timeColor = 'red';
  if (daysLeft > 3) {
    timeColor = 'green';
  } else if (daysLeft > 1) {
    timeColor = 'yellow';
  }

  return (
    <div className="w-full flex justify-center py-7 mt-10 bg-gradient-to-b from-blue-100 to-white">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="w-full text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 text-2xl font-semibold rounded-md">
          {advertisement.title}
        </h1>
        <div className="w-full p-4 flex flex-col gap-y-4">{content.map((element) => element)}</div>
        <div className="w-full text-center py-6 px-4 flex justify-between">
          <Link
            to="/"
            className="w-32 text-xl tracking-wider px-4 py-2 bg-blue-600 text-white rounded-md transform transition-transform duration-200 hover:scale-110 hover:bg-blue-700"
          >
            Back
          </Link>
          <button className="w-44 text-xl tracking-wider px-4 py-2 bg-green-600 text-white rounded-md transform transition-transform duration-200 hover:scale-110 hover:bg-green-700">
            Apply
          </button>
        </div>
        <div className="w-full px-2 py-2 flex justify-between bg-gray-800 rounded-md shadow-inner">
          <span className={`text-${timeColor}-400 font-semibold text-lg`}>
            Time left: {daysLeft}d {hoursLeft}h
          </span>
          <span className="text-white text-lg">By {advertisement.creator}</span>
        </div>
      </div>
    </div>
  );
};

export default ShowAd;

const DetailField = ({ label, value }) => {
  return (
    <div className="w-full px-4 py-3 flex justify-between items-center text-lg bg-gray-100 rounded-md shadow-sm transform transition-all duration-300 hover:ring-2 hover:ring-gray-500 hover:scale-105 hover:bg-gray-200">
      <h1 className="font-semibold">{label}:</h1>
      <span className="text-gray-700">{value}</span>
    </div>
  );
};

const DetailList = ({ label, items }) => {
  return (
    <div className="w-full px-4 py-3 flex justify-between items-center text-lg bg-gray-100 rounded-md shadow-sm transform transition-all duration-300 hover:ring-2 hover:ring-gray-500 hover:scale-105 hover:bg-gray-200">
      <h1 className="font-semibold">{label}:</h1>
      <ul className="flex flex-col space-y-2 text-gray-700">
        {items.map((item, index) => (
          <li key={index} className="text-sm">{item}</li>
        ))}
      </ul>
    </div>
  );
};

const DetailMessage = ({ message }) => {
  return (
    <div className="w-full px-4 py-3 text-lg bg-gray-100 rounded-md shadow-sm transform transition-all duration-300 hover:ring-2 hover:ring-gray-500 hover:scale-105 hover:bg-gray-200">
      <p className="text-gray-700">{message}</p>
    </div>
  );
};
