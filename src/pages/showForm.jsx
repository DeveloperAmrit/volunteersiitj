import React, { use, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../customHooks/UserContext';

const ShowForm = () => {
  const [radioCount, setRadioCount] = useState(0);
  const location = useLocation();
  const addSequence = location.state?.form;
  const formSequence = addSequence.formSequence;
  const user = useUserContext();
  const navigate = useNavigate();

  const handleRadioChange = (e) => {
    if (e.target.checked) {
      setRadioCount(radioCount + 1);
    } else {
      setRadioCount(radioCount - 1);
    }
  };

  const getFileTyes = (extensions) => {
    let fileTypes = [];
    extensions.forEach((extension) => {
      switch (extension) {
        case 'doc':
          fileTypes.push('.doc,.docx,.pdf');
          break;
        case 'sheet':
          fileTypes.push('.xls,.xlsx,.csv');
          break;
        case 'video':
          fileTypes.push('video/*');
          break;
        case 'audio':
          fileTypes.push('audio/*');
          break;
        case 'all':
          fileTypes.push('*');
          break;
      }
    });
    return fileTypes.join(',');
  };
  const handleSubmitClick = async () => {
    try {
      const body = {
        userId: user.userId,
        updates: {
          appliedForms: {
            id: addSequence.advertisementId,
            status: 'pending'
          },
        },
      };

      const response = await fetch('http://localhost:5000/modifyUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      navigate('/', {
        state: { title: addSequence.title, message: `Applied Successfully` }
      })
    } catch (err) {
      console.log('Failed to register user in database', err);
    }
  };

  return (
    <div className="mt-[50px] mx-auto max-w-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg relative overflow-hidden text-black dark:text-black">
      {/* Form Section */}
      {formSequence.map((form, index) => {
        return (
          <div key={index} className="mb-6 z-[1]">
            {/* Text Inputs */}
            {form.type === 'text' && (
              <div>
                <label className="text-xl font-semibold text-gray-700 dark:text-gray-200">{form.label}</label>
                <input
                  type="text"
                  placeholder={form.label}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  required={form.isMandatory}
                />
              </div>
            )}

            {/* Number Inputs (Hide Increase/Decrease buttons using Tailwind) */}
            {form.type === 'number' && (
              <div>
                <label className="text-xl font-semibold text-gray-700 dark:text-gray-200">{form.label}</label>
                <input
                  type="number"
                  placeholder={form.label}
                  min={form.min}
                  max={form.max}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 appearance-none"
                  required={form.isMandatory}
                />
              </div>
            )}

            {/* Email Inputs */}
            {form.type === 'email' && (
              <div>
                <label className="text-xl font-semibold text-gray-700 dark:text-gray-200">{form.label}</label>
                <input
                  type="email"
                  placeholder={form.label}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  required={form.isMandatory}
                />
              </div>
            )}

            {/* Dropdown Inputs */}
            {form.type === 'dropdown' && (
              <div>
                <label className="text-xl font-semibold text-gray-700 dark:text-gray-200">{form.label}</label>
                <select className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                  {form.options.map((option, index) => {
                    return (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* Radio Inputs (Checkbox Style) */}
            {form.type === 'checkbox' && (
              <div>
                <label className="text-xl font-semibold text-gray-700 dark:text-gray-200">{form.label}</label>
                <div className="flex justify-between text-md mt-2 text-gray-700 dark:text-gray-200">
                  <span>Max Choices: {form.maxChoices}</span>
                </div>
                {form.options.map((option, index) => (
                  <label key={index} className="block mt-2 text-gray-700 dark:text-gray-200">
                    <input
                      type="radio"
                      name={form.name}
                      value={option}
                      disabled={radioCount >= form.maxChoices}
                      onChange={handleRadioChange}
                      className="mr-2"
                      required={form.isMandatory}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {/* File Inputs */}
            {form.type === 'file' && (
              <div>
                <label className="text-xl font-semibold text-gray-700 dark:text-gray-200">{form.label}</label>
                <input
                  type="file"
                  accept={getFileTyes(form.extensions)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  required={form.isMandatory}
                />
              </div>
            )}

            {/* Image File Inputs */}
            {form.type === 'image' && (
              <div>
                <label className="text-xl font-semibold text-gray-700 dark:text-gray-200">{form.label}</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  required={form.isMandatory}
                />
              </div>
            )}

            {/* Datetime Inputs */}
            {form.type === 'datetime' && (
              <div>
                <label className="text-xl font-semibold text-gray-700 dark:text-gray-200">{form.label}</label>
                <input
                  type={form.format === 'datetime' ? 'datetime-local' : form.format}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  required={form.isMandatory}
                />
              </div>
            )}
          </div>
        );
      })}

      <button className="w-full bg-green-400 text-white p-3 rounded-lg mt-5 hover:bg-green-500 focus:ring-2 focus:ring-blue-500 active:scale-95 dark:bg-green-600 dark:hover:bg-green-500" onClick={() => handleSubmitClick()}>
        Submit
      </button>
    </div>
  );
};

export default ShowForm;
